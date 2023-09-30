import {useLoaderData} from '@remix-run/react';
import { json } from "@shopify/remix-oxygen";
import ProductGrid from '~/components/ProductGrid';
import {Image} from '@shopify/hydrogen';
import { FeaturedProductCard } from '~/components/FeaturedCollection';

export async function loader({context}) {
  const handle = "Exhibition";
  const number = 8;

  console.log(context.storefront);
  
  const page = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      number
    },
  });

  
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
  
  // console.log(page.collection.title);

  const paintings = page.metaobjects.nodes.sort((paint1, paint2) => (paint1.order.value > paint2.order.value ? 1 : -1))
  console.log(paintings);
  return (
    <div id="exhibition" className="">
      <div>
      {paintings.map((painting) => {
        // console.log(painting);
        return (
          <div className="painting-item m-10" key={painting.id}>
          <h3 className="painting-title text-2xl">
            {painting.title.value}
          </h3>
          <div className="painting-body mx-auto">
            <Image
              data={painting.image.reference.image}
              alt={painting.title.value}
              sizes="(min-width: 45em) 50vw, 100vw"
              // height="80vh"
              // style={{width: "60vw"}}
            />
            <div className="grid painting-des">
              <h4>{painting.fact.value}</h4>
              <p>{painting.inspiration.value}</p>
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
    
      metaobjects(type: $handle, first: $number) {
        # MetaobjectConnection fields
        nodes {
          id
          order: field(key: "order") {value}
          title: field(key:"title") {
            key,
            value
    
          }
          image: field(key:"url"){
            key,
            value,
            reference {
                ... on MediaImage {
                  __typename
                  image {
                    url
                    width
                    height
                  }
                }
            }
          }
          fact: field(key:"factual_description") {
            key,
            value
          }
          inspiration: field(key:"inspiration_description") {
            key,
            value
    
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