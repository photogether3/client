import { cva, VariantProps } from 'class-variance-authority';

// TODO input 디자인 시스템 나오면 수정 예정 (현재 임시)
export const inputVariants = cva('rounded-[8px] border border-gray-400 px-4', {
  variants: {
    size: {
      lg: 'h-14 leading-14 text-lg',
      md: 'h-12 leading-12 text-md',
      sm: 'h-10 leading-10 text-sm',
    },
  },
});

export type InputProps = VariantProps<typeof inputVariants>;
