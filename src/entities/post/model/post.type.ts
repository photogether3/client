export type PostCreateFormType = {
  collectionId: number;
  title: string;
  content: string;
  metadataStringify: ImgContentType[];
  file: File;
};

export type ImgContentType = {
  isPublic: boolean;
  content: string;
  hasLink: boolean;
};
