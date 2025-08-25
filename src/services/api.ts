const BASE_URL = 'https://api.escuelajs.co/api/v1';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }
  return response.json();
};

export const apiService = {
  async fetchProducts(offset: number = 0, limit: number = 10, title?: string, categoryId?: number) {
    try {
      let url = `${BASE_URL}/products?offset=${offset}&limit=${limit}`;
      
      if (title) {
        url += `&title=${encodeURIComponent(title)}`;
      }
      
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }

      const response = await fetch(url);
      const products = await handleResponse(response);
      
      return {
        products,
        hasMore: products.length === limit
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch products');
    }
  },

  async fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch categories');
    }
  }
};