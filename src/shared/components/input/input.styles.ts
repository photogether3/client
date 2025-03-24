import { cva, VariantProps } from 'class-variance-authority';

export const inputVariants = cva('border rounded-[8px] px-4 text-body-m placeholder:text-gray50 outline-none', {
  variants: {
    size: {
      lg: 'h-14',
      md: 'h-12',
      sm: 'h-10',
      xs: 'h-8',
    },
    type: {
      input: '',
      textarea: 'py-2 resize-none min-h-[144px]',
    },
    state: {
      // TODO border border-image-source로 줘야 함 (임시: border-gray60)
      default: 'bg-layer30 focus:border-primary50 focus:border-2 border-gray70 text-white',
      error: 'bg-layer30 border-accent50 border-2 text-white',
      disabled: 'bg-layer20 border-gray50 text-gray50',
    },
    defaultVariants: {
      state: 'default',
    },
  },
});

export type InputProps = VariantProps<typeof inputVariants>;
