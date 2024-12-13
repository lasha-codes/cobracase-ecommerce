import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/db'

type PaymentMetadata = {
  orderId: string
  userId: string
}

type ShippingAddressDetails = {
  city: string
  country: string
  line1: string
  line2: string
  postal_code: string
  state: null | string
}

export const POST = async (req: Request) => {
  try {
    const body = JSON.parse(await req.text())

    const { sessionId } = body

    const paymentSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (paymentSession.payment_status !== 'paid') {
      return NextResponse.json(
        { message: 'payment has failed' },
        { status: 400 }
      )
    }

    const { orderId, userId } = paymentSession.metadata as PaymentMetadata

    if (!userId || !orderId) {
      return NextResponse.json(
        { message: 'Invalid payment session' },
        { status: 400 }
      )
    }

    const exists = await db.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!exists) {
      return NextResponse.json({ message: 'invalid order id' }, { status: 500 })
    }

    if (exists.isPaid) {
      return NextResponse.json({ order: exists }, { status: 200 })
    }

    const shippingDetails = paymentSession.shipping_details!
      .address as ShippingAddressDetails

    const billingDetails = paymentSession.customer_details!
      .address as ShippingAddressDetails

    const order = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        shippingAddress: {
          create: {
            name: paymentSession.customer_details?.name || 'unknown',
            city: shippingDetails.city,
            state: shippingDetails.state,
            postalCode: shippingDetails.postal_code,
            country: shippingDetails.country,
            street: shippingDetails.line1,
          },
        },
        billingAddress: {
          create: {
            name: paymentSession.customer_details?.name || 'unknown',
            city: billingDetails.city,
            state: billingDetails.state,
            postalCode: billingDetails.postal_code,
            country: billingDetails.country,
            street: billingDetails.line1,
          },
        },
      },
    })

    return NextResponse.json({ order }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
