import { Product, Category } from "../types";

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

const filterValidProducts = (data: Product[]): Product[] => {
  return data.filter(
    (product: Product) =>
      product.images &&
      product.images.length > 0 &&
      product.images[0] &&
      !product.images[0].includes("placeimg.com")
  );
};

export const productsApi = {
  async fetchProducts(
    offset = 0,
    limit = 10,
    categoryId?: string | number,
    title?: string
  ): Promise<Product[]> {
    try {
      let url = `${API_BASE_URL}/products?offset=${offset}&limit=${limit}`;

      if (categoryId && categoryId !== "all") {
        url += `&categoryId=${categoryId}`;
      }

      if (title) {
        url += `&title=${encodeURIComponent(title)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return filterValidProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products. Please try again.");
    }
  },

  async searchProducts(
    query: string,
    offset = 0,
    limit = 10
  ): Promise<Product[]> {
    try {
      let url = `${API_BASE_URL}/products?title=${encodeURIComponent(
        query
      )}&offset=${offset}&limit=${limit}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return filterValidProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error("Failed to search products. Please try again.");
    }
  },

  async fetchCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((category: any) => ({
        id: category.id,
        name: category.name,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
