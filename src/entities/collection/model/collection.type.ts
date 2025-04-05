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
  postCount: number;
  imageUrls: ImgUrlType[];
};

export enum CollectionTypeEnum {
  UNCATEGORIZED = 'UNCATEGORIZED',
  TRASH = 'TRASH',
  DEFAULT = 'DEFAULT',
}

export type ImgUrlType = {
  id: number;
  blur: string;
  grid: string;
};
