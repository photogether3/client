export type PostCreateFormType = {
  collectionId: number;
  title: string;
  content: string;
  metadataStringify: ImgContentType[];
  file: File;
};

export type PostUpdateFormType = {
  postId: number;
  title: string;
  content: string;
  metadataList: ImgContentType[];
};

export type ImgContentType = {
  isPublic: boolean;
  content: string;
  hasLink: boolean;
};
