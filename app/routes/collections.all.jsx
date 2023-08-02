import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';


export async function loader({params, context, request}) {
    const searchParams = new URL(request.url).searchParams;
    const cursor = searchParams.get('cursor');

    const collection = await context.storefront.query(COLLECTION_QUERY, {
        variables: {
            cursor,
        },
    });

      if (!collection) {
        throw new Response(null, {status: 404});
      }

      return json({
        collection,
      });
  }

export function meta(parentsData){
    // console.log(parentsData.matches[0].data.header.shop.description);
    return [
        {title: 'Products - JIAGIA'},
        {description: "All handmade screen printed ready to wear apparels, hoodies and t-shirt, made by JIAGIA"},
        {
            property: "og:description",
            content: parentsData.matches[0].data.header.shop.description
        },
    ];
};

export default function CollectionAll() {
  const {collection} = useLoaderData();
  return (
    <>
      {/* <header className="grid w-full gap-8 py-8 justify-items-start">
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
      </header> */}
      <ProductGrid
        collection={collection}
        url={`/collections/all`}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($cursor: String) {
      products(first: 4, reverse: true, after: $cursor) {
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
`;
