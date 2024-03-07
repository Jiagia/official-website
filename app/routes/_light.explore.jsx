import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';
import {Image} from '@shopify/hydrogen';
import {FeaturedProductCard} from '../components/FeaturedCollection';
import {ImageCard} from '~/components/ImageCard';
// import {useState} from 'react';
// import {motion, AnimatePresence} from 'framer-motion'
// import splashcss from '../styles/splash.css';
import {Await, NavLink, useMatches} from '@remix-run/react';
import arrowRight from '../../public/arrow-right-black.svg'
import arrowLeft from '../../public/arrow-left-black.svg'


export async function loader({context}) {
  let handle = 'exploration-highlights';
  let type = 'carousel';
  const discovery = await context.storefront.query(UPDATE_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  handle = 'active-exploration-sites';
  type = 'carousel';
  const collection = await context.storefront.query(UPDATE_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  console.log(discovery);
  console.log(collection);

  if (!discovery.metaobject) throw new Response(null, {status: 404});
  if (!collection.metaobject) throw new Response(null, {status: 404});

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    discovery,
    collection,
  });
}

export default function Explore() {
  // hook that retrieves queries data from the loader function
  const {discovery, collection} = useLoaderData();

  // console.log(img);
  // console.log(latestUpdate.metaobject.items);

  return (
    <>
      <div className='text-center justify-center bg-white text-black mt-8'>
        <h1 className='text-6xl my-12'> &gt; Explore &lt; </h1>
        <h2 className="md:text-4xl">{discovery.metaobject.title.value}</h2>
        <p className="">{discovery.metaobject.subtitle.value}</p>
        <div className="hidden md:flex p-4 md:p-6 lg:p-8">
          <UpdateCarousel cards={discovery.metaobject.items} number={3} id="prod-carousel-desktop" />
        </div>
        <div className="flex gap-4 md:hidden p-4">
          <UpdateCarousel cards={discovery.metaobject.items} number={1} id="prod-carousel-mobile" />
        </div>

        <div className='m-12 mx-auto w-4/5 border border-black'></div>

        <h2 className="md:text-4xl">{collection.metaobject.title.value}</h2>
        <p className="">{collection.metaobject.subtitle.value}</p>
        <div className="hidden md:flex md:gap-x-2 justify-center p-4 md:p-6 lg:p-8">
          {/* <UpdateCarousel cards={collection.metaobject.items} number={2} id="prod-carousel-desktop" /> */}
          {collection.metaobject.items.references.nodes.map((card, id) => (
            <ImageCard key={id} card={card} />
          ))}
        </div>
        <div className="flex gap-4 md:hidden p-4">
          <UpdateCarousel cards={collection.metaobject.items} number={1} id="prod-carousel-mobile" />
        </div>
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
    subtitle: field(key:"subtitle"){
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
