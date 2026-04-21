import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div aria-label="Price" role="group">
      {compareAtPrice ? (
        <div className="flex items-center gap-3">
          {price && (
            <span className="text-base font-semibold text-black">
              <Money data={price} />
            </span>
          )}
          <s className="text-base text-black/50">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <span className="text-base font-semibold text-black">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
