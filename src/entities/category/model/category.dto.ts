export type CategoriesDTO = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryUpdateDTO = {
  categoryIds: number[];
};
