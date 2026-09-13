export const addProductImage = async (data: {
  productId: number;
  url: string;
  isPrimary?: boolean;
}) => {
  // TODO: if data.isPrimary is true, unset isPrimary on other images for this productId first
  // then create the new ProductImage
};

export const getProductImages = async (productId: number) => {
  // TODO: fetch all images for this productId
};

export const deleteProductImage = async (id: number, businessId: number) => {
  // TODO: find the image + its product's businessId (use include), verify ownership, then delete
};

export const setPrimaryImage = async (id: number, productId: number) => {
  // TODO: unset isPrimary on all images for productId, then set true for this id
  // (consider prisma.$transaction([...]))
};
