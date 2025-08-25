import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState, Product } from "../../types";

const CART_STORAGE_KEY = "cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const calculateItemCount = (items: CartItem[]): number =>
  items.reduce((count, item) => count + item.quantity, 0);

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
  total: 0,
  itemCount: 0,
};

initialState.total = calculateTotal(initialState.items);
initialState.itemCount = calculateItemCount(initialState.items);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0] || "",
          quantity: 1,
        };
        state.items.push(newItem);
      }

      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        state.total = calculateTotal(state.items);
        state.itemCount = calculateItemCount(state.items);
        saveCartToStorage(state.items);
      }
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      saveCartToStorage([]);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCart,
  closeCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
