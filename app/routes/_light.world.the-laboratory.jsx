import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';
import img1 from '../../public/Lab2.png'
import img2 from '../../public/Lab3.png'
import img3 from '../../public/Lab5.png'
import img4 from '../../public/Lab6.png'

export async function loader({context}) {
  // const handle = 'the-founders';
  // const type = 'discovery';
  const handle="the-laboratory";
  const type="season"

  const season = await context.storefront.query(METAOBJECT_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  if (!season) {
    throw new Response(null, {status: 404});
  }

  return json({
    season,
  });
}

export default function Laboratory() {
  const {season} = useLoaderData();
  console.log(season.metaobject);
  var page = season.metaobject;
  return (
    <div className="container mx-auto mb-16 p-8 md:p-10 xl:p-32">
      <div className="flex flex-col space-between items-center mx-10 mb-10 gap-5 text-center">
        <h2 className="font-bold">{page.title.value}</h2>
        <p>{page.description.value}</p>
      </div>
      <div width="100%" className="flex flex-col text-xxs md:text-xs" style={{rowGap: "25px"}}>
        {/* <div className="flex w-full text-xxs md:text-xs">
          <div className="w-full flex flex-initial flex-col"> */}
        {page.rows.references.nodes.map((boxes, i) => (
          <div className="flex w-full flex-col md:flex-row" style={{rowGap: "25px", columnGap: "10px"}} key={i}>
            {boxes.boxes.references.nodes.map((box, j) => (
              <div className='border border-black'  key={j}>
                {/* <Image data={box.image.reference.image} /> */}
                <img className='border border-black' src={box.image.reference.image.url} />
                <div className=' p-4'>
                  <div><b>{box.title.value}</b></div>
                  <div><i>{box.subtitle.value}</i></div>
                  <div className="mt-4">
                    {box.description.value
                      .split('\n')
                      .map((desc, index) => (
                      <div key={index}>{desc}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
          {/* </div>
        </div> */}
      {/* </div>
      <div className='flex flex-col'>
        <div className='flex'>
          <div>
            <img src={img1} />
            <div>
              Hello <br />
            </div>
          </div>
          <div>
            <img src={img2} />
            <div>
              Hello <br />
            </div>
          </div>
        </div>
        <div className='flex'>
          <div>
            <img src={img3} />
            <div>
              Hello <br />
            </div>
          </div>
          <div>
            <img src={img4} />
            <div>
              Hello <br />
            </div>
          </div>
      </div> */}
      </div> 
    </div>
  );
}

const METAOBJECT_QUERY = `#graphql
fragment Box on Metaobject{
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
}
query SeasonPage($handle: String!, $type: String!) {

	metaobject(handle:{handle:$handle, type:$type}) {
    description:field(key:"description"){
      value
    }
    title: field(key:"title"){
      value
    }
    rows:field(key:"rows"){
      references (first: 10) {
        	nodes {
            ... on Metaobject {
              boxes:field(key:"box"){
                references (first: 3){
                  nodes {
                    ... Box
                }
              }
            }
          }
      	}
      }
    }
  }
}

`
// const METAOBJECT_QUERY = `#graphql
// query SeasonPage($handle: String!, $type: String!) {
//   metaobject(handle: {handle: $handle, type: $type}) {
//     id
//     handle
//     type
//     image: field(key: "image") {
//       type
//       reference {
//         ... on MediaImage {
//           __typename
//           alt
//           image {
//             altText
//             height
//             id
//             url
//             width
//           }
//         }
//       }
//     }
//     title: field(key: "title") {
//       type
//       value
//     }
//     subtitle: field(key: "subtitle") {
//       type
//       value
//     }
//     description: field(key: "description") {
//       type
//       value
//     }
//   }
// }
// `;
