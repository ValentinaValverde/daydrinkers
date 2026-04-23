import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {CaretUp, CaretDown, Check} from '@phosphor-icons/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {ProductItem} from '~/components/ProductItem';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-6">Articles</h2>
      <div className="space-y-3">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="block text-black hover:opacity-60 transition-opacity font-medium"
            >
              {article.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-6">Pages</h2>
      <div className="space-y-3">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="block text-black hover:opacity-60 transition-opacity font-medium"
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  {label: 'Relevance', value: 'relevance'},
  {label: 'A to Z', value: 'title-asc'},
  {label: 'Price: Low to high', value: 'price-asc'},
  {label: 'Price: High to low', value: 'price-desc'},
];

const PRICE_FILTERS = [
  {label: 'All prices', value: 'all'},
  {label: 'Under $50', value: 'under-50'},
  {label: '$50 - $100', value: '50-100'},
  {label: 'Over $100', value: 'over-100'},
];

const AVAILABILITY_OPTIONS = [
  {label: 'All', value: 'all'},
  {label: 'In stock', value: 'in-stock'},
  {label: 'Out of stock', value: 'out-of-stock'},
];

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: {label: string; value: string}[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-base"
      >
        <span className="font-semibold">{label}:</span>
        <span>{selectedLabel}</span>
        {open ? <CaretUp size={14} /> : <CaretDown size={14} />}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-black rounded-lg p-4 flex flex-col gap-3 min-w-[160px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex items-center justify-between gap-6 text-left text-base hover:opacity-60 transition-opacity"
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  const [sortBy, setSortBy] = useState('relevance');
  const [priceFilter, setPriceFilter] = useState('all');
  const [availability, setAvailability] = useState('all');

  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-8">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          let sorted = [...nodes];

          if (sortBy === 'price-asc')
            sorted.sort(
              (a, b) =>
                parseFloat(a.selectedOrFirstAvailableVariant?.price?.amount ?? '0') -
                parseFloat(b.selectedOrFirstAvailableVariant?.price?.amount ?? '0'),
            );
          else if (sortBy === 'price-desc')
            sorted.sort(
              (a, b) =>
                parseFloat(b.selectedOrFirstAvailableVariant?.price?.amount ?? '0') -
                parseFloat(a.selectedOrFirstAvailableVariant?.price?.amount ?? '0'),
            );
          else if (sortBy === 'title-asc')
            sorted.sort((a, b) => a.title.localeCompare(b.title));

          if (priceFilter !== 'all') {
            sorted = sorted.filter((product) => {
              const price = parseFloat(
                product.selectedOrFirstAvailableVariant?.price?.amount ?? '0',
              );
              if (priceFilter === 'under-50') return price < 50;
              if (priceFilter === '50-100') return price >= 50 && price <= 100;
              return price > 100;
            });
          }

          if (availability !== 'all') {
            sorted = sorted.filter((product) => {
              const inStock = product.selectedOrFirstAvailableVariant != null;
              return availability === 'in-stock' ? inStock : !inStock;
            });
          }

          return (
            <div>
              <div className="flex flex-wrap gap-8 mb-8">
                <FilterDropdown
                  label="Availability"
                  value={availability}
                  options={AVAILABILITY_OPTIONS}
                  onChange={setAvailability}
                />
                <FilterDropdown
                  label="Price"
                  value={priceFilter}
                  options={PRICE_FILTERS}
                  onChange={setPriceFilter}
                />
                <FilterDropdown
                  label="Sort by"
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onChange={setSortBy}
                />
              </div>

              <div className="flex justify-center mb-8">
                <PreviousLink className="bg-transparent border-2 border-black text-black rounded-full px-8 h-[52px] flex items-center font-medium hover:bg-black hover:text-white transition-colors">
                  {isLoading ? 'Loading...' : '↑ Load previous'}
                </PreviousLink>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sorted.map((product, i) => {
                  const price = product?.selectedOrFirstAvailableVariant?.price;
                  const image = product?.selectedOrFirstAvailableVariant?.image;
                  const productUrl = urlWithTrackingParams({
                    baseUrl: `/products/${product.handle}`,
                    trackingParams: product.trackingParameters,
                    term,
                  });

                  return (
                    <Link
                      key={product.id}
                      prefetch="intent"
                      to={productUrl}
                      className="space-y-3 block group"
                    >
                      <div className="rounded-[32px] overflow-hidden border-2 border-transparent group-hover:border-black transition-colors duration-300 bg-[#e4ceb4]">
                        {image ? (
                          <Image
                            data={image}
                            alt={product.title}
                            aspectRatio="3/4"
                            loading={i < 6 ? 'eager' : 'lazy'}
                            sizes="(min-width: 45em) 400px, 100vw"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[3/4] bg-[#e4ceb4]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-black">
                          {product.title}
                        </p>
                        <p className="text-sm text-black">
                          {price && <Money data={price} />}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="flex justify-center mt-10">
                <NextLink className="bg-[#3c6d8e] text-white border-2 border-[#3c6d8e] rounded-full px-8 h-[52px] flex items-center font-medium hover:bg-transparent hover:text-[#3c6d8e] transition-colors">
                  {isLoading ? 'Loading...' : 'Load more ↓'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-20">
      <p className="text-xl text-black/60">
        No results found. Try a different search term.
      </p>
    </div>
  );
}
