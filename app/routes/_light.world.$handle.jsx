import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {useState} from 'react';

export async function loader({params, context}) {
  // const handle = 'the-founders';
  // const type = 'discovery';
  // const handle="the-laboratory";
  const {handle} = params;
  const type="season"

  const season = await context.storefront.query(METAOBJECT_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  if (!season || !season.metaobject) {
    throw new Response(null, {status: 404});
  }

  return json({
    season,
  });
}

// Render page
export default function Laboratory() {
  const {season} = useLoaderData();
  // console.log(season.metaobject);
  var page = season.metaobject;

  return (
    <div className="container mx-auto mb-16 p-8 md:p-10 xl:p-32">
      <div className="flex flex-col space-between items-center mx-10 mb-10 gap-5 text-center">
        <h2 className="font-bold">{page.title.value}</h2>
        <p>{page.description.value}</p>
      </div>
      <div width="100%" className="flex flex-col text-xxs md:text-xs" style={{rowGap: "25px"}}>
        {page.rows.references.nodes.map((boxes, i) => (
          <div className="flex w-full flex-col md:flex-row" style={{rowGap: "25px", columnGap: "10px"}} key={i}>
            {boxes.boxes.references.nodes.map((box, j) => (
              <TextBox box={box} key={j} />
            ))}
          </div>
        ))}
      </div> 
    </div>
  );
}

// Render the text boxes for each block
// contains the show/hide buttons
function TextBox({box}) {
  
  const [dropshow, setDropshow] = useState("hidden");
  const showBodyText = () => {
    dropshow == "hidden" ? setDropshow("") : setDropshow("hidden")
  } 

  return (
    <div className='border border-black' id={box.id_tag.value}>
      <img className='border border-black' src={box.image.reference.image.url} />
      <div className=' p-4'>
        <div>
          <b>{box.title.value}</b>
          <button onClick={showBodyText}>+</button>
        </div>
        <div>
          <i>{box.subtitle.value}</i> 
        </div>
        <div className={`mt-4 ${dropshow}`}>
          {box.description.value
            .split('\n')
            .map((desc, index) => (
            <div key={index}>{desc}</div>
          ))}
        </div>
      </div>
    </div>
  )
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
    id_tag: field(key: "id_tag") {
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
