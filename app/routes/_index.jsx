import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';
import {Image} from '@shopify/hydrogen';
import {FeaturedProductCard} from '../components/FeaturedCollection';
import { ImageCard } from '~/components/ImageCard';
// import {useState} from 'react';
// import {motion, AnimatePresence} from 'framer-motion'
// import splashcss from '../styles/splash.css';
import {Await, NavLink, useMatches} from '@remix-run/react';
import arrowRight from '../../public/arrow-right.svg'
import arrowLeft from '../../public/arrow-left.svg'

// GLOBAL VARIABLES
// Featured Collection
const FeaturedCollectionHandle = 'season-4';
const FeaturedCollectionNumber = 5;

// export const links = () => [{rel: 'stylesheet', href: splashcss}];

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

  handle = 'latest-laboratory-update';
  type = 'carousel';
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
    latestUpdate,
  });
}

export default function Index() {
  // hook that retrieves queries data from the loader function
  const {img, latestUpdate} = useLoaderData();

  // console.log(img);
  // console.log(latestUpdate.metaobject.items);

  return (
    <>
      <div style={{height: "150px"}}></div>
      <div className=' text-center justify-center'>
        <Link to="/about" className='border hover:border-2 w-fit place-content-center justify-center p-2 text-sm font-bold hover:font-black'>
            &gt; ABOUT US &lt;
        </Link>
        <div className='m-4 mt-12 flex flex-col gap-4'>
          <p>
          WE ARE A CREATIVE LAB <b>EXPLORING</b> WORLDS WITHIN THE <i><b>“DAYDREAM UNIVERSE”</b></i> 
          </p>
          <p>
          OUR MISSION IS TO <b>INVESTIGATE, DOCUMENT,</b> AND <b>SHOWCASE</b> OUR FINDINGS AND STORIES 
          </p>
          <p>
          REPORTS OF OUR RESEARCH & EXPEDITIONS ARE PUBLISHED THROUGH VARIOUS CHANNELS
          </p>
        </div>
        <div>
        <Image
          style={{
            width: "100%"
          }}
          className="mb-8"
          data={img.home.image.reference.image}
        />
        </div>
        {/* <div className="hidden md:flex p-4 md:p-6 lg:p-8">
          
          <UpdateCarousel cards={latestUpdate.metaobject.items} number={3} id="prod-carousel-desktop" />
        </div> */}
        {/* <div className="flex md:hidden p-4">
          <UpdateCarousel cards={latestUpdate.metaobject.items} number={1} id="prod-carousel-mobile" />
        </div>
        <Link to="/explore" className='border hover:border-2 w-fit place-content-center justify-center p-2 text-sm font-bold hover:font-black'>
            &gt; EXPLORE MORE &lt;
        </Link> */}
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
      className={`flex w-full justify-center flex-col md:flex-row gap-2`}
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
