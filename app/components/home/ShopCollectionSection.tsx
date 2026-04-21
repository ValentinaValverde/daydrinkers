import PrimaryButton from '~/components/ui/Button';
import ProductCard from '~/components/ui/ProductCard';

const largeProduct = {
  image: 'https://placehold.co/470x626/c8b49a/4a3a2a?text=.',
  name: 'Daydrinkers Two Year Tee',
  price: '$35',
};

const smallProducts = [
  {
    image: 'https://placehold.co/207x304/b8a48a/4a3a2a?text=.',
    name: 'Cafe Ballet Cuff Sock',
    price: '$35',
  },
  {
    image: 'https://placehold.co/225x304/c2ae94/4a3a2a?text=.',
    name: 'Spilled Milk Socks',
    price: '$35',
  },
];

export default function ShopCollectionSection() {
  return (
    <section id="shop" className="bg-[#f0f2ea] py-16 md:py-64">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[470px_1fr] gap-10 items-end">
          <ProductCard product={largeProduct} imageHeight={626} />

          <div className="flex flex-col mt-16 md:mt-0">
            <div className="flex flex-col gap-3 mb-16">
              <h2 className="text-2xl font-bold text-black max-w-[452px]">
                Shop from our collection
              </h2>
              <p className="text-base text-black max-w-[452px]">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis.
              </p>
              <PrimaryButton text="See More" link="/collections/all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {smallProducts.map((product, i) => (
                <ProductCard key={i} product={product} imageHeight={304} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
