import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'
import Image from 'next/image'

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
}

const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden',
        className
      )}
      {...props}
    >
      <Image
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        className='pointer-events-none z-50 select-none'
        width={200}
        height={200}
        alt='phone image'
      />
      <div className='absolute -z-10 inset-0'>
        <Image
          className='object-cover'
          src={imgSrc}
          width={200}
          height={200}
          alt='overlaying phone image'
        />
      </div>
    </div>
  )
}

export default Phone
