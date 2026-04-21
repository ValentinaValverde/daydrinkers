import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
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
