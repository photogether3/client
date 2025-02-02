export type CollectionDTO = {
  id: number;
  title: string;
  tag: string;
  images: { src: string; alt: string }[];
};

export type CollectionCreateDTO = {
  title: string;
  categoryId: string;
};
