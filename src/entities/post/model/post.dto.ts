export type PostReqDto = {
  collectionId: string;
  title: string;
  content: string;
  metadataStringify: {
    content: string;
    isPublic: boolean;
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

export type PostType = {
  postId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    categoryId: string;
    name: string;
  };
  collection: {
    collectionId: string;
    title: string;
  };
  metadataList: {
    content: string;
    isPublic: boolean;
  }[];
};
