import type {Route} from './+types/collections.all';
import {useLoaderData, useSearchParams} from 'react-router';
import {useEffect, useState} from 'react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Daydrinkers | Shop'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});
  const url = new URL(request.url);

  const sort = url.searchParams.get('sort') ?? 'best-selling';
  const availability = url.searchParams.get('availability') ?? 'all';
  const price = url.searchParams.get('price') ?? 'all';

  let sortKey = 'BEST_SELLING';
  let reverse = false;
  switch (sort) {
    case 'price-asc':
      sortKey = 'PRICE';
      break;
    case 'price-desc':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'newest':
      sortKey = 'CREATED_AT';
      reverse = true;
      break;
  }

  const queryParts = ['status:active'];
  if (availability === 'in-stock') queryParts.push('available_for_sale:true');
  else if (availability === 'out-of-stock')
    queryParts.push('available_for_sale:false');
  if (price === 'under-50') queryParts.push('variants.price:<50');
  else if (price === '50-100')
    queryParts.push('variants.price:>=50 variants.price:<=100');
  else if (price === 'over-100') queryParts.push('variants.price:>100');

  const filterQuery = queryParts.join(' ');

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables, sortKey, reverse, filterQuery},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

function ShopHero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-b-[54px]">
      <img
        src="/images/shop-img.png"
        alt="Shop hero background"
        className="absolute inset-0 w-full h-[110%] object-cover"
        style={{transform: `translateY(${offset}px)`}}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">Shop</h1>
        <p className="text-base max-w-[452px] opacity-90">
          Apparel and accessories made for people who live and breathe good
          drinks and good vibes.
        </p>
      </div>
    </section>
  );
}

const SORT_OPTIONS = [
  {label: 'Best Selling', value: 'best-selling'},
  {label: 'Price: Low to high', value: 'price-asc'},
  {label: 'Price: High to low', value: 'price-desc'},
  {label: 'Newest', value: 'newest'},
];

const AVAILABILITY_OPTIONS = [
  {label: 'All', value: 'all'},
  {label: 'In stock', value: 'in-stock'},
  {label: 'Out of stock', value: 'out-of-stock'},
];

const PRICE_OPTIONS = [
  {label: 'All prices', value: 'all'},
  {label: 'Under $50', value: 'under-50'},
  {label: '$50–$100', value: '50-100'},
  {label: 'Over $100', value: 'over-100'},
];

function buildFilterUrl(
  params: URLSearchParams,
  key: string,
  value: string,
): string {
  const next = new URLSearchParams(params);
  next.set(key, value);
  next.delete('cursor');
  next.delete('direction');
  return `?${next.toString()}`;
}

const pillBase = 'rounded-full px-6 py-2 border-2 border-black flex items-center transition-colors text-sm';
const pillActive = `${pillBase} bg-black text-white`;
const pillInactive = `${pillBase} bg-transparent text-black hover:bg-black hover:text-white`;

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const currentSort = searchParams.get('sort') ?? 'best-selling';
  const currentAvailability = searchParams.get('availability') ?? 'all';
  const currentPrice = searchParams.get('price') ?? 'all';

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <ShopHero />
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-sm">Sort:</span>
              {SORT_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={buildFilterUrl(searchParams, 'sort', opt.value)}
                  className={currentSort === opt.value ? pillActive : pillInactive}
                >
                  {opt.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-sm">Availability:</span>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={buildFilterUrl(searchParams, 'availability', opt.value)}
                  className={
                    currentAvailability === opt.value ? pillActive : pillInactive
                  }
                >
                  {opt.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-sm">Price:</span>
              {PRICE_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={buildFilterUrl(searchParams, 'price', opt.value)}
                  className={
                    currentPrice === opt.value ? pillActive : pillInactive
                  }
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
          <PaginatedResourceSection<CollectionItemFragment>
            connection={products}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </section>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $filterQuery: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      query: $filterQuery
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
