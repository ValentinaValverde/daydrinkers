import {Link} from 'react-router';

interface Product {
  name: string;
  price: string;
  image: string;
  slug?: string;
}

export default function ProductCard({
  product,
  imageHeight = 408,
}: {
  product: Product;
  imageHeight?: number;
}) {
  const slug = product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link to={`/products/${slug}`} className="space-y-3 block">
      <div className="rounded-[32px] overflow-hidden border-2 border-transparent hover:border-black transition-colors duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full object-cover"
          style={{height: `${imageHeight}px`}}
        />
      </div>
      <div>
        <p className="font-semibold text-lg">{product.name}</p>
        <p className="text-sm">{product.price}</p>
      </div>
    </Link>
  );
}
