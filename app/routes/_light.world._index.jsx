import {Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';

export default function World() {
  const imgData = {
    altText: 'Temp png',
    url: 'https://cdn.shopify.com/s/files/1/0753/7868/8295/files/template.png?v=1702157407',
    width: '30%',
    height: 'auto',
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-between items-center m-10 gap-5 text-center">
        <h2 className="font-bold">LOCATIONS</h2>
        <p>LEARN ABOUT OUR VARIOUS PROJECTS AND EXPLORATIONS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/world/the-laboratory">
          <div className="flex flex-initial flex-col text-center">
            <Image data={imgData} alt="The Laboratory" />
            <div className="border border-black flex flex-1 flex-col flex-wrap p-4 gap-2">
              <h3>
                <b>THE LABORATORY</b>
              </h3>
              <p>EXPLORATION LAUNCHPAD & CREATIVE STUDIO</p>
            </div>
          </div>
        </Link>
        <Link to="/world/daydream-universe">
          <div className="flex flex-initial flex-col text-center">
            <Image data={imgData} alt="The Laboratory" />
            <div className="border border-black flex flex-1 flex-col flex-wrap p-4 gap-2">
              <h3>
                <b>DAYDREAM UNIVERSE</b>
              </h3>
              <p>BECOMING FAMILIAR IN AN UNFAMILIAR WORLD</p>
            </div>
          </div>
        </Link>
        <Link to="/world/illusive-flora">
          <div className="flex flex-initial flex-col text-center">
            <Image data={imgData} alt="The Laboratory" />
            <div className="border border-black flex flex-1 flex-col flex-wrap p-4 gap-2">
              <h3>
                <b>ILLUSIVE FLORA</b>
              </h3>
              <p>AN EXPANSE OF ABSTRACT FLOWERS</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
