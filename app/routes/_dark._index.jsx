import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';
import {Image} from '@shopify/hydrogen';
import {FeaturedProductCard} from '../components/FeaturedCollection';
import { ImageCard } from '~/components/ImageCard';
// import {useState} from 'react';
// import {motion, AnimatePresence} from 'framer-motion'
import splashcss from '../styles/splash.css';
import {Await, NavLink, useMatches} from '@remix-run/react';
import arrowRight from '../../public/arrow-right.svg'
import arrowLeft from '../../public/arrow-left.svg'

// GLOBAL VARIABLES
// Featured Collection
const FeaturedCollectionHandle = 'season-4';
const FeaturedCollectionNumber = 5;

export const links = () => [{rel: 'stylesheet', href: splashcss}];

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
  // const handle = FeaturedCollectionHandle;
  // const number = FeaturedCollectionNumber;
  var handle = 'home-page';
  var type = 'file';

  const img = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  handle = "latest-dreamscape-update"
  type =  "carousel"
  const latestUpdate = await context.storefront.query(UPDATE_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  // Handle 404s
  if (!img) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    img,
    latestUpdate
  });
}

export default function Index() {
  // hook that retrieves queries data from the loader function
  const {img, latestUpdate} = useLoaderData();

  // console.log(img);
  // console.log(latestUpdate.metaobject.items);

  return (
    <>
      <div className="md:hidden" style={{position: 'relative'}}>
        <div style={{height: '30vh', backgroundColor: 'black'}}></div>
        <Image
          style={{
            zIndex: '-10',
            backgroundColor: 'black',
            height: '70vh',
            objectFit: 'cover',
            objectPosition: '50% 0%',
          }}
          data={img.home.image.reference.image}
        />
      </div>
      <div
        className="hidden md:block"
        style={{position: 'relative', height: '100vh', }}
      >
        <Image
          style={{
            zIndex: '0',
            height: '100vh',
            position: 'absolute',
            backgroundColor: 'black',
            objectFit: 'contain',
            objectPosition: '50% 0%',
          }}
          data={img.home.image.reference.image}
        />
      </div>
      <div className="hidden md:flex px-4 md:px-6 lg:px-8">
        <UpdateCarousel cards={latestUpdate.metaobject.items} number={3} id="prod-carousel-desktop" />
      </div>
      <div className="flex md:hidden px-4">
        <UpdateCarousel cards={latestUpdate.metaobject.items} number={1} id="prod-carousel-mobile" />
      </div>
    </>
  );
}

function UpdateCarousel({cards, number, id = ''}) {
  // console.log(cards);
  return (
    <Carousel
      number={number}
      array={cards.references.nodes.map((card, id) => (
        <ImageCard key={id} card={card} />
      ))}
      className={`flex w-full flex-col md:flex-row gap-2`}
      // leftbtn={
      //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8"><g data-name="91-Arrow Left"><path d="M16 32a16 16 0 1 1 16-16 16 16 0 0 1-16 16zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 16 2z"/><path d="m18.29 24.71-8-8a1 1 0 0 1 0-1.41l8-8 1.41 1.41L12.41 16l7.29 7.29z"/></g></svg>
      // }
      // rightbtn={
      //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8"><g data-name="92-Arrow Right"><path d="M16 32a16 16 0 1 1 16-16 16 16 0 0 1-16 16zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 16 2z"/><path d="M13.71 24.71 12.3 23.3l7.29-7.3-7.3-7.29L13.7 7.3l8 8a1 1 0 0 1 0 1.41z"/></g></svg>
      // }
      leftbtn={<img className="px-4" src={arrowLeft} />}
      rightbtn = {<img className="px-4" src={arrowRight} />}
      id={id}
    />
  )
}

const COLLECTION_QUERY = `#graphql
  query HomePage($handle: String!, $type: String!) {
    home: metaobject(handle: {handle: $handle, type: $type} ) {
      id,
      handle,
      type,
      image: field(key:"image") {
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
    }
  }
`;

const UPDATE_QUERY = `#graphql
fragment Card on Metaobject{
  image: field(key: "image") {
      reference {
        ... on MediaImage {
          alt
          image {
            altText
            height
            id
            url
            width
          }
        }
      }
    }
    title: field(key: "title") {
      value
    }
    subtitle: field(key: "subtitle") {
      value
    }
    description: field(key: "description") {
      value
    }
    link: field(key: "link") {
      value
    }
}
query Carousel($handle: String!, $type: String!) {

	metaobject(handle:{handle:$handle, type:$type}) {
    title: field(key:"title"){
      value
    }
    items:field(key:"items"){
      references (first: 10) {
        	nodes {
            ... Card
          
      	}
      }
    }
  }
}
`
;
