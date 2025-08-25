import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsState, Category } from "../../types";
import { productsApi } from "../../services/productsApi";

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
  searchQuery: "",
  selectedCategory: "all",
  categories: [],
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    offset?: number;
    limit?: number;
    title?: string;
    categoryId?: string | number;
    reset?: boolean;
  }) => {
    const { offset = 0, limit = 10, title, categoryId, reset = false } = params;

    const products = await productsApi.fetchProducts(
      offset,
      limit,
      categoryId,
      title
    );

    return {
      products,
      reset,
      hasMore: products.length === limit,
    };
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (params: {
    query: string;
    offset?: number;
    limit?: number;
    reset?: boolean;
  }) => {
    const { query, offset = 0, limit = 10, reset = false } = params;
    const products = await productsApi.searchProducts(query, offset, limit);

    return {
      products,
      reset,
      hasMore: products.length === limit,
    };
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    return await productsApi.fetchCategories();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.offset = 0;
      state.hasMore = true;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.offset = 0;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: (state) => {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.reset) {
          state.items = action.payload.products;
          state.offset = action.payload.products.length;
        } else {
          state.items.push(...action.payload.products);
          state.offset += action.payload.products.length;
        }

        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.reset) {
          state.items = action.payload.products;
          state.offset = action.payload.products.length;
        } else {
          state.items.push(...action.payload.products);
          state.offset += action.payload.products.length;
        }

        state.hasMore = action.payload.hasMore;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search products";
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = [{ id: "all", name: "All" }, ...action.payload];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearError,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
