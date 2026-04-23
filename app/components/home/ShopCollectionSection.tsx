import type {ProductItemFragment} from 'storefrontapi.generated';
import PrimaryButton from '~/components/ui/Button';
import {ProductItem} from '~/components/ProductItem';

export default function ShopCollectionSection({
  products,
}: {
  products: ProductItemFragment[];
}) {
  const [large, ...small] = products;

  return (
    <section id="shop" className="bg-[#f0f2ea] py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[470px_1fr] gap-10 items-end">
          {/* Left: large product */}
          {large && <ProductItem product={large} loading="eager" />}

          {/* Right: text + 2 small products */}
          <div className="flex flex-col mt-16 md:mt-0">
            <div className="flex flex-col gap-3 mb-8">
              <h2 className="text-3xl font-bold text-black max-w-[452px]">
                Shop from our collection
              </h2>
              <p className="text-base text-black max-w-[452px]">
                Wear the vibe. From tees to hats, our collection lets you take
                a little piece of Daydrinkers wherever you go.
              </p>
              <PrimaryButton text="See More" link="/collections/all" />
            </div>

            {small.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {small.slice(0, 2).map((p) => (
                  <ProductItem key={p.id} product={p} loading="lazy" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
