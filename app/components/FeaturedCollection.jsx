import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export default function FeaturedCollection({collection}) {
  return (
    <section className="w-full gap-4 text-center">
      <h2 className="whitespace-pre-wrap font-bold text-lead">
        {collection.title}
      </h2>
      <p>
        {`"${collection.description}"`}
      </p>
      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collection.products.nodes.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function FeaturedProductCard({product}) {
  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="relative">
          <Image
            data={product.variants.nodes[0].image}
            alt={product.title}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis ">
            {product.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}