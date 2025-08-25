export const getValidImageUrl = (images: string[]): string => {
  if (!images || images.length === 0) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }

  const validImages = images.filter((img) => {
    try {
      new URL(img);
      return true;
    } catch {
      return false;
    }
  });

  return validImages.length > 0
    ? validImages[0]
    : "https://via.placeholder.com/300x300?text=No+Image";
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
