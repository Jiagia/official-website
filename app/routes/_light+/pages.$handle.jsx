import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';


export async function loader({params, context}) {
  const {handle} = params;

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle,
    },
  });

  // Handle 404s
  if (!page) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    page,
  });
}

export function meta({data, matches}){
  return [
      {title: (data?.page?.title ?? 'Page') + ' - JIAGIA'},
      {description: "Jiagia Studio's " + (data?.page?.title ?? 'Page')},
      {
          property: "og:description",
          content: matches[0].data.header.shop.description
      },
  ];
};

export default function Page() {
    const {page} = useLoaderData();

    return (
      <div className='p-4 md:p-8'>
        <div dangerouslySetInnerHTML={{__html: page.body}}></div>
      </div>
    )
    
}


const PAGE_QUERY = `#graphql
    query PageDetails($handle: String!) {
        page(handle: $handle) {
            id
            title
            handle
            body
            bodySummary
        }
    }
`;
