'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db'
import sharp from 'sharp'
import { ClientUploadedFileData } from 'uploadthing/types'

export const createConfiguration = async (
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
