import {useLoaderData, Form, useLocation} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';


// const seo = ({data}) => ({
//   title: data?.collection?.title,
//   description: data?.collection?.description.substr(0, 154),
// });

// export const handle = {
  //   seo,
  // };
  
  export async function loader({params, context, request, route}) {
    const searchParams = new URL(request.url).searchParams;
    const url = new URL(request.url);
    const cursor = searchParams.get('cursor');
    console.info(searchParams);
    console.info(url.pathname);
    console.info(url.pathname.split('/')[2]);

    const {collections} = await context.storefront.query(COLLECTION_QUERY, {
        variables: {
            cursor,
        },
    });

      if (!collections) {
        throw new Response(null, {status: 404});
      }

      return json({
        collections,
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
      <select name="sort-option">
        <option value='BEST_SELLING'>Best Selling</option>
        <option value='PRODUCT_TYPE'>Product Type</option>
        <option value='TITLE'>Title</option>
        <option value='CREATED_AT'>Product Added</option>
      </select><br />
      <button type="submit">
        Submit
      </button>
    </Form>
  );
}

export default function CollectionAll() {
  const {collections} = useLoaderData();
  const location = useLocation();
  console.log(location);
  console.log(collections);
  return collections ? (
    <>
      <div className="md:grid md:grid-cols-12 md:mx-4 md:border-x md:border-black">
        <div className="flex flex-row md:flex-col md:col-span-1 items-center p-4 gap-4 md:h-screen overflow-auto bg-slate-700">
          {collections.nodes.map((collection) => {
            return (
              <div key={collection} className="flex flex-col w-full">
                <Image data={collection.image} />
                <p className="text-center text-sm">{collection.title}</p>
              </div>
            );
          })}
        </div>
        <div className="md:grid md:grid-cols-2 md:col-span-11">
          <div className="bg-lime-500 h-full"></div>
          <div className="md:border-l md:border-black">
            <h1 className="text-xl text-center">Title</h1>
          </div>
        </div>
      </div>
      {/* <CollectionForm />
      {collection ? (
        <ProductGrid
          collection={collection}
          url={`/collections/all`}
        />
      ) : (
        <p>Nothing to be shown</p>
      )} */}
    </>
  ) : (
    <>
      <p>Collection data not loaded</p>
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionOptions {
    collections(first: 15) {
      nodes {
        title
        handle
        image {
          ... on Image {
            altText
            width
            height
            url
          }
        }
      }
    }
  }
`;
