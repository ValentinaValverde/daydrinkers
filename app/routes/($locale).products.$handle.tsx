import {redirect, useLoaderData, Await} from 'react-router';
import type {Route} from './+types/products.$handle';
import {useState, useCallback, useEffect, Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
} from '@shopify/hydrogen';
import {XIcon, ArrowLeftIcon, ArrowRightIcon} from '@phosphor-icons/react';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductItem} from '~/components/ProductItem';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';

type RecommendedProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

type ProductRecommendationsQuery = {
  productRecommendations: RecommendedProduct[] | null;
};

export const meta: Route.MetaFunction = ({
  data,
}: {
  data?: {product: {title: string; handle: string}};
}) => {
  return [
    {title: `Daydrinkers | ${data?.product.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData.product.id);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Error('Expected product handle to be defined');

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) throw new Response(null, {status: 404});

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context}: Route.LoaderArgs, productId: string) {
  const recommendations = context.storefront
    .query(RECOMMENDATIONS_QUERY, {variables: {productId}})
    .catch(() => null);

  return {recommendations};
}

// ─── Image Gallery ───────────────────────────────────────────────────────────

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (i: number) => {
    setLightboxIdx(i);
    setLightboxOpen(true);
  };

  const prev = useCallback(
    () => setLightboxIdx((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setLightboxIdx((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  const displayImages = images.length > 0 ? images : [];

  return (
    <>
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {/* Main image */}
        {displayImages[selected] && (
          <button
            onClick={() => openLightbox(selected)}
            className="rounded-[32px] overflow-hidden border-2 border-transparent hover:border-black transition-colors duration-300 cursor-zoom-in text-left w-full"
          >
            <Image
              data={displayImages[selected] as any}
              alt={displayImages[selected].altText || title}
              aspectRatio="4/5"
              sizes="(min-width: 45em) 50vw, 100vw"
              className="w-full object-cover"
            />
          </button>
        )}

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-2 gap-4">
            {displayImages.slice(0, 2).map((img, i) => (
              <button
                key={img.id ?? i}
                onClick={() => {
                  setSelected(i);
                  openLightbox(i);
                }}
                className={`rounded-[32px] overflow-hidden border-2 transition-colors duration-300 cursor-zoom-in ${
                  selected === i ? 'border-black' : 'border-transparent hover:border-black'
                }`}
              >
                <Image
                  data={img as any}
                  alt={img.altText || `${title} view ${i + 1}`}
                  aspectRatio="3/4"
                  sizes="(min-width: 45em) 25vw, 50vw"
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && displayImages.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:opacity-60 transition-opacity"
            aria-label="Close"
          >
            <XIcon size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-6 text-white hover:opacity-60 transition-opacity"
            aria-label="Previous image"
          >
            <ArrowLeftIcon size={32} />
          </button>
          <img
            src={displayImages[lightboxIdx]?.url}
            alt={displayImages[lightboxIdx]?.altText || title}
            className="max-h-[80vh] max-w-[80vw] rounded-[32px] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-6 text-white hover:opacity-60 transition-opacity"
            aria-label="Next image"
          >
            <ArrowRightIcon size={32} />
          </button>
          <div className="absolute bottom-6 flex gap-2">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(i);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === lightboxIdx ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────

function RelatedProducts({
  recommendations,
}: {
  recommendations: Promise<ProductRecommendationsQuery | null>;
}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={recommendations}>
        {(data) => {
          const products = data?.productRecommendations?.slice(0, 6);
          if (!products?.length) return null;
          return (
            <section className="bg-[#f0f2ea] py-16 md:py-24">
              <div className="max-w-screen-xl mx-auto px-6 md:px-8">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-black">
                    There&apos;s more where that came from...
                  </h2>
                  <p className="text-base text-black mt-2">
                    You might also like these.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product: RecommendedProduct, i: number) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      loading={i < 3 ? 'eager' : undefined}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Merge variant image at the front of the gallery
  const allImages: GalleryImage[] = [];
  if (selectedVariant?.image) allImages.push(selectedVariant.image);
  for (const img of product.images.nodes) {
    if (!allImages.find((i) => i.id === img.id)) allImages.push(img);
  }

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <section className="pt-[100px] pb-16 md:pb-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Left: gallery */}
            <ProductGallery images={allImages} title={product.title} />

            {/* Right: details */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 md:pt-4 md:sticky md:top-[100px] md:self-start">
              <h1 className="text-4xl md:text-[48px] font-bold leading-tight text-black">
                {product.title}
              </h1>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              {product.descriptionHtml && (
                <div
                  className="text-base leading-relaxed text-black max-w-[452px] prose"
                  dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                />
              )}
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts recommendations={recommendations} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDATIONS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...RecommendedProduct
    }
  }
` as const;
