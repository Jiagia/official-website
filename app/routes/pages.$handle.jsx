

import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';


export async function loader({params, context}) {
  const {handle} = params;


  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle,
    },
  });

  // Handle 404s
  if (!page) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    page,
  });
}

// export function meta({data}){
//   return [
//     {title: data?.collection?.title ?? 'Collection'},
//     {description: data?.collection?.description},
//   ];
// };

export function meta({data, matches}){
  return [
      {title: (data?.page?.title ?? 'Page') + ' - JIAGIA'},
      {description: "Jiagia Studio's " + (data?.page?.title ?? 'Page')},
      {
          property: "og:description",
          content: matches[0].data.header.shop.description
      },
  ];
};

export default function Page() {
    const {page} = useLoaderData();

    // console.log(page);

    return <div dangerouslySetInnerHTML={{__html: page.body}}></div>;
}


export  function Collection() {
  const {collection} = useLoaderData();
  return (
    <>
      <header className="grid w-full gap-8 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>

        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
      <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
    </>
  );
}

const PAGE_QUERY = `#graphql
    query PageDetails($handle: String!) {
        page(handle: $handle) {
            id
            title
            handle
            body
            bodySummary
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
