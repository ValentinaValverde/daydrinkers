import {Link} from 'react-router';
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

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-8">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <div>
            <div className="flex justify-center mb-8">
              <PreviousLink className="bg-transparent border-2 border-black text-black rounded-full px-8 h-[52px] flex items-center font-medium hover:bg-black hover:text-white transition-colors">
                {isLoading ? 'Loading...' : '↑ Load previous'}
              </PreviousLink>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nodes.map((product, i) => {
                const price =
                  product?.selectedOrFirstAvailableVariant?.price;
                const image =
                  product?.selectedOrFirstAvailableVariant?.image;
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
        )}
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
