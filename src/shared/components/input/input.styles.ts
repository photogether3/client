import { cva, VariantProps } from 'class-variance-authority';
import { extendTailwindMerge } from 'tailwind-merge';

export const inputVariants = cva('border rounded-[8px] px-4 placeholder:text-gray50 outline-none', {
  variants: {
    size: {
      lg: 'h-14 text-body-l',
      md: 'h-12 text-body-m',
      sm: 'h-10 text-body-s',
      xs: 'h-8 text-detail-l',
    },
    type: {
      input: '',
      textarea: 'py-2 resize-none min-h-[144px]',
    },
    state: {
      default: 'bg-layer30 focus:border-primary50 focus:border-2 border-white/20 text-white',
      error: 'bg-layer30 border-accent50 border-2 text-white',
      disabled: 'bg-layer20 border-gray50 text-gray50',
    },
    defaultVariants: {
      state: 'default',
    },
  },
});

export type InputProps = VariantProps<typeof inputVariants>;

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display-l', 'display-m', 'display-s', 'title-l', 'title-m', 'title-s', 'body-l', 'body-m', 'body-s', 'detail-l', 'detail-m', 'detail-s'],
        },
      ],
      'text-color': [
        {
          text: ['gray50', 'white'],
        },
      ],
    },
  },
});
