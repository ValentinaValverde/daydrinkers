import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {useEffect, useState} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Daydrinkers | ${data?.collection.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!handle) throw redirect('/collections');

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

function CollectionHero({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
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
        alt={title}
        className="absolute inset-0 w-full h-[110%] object-cover"
        style={{transform: `translateY(${offset}px)`}}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        {description && (
          <p className="text-base max-w-[452px] opacity-90">{description}</p>
        )}
      </div>
    </section>
  );
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <CollectionHero
        title={collection.title}
        description={collection.description}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
            resourcesClassName="grid grid-cols-2 md:grid-cols-3 gap-6"
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
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
