import type {ProductItemFragment} from 'storefrontapi.generated';
import PrimaryButton from '~/components/ui/Button';
import {ProductItem} from '~/components/ProductItem';

export default function SeasonalEditSection({
  products,
  collectionHandle,
}: {
  products: ProductItemFragment[];
  collectionHandle: string;
}) {
  const [large, ...small] = products;

  return (
    <section id="collection" className="bg-[#f0f2ea] py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[470px_1fr] gap-10 items-end">
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold text-black max-w-[463px]">
                Shop our Summer Collection.
              </h2>
              <p className="text-base text-black max-w-[470px]">
                Made for iced coffee runs, porch hangs, and everything else
                summer&rsquo;s an excuse for.
              </p>
              <PrimaryButton text="See More" link={`/collections/${collectionHandle}`} />
            </div>
            {large && <ProductItem product={large} loading="eager" />}
          </div>

          {small.length > 0 && (
            <div className="flex flex-col gap-4 pt-0 md:pt-[172px]">
              <div className="grid grid-cols-2 gap-4">
                {small.slice(0, 2).map((p, i) => (
                  <ProductItem
                    key={p.id}
                    product={p}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              {small.length > 2 && (
                <div className="grid grid-cols-2 gap-4">
                  {small.slice(2, 4).map((p) => (
                    <ProductItem key={p.id} product={p} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
