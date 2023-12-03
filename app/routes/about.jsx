import {useLoaderData, NavLink} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';

export function meta({matches}) {
    // console.log(matches[0]?.data?.header?.shop);
    return [
      {title: 'Jiagia Studios - About'},
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

export async function loader({context}) {
    // const handle = FeaturedCollectionHandle;
    // const number = FeaturedCollectionNumber;
    const handle = 'AboutUs';
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
  
export default function About() {
    // hook that retrieves queries data from the loader function
    const {img} = useLoaderData();

    console.log(img);

    return (
        <>
        <div className="pt-10" style={{position: "relative", height: "100vh", width: "100%", backgroundColor: "black", color: "white"}}>
            <NavLink to="/">
            <svg className="mx-10" xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 139 74" fill="none">
                <path id="Arrow 21" d="M1.46447 33.4645C-0.488155 35.4171 -0.488155 38.5829 1.46447 40.5355L33.2843 72.3553C35.2369 74.308 38.4027 74.308 40.3553 72.3553C42.308 70.4027 42.308 67.2369 40.3553 65.2843L12.0711 37L40.3553 8.71573C42.308 6.76311 42.308 3.59728 40.3553 1.64466C38.4027 -0.307961 35.2369 -0.307961 33.2843 1.64466L1.46447 33.4645ZM5 42H139V32H5V42Z" fill="white"/>
            </svg>
            </NavLink>
            <div className="grid grid-cols-1 place-content-center text-center">
                <div className='justify-self-center'>
                    JIAGIA STUDIOS
                </div>
                <div className='justify-self-center'>
                    ABOUT
                </div>
                <div className='justify-self-center'>
                WE ARE A CREATIVE LAB EXPLORING WORLDS WITHIN THE “DAYDREAM UNIVERSE” 
                </div>
                <div className='justify-self-center'>
                OUR MISSION IS TO INVESTIGATE, DOCUMENT, AND SHOWCASE OUR FINDINGS AND STORIES 
                </div>
                <div className='justify-self-center'>
                REPORTS OF OUR RESEARCH & EXPEDITIONS ARE PUBLISHED THROUGH VARIOUS CHANNELS
                </div>
                <div className='justify-self-center'>
                More Info 12/13/23
                </div>
                <NavLink to="https://www.instagram.com/jiagia_studios/" className="justify-self-center">
                <div className="w-7 h-7" style={{display: "inline-block"}}>
                <svg aria-hidden="true" focusable="false" className="icon icon-instagram" viewBox="0 0 18 18" >
                    <path fill="currentColor" d="M8.77 1.58c2.34 0 2.62.01 3.54.05.86.04 1.32.18 1.63.3.41.17.7.35 1.01.66.3.3.5.6.65 1 .12.32.27.78.3 1.64.05.92.06 1.2.06 3.54s-.01 2.62-.05 3.54a4.79 4.79 0 01-.3 1.63c-.17.41-.35.7-.66 1.01-.3.3-.6.5-1.01.66-.31.12-.77.26-1.63.3-.92.04-1.2.05-3.54.05s-2.62 0-3.55-.05a4.79 4.79 0 01-1.62-.3c-.42-.16-.7-.35-1.01-.66-.31-.3-.5-.6-.66-1a4.87 4.87 0 01-.3-1.64c-.04-.92-.05-1.2-.05-3.54s0-2.62.05-3.54c.04-.86.18-1.32.3-1.63.16-.41.35-.7.66-1.01.3-.3.6-.5 1-.65.32-.12.78-.27 1.63-.3.93-.05 1.2-.06 3.55-.06zm0-1.58C6.39 0 6.09.01 5.15.05c-.93.04-1.57.2-2.13.4-.57.23-1.06.54-1.55 1.02C1 1.96.7 2.45.46 3.02c-.22.56-.37 1.2-.4 2.13C0 6.1 0 6.4 0 8.77s.01 2.68.05 3.61c.04.94.2 1.57.4 2.13.23.58.54 1.07 1.02 1.56.49.48.98.78 1.55 1.01.56.22 1.2.37 2.13.4.94.05 1.24.06 3.62.06 2.39 0 2.68-.01 3.62-.05.93-.04 1.57-.2 2.13-.41a4.27 4.27 0 001.55-1.01c.49-.49.79-.98 1.01-1.56.22-.55.37-1.19.41-2.13.04-.93.05-1.23.05-3.61 0-2.39 0-2.68-.05-3.62a6.47 6.47 0 00-.4-2.13 4.27 4.27 0 00-1.02-1.55A4.35 4.35 0 0014.52.46a6.43 6.43 0 00-2.13-.41A69 69 0 008.77 0z"></path>
                    <path fill="currentColor" d="M8.8 4a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.43a2.92 2.92 0 110-5.85 2.92 2.92 0 010 5.85zM13.43 5a1.05 1.05 0 100-2.1 1.05 1.05 0 000 2.1z"></path>
                </svg>
                </div>
                </NavLink>
            </div>
            <Image style={{backgroundColor: "black", width: "100%", objectFit: "contain", objectPosition: "50% 100%"}} data={img.home.image.reference.image} />
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
