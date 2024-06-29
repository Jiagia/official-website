import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {RotatingImage} from '~/components/Image';

export default function ProductCard({product, rotate = false, rotateInt = 2}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  // console.log(product);

  console.log(rotate ? 'rotating' : 'image');
  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid text-center border border-black">
        <div className="relative border-b border-black">
          {isDiscounted && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )}
          {rotate ? (
            <RotatingImage
              // length={product.media.nodes.length}
              length={rotateInt}
              media={product.media.nodes}
              style={{width: 100}}
            />
          ) : (
            <Image data={product.media.nodes[0].image} />
          )}
          {!product.availableForSale && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600">
              Sold out
            </label>
          )}
        </div>
        <div className="grid">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-normal text-lg ">
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
