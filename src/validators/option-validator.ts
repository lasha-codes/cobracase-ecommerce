// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950

export const COLORS = [
  { label: 'Black', value: 'black', tw: 'zinc-900' },
  { label: 'Blue', value: 'blue', tw: 'blue-950' },
  { label: 'Rose', value: 'rose', tw: 'rose-950' },
] as const

export const MODELS = {
  name: 'models',
  options: [
    {
      label: 'Iphone X',
      value: 'iphonex',
    },
    {
      label: 'Iphone 11',
      value: 'iphone11',
    },
    {
      label: 'Iphone 12',
      value: 'iphone12',
    },
    {
      label: 'Iphone 13',
      value: 'iphone13',
    },
    {
      label: 'Iphone 14',
      value: 'iphone14',
    },
    {
      label: 'Iphone 15',
      value: 'iphone15',
    },
    {
      label: 'Iphone 16',
      value: 'iphone16',
    },
  ],
} as const
