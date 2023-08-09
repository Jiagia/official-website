import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import FeaturedCollection from '../components/FeaturedCollection';

// GLOBAL VARIABLES
// Featured Collection
const FeaturedCollectionHandle = "season-4";
const FeaturedCollectionNumber = 5;

export function meta({matches}) {
  // console.log(matches[0]?.data?.header?.shop);
  return [
    { title: "Jiagia Studios - JIAGIA"},
    {
      property: "og:title",
      content: "JIAGIA",
    },
    {
      name: "description",
      content: matches[0]?.data?.header?.shop?.description ?? "Jiagia Studios",
    },
  ];
}

/*
  loaders are functions that retrieve the data that's required to render the page
  They always run on the server and pass the returned data to the JSX component
*/
export async function loader({context}) {
    const handle = FeaturedCollectionHandle;
    const number = FeaturedCollectionNumber;
  
    const {collection} = await context.storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        number
      },
    });
  
    // console.log(collection);

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

export default function Index() {
  // hook that retrieves queries data from the loader function
  const {collection} = useLoaderData();
  // console.log(collection);
  return <FeaturedCollection collection={collection} />;
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $number: Int) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: $number) {
        nodes {
          id
          title
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