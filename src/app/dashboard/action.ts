'use server'

import { db } from '@/db'
import { OrderStatus } from '@prisma/client'

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string
  newStatus: OrderStatus
}) => {
  await db.order.update({
    where: {
      id: id,
    },
    data: {
      status: newStatus,
    },
  })
}

// stop - 11:11:24

console.log('nr')
