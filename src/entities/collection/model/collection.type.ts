export type CollectionType = {
  collectionId: string;
  title: string;
  postCount: number;
  category: {
    categoryId: string;
    name: string;
  };
  imageUrls: string[];
};
