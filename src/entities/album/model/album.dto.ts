export type AlbumDTO = {
  id: number;
  title: string;
  tag: string;
  images: { src: string; alt: string }[];
};
