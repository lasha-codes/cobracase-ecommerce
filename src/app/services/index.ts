'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db'
import sharp from 'sharp'
import { ClientUploadedFileData } from 'uploadthing/types'

export const afterUpload = async (
  configId: string | null,
  file: ClientUploadedFileData<any>
) => {
  try {
    const res = await fetch(file.url)
    const buffer = await res.arrayBuffer()

    const imgMetadata = await sharp(buffer).metadata()

    const { width, height } = imgMetadata

    if (!configId) {
      const configuration = await db.configuration.create({
        data: {
          imageUrl: file.url,
          height: height || 500,
          width: width || 500,
        },
      })
      return { configId: configuration.id }
    } else {
      const updatedConfiguration = await db.configuration.update({
        where: {
          id: configId,
        },
        data: {
          croppedImageUrl: file.url,
        },
      })
      return { configId: updatedConfiguration.id }
    }
  } catch (err) {
    console.error('error creating configuration', err)
  }
}

export const getConfiguration = async (id: string) => {
  const configuration = await db.configuration.findUnique({
    where: {
      id: id,
    },
  })

  return configuration
}

export const getOrders = async () => {
  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      User: true,
      shippingAddress: true,
    },
  })
  return orders
}
