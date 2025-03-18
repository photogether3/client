import { cva, VariantProps } from 'class-variance-authority';

export const inputVariants = cva('border rounded-[8px] px-4 text-gray90 text-body-m placeholder:text-gray50 outline-none', {
  variants: {
    type: {
      input: 'h-12',
      textarea: 'py-2 resize-none min-h-[144px]',
    },
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
