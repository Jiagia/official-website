import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import ShowcaseCard from './ShowcaseCard';

export default function ShowcaseGrid({collection, url}) {
  const [nextPage, setNextPage] = useState(
    collection.products.pageInfo.hasNextPage,
  );

  const [endCursor, setEndCursor] = useState(
    collection.products.pageInfo.endCursor,
  );

  const [products, setProducts] = useState(collection.products.nodes || []);
  useEffect(() => {
    setProducts(collection.products.nodes || []);
  }, [collection]);

  // For making client-side requests
  // https://remix.run/docs/en/v1/hooks/use-fetcher
  const fetcher = useFetcher();

  function fetchMoreProducts() {
    // ?index differentiates index routes from their parent layout routes
    // https://remix.run/docs/en/v1/guides/routing#what-is-the-index-query-param
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const {collection} = fetcher.data;

    setProducts((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  return (
    <section className="w-full gap-4 md:gap-8 grid">
      <div className="grid-flow-row grid gap-4 gap-y-6 md:gap-y-8 lg:gap-y-12 grid-cols-1 md:grid-cols-3 ">
        {products.map((product) => (
          <ShowcaseCard key={product.id} product={product} />
        ))}
      </div>
      {nextPage && (
        <div className="flex items-center justify-center mt-6">
          <button
            className="inline-block rounded font-medium text-center py-3 px-6 border w-full cursor-pointer"
            disabled={fetcher.state !== 'idle'}
            onClick={fetchMoreProducts}
          >
            {fetcher.state !== 'idle' ? 'Loading...' : 'Load more products'}
          </button>
        </div>
      )}
    </section>
  );
}
