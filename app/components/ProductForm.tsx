import {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions, ShopPayButton} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {MinusIcon, PlusIcon} from '@phosphor-icons/react';
import {AddToCartButton} from './AddToCartButton';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
  storeDomain,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  storeDomain: string;
}) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  const showToast = () => {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const available = selectedVariant?.availableForSale ?? false;

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="flex flex-col gap-3">
            <p className="text-sm text-black/60">{option.name}</p>
            <div className="flex flex-wrap gap-4">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const hasSwatch =
                  swatch?.color || swatch?.image?.previewImage?.url;

                const pillClass = `h-[44px] min-w-[52px] px-4 rounded-full border-2 text-sm transition-colors duration-200 ${
                  selected
                    ? 'bg-black text-[#f0f2ea] border-black'
                    : available
                      ? 'bg-transparent text-black border-black hover:bg-black hover:text-[#f0f2ea]'
                      : 'bg-transparent text-black/30 border-black/30 cursor-not-allowed'
                }`;

                const swatchClass = `w-8 h-8 rounded-full transition-all duration-200 ${
                  selected
                    ? 'ring-2 ring-offset-[3px] ring-black'
                    : available
                      ? 'hover:ring-2 hover:ring-offset-2 hover:ring-black/40'
                      : 'opacity-30 cursor-not-allowed'
                }`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={hasSwatch ? swatchClass : pillClass}
                      style={
                        hasSwatch
                          ? {
                              backgroundColor: swatch?.color || 'transparent',
                              opacity: available ? 1 : 0.3,
                            }
                          : {opacity: available ? 1 : 0.3}
                      }
                      aria-label={name}
                    >
                      {hasSwatch ? (
                        swatch?.image?.previewImage?.url ? (
                          <img
                            src={swatch.image.previewImage.url}
                            alt={name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : null
                      ) : (
                        name
                      )}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={option.name + name}
                    className={hasSwatch ? swatchClass : pillClass}
                    style={
                      hasSwatch
                        ? {backgroundColor: swatch?.color || 'transparent'}
                        : undefined
                    }
                    disabled={!exists}
                    aria-label={name}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {hasSwatch ? (
                      swatch?.image?.previewImage?.url ? (
                        <img
                          src={swatch.image.previewImage.url}
                          alt={name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : null
                    ) : (
                      name
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity selector */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-black/60">Quantity</p>
        <div className="flex items-center border-2 border-black rounded-full w-fit">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <MinusIcon size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
            aria-label="Increase quantity"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </div>

      <AddToCartButton
        disabled={!selectedVariant || !available}
        onClick={showToast}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {available ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      {available && selectedVariant && (
        <ShopPayButton
          variantIdsAndQuantities={[{id: selectedVariant.id, quantity}]}
          storeDomain={storeDomain}
          width="100%"
          channel="hydrogen"
        />
      )}

      {/* <Link
        to="/cart"
        className="text-center text-sm underline underline-offset-4 text-black/60 hover:text-black transition-colors"
      >
        More payment options
      </Link> */}

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-[#f0f2ea] text-sm px-5 py-3 rounded-full shadow-lg transition-all duration-300 pointer-events-none z-50 ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        Added to cart!
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <>{name}</>;

  return (
    <div
      aria-label={name}
      className="w-5 h-5 rounded-full"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && (
        <img src={image} alt={name} className="w-full h-full rounded-full" />
      )}
    </div>
  );
}
