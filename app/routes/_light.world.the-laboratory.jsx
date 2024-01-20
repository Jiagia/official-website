import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';

export async function loader({context}) {
  const handle = 'the-founders';
  const type = 'discovery';

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
  return (
    <div className="container mx-auto mb-16 p-4">
      <div className="flex flex-col space-between items-center m-10 gap-5 text-center">
        <h2 className="font-bold">{season.metaobject.title.value}</h2>
        <p>{season.metaobject.description.value}</p>
      </div>
      <div className="flex text-xxs">
        <div className="w-full flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={season.metaobject.image.reference.image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b style={{fontSize: '10px'}}>{season.metaobject.title.value}</b>
            </p>
            <p>
              <i style={{fontSize: '10px'}}>
                {season.metaobject.subtitle.value}
              </i>
            </p>
            <div className="mt-4">
              {season.metaobject.description.value
                .split('\n')
                .map((desc, index) => {
                  return (
                    <p style={{fontSize: '10px'}} key={index}>
                      {desc}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div
        className="border border-black"
        style={{height: '100px', width: '10px'}}
      ></div>
      <div
        className="border border-black"
        style={{height: '25px', width: '200px'}}
      ></div>
    </div>
  );
}

const METAOBJECT_QUERY = `#graphql
query SeasonPage($handle: String!, $type: String!) {
  metaobject(handle: {handle: $handle, type: $type}) {
    id
    handle
    type
    image: field(key: "image") {
      type
      reference {
        ... on MediaImage {
          __typename
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
      type
      value
    }
    subtitle: field(key: "subtitle") {
      type
      value
    }
    description: field(key: "description") {
      type
      value
    }
  }
}
`;
