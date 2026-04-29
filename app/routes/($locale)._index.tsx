import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import type {ProductItemFragment} from 'storefrontapi.generated';
import HeroSection from '~/components/home/HeroSection';
import FeaturesSection from '~/components/home/FeaturesSection';
import WinterCollectionSection from '~/components/home/WinterCollectionSection';
import OurStorySection from '~/components/home/OurStorySection';
import ShopCollectionSection from '~/components/home/ShopCollectionSection';
import MenuSection from '~/components/home/MenuSection';
import GiftCardsSection from '~/components/home/GiftCardsSection';
import LocationsSection from '~/components/home/LocationsSection';
import ContactSection from '~/components/home/ContactSection';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Daydrinkers'}];
};

type HomeProductsResult = {
  products: {nodes: ProductItemFragment[]};
};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // Fetch 8 best-selling products in one request and split between the two sections
  const data = await storefront
    .query(HOME_PRODUCTS_QUERY, {variables: {first: 8}})
    .catch(() => null) as HomeProductsResult | null;

  const allProducts = data?.products?.nodes ?? [];

  return {
    winterProducts: allProducts.slice(0, 5),
    shopProducts: allProducts.slice(5, 8),
  };
}

export default function Homepage() {
  const {winterProducts, shopProducts} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <HeroSection />
      <FeaturesSection />
      <WinterCollectionSection products={winterProducts} />
      <OurStorySection />
      <ShopCollectionSection products={shopProducts} />
      {/* z-50 so overflowing menu images stack above the checkered section */}
      <div className="relative z-50">
        <MenuSection />
      </div>
      <GiftCardsSection />
      <LocationsSection />
      <ContactSection />
    </div>
  );
}

const HOME_PRODUCTS_QUERY = `#graphql
  fragment HomeMoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment HomeProductItem on Product {
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
        ...HomeMoneyProductItem
      }
      maxVariantPrice {
        ...HomeMoneyProductItem
      }
    }
  }
  query HomeProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...HomeProductItem
      }
    }
  }
` as const;
