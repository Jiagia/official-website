

import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../components/ProductGrid';


export async function loader({context}) {
  const handle = "commissions-printing";

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

    // console.log(page);

    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: page.body}}></div>
            <ContactForm />
        </div>
    );
}

function ContactForm() {
    return (
        <div className="contact-form">
          <form method="post"  >

          </form>
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
