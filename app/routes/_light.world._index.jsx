import {Image} from '@shopify/hydrogen-react';
import {Link, useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

export async function loader({context}) {
  const handle = 'the-laboratory';
  const type = 'season';

  const world = await context.storefront.query(METAOBJECT_QUERY, {
    variables: {
      handle,
      type,
    },
  });

  if (!world) {
    throw new Response(null, {status: 404});
  }

  return json({
    world,
  });
}

export default function World() {
  const {world} = useLoaderData();
  console.log(world.metaobject);
  return (
    <div className="container mx-auto mb-16 p-4">
      <div className="flex flex-col space-between items-center m-10 text-center">
        <h2 className="font-bold">LOCATIONS</h2>
        <p>LEARN ABOUT OUR VARIOUS PROJECTS AND EXPLORATIONS</p>
      </div>
      <div className="flex justify-center gap-4 mx-auto">
        <Link to="/world/the-laboratory" className="block md:w-1/3 sm:w-full">
          <div className="flex flex-col text-center">
            <Image
              data={world.metaobject.banner.reference.image}
              alt="The Laboratory"
            />
            <div className="border border-black flex flex-1 flex-col flex-wrap p-4 gap-2">
              <h3>
                <b>{world.metaobject.title.value}</b>
              </h3>
              <p>{world.metaobject.description.value}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

const METAOBJECT_QUERY = `#graphql
query WorldPage($handle: String!, $type: String!) {
  metaobject(handle: {handle: $handle, type: $type}) {
    id
    handle
    type
    banner: field(key: "banner") {
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
