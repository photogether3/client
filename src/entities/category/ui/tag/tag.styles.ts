import { cva, VariantProps } from 'class-variance-authority';

export const tagVariants = cva('flex items-center justify-center whitespace-nowrap', {
  variants: {
    appearance: {
      primary: ['text-white', 'bg-primary50', 'hover:bg-primary60'],
      accent: ['text-white', 'bg-accent50', 'hover:bg-accent60'],
      secondary: ['text-white', 'bg-secondary50', 'hover:bg-secondary60'],
      outline: ['text-black', 'border', 'bg-white', 'border-base04', 'hover:text-white hover:bg-secondary60'],
    },
    size: {
      l: ['text-base', 'px-6', 'py-3', 'rounded-[14px]'],
      m: ['text-base', 'px-4', 'py-1.5', 'rounded-[12px]'],
      s: ['text-sm', 'px-3', 'py-1', 'rounded-[10px]'],
      xs: ['text-sm', 'px-2', 'py-0.5', 'rounded-[8px]'],
    },
  },
  defaultVariants: {
    appearance: 'outline',
    size: 'xs',
  },
});

export type TagProps = VariantProps<typeof tagVariants>;
