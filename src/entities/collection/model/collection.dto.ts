import { CollectionType } from './collection.type';

// home 페이지에서 사용
export type CollectionsResDTO = {
  totalItemCount: number;
  totalPageCount: number;
  currentPage: number;
  perPage: number;
  items: CollectionType[];
};

export type CollectionReqDTO = {
  title: string;
  categoryId: string;
};
