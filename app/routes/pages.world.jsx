import {Image} from '@shopify/hydrogen';

export default function World() {
  const imgData = {
    altText: 'Temp png',
    url: 'https://cdn.shopify.com/s/files/1/0753/7868/8295/files/template.png?v=1702157407',
    height: 'auto',
    width: '30vw',
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-between items-center m-10 gap-5 text-center">
        <h2 className="font-bold">LOCATIONS</h2>
        <p>LEARN ABOUT OUR VARIOUS PROJECTS AND EXPLORATIONS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex-auto flex-col card-min text-center">
          <Image data={imgData} alt="The Laboratory" />
          <div className="border border-black flex-auto flex-col flex-wrap p-2 gap-2">
            <h3>
              <b>THE LABORATORY</b>
            </h3>
            <p>EXPLORATION LAUNCHPAD & CREATIVE STUDIO</p>
          </div>
        </div>
        <div className="flex-auto flex-col card-min text-center">
          <Image data={imgData} alt="The Laboratory" />
          <div className="border border-black flex-auto flex-col flex-wrap p-2 gap-2">
            <h3>
              <b>DAYDREAM UNIVERSE</b>
            </h3>
            <p>BECOMING FAMILIAR IN AN UNFAMILIAR WORLD</p>
          </div>
        </div>
        <div className="flex-auto flex-col card-min text-center">
          <Image data={imgData} alt="The Laboratory" />
          <div className="border border-black flex-auto flex-col flex-wrap p-2 gap-2">
            <h3>
              <b>ILLUSIVE FLORA</b>
            </h3>
            <p>AN EXPANSE OF ABSTRACT FLOWERS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
