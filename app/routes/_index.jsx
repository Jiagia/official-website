import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';
import {Image} from '@shopify/hydrogen';
import {FeaturedProductCard} from '../components/FeaturedCollection';
// import {useState} from 'react';
// import {motion, AnimatePresence} from 'framer-motion'
import splashcss from '../styles/splash.css';
import {Await, NavLink, useMatches} from '@remix-run/react';

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
  // const handle = FeaturedCollectionHandle;
  // const number = FeaturedCollectionNumber;
  const handle = 'home-page';
  const type = 'file';

  const img = await context.storefront.query(COLLECTION_QUERY, {
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
  });
}

export default function Index() {
  // hook that retrieves queries data from the loader function
  const {img} = useLoaderData();

  console.log(img);

  

  return (
    <>
      <div className="md:hidden" style={{position: "relative"}}>
        <div style={{height: "30vh", backgroundColor: "black"}}></div>
        <nav className="grid grid-cols-1 place-content-end" style={{color: "white", position: "absolute", width: "100%", top: "25vh"}}>
        
          <NavLink to="/" className="justify-self-center" style={{fontSize: "5vh"}}>JIAGIA STUDIOS</NavLink>
          <NavLink to="/about" className="justify-self-center">ABOUT</NavLink>
          <NavLink to="https://www.instagram.com/jiagia_studios/" className="justify-self-center">INSTAGRAM</NavLink>
          
        </nav>
      <Image style={{zIndex: "-10", backgroundColor: "black", height: "70vh", objectFit: "cover", objectPosition: "50% 0%"}} data={img.home.image.reference.image} />
    </div>
      <div className="hidden md:block" style={{position: "relative", height: "100vh"}}>
        
          <nav className="grid grid-cols-1 place-content-center" style={{position: "absolute", color: "white", height: "80vh", width: "40vw"}}>
          
            <NavLink to="/" className="justify-self-center" style={{fontSize: "40px"}}>JIAGIA STUDIOS</NavLink>
            <NavLink to="/about" className="justify-self-center">ABOUT</NavLink>
            <NavLink to="https://www.instagram.com/jiagia_studios/" className="justify-self-center">INSTAGRAM</NavLink>
            
          </nav>
        <Image style={{zIndex: "-10", height: "100vh", position: "absolute", backgroundColor: "black", objectFit: "contain", objectPosition: "50% 0%"}} data={img.home.image.reference.image} />
      </div>
    </>
  );
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
