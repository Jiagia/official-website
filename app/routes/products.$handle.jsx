import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {MediaFile, Money, ShopPayButton} from '@shopify/hydrogen-react';
import {CartForm} from '@shopify/hydrogen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import ProductOptions from '~/components/ProductOptions';
import ProductCard from '~/components/ProductCard';
import {AddToCartButton} from '~/components/CartButtons';
import {Carousel} from '~/components/Carousel';
import arrowRight from '../../public/arrow-right-black.svg'
import arrowLeft from '../../public/arrow-left-black.svg'
import carouselcss from '../styles/carousel.css';

export const links = () => [
  {rel: "stylesheet", href: carouselcss},
]

export async function loader({params, context, request}) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];
  const storeDomain = context.storefront.getShopifyDomain();
  const recNum = 5;

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {product} = await context.storefront.query(PRODUCT_W_REC_QUERY, {
    variables: {
      handle,
      selectedOptions,
      recNum,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  return json({
    product,
    selectedVariant,
    storeDomain,
    analytics: {
      pageType: AnalyticsPageType.product,
      products: [product],
    },
  });
}

export function meta({data}) {
  return [
    {title: (data?.product?.title ?? 'Collection') + ' - JIAGIA'},
    {description: data?.product?.descriptionHtml},
  ];
}

export default function ProductHandle() {
  const {product, selectedVariant, storeDomain} = useLoaderData();
  // console.log(product)
  // console.log(selectedVariant)
  // console.log(product.recommendation.references.nodes);
  const orderable = selectedVariant?.availableForSale || false;
  const sellable = product.tags.includes('Sellable');

  return (
    <section className="w-full grid ">
      <div className="grid items-start md:grid-cols-2">
        {/* <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden md:grid-cols-2 md:w-full lg:col-span-3"> */}
        <div className="scroll-smooth snap-x md:col-span-2 snap-center card-image  ">
          <ProductGallery media={product.media.nodes} />
          {/* </div> */}
        </div>
        <div className="md:sticky px-auto max-w-xl  grid p-2 md:p-6 md:px-2  ">
          <div className="grid gap-2">
            <h1 className="text-4xl font-bold leading-10 whitespace-normal">
              {product.title}
            </h1>
            {/* <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span> */}
          </div>
          <div
            className="prose border-t border-gray-200 pt-6 text-black text-md mb-8"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          ></div>
          {sellable ? (
            <>
              <ProductOptions
                options={product.options}
                selectedVariant={selectedVariant}
                className="mt-32"
              />
              <Money
                withoutTrailingZeros
                data={selectedVariant.price}
                className="text-xl font-semibold mb-2"
              />
              {orderable ? (
                <div className="space-y-2 w-11/12 max-w-[400px]">
                  <ProductForm
                    variantId={selectedVariant?.id}
                    width="100%"
                    productAnalytics={product?.handle}
                  />
                  <ShopPayButton
                    storeDomain={storeDomain}
                    variantIds={[selectedVariant?.id]}
                    width="100%"
                  />
                </div>
              ) : (
                <div className="text-xl font-bold mb-2">Sold Out</div>
              )}
            </>
          ) : null}
        </div>
      </div>
      {/* {product.recommendation ? (
        <div className='pt-5 grid'>
          <hr />
          <h2>Recommendation</h2>
          <div className='grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          
          {product.recommendation?.references.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
        ) : null
        } */}
    </section>
  );
}

function ProductGallery({media}) {
  if (!media.length) {
    return null;
  }

  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  const number = 2;
  const id = 'product-gallery';

  return (
    <Carousel
      number={number}
      className={`flex w-full justify-center flex-col md:flex-row`}
      // leftbtn={<img className="px-4" src={arrowLeft} />}
      // rightbtn = {<img className="px-4" src={arrowRight} />}
      leftbtn={
        <svg height="60px" width="60px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 197.402 197.402" xml:space="preserve">
        <g>
          <g>
            <g>
              <polygon points="146.883,197.402 45.255,98.698 146.883,0 152.148,5.418 56.109,98.698 152.148,191.98         "/>
            </g>
          </g>
        </g>
        </svg>
      }
      rightbtn={
      <svg height="60px" width="60px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 223.413 223.413" xml:space="preserve">
        <g>
          <g>
            <g>
              <polygon  points="57.179,223.413 51.224,217.276 159.925,111.71 51.224,6.127 57.179,0 172.189,111.71         "/>
            </g>
          </g>
        </g>
        </svg>
        }
      lbtnclass={`absolute left-0 inset-y-0 `}
      rbtnclass={`absolute right-0 inset-y-0`}
      array={media.map((med) => {
        let extraProps = {};

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: 'eager',
            disableZoom: true,
            style: {height: '100%', margin: '0 auto'},
          };
        }

        const data = {
          ...med,
          __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
          image: {
            ...med.image,
            altText: med.alt || 'Product image',
          },
        };

        return (
          <div
            className={`snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={data.id || data.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full aspect-square object-cover`}
              data={data}
              {...extraProps}
            />
          </div>
        );
      })}
      
      // leftbtn=""
      // rightbtn=""
      id={id}
    />
  );
}

// function ProductGallery({media}) {
//   if (!media.length) {
//     return null;
//   }

//   const typeNameMap = {
//     MODEL_3D: 'Model3d',
//     VIDEO: 'Video',
//     IMAGE: 'MediaImage',
//     EXTERNAL_VIDEO: 'ExternalVideo',
//   };

//   return (
//     <div
//       className={`grid gap-4 overflow-x-auto grid-flow-col md:grid-flow-row  md:p-0 md:overflow-y-auto md:grid-cols-2 w-[90vw] md:w-full `}
//     >
//       {media.map((med) => {
//         let extraProps = {};

//         if (med.mediaContentType === 'MODEL_3D') {
//           extraProps = {
//             interactionPromptThreshold: '0',
//             ar: true,
//             loading: 'eager',
//             disableZoom: true,
//             style: {height: '100%', margin: '0 auto'},
//           };
//         }

//         const data = {
//           ...med,
//           __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
//           image: {
//             ...med.image,
//             altText: med.alt || 'Product image',
//           },
//         };

//         return (
//           <div
//             className={`snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
//             key={data.id || data.image.id}
//           >
//             <MediaFile
//               tabIndex="0"
//               className={`w-full aspect-square object-cover`}
//               data={data}
//               {...extraProps}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }

function ProductForm({variantId, productAnalytics = ''}) {
  const lines = [{merchandiseId: variantId, quantity: 1}];

  return (
    <AddToCartButton
      lines={lines}
      productAnalytics={productAnalytics}
      className="bg-black text-white px-6 py-3 w-full text-center font-medium max-w-[400px]"
    />
  );
  // return (
  //   <CartForm
  //     route="/cart"
  //     action={CartForm.ACTIONS.LinesAdd}
  //     inputs={
  //       {lines}
  //     }
  //   >
  //     <button className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium max-w-[400px]">
  //       Add to Bag
  //     </button>
  //   </CartForm>
  // );
}

const PRODUCT_W_REC_QUERY = `#graphql
  fragment RecProduct on Product {
    id
    title
    availableForSale
    handle
    featuredImage {
      id
      altText
      url
      width
      height
    }
    id
    title
    publishedAt
    handle
    availableForSale
    tags
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
  
  query product($recNum: Int, $handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      tags
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
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
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
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
      recommendation: metafield(namespace: "my_product", key: "recommended_product") {
        references(first: $recNum) {
          nodes {
            ...RecProduct
          }
        }
      }
    }
  }
  `;

const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
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
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
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
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
