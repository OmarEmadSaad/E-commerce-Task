export interface Category {
  id: number | string;
  name: string;
  image?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number | string;
    name: string;
    image?: string;
  };
  images: string[];
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  searchQuery: string;
  selectedCategory: string | number;
  categories: Category[];
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
}

export interface ApiResponse {
  products: Product[];
  hasMore: boolean;
}
