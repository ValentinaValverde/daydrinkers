import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
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
  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {variables: {...paginationVariables}}),
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

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <ShopHero />
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-10">
            <div className="flex gap-3">
              <button className="border border-black rounded-full px-5 h-10 text-sm text-black hover:bg-black hover:text-[#f0f2ea] transition-colors">
                Availability
              </button>
              <button className="border border-black rounded-full px-5 h-10 text-sm text-black hover:bg-black hover:text-[#f0f2ea] transition-colors">
                Price
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-black">
              <select className="border border-black rounded-full px-4 h-10 text-sm bg-transparent appearance-none pr-8 cursor-pointer focus:outline-none">
                <option>Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
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
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
