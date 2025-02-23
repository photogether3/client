import { CategoriesGetDTO } from 'src/entities/category';

export type CollectionFormType = {
  title: string;
  categoryId: number;
};

export type CollectionType = {
  id: number;
  title: string;
  type: CollectionTypeEnum;
  category: CategoriesGetDTO | null;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
};

export enum CollectionTypeEnum {
  UNCATEGORIZED = 'UNCATEGORIZED',
  TRASH = 'TRASH',
  DEFAULT = 'DEFAULT',
}
