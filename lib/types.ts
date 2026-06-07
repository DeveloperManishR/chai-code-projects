export type ApiImage = {
  url: string;
  localPath: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category | string;
  owner?: string;
  mainImage: ApiImage;
  subImages?: ApiImage[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  _id: string;
  name: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiEnvelope<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

export type DummyProductRaw = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  images?: string[];
  thumbnail?: string;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
};

export type DummyProductsResponse = {
  products: DummyProductRaw[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductsPage = {
  products: Product[];
  totalProducts: number;
  limit: number;
  page: number;
  totalPages: number;
  serialNumberStartFrom: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type CategoriesPage = {
  categories: Category[];
  totalCategories: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type CategoryWithProducts = ProductsPage & {
  category: Category;
};
