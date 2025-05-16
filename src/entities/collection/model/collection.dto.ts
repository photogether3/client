import { CategoriesGetDTO } from 'src/entities/category';
import { CollectionType } from './collection.type';

export type CollectionsResDTO = {
  totalItemCount: number;
  totalPageCount: number;
  currentPage: number;
  perPage: number;
  items: CollectionType[];
};

export type CollectionDetailResDTO = {
  id: number;
  title: string;
  postCount: number;
  category: CategoriesGetDTO | null;
};

export type CollectionReqDTO = {
  title: string;
  categoryId: number;
};
