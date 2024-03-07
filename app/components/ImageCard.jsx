import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';

export function ImageCard({card}) {
 return (
  <Link to={card.link.value} className="block md:w-1/3 w-full">
    <div className="flex flex-col text-center">
      <Image
        data={card.image.reference.image}
        alt={card.image.reference.alt}
      />
      <div className="flex flex-col text-wrap border border-black bg-white text-black p-4">
        <h3><b>{card.title.value}</b></h3>
        <h3>{card.subtitle.value}</h3>
      </div>
    </div>
  </Link>
 )
}