import {useLoaderData, Form} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';
import {AnalyticsPageType} from '@shopify/hydrogen';

// const seo = ({data}) => ({
//   title: data?.collection?.title,
//   description: data?.collection?.description.substr(0, 154),
// });

// export const handle = {
  //   seo,
  // };
  
  export async function loader({params, context, request}) {
    const searchParams = new URL(request.url).searchParams;
    const cursor = searchParams.get('cursor');
    console.log(searchParams);

    // iterate through availability filters, if any
    let availabilityFilter = '';
    let availability = searchParams.getAll('available_for_sale');
    if (availability.length > 0) {
      availabilityFilter += (availability.includes('false')) ? '(-' : '(';
      
      for (let i = 0; i < availability.length; i++) {
        availabilityFilter += `available_for_sale:${availability[i]}`;

        if (i < availability.length - 1) {
          availabilityFilter += ' OR '
        }
      }

      if (availability.length === 1) {
        availabilityFilter.replace(' OR ', '');
      }
      availabilityFilter += ')';
    }

    // iterate through product type filters, if any
    let productTypeFilter = '';
    let productType = searchParams.getAll('product_type');
    if (productType.length > 0) {
      productTypeFilter += '(';

      for (let i = 0; i < productType.length; i++) {
        productTypeFilter += `product_type:${productType[i]}`;
        
        if (i < productType.length - 1) {
          productTypeFilter += ' OR ';
        }
      }

      if (productType.length === 1) {
        productTypeFilter.replace(' OR ', '');
      }
      productTypeFilter += ')';
    }
    
    // iterate through price range filters, if any
    let priceRangeFilter = '';
    let minPrice = searchParams.get('min_price');
    let maxPrice = searchParams.get('max_price');
    if (minPrice && maxPrice) {
      priceRangeFilter += `(variants.price:>=${minPrice} variants.price<=${maxPrice})`;
    } else {
      if (minPrice) {
        priceRangeFilter += `(variants.price:>=${minPrice})`;
      }
      if (maxPrice) {
        priceRangeFilter += `(variants.price<=${maxPrice})`;
      }
    }
    
    let filter = `${availabilityFilter}AND${productTypeFilter}AND${priceRangeFilter}`;
    console.log(filter);

    const collection = await context.storefront.query(COLLECTION_QUERY, {
        variables: {
            cursor,
            filter
        },
    });

      if (!collection) {
        throw new Response(null, {status: 404});
      }

      return json({
        collection,
        analytics: {
          pageType: AnalyticsPageType.collection,
        },
      });
  }



export function meta(parentsData){
    // console.log(parentsData.matches[0].data.header.shop.description);
    return [
        {title: 'Products - JIAGIA'},
        {description: "All handmade screen printed ready to wear apparels, hoodies and t-shirt, made by JIAGIA"},
        {
            property: "description",
            content: parentsData.matches[0].data.header.shop.description
        },
    ];
};

function dropdownClicked(e) {
  // console.log(e);
  e.preventDefault();
  let dropdown = e.currentTarget;
  console.log(dropdown);
  if (dropdown.className.includes('on')) {
    dropdown.classList.remove('on');
  } else {
    dropdown.classList.add('on');
  }
}

function checkAllClicked(e) {
  // console.log(e);
  e.preventDefault();
  let checkAll = e.currentTarget;
  // console.log(checkAll);
}

// function processForm() {
//   let list = document.querySelector('label.dropdown-option');
// }

function CollectionForm() {
  return (
    <Form method="get" >
      <label className="dropdown-option">
        <input type="checkbox" name="available_for_sale" value="true" />
        In Stock
      </label>
      <label className="dropdown-option">
        <input type="checkbox" name="available_for_sale" value="false" />
        Out of Stock
      </label><br />

      <label className="dropdown-option">
        <input type="number" name="min-price" defaultValue={0}/>
        Min Price
      </label>
      &nbsp;
      <label className="dropdown-option">
        <input type="number" name="max-price" defaultValue={0}/>
        Max Price
      </label><br />
      
      <label className="dropdown-option">
        <input type="checkbox" name="product_type" value="hoodie"/>
        Hoodie
      </label>
      <label className="dropdown-option">
        <input type="checkbox" name="product_type" value="sweatshirt"/>
        Sweatshirt
      </label>
      <label className="dropdown-option">
        <input type="checkbox" name="product_type" value="t-shirt"/>
        T-Shirt
      </label><br />
      <button type="submit">
        Submit
      </button>
    </Form>
  );
}

export default function CollectionAll() {
  const {collection} = useLoaderData();
  // console.log(collection);
  // const params = useParams();
  // const inputRef = useRef(null);
  return (
    <>
      <CollectionForm />
      {collection ? (
        <ProductGrid
          collection={collection}
          url={`/collections/all`}
        />
      ) : (
        <p>Nothing to be shown</p>
      )}
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($cursor: String, $filter: String) {
      products(first: 20, reverse: true, after: $cursor, query: $filter) {
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
