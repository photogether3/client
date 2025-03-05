import { cva, VariantProps } from 'class-variance-authority';

export const buttonStyles = cva('flex items-center justify-center rounded-full', {
  variants: {
    type: {
      primary: 'text-white bg-primary50 hover:bg-primary60 active:bg-primary70 disabled:bg-gray30 disabled:text-gray60',
      secondary:
        'text-primary60 border border-primary50 bg-primary5 hover:bg-primary20 active:bg-primary70 active:text-primary70 disabled:bg-gray30 disabled:border-gray40 disabled:text-gray60',
      tertiary: 'text-white bg-secondary50 hover:bg-secondary60 active:bg-secondary70 disabled:bg-secondary20',
      text: 'border border-base04 hover:text-white hover:bg-secondary60 active:text-white active:bg-secondary70 disabled:text-link-disabled',
    },
    size: {
      xl: 'text-body-l px-6 h-16',
      lg: 'text-body-l px-5 h-14',
      md: 'text-body-m px-4 h-12',
      sm: 'text-body-s px-3 h-10',
      xs: 'text-body-s px-2.5 h-8',
    },
    width: {
      full: 'w-full block',
      auto: 'w-auto',
    },
  },
  defaultVariants: {
    type: 'primary',
    size: 'md',
    width: 'full',
  },
});

export type ButtonProps = VariantProps<typeof buttonStyles>;
