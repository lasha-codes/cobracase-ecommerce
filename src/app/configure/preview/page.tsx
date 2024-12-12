/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConfiguration } from '@/app/services'
import { notFound } from 'next/navigation'
import DesignPreview from './DesignPreview'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams

  if (!id || Number.isInteger(Number(id))) {
    return notFound()
  }

  const configuration = await getConfiguration(id.toString())

  if (!configuration || !configuration.croppedImageUrl) {
    return notFound()
  }

  return <DesignPreview configuration={configuration} />
}

export default Page
