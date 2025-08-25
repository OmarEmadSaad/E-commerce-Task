import React, { useEffect, useCallback } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import {
  fetchProducts,
  fetchCategories,
  resetProducts,
} from "../../store/slices/productsSlice";
import CategoryFilter from "../../components/filters/CategoryFilter";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import ProductGrid from "./ProductGrid";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    loading,
    error,
    hasMore,
    offset,
    searchQuery,
    selectedCategory,
    categories,
  } = useAppSelector((state) => state.products);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const categoryId =
        selectedCategory && selectedCategory !== "all"
          ? selectedCategory
          : undefined;
      dispatch(
        fetchProducts({
          offset: items.length,
          limit: 10,
          title: debouncedSearchQuery || undefined,
          categoryId,
          reset: false,
        })
      );
    }
  }, [
    dispatch,
    loading,
    hasMore,
    items.length,
    debouncedSearchQuery,
    selectedCategory,
  ]);

  useInfiniteScroll({ hasMore, loading, onLoadMore: loadMore });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ offset: 0, limit: 10, reset: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetProducts());
    const categoryId =
      selectedCategory && selectedCategory !== "all"
        ? selectedCategory
        : undefined;

    dispatch(
      fetchProducts({
        offset: 0,
        limit: 10,
        title: debouncedSearchQuery || undefined,
        categoryId,
        reset: true,
      })
    );
  }, [dispatch, debouncedSearchQuery, selectedCategory]);

  const handleRetry = useCallback(() => {
    dispatch(resetProducts());
    const categoryId =
      selectedCategory && selectedCategory !== "all"
        ? selectedCategory
        : undefined;

    dispatch(
      fetchProducts({
        offset: 0,
        limit: 10,
        title: debouncedSearchQuery || undefined,
        categoryId,
        reset: true,
      })
    );
  }, [dispatch, debouncedSearchQuery, selectedCategory]);

  if (error && items.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      <CategoryFilter />

      {items.length === 0 && !loading ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            {debouncedSearchQuery.trim()
              ? `No results for "${debouncedSearchQuery}"`
              : "Try adjusting your filters or search terms"}
          </p>
        </div>
      ) : (
        <>
          <ProductGrid products={items} loading={loading} />

          {loading && <LoadingSpinner size="lg" className="py-8" />}

          {!hasMore && items.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You've reached the end of the products!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(ProductList);
