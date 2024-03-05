import {Image} from '@shopify/hydrogen';

export function meta({matches}) {
  return [
    {title: 'Jiagia Studios - Shop'},
    {
      property: 'og:title',
      content: 'JIAGIA',
    },
    {
      name: 'description',
      content: matches[0]?.data?.header?.shop?.description ?? 'Jiagia Studios',
    },
  ];
}

export default function Shop() {
  const imgData = {
    altText: 'Temp png',
    url: 'https://cdn.shopify.com/s/files/1/0753/7868/8295/files/template.png?v=1702157407',
    width: '100%',
    height: 'auto',
  };
  return (
    <div className="container mx-auto p-4">
      <div className="text-center m-10">
        <h2>DREAMSCAPE REPORT: ILLUSIVE FLORA</h2>
        <p className="italic">FIRST DISCOVERED ____</p>
        <p className="pt-4">
          TAGLINE: WORLD FULL OF PLANTS AND CUBISM. DON'T FRET AS THESE
          CREATURES MOVE
        </p>
      </div>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-6 justify-items-center gap-x-4">
        <div className="md:col-start-2 md:col-span-2 flex flex-col border border-black">
          <Image data={imgData} alt="Custom Hoodie" />
          <div className="flex flex-col gap-y-4 border-t border-black">
            <p>CUSTOM HOODIE</p>
            <p>S M L</p>
          </div>
        </div>
        <div className="md:col-start-4 md:col-span-2 flex flex-col border border-black">
          <Image data={imgData} alt="Custom Hoodie" />
          <div className="flex flex-col gap-y-4 border-t border-black">
            <p>CUSTOM HOODIE</p>
            <p>SMALL & LARGE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
