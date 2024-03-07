import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';
import {Image} from '@shopify/hydrogen';
import {FeaturedProductCard} from '../components/FeaturedCollection';
// import {useState} from 'react';
// import {motion, AnimatePresence} from 'framer-motion'
import splashcss from '../styles/splash.css';

// GLOBAL VARIABLES
// Featured Collection
const FeaturedCollectionHandle = 'season-4';
const FeaturedCollectionNumber = 5;

export const links = () => [
  {rel: "stylesheet", href: splashcss},
]

export function meta({matches}) {
  // console.log(matches[0]?.data?.header?.shop);
  return [
    {title: 'Jiagia Studios - JIAGIA'},
    {
      property: 'og:title',
      content: 'JIAGIA',
    },
    {
      name: 'description',
      content: matches[0]?.data?.header?.shop?.description ?? 'Jiagia Studios',
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
      number,
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

  

  const images = [
    'https://picsum.photos/id/1/400/500',
    'https://picsum.photos/id/2/400/500',
    'https://picsum.photos/id/3/400/500',
    'https://picsum.photos/id/4/400/500',
    'https://picsum.photos/id/5/400/500',
  ];

  const array = images.map((image, i) => (<Image src={image} key={i} style={{float: 'left'}} width="25%" />));

  return (
    <div>
      <div className="relative">
        <Carousel
          array={array}
          number={4}
          wrap={true}
          leftbtn={<div></div>}
          lbtnclass="absolute h-full w-1/4"
          rightbtn={<div></div>}
          rbtnclass="absolute h-full w-1/4 right-0 top-0"
          className="hidden md:block h-full"
          id="gallery-desktop"
        />
        <span className="text-transparent">Jigia</span>
      </div>
      <div className="relative">
        <Carousel
          array={images.map((image, i) => (<Image src={image} key={i} width="100%" />))}
          number={1} wrap={true} 
          leftbtn={<div></div>}
          lbtnclass="absolute h-full w-1/4"
          rightbtn={<div></div>}
          rbtnclass="absolute h-full w-1/4 right-0 top-0"
          className="md:hidden h-full"
          id="gallery-mobile"
        />
        <span> </span>
      </div>
      <div className='grid grid-cols-4 hidden border-1'>
        <div>1</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
      </div>
      <div className="hidden md:flex px-4 md:px-6 lg:px-8">
        <ProductCarousel collection={collection} number={4} id="prod-carousel-desktop" />
      </div>
      <div className="flex md:hidden px-4">
        <ProductCarousel collection={collection} number={1} id="prod-carousel-mobile" />
      </div>
    </div>
  );
}

function ProductCarousel({collection, number, id = ''}) {
  return (
    <Carousel
      number={number}
      array={collection.products.nodes.map((product) => (
        <FeaturedProductCard key={product.id} product={product} />
      ))}
      className={`grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-${number} relative w-full`}
      leftbtn={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8"><g data-name="91-Arrow Left"><path d="M16 32a16 16 0 1 1 16-16 16 16 0 0 1-16 16zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 16 2z"/><path d="m18.29 24.71-8-8a1 1 0 0 1 0-1.41l8-8 1.41 1.41L12.41 16l7.29 7.29z"/></g></svg>
      }
      rightbtn={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8"><g data-name="92-Arrow Right"><path d="M16 32a16 16 0 1 1 16-16 16 16 0 0 1-16 16zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 16 2z"/><path d="M13.71 24.71 12.3 23.3l7.29-7.3-7.3-7.29L13.7 7.3l8 8a1 1 0 0 1 0 1.41z"/></g></svg>
      }
      id={id}
    />
  )
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
