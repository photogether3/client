import { cva, VariantProps } from 'class-variance-authority';
import { extendTailwindMerge } from 'tailwind-merge';

export const tagVariants = cva('flex items-center justify-center whitespace-nowrap rounded-[8px] px-2', {
  variants: {
    type: {
      outline: 'border border-gray70 text-gray70 bg-layer30',
      solid: 'border border-primary50 bg-[#182B28] text-primary20 font-bold',
      solidPastel: 'bg-secondary5 text-secondary60',
    },
    size: {
      lg: 'h-8 text-detail-l font-bold',
      md: 'h-6 text-detail-m',
      sm: 'h-5 text-detail-s',
    },
  },
  defaultVariants: {
    type: 'outline',
    size: 'md',
  },
});

export type TagProps = VariantProps<typeof tagVariants>;

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
          text: ['primary50', 'gray70', 'secondary60'],
        },
      ],
    },
  },
});
