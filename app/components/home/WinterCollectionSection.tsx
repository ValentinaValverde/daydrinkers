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
  {
    image: 'https://placehold.co/207x304/b8a48a/4a3a2a?text=.',
    name: 'Cafe Latte Hoodie',
    price: '$65',
  },
  {
    image: 'https://placehold.co/225x304/c2ae94/4a3a2a?text=.',
    name: 'Morning Fog Tote',
    price: '$28',
  },
];

export default function WinterCollectionSection() {
  return (
    <section id="collection" className="bg-[#f0f2ea] py-16 md:py-64">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[470px_1fr] gap-10 items-end">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-black max-w-[463px]">
                Shop our Winter Collection.
              </h2>
              <p className="text-base text-black max-w-[470px]">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis.
              </p>
              <PrimaryButton text="See More" link="/collections/all" />
            </div>
            <ProductCard product={largeProduct} imageHeight={600} />
          </div>

          <div className="flex flex-col gap-8 pt-0 md:pt-[172px]">
            <div className="grid grid-cols-2 gap-4">
              {smallProducts.slice(0, 2).map((product, i) => (
                <ProductCard key={i} product={product} imageHeight={350} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {smallProducts.slice(2, 4).map((product, i) => (
                <ProductCard key={i} product={product} imageHeight={350} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
