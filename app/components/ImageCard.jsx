import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';

export function ImageCard({card}) {
 return (
  <Link to={card.link.value} className="block md:w-1/4 w-full">
    <div className="flex flex-col text-center">
      <Image
        data={card.image.reference.image}
        alt={card.image.reference.alt}
      />
      <div className="flex flex-col gap-0.5 text-wrap border border-black bg-white text-black p-4">
        <h4><b>{card.title.value}</b></h4>
        <p className="text-sm">{card.subtitle.value}</p>
      </div>
    </div>
  </Link>
 )
}