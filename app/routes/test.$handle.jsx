import {RotatingImage} from '~/components/Image';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {MediaFile, Money, ShopPayButton} from '@shopify/hydrogen-react';
import {CartForm} from '@shopify/hydrogen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import ProductOptions from '~/components/ProductOptions';
import ProductCard from '~/components/ProductCard';
import {AddToCartButton} from '~/components/CartButtons';

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

export default function Test() {
  const data = useLoaderData();
  // console.log(data.product.media);
  return (
    <RotatingImage
      length={data.product.media.nodes.length}
      media={data.product.media.nodes}
    />
  );
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
