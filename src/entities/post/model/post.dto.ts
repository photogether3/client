import { CategoriesGetDTO } from 'src/entities/category';
import { ImgUrlType } from 'src/entities/collection';

export type PostReqDto = {
  collectionId: number;
  title: string;
  content: string;
  metadataStringify: {
    content: string;
    isPublic: boolean;
    hasLink: boolean;
  }[];
  file: File;
};

export type UpdatePostDTO = {
  title: string;
  content: string;
  metadataList: {
    content: string;
    isPublic: boolean;
  }[];
};

export type PostResDTO = {
  totalItemCount: number;
  totalPageCount: number;
  currentPage: number;
  perPage: number;
  items: PostType[];
};

export type PostMoveReqDTO = {
  postIds: number[];
  collectionId: number;
};

export type PostType = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  category: CategoriesGetDTO | null;
  collectionId: number;
  collection: {
    collectionId: string;
    title: string;
  };
  metadataList: {
    content: string;
    isPublic: boolean;
  }[];
  prevPost: {
    id: number;
    images: ImgUrlType;
  };
  nextPost: {
    id: number;
    images: ImgUrlType;
  };
};
