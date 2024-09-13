import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';
import {AnalyticsPageType, Image} from '@shopify/hydrogen';

// const seo = ({data}) => ({
//   title: data?.collection?.title,
//   description: data?.collection?.description.substr(0, 154),
// });

// export const handle = {
//   seo,
// };

export async function loader({params, context, request}) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');
  console.log(params);
  console.log(handle);

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {
      cursor,
    },
  });

  if (!collections) {
    throw new Response(null, {status: 404});
  }

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      cursor,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    collections,
    collection,
  });
}

export function meta({data}){
  return [
    {title: data?.collection?.title ?? 'Collection'},
    {description: data?.collection?.description},
  ];
};

export default function Collection() {
  const {collections, collection} = useLoaderData();
  console.log(collections);
  return collections ? (
    <>
      <div className="md:grid md:grid-cols-12 md:mx-4 md:border-x md:border-b md:border-black">
        <div className="flex flex-row md:flex-col md:col-span-1 items-center p-4 gap-4 md:h-screen overflow-auto bg-slate-700">
          {collections.nodes.map((col) => {
            return (
              <div key={col} className="flex flex-col w-full">
                <Link to={`/collections/${col.handle}`}>
                  <Image data={col.image} />
                  <p className="text-center text-sm">{col.title}</p>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="md:grid md:grid-cols-2 md:col-span-11">
          <div className="bg-lime-500 h-full"></div>
          <div className="md:border-l md:border-black">
            <h1 className="text-xl text-center">{collection.title}</h1>
          </div>
        </div>
      </div>
      {collection ? (
        <ProductGrid
          collection={collection}
          url={`/collections/all`}
        />
      ) : (
        <p>ProductGrid not loading</p>
      )}
    </>
  ) : (
    <>
      <p>Collection data not loaded</p>
    </>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query CollectionOptions {
    collections(first: 15) {
      nodes {
        title
        handle
        image {
          ... on Image {
            altText
            width
            height
            url
          }
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 4, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          availableForSale
          media(first: 4) {
            nodes {
              ... on MediaImage {
                mediaContentType
                image {
                  id
                  altText
                  url
                  height
                  width
                }
              }
            }
          }
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
