import {useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

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
  console.log(collection);
  return (
    <section className="w-full gap-4">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        Featured Collection
      </h2>
      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collection.products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function ProductCard({product}) {
  
    return (
      <Link to={`/products/${product.handle}`}>
        <div className="grid gap-6">
          <div className="shadow-sm rounded relative">
            <Image
              data={product.variants.nodes[0].image}
              alt={product.title}
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </div>
          <div className="grid gap-1">
            <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis ">
              {product.title}
            </h3>
          </div>
        </div>
      </Link>
    );
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