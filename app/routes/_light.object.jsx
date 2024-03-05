import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {useState} from 'react';

export async function loader({params, context, request}) {
  // const handle = 'the-founders';
  // const type = 'discovery';
  // const handle="the-laboratory";
  // const url = new URL(request.url)
  // const pageTerm = url.searchParams.get('page')
  // if (!searchTerm) {
  //   return {
  //     searchResults: {results: null, totalResults: 0},
  //     searchTerm,
  //   };
  // }


  // const {handle} = params;
  // const type="season"

  const handle = "objects"
  const type = "objects"

  const objects = await context.storefront.query(METAOBJECT_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  

  if (!objects || !objects.metaobject) {
    throw new Response(null, {status: 404});
  }

  return json({
    objects,
    // pageTerm
  });
}

// Render page
export default function Object() {
  // const {season, pageTerm} = useLoaderData();
  const {objects} = useLoaderData();
  // console.log(season.metaobject);
  // var page = season.metaobject;
  // console.log(pageTerm);
  // const [pageNo, setPageNo] = useState(pageTerm ? parseInt(pageTerm) - 1: 0);
  
  // const pages = season.metaobject.pages.references.nodes
  // var page = pages[pageNo]
  // console.log(page)
  // console.log(objects)
  const page = objects.metaobject
  return (
    <div className="container mx-auto mb-16 p-8 md:p-10 xl:p-32">
      <div className="flex flex-col space-between items-center mx-10 mb-10 gap-5 text-center">
        <div>
        <h2 className="font-bold">{objects.metaobject.title.value}</h2>
        <h2 className="">{objects.metaobject.subtitle.value}</h2>
        </div>
        <p>{objects.metaobject.description.value}</p>
        {/* page buttons */}
        {/* <div>
          {pages.map((page, index) => (
            <button onClick={() => {setPageNo(index)}} key={index} className='border border-black m-2 p-2'>
              Page {page.number.value} - {page.title.value}
            </button>
          ))}
        </div> */}
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
    subtitle: field(key:"subtitle"){
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
    pages:field(key:"pages"){
      references (first: 10) {
        	nodes {
            ... on Metaobject {
              title:field(key:"title"){value}
              number:field(key:"number"){value}
             rows:field(key:"row"){
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
      }
    }
  }
}
`

// const METAOBJECT_QUERY = `#graphql
// fragment Box on Metaobject{
//   image: field(key: "image") {
//       reference {
//         ... on MediaImage {
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
//       value
//     }
//     subtitle: field(key: "subtitle") {
//       value
//     }
//     description: field(key: "description") {
//       value
//     }
//     id_tag: field(key: "id_tag") {
//       value
//     }
// }
// query SeasonPage($handle: String!, $type: String!) {

// 	metaobject(handle:{handle:$handle, type:$type}) {
//     description:field(key:"description"){
//       value
//     }
//     title: field(key:"title"){
//       value
//     }
//     rows:field(key:"rows"){
//       references (first: 10) {
//         	nodes {
//             ... on Metaobject {
//               boxes:field(key:"box"){
//                 references (first: 3){
//                   nodes {
//                     ... Box
//                 }
//               }
//             }
//           }
//       	}
//       }
//     }
//   }
// }

// `
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
