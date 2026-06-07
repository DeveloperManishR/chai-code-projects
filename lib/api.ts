import type {
  CategoriesPage,
  Category,
  CategoryWithProducts,
  DummyProductsResponse,
  DummyProductRaw,
  Product,
  ProductsPage,
} from "./types";

const API_BASE = "https://dummyjson.com";

async function rawFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }

  return (await res.json()) as T;
}

function buildPath(path: string, params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

function slugToName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeProduct(raw: DummyProductRaw): Product {
  const fallbackDate = new Date().toISOString();
  const createdAt = raw.meta?.createdAt ?? fallbackDate;
  const updatedAt = raw.meta?.updatedAt ?? createdAt;
  const images = (raw.images ?? []).filter(Boolean);
  return {
    _id: String(raw.id),
    name: raw.title,
    description: raw.description,
    price: raw.price,
    stock: raw.stock,
    category: raw.category,
    owner: raw.brand,
    mainImage: { url: raw.thumbnail ?? images[0] ?? "", localPath: "" },
    subImages: images.map((url) => ({ url, localPath: "" })),
    createdAt,
    updatedAt,
  };
}

function toProductsPage(
  response: DummyProductsResponse,
  page: number,
  limit: number,
): ProductsPage {
  const totalPages = Math.max(1, Math.ceil(response.total / limit));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  return {
    products: response.products.map(normalizeProduct),
    totalProducts: response.total,
    limit,
    page,
    totalPages,
    serialNumberStartFrom: response.skip + 1,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
  };
}

export async function getCategories(
  page = 1,
  limit = 50,
): Promise<CategoriesPage> {
  const slugs = await rawFetch<string[]>("/products/category-list");
  const now = new Date().toISOString();
  const categories: Category[] = slugs.map((slug) => ({
    _id: slug,
    name: slugToName(slug),
    createdAt: now,
    updatedAt: now,
  }));
  return {
    categories,
    totalCategories: categories.length,
    limit,
    page,
    totalPages: 1,
  };
}

export async function getProducts(
  page = 1,
  limit = 24,
): Promise<ProductsPage> {
  const skip = Math.max(0, (page - 1) * limit);
  const data = await rawFetch<DummyProductsResponse>(
    buildPath("/products", { skip, limit, sortBy: "id", order: "asc" }),
  );
  return toProductsPage(data, page, limit);
}

export async function getProductById(id: string): Promise<Product> {
  const raw = await rawFetch<DummyProductRaw>(
    `/products/${encodeURIComponent(id)}`,
  );
  return normalizeProduct(raw);
}

export async function getProductsByCategory(
  categoryId: string,
  page = 1,
  limit = 24,
): Promise<CategoryWithProducts> {
  const skip = Math.max(0, (page - 1) * limit);
  const data = await rawFetch<DummyProductsResponse>(
    buildPath(`/products/category/${encodeURIComponent(categoryId)}`, {
      skip,
      limit,
    }),
  );
  const now = new Date().toISOString();
  return {
    ...toProductsPage(data, page, limit),
    category: {
      _id: categoryId,
      name: slugToName(categoryId),
      createdAt: now,
      updatedAt: now,
    },
  };
}
