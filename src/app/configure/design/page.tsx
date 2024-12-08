import { getConfiguration } from '@/app/services'
import { Configuration } from '@prisma/client'
import { notFound } from 'next/navigation'
import DesignConfigurator from './DesignConfigurator'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams

  if (!id || Number.isInteger(Number(id))) {
    return notFound()
  }
  const configuration: Configuration | null = await getConfiguration(
    id as string
  )
  if (!configuration) {
    return notFound()
  }

  const { imageUrl, width, height, id: configId } = configuration

  return (
    <DesignConfigurator
      configId={configId}
      imageUrl={imageUrl}
      imageDimensions={{
        height: height,
        width: width,
      }}
    />
  )
}

export default Page
