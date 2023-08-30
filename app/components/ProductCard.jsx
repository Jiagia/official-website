import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  // console.log(product);

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6 text-center">
        <div className="relative">
          {isDiscounted && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )}
          <Image
            data={product.variants.nodes[0].image}
            alt={product.title}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
          {!product.availableForSale && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600">
              Sold out
            </label>
          )}
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-normal ">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4">
              {/* <Money withoutTrailingZeros data={price} /> */}
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
