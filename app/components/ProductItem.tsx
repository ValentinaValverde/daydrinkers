import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

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

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProduct;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      to={variantUrl}
      prefetch="intent"
      className="space-y-3 block group"
    >
      <div className="rounded-[32px] overflow-hidden border-2 border-transparent group-hover:border-black transition-colors duration-300 bg-[#e4ceb4]">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="3/4"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-[#e4ceb4]" />
        )}
      </div>
      <div>
        <p className="font-semibold text-lg text-black">{product.title}</p>
        <p className="text-sm text-black">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </Link>
  );
}
