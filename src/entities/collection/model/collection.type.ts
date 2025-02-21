import { FormControl } from '@angular/forms';
import { CategoriesDTO } from 'src/entities/category';

// TODO 나중에 form 공통 타입으로 분리 필요
export type FormControls<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export type CollectionFormType = {
  title: string;
  categoryId: number;
};

export type CollectionType = {
  id: number;
  title: string;
  type: 'UNCATEGORIZED' | 'TRASH' | 'DEFAULT';
  category: CategoriesDTO | null;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
};
