import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('flex items-center justify-center', {
  variants: {
    appearance: {
      primary: 'text-white bg-primary50 hover:bg-primary60 active:bg-primary70 disabled:bg-primary20',
      accent: 'text-white bg-accent50 hover:bg-accent60 active:bg-accent70 disabled:bg-accent20',
      secondary: 'text-white bg-secondary50 hover:bg-secondary60 active:bg-secondary70 disabled:bg-secondary20',
      outline: 'text-black border border-base04 hover:text-white hover:bg-secondary60 active:text-white active:bg-secondary70 disabled:text-link-disabled',
    },
    size: {
      l: 'text-base px-6 py-3 rounded-[12px]',
      m: 'text-base px-4 py-2.5 rounded-[10px]',
      s: 'text-sm px-3 py-1 rounded-[8px]',
      xs: 'text-sm px-2 py-0.5 rounded-[6px]',
    },
    width: {
      full: 'w-full block',
      auto: 'w-auto',
    },
  },
  defaultVariants: {
    appearance: 'primary',
    size: 'm',
    width: 'full',
  },
});

export type ButtonProps = VariantProps<typeof buttonVariants>;
