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
