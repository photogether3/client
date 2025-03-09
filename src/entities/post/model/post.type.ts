export type PostCreateFormType = {
  collectionId: string;
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
