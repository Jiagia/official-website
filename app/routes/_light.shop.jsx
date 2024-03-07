import {Image} from '@shopify/hydrogen';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';

export async function loader({context, request}) {
  // const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  console.info(searchParams);
  const cursor = searchParams.get('cursor');
  console.info(cursor);

  const {collection} = await context.storefront.query(SELLABLE_COLLECTION_QUERY, {
    variables: {
      // handle,
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
    collection,
  });
}


export function meta({matches}) {
  return [
    {title: 'Jiagia Studios - Shop'},
    {
      property: 'og:title',
      content: 'JIAGIA',
    },
    {
      name: 'description',
      content: matches[0]?.data?.header?.shop?.description ?? 'Jiagia Studios',
    },
  ];
}

export default function Shop() {
  const {collection} = useLoaderData();
  const imgData = {
    altText: 'Temp png',
    url: 'https://cdn.shopify.com/s/files/1/0753/7868/8295/files/template.png?v=1702157407',
    width: '100%',
    height: 'auto',
  };

  console.log(collection);
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center m-10">
        <h2 className="font-bold">&gt; SHOW &lt;</h2>
        <p>CURRENT PROJECTS AND PROTOTYPES AVAILABLE FOR DREAMERS</p>
      </div>
      
      <ProductGrid
          collection={collection}
          url={`/collections/${collection.handle}`}
        />
    </div>
  );
}

const SELLABLE_COLLECTION_QUERY = `#graphql
query CollectionDetails($cursor: String) {
  collection(handle: "Sellable") {
    id
    title
    description
    handle
    products(first: 10, after: $cursor) {
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
        media(first: 10) {
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
            ... on Model3d {
              id
              mediaContentType
              sources {
                mimeType
                url
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
`