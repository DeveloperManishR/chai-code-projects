import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getProducts, getProductsByCategory } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductGallery, AddToCartPanel } from "@/components/product-detail";
import { categoryIdOf, categoryNameOf, formatDate, formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.mainImage?.url ? [product.mainImage.url] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const categoryId = categoryIdOf(product.category);
  const [relatedResult, allProducts] = await Promise.all([
    categoryId ? getProductsByCategory(categoryId, 1, 5).catch(() => null) : null,
    getProducts(1, 30).catch(() => null),
  ]);

  const related =
    relatedResult?.products
      ?.filter((p) => p._id !== product._id)
      .slice(0, 4) ??
    allProducts?.products
      ?.filter((p) => p._id !== product._id)
      .slice(0, 4) ??
    [];

  return (
    <article>
      <div className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          <span className="truncate text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            {categoryNameOf(product.category)}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-mono text-2xl tabular-nums text-ink">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-ink/80">
            {product.description}
          </p>

          <div className="my-8 h-px w-full bg-ink/10" />

          <AddToCartPanel product={product} />

          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Maker&apos;s note
              </dt>
              <dd className="mt-1 text-ink/80">
                Hand-finished in our partner studio. Slight variation is part
                of the craft.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Care
              </dt>
              <dd className="mt-1 text-ink/80">
                Wipe clean with a soft, dry cloth. Avoid prolonged direct
                sunlight.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Listed
              </dt>
              <dd className="mt-1 font-mono text-ink/80">
                {formatDate(product.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Reference
              </dt>
              <dd className="mt-1 font-mono text-ink/80">
                #{product._id.slice(-6).toUpperCase()}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                  More to discover
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  From the same collection
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden text-sm font-medium text-ink sm:inline-flex"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
