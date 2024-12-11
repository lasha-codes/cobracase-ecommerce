'use client'

import HandleComponent from '@/components/HandleComponent'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn, formatPrice } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import NextImage from 'next/image'
import { Rnd } from 'react-rnd'
import {
  RadioGroup,
  Radio,
  Label as RadioLabel,
  Description,
} from '@headlessui/react'
import { useState } from 'react'
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from '@/validators/option-validator'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react'
import { BASE_PRICE } from '@/config/products'

interface DesignConfiguratorProps {
  configId: string
  imageUrl: string
  imageDimensions: {
    width: number
    height: number
  }
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number]
    model: (typeof MODELS.options)[number]
    material: (typeof MATERIALS.options)[number]
    finish: (typeof FINISHES.options)[number]
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  })

  return (
    <div className='relative mt-20 grid grid-cols-3 mb-20 pb-20'>
      <div className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none ring-2 focus:ring-2 focus:ring-primary focus:ring-offset-2'>
        <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
          <AspectRatio
            ratio={896 / 1831}
            className='pointer-events-none relative z-[50] aspect-[896/1831] w-full'
          >
            <NextImage
              fill
              alt='phone image'
              src='/phone-template.png'
              className='pointer-events-none z-[50] select-none'
            />
          </AspectRatio>
          <div className='absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]' />
          <div
            className={cn(
              'absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]',
              `bg-${options.color.tw} transition-all duration-100 ease-linear`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className='absolute z-20 border-[2px] border-primary'
        >
          <div className='relative w-full h-full'>
            <NextImage
              src={imageUrl}
              fill
              alt='your image'
              className='pointer-events-none'
            />
          </div>
        </Rnd>
      </div>

      <div className='h-[37.5rem] flex flex-col bg-white'>
        <ScrollArea className='relative flex-1 overflow-auto'>
          <div className='px-8 pb-12 pt-8'>
            <h2 className='tracking-tight font-bold text-3xl'>
              Customize your case
            </h2>

            <div className='w-full h-px bg-zinc-200 my-6' />

            <div className='relative mt-4 h-full flex flex-col justify-between'>
              <div className='flex flex-col gap-6'>
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }))
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className='mt-3 flex items-center space-x-3'>
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent transition duration-200 ease-linear hover:opacity-90',
                            {
                              [`border-${color.tw}`]: checked,
                            }
                          )
                        }
                      >
                        <div
                          className={cn(
                            `bg-${color.tw}`,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                        ></div>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className='relative flex flex-col gap-3 w-full'>
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between'
                      >
                        {options.model.label}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </DropdownMenuTrigger>{' '}
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            'flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                            {
                              'bg-zinc-100':
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({
                              ...prev,
                              model: model,
                            }))
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              model.label === options.model.label
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          [name]: val,
                        }))
                      }}
                    >
                      <Label className='capitalize'>{name}</Label>
                      <div className='mt-3 space-y-4'>
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                'relative block cursor-pointer rounded-lg bg-white px-6 py-5 border-2 border-zinc-200 focus:outline-none outline-none sm:flex sm:justify-between transition-color duration-100 ease-linear',
                                {
                                  'border-primary': checked,
                                }
                              )
                            }
                          >
                            <span className='flex items-center'>
                              <span className='flex flex-col text-sm'>
                                <RadioLabel
                                  className='font-medium text-gray-900'
                                  as='span'
                                >
                                  {option.label}
                                </RadioLabel>

                                {option.description ? (
                                  <Description
                                    as='span'
                                    className='text-gray-500'
                                  >
                                    <span className='block sm:inline'>
                                      {option.description}
                                    </span>
                                  </Description>
                                ) : null}
                              </span>
                            </span>

                            <Description
                              as='span'
                              className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'
                            >
                              <span className='font-medium text-gray-900'>
                                {formatPrice(option.price / 100)}
                              </span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className='w-full px-8 h-16 bg-white'>
          <div className='h-px w-full bg-zinc-200' />
          <div className='w-full h-full flex justify-end items-center'>
            <div className='w-full flex gap-6 items-center'>
              <p className='font-medium whitespace-nowrap'>
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button className='w-full'>
                Continue
                <ArrowRight className='h-4 w-4 ml-1.5 inline' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignConfigurator
