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
    <div id="exhibition" className="">
      {/* <h1 className="text-center text-[30px]">{page.collection.title}</h1> */}
      {/* <ProductGrid
        collection={page.collection}
        url={`/pages/${page.collection.handle}`}
      /> */}
      <div>
      {page.collection.products.nodes.map((painting) => {
        // console.log(painting);
        return (
          <div className="painting-item m-10" key={painting.id}>
          <h3 className="painting-title text-2xl">
            {painting.title}
          </h3>
          <div className="painting-body mx-auto">
            <Image
              data={painting.variants.nodes[0].image}
              alt={painting.title}
              sizes="(min-width: 45em) 50vw, 100vw"
              // height="80vh"
              // style={{width: "60vw"}}
            />
            <div className="grid painting-des" dangerouslySetInnerHTML={{__html: painting.descriptionHtml}}>


              </div>
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
      descriptionHtml
      handle
      products(first: $number) {
        nodes {
          id
          title
          description
          descriptionHtml
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