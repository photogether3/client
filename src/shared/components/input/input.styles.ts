import { cva, VariantProps } from 'class-variance-authority';

export const inputVariants = cva('border rounded-[8px] px-4 h-14 text-gray90 text-body-l placeholder:text-gray50 outline-none', {
  variants: {
    state: {
      default: 'bg-white border-gray70 focus:border-primary50 focus:border-2',
      error: 'bg-white border-accent50 border-2',
      disabled: 'bg-gray30 border-gray50 text-gray60',
    },
    defaultVariants: {
      state: 'default',
    },
  },
});

export type InputProps = VariantProps<typeof inputVariants>;
