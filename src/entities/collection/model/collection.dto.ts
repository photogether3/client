import { CategoriesGetDTO } from 'src/entities/category';
import { CollectionType } from './collection.type';

// home 페이지에서 사용
export type CollectionsResDTO = {
  totalItemCount: number;
  totalPageCount: number;
  currentPage: number;
  perPage: number;
  items: CollectionType[];
};

export type CollectionDetailResDTO = {
  collectionId: string;
  title: string;
  postCount: number;
  category: CategoriesGetDTO | null;
};

export type CollectionReqDTO = {
  title: string;
  categoryId: string;
};
