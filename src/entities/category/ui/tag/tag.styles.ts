import { cva, VariantProps } from 'class-variance-authority';

export const tagVariants = cva('flex items-center justify-center whitespace-nowrap rounded-[4px] px-2', {
  variants: {
    type: {
      outline: 'border border-secondary50 text-secondary60',
      solid: 'bg-secondary50 text-white',
      solidPastel: 'bg-secondary5 text-secondary60',
    },
    size: {
      lg: 'h-8 text-body-m',
      md: 'h-6 text-detail',
    },
  },
  defaultVariants: {
    type: 'outline',
    size: 'md',
  },
});

export type TagProps = VariantProps<typeof tagVariants>;
