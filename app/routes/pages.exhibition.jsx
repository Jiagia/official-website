import {useLoaderData} from '@remix-run/react';
import { json } from "@shopify/remix-oxygen";
import ProductGrid from '~/components/ProductGrid';
import {Image} from '@shopify/hydrogen';
import { FeaturedProductCard } from '~/components/FeaturedCollection';

export async function loader({context}) {
  const handle = "painting";
  const number = 8;

  console.log(context.storefront);
  
  const page = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      number
    },
  });

  console.log('2');
  
  // Handle 404s
  if (!page) {
    throw new Response(null, {status: 404});
  }

  // console.log("BP: 3");
  
  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    page,
  });
}

export function meta(parentsData) {
  // console.log(parentsData.matches[0].data.header.shop.description);
  return [
    {title: 'Products - JIAGIA'},
    {description: parentsData.matches[0].data.header.shop.description + " - Exhibition"},
    {
      property: "og:description",
      content: parentsData.matches[0].data.header.shop.description
    },
  ];
};

export default function Exhibition() {
  const {page} = useLoaderData();
  // console.log(page);
  // console.log(page.collection.title);
  return (
    <div className="container mx-10 w-1/2">
      <h1>{page.collection.title}</h1>
      {/* <ProductGrid
        collection={page.collection}
        url={`/pages/${page.collection.handle}`}
      /> */}
      <div>
      {page.collection.products.nodes.map((painting) => {
        // console.log(painting);
        return (
          <div key={painting.id}>
          <h3>
            {painting.title}
          </h3>
          <div>
            <Image 
              data={painting.variants.nodes[0].image}
              alt={painting.title}
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query getCollectionByHandle($handle: String!, $number: Int) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: $number) {
        nodes {
          id
          title
          description
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
            }
          }
        }
      }
    }
  }
`;

// const COLLECTION_QUERY = `#graphql
//   query CollectionDetails($handle: String!, $number: Int) {
//     collection(handle: $handle) {
//       id
//       title
//       description
//       handle
//       products(first: $number) {
//         nodes {
//           id
//           title
//           handle
//           variants(first: 1) {
//             nodes {
//               id
//               image {
//                 url
//                 altText
//                 width
//                 height
//               }
//               price {
//                 amount
//                 currencyCode
//               }
//               compareAtPrice {
//                 amount
//                 currencyCode
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;