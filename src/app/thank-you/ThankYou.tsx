'use client'

import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from './actions'
import { useSearchParams, notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import PhonePreview from '@/components/PhonePreview'

const ThankYou = () => {
  const { toast } = useToast()
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!orderId || !sessionId) {
      return notFound()
    }
    const completeOrder = async () => {
      setVerifyingPayment(true)
      const response = await axios.post('/api/orders/complete', {
        sessionId,
      })

      if (response.data.order.isPaid) {
        setVerifyingPayment(false)
      } else {
        toast({
          title: 'Something went wrong.',
          description: 'We could not verify the order please try again.',
        })
      }
    }

    completeOrder()
  }, [sessionId, orderId, toast])

  const { data } = useQuery({
    queryKey: ['get-payment-status'],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  })

  if (data === undefined) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
          <h3 className='font-semibold text-xl'>Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    )
  }

  if (verifyingPayment || data === false) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
          <h3 className='font-semibold text-xl'>Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    )
  }

  const { configuration, billingAddress, shippingAddress, amount } = data
  const { color, croppedImageUrl } = configuration

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-xl'>
          <p className='text-base font-medium text-primary'>Thank you!</p>
          <h1 className='mt-2 text-4l font-bold tracking-tight sm:text-5xl'>
            Your case is on the way!
          </h1>
          <p className='mt-2 text-base text-zinc-500'>
            We've received your order and now are processing it.
          </p>

          <div className='mt-12 text-sm font-medium'>
            <p className='text-zinc-900'>Order number</p>
            <p className='mt-2 text-zinc-500'>{orderId}</p>
          </div>
        </div>

        <div className='mt-10 border-t border-zinc-200'>
          <div className='mt-10 flex flex-auto flex-col'>
            <h4 className='font-semibold text-zinc-900'>
              You made a great choice!
            </h4>
            <p className='mt-2 text-sm text-zinc-600'>
              We at Casecobra believe that a phone case doesn't only need to
              look good, but also last you for the years to come. We offer a
              1-year print guarantee: If your case isn't of the highest quality,
              we'll replace it for free.
            </p>
          </div>
        </div>

        <div className='flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-950/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl'>
          <PhonePreview croppedImageUrl={croppedImageUrl!} color={color!} />
        </div>
      </div>
    </div>
  )
}

export default ThankYou

// stop - 10:16:14
