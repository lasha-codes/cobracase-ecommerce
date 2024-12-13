'use client'

import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from './actions'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

const ThankYou = () => {
  const { toast } = useToast()
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
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
  }, [sessionId, toast])

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
  const { color } = configuration

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-xl'></div>
      </div>
    </div>
  )
}

export default ThankYou

// stop - 9:46:38
