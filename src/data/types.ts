export type Category =
  | "Soup"
  | "Stews"
  | "Omelette"
  | "Main Dish"
  | "Chopsey"
  | "Boiled Vegetables"
  | "Signature Roti"
  | "Kottu Junction";

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string | null;
  ingredients: string[];
  prepTime: string;
  description: string;
  special?: boolean;
  spiceLevel?: 1 | 2 | 3;
}
