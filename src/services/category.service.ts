export const createCategory = async (data: {
  name: string;
  businessId: number;
}) => {
  // TODO: create a category using prisma.category.create()
};

export const getCategories = async (businessId: number) => {
  // TODO: fetch all categories for this business using prisma.category.findMany()
};

export const getCategoryById = async (id: number, businessId: number) => {
  // TODO: fetch a single category, scoped by businessId (use findFirst)
};

export const updateCategory = async (
  id: number,
  businessId: number,
  data: { name?: string },
) => {
  // TODO:
  // 1. confirm category exists AND belongs to this businessId
  // 2. if not found, return null
  // 3. if found, update it and return the result
};

export const deleteCategory = async (id: number, businessId: number) => {
  // TODO:
  // 1. confirm category exists AND belongs to this businessId
  // 2. if not found, return null
  // 3. if found, delete it and return true
  // (think about what should happen to Products that reference this category!)
};
