import React, { useCallback } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedCategory } from "../../store/slices/productsSlice";

const CategoryFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, loading } = useAppSelector(
    (state) => state.products
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      dispatch(setSelectedCategory(categoryId));
    },
    [dispatch]
  );

  if (loading && categories.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 h-10 w-24 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id.toString())}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id.toString()
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryFilter);
