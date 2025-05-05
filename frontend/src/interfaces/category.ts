export interface ICategory {
  id: number;
  name: string;
  categoriesImg: string;
}

export interface ICategoryFilterProps {
  categories: ICategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}