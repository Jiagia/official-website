import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';

export async function loader({context}) {
  const handle = 'daydream-universe';
  const type = 'season';

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

export default function DaydreamUniverse() {
  const {season} = useLoaderData();
  console.log(season.metaobject);
  const discoveries = season.metaobject.discoveries.references.nodes;
  console.log(discoveries);
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-between items-center m-10 gap-5 text-center">
        <h2 className="font-bold">DAYDREAM UNIVERSE</h2>
        <p>A PLACE WHERE UNIQUE WORLDS AND CREATURES CO-EXIST</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-y-8 gap-x-4">
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[0].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[0].title.value}</b>
            </p>
            <p>
              <i>{discoveries[0].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[0].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[1].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[1].title.value}</b>
            </p>
            <p>
              <i>{discoveries[1].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[1].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[2].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[2].title.value}</b>
            </p>
            <p>
              <i>{discoveries[2].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[2].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[3].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[3].title.value}</b>
            </p>
            <p>
              <i>{discoveries[3].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[3].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[4].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[4].title.value}</b>
            </p>
            <p>
              <i>{discoveries[4].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[4].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[5].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[5].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[5].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[6].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[6].title.value}</b>
            </p>
            <p>
              <i>{discoveries[6].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[6].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[7].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[7].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[7].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[8].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[8].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[8].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-6">
          <Image
            data={discoveries[9].images.references.nodes[0].image}
            className="border border-black lg:col-span-4"
          />
          <div className="lg:col-span-2 border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[9].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[9].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-6">
          <Image
            data={discoveries[10].images.references.nodes[0].image}
            className="border border-black lg:col-span-4"
          />
          <div className="lg:col-span-2 border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[10].title.value}</b>
            </p>
            <p>
              <i>{discoveries[10].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[10].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[11].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[11].title.value}</b>
            </p>
            <p>
              <i>{discoveries[11].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[11].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[12].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[12].title.value}</b>
            </p>
            <p>
              <i>{discoveries[12].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[12].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[13].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[13].title.value}</b>
            </p>
            <p>
              <i>{discoveries[13].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[13].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[14].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[14].title.value}</b>
            </p>
            <p>
              <i>{discoveries[14].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[14].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[15].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[15].title.value}</b>
            </p>
            <p>
              <i>{discoveries[15].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[15].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[16].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[16].title.value}</b>
            </p>
            <p>
              <i>{discoveries[16].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[16].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[17].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[17].title.value}</b>
            </p>
            <p>
              <i>{discoveries[17].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[17].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[18].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[18].title.value}</b>
            </p>
            <p>
              <i>{discoveries[18].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[18].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[19].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[19].title.value}</b>
            </p>
            <p>
              <i>{discoveries[19].subtitle.value}</i>
            </p>
            <div className="mt-4">
              {discoveries[19].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[20].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[20].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[20].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-initial flex-col">
          <div className="border border-black flex flex-1 flex-col flex-wrap">
            <Image data={discoveries[21].images.references.nodes[0].image} />
          </div>
          <div className="border border-black flex flex-1 flex-col flex-wrap p-4 text-left">
            <p>
              <b>{discoveries[21].title.value}</b>
            </p>
            <div className="mt-4">
              {discoveries[21].description.value
                .split('\n')
                .map((desc, index) => {
                  return <p key={index}>{desc}</p>;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const METAOBJECT_QUERY = `#graphql
query SeasonPage($handle: String!, $type: String!) {
  metaobject(handle: {handle: $handle, type: $type}) {
    id
    handle
    type
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
    discoveries: field(key: "discoveries") {
      type
      value
      references(first: 22) {
        nodes {
          ... on Metaobject {
            __typename
            handle
            type
            images: field(key: "images") {
              type
              value
              references(first: 2) {
                nodes {
                  ... on MediaImage {
                    __typename
                    image {
                      altText
                      width
                      height
                      url
                    }
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
            rich: field(key: "rich") {
              type
              value
            }
          }
        }
      }
    }
  }
}
`;
