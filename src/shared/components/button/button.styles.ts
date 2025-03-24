import { cva, VariantProps } from 'class-variance-authority';
import { extendTailwindMerge } from 'tailwind-merge';

export const buttonStyles = cva('flex items-center justify-center rounded-full', {
  variants: {
    type: {
      primary: 'text-white bg-primary50 active:bg-primary70 disabled:bg-layer30 shadow-custom disabled:text-gray70',
      secondary: 'text-primary20 border border-primary50 bg-[#182B28] disabled:bg-layer30 shadow-custom disabled:text-gray70',
      tertiary: 'text-secondary20 border border-layer10 bg-layer40 active:bg-layer20 active:border-layer10 disabled:bg-layer30 shadow-custom disabled:text-gray70',
      text: 'text-white active:bg-secondary10 active:text-gray90 disabled:text-gray50',
      danger: 'text-accent30 border border-accent70 text-[#311A1F] disabled:bg-layer30 shadow-custom disabled:text-gray70',
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

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-l', 'display-m', 'display-s', 'title-l', 'title-m', 'title-s', 'body-l', 'body-m', 'body-s', 'detail'] }],
    },
  },
});
