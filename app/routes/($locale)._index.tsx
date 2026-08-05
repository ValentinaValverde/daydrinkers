import {useLoaderData} from 'react-router';
import {Resend} from 'resend';
import type {Route} from './+types/_index';
import type {ProductItemFragment} from 'storefrontapi.generated';
import HeroSection from '~/components/home/HeroSection';
import FeaturesSection from '~/components/home/FeaturesSection';
import SeasonalEditSection from '~/components/home/SeasonalEditSection';
import OurStorySection from '~/components/home/OurStorySection';
import ShopCollectionSection from '~/components/home/ShopCollectionSection';
import MenuSection from '~/components/home/MenuSection';
import GiftCardsSection from '~/components/home/GiftCardsSection';
import LocationsSection from '~/components/home/LocationsSection';
import ContactSection from '~/components/home/ContactSection';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Daydrinkers'}];
};

type HomeDataResult = {
  seasonalCollection: {products: {nodes: ProductItemFragment[]}} | null;
  products: {nodes: ProductItemFragment[]};
};

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const phone = String(formData.get('phone') ?? '');
  const message = String(formData.get('message') ?? '');

  if (!email) return {error: 'Email is required'};

  const resend = new Resend((context.env as Record<string, string>).RESEND_API_KEY);

  await Promise.all([
    resend.emails.send({
      from: 'Daydrinkers <onboarding@resend.dev>',
      to: 'hellodaydrinkers@gmail.com',
      subject: `New contact form submission from ${name || email}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    }),
    resend.emails.send({
      from: 'Daydrinkers <onboarding@resend.dev>',
      to: email,
      subject: "We got your message!",
      text: `Hi ${name || 'there'},\n\nThanks for reaching out — we got your message and will be in touch soon!\n\nThe Daydrinkers Team`,
    }),
  ]);

  return {success: true};
}

export async function loader({context}: Route.LoaderArgs) {
  const {storefront, env} = context;
  const seasonalCollectionHandle = env.SEASONAL_COLLECTION_HANDLE ?? 'summer-edit';

  const data = await storefront
    .query(HOME_PRODUCTS_QUERY, {variables: {seasonalFirst: 5, seasonalHandle: seasonalCollectionHandle, shopFirst: 3}})
    .catch(() => null) as HomeDataResult | null;

  return {
    seasonalProducts: data?.seasonalCollection?.products?.nodes ?? [],
    seasonalCollectionHandle,
    shopProducts: data?.products?.nodes ?? [],
  };
}

export default function Homepage() {
  const {seasonalProducts, seasonalCollectionHandle, shopProducts} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <HeroSection />
      <FeaturesSection />
      <SeasonalEditSection products={seasonalProducts} collectionHandle={seasonalCollectionHandle} />
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
    $seasonalFirst: Int!
    $seasonalHandle: String!
    $shopFirst: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    seasonalCollection: collection(handle: $seasonalHandle) {
      products(first: $seasonalFirst) {
        nodes {
          ...HomeProductItem
        }
      }
    }
    products(first: $shopFirst, sortKey: BEST_SELLING) {
      nodes {
        ...HomeProductItem
      }
    }
  }
` as const;
