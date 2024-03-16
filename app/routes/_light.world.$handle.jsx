import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {useState} from 'react';

export async function loader({params, context, request}) {
  // const handle = 'the-founders';
  // const type = 'discovery';
  // const handle="the-laboratory";
  const url = new URL(request.url)
  const pageTerm = url.searchParams.get('page');
  console.log(pageTerm);
  // if (!searchTerm) {
  //   return {
  //     searchResults: {results: null, totalResults: 0},
  //     searchTerm,
  //   };
  // }


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
    pageTerm
  });
}

// Render page
export default function WorldPage() {
  const {season, pageTerm} = useLoaderData();

  // console.log(season.metaobject);
  // var page = season.metaobject;
  // console.log(pageTerm);
  const [pageNo, setPageNo] = useState(pageTerm ? parseInt(pageTerm) - 1: 0);
  // console.log(pageNo);
  
  const pages = season.metaobject.pages.references.nodes;
  // console.log(pages);
  var page = pages[pageNo];
  console.log(page);
  return (
    <div className="container mx-auto mb-16 p-8 md:p-10 xl:p-32">
      <div className="flex flex-col space-between items-center mx-10 mb-10 gap-5 text-center">
        <h2 className="font-bold">{season.metaobject.title.value}</h2>
        <p>{season.metaobject.description.value}</p>
        <div>
          {pages.map((page, index) => (
            <button onClick={() => {setPageNo(index)}} key={index} className={`border border-black m-2 p-2 ${((page.number.value - 1) == pageNo) ? "bg-orange-100" : ""}`}>
              Page {page.number.value} - {page.title.value}
            </button>
          ))}
        </div>
      </div>
      
      <div width="100%" className="flex flex-col text-xxs md:text-xs" style={{rowGap: "25px"}}>
        {page.rows.references.nodes.map((boxes, i) => (
          // <div className="flex w-full flex-col md:flex-row" style={{rowGap: "25px", columnGap: "10px"}} key={i}>
          <div className="grid grid-cols-1 md:grid-cols-6 w-full" style={{rowGap: "25px", columnGap: "10px"}} key={i}>
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
    setDropshow((prevDropshow) => (prevDropshow === "hidden" ? "" : "hidden"));
  };
  console.log(box);
  
  let colspan;
  if (!box.col_span) colspan = "col-span-1"
  else {
    switch (box.col_span.value) {
      case "1":
        colspan = "col-span-1";
        break;
      case "2":
        colspan = "col-span-2";
        break;
      case "3":
        colspan = "col-span-3";
        break;
      case "4":
        colspan = "col-span-4";
        break;
      case "5":
        colspan = "col-span-5";
        break;
      case "6":
        colspan = "col-span-6";
        break;
      default:
        colspan = "col-span-1";
    }
  }

  return (
    <div className={`border border-black ${colspan}`} id={box.id_tag.value}>
      <img src={box.image.reference.image.url} />
      <div className='flex flex-row p-4 justify-between'>
        <div className='flex-initial text-wrap '>
          <div>
            <b>{box.title.value}</b>
          </div>
          <div>
            <i>{box.subtitle.value}</i> 
          </div>
          <div className={`text-wrap mt-4 ${dropshow}`}>
            {box.description.value
              .split('\n')
              .map((desc, index) => (
              <div key={index}>{desc}</div>
            ))}
          </div>
        </div>
        <div className="w-16 text-right">
          <button onClick={showBodyText}>
            {dropshow=="hidden" ? (<b>EXPAND [+]</b>) : (<b>HIDE [-]</b>)}
          </button>
        </div>
      </div>
    </div>
  );
}

const METAOBJECT_QUERY = `#graphql
fragment Box on Metaobject {
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
  col_span: field(key: "col_span") {
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
