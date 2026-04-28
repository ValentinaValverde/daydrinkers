import {useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {ProductItem} from '~/components/ProductItem';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Daydrinkers | Cart'}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) throw new Error('No action provided');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({...inputs.buyerIdentity});
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data({cart: cartResult, errors, warnings, analytics: {cartId}}, {
    status,
    headers,
  });
}

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

export async function loader({context}: Route.LoaderArgs) {
  const {cart, storefront} = context;
  const [cartData, productsData] = await Promise.all([
    cart.get(),
    storefront
      .query(RECOMMENDED_PRODUCTS_QUERY, {variables: {first: 4}})
      .catch(() => null),
  ]);
  const recommended = (productsData as {products: {nodes: RecommendedProduct[]}} | null)?.products?.nodes ?? [];
  return {cart: cartData, recommendedProducts: recommended};
}

export default function Cart() {
  const {cart, recommendedProducts} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <section className="pt-[100px] pb-16 md:pb-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-16">
          <CartMain layout="page" cart={cart ?? null} />
        </div>
      </section>

      {recommendedProducts.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-screen-xl mx-auto px-6 md:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-black">
                You might also like
              </h2>
              <p className="text-base text-black/60 mt-2">
                A few of our favourites.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.map((product, i) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={i < 2 ? 'eager' : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment CartRecommendedProduct on Product {
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
  query CartRecommendedProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...CartRecommendedProduct
      }
    }
  }
` as const;
