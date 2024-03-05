import {useState} from 'react';
import {Image} from '@shopify/hydrogen'

export function RotatingImage({length, media}) {
  const [bgColor, setBgColor] = useState('white');

  function changeColor(color) {
    setBgColor(color);
  }

  console.log(length);
  console.log(media);

  const [bgImg, setBgImg] = useState(`url("${media[0].image.url}")`);

  function changeImg(img) {
    setBgImg(`url("${img}")`);
  }

  const [index, setIdx] = useState(0);

  console.log(bgImg);
  return (
    <div className="flex flex-col">
      {/* <div className={`w-full absolute top-0`}> */}
        <Image  data={media[index].image} />
      {/* </div> */}
      
    <div
      className={`grid grid-cols-${length} h-full w-full absolute top-0 `}
      style={{
        backgroundColor: bgColor,
        // height: '42vw',
        // maxWidth: '450px',
        // width: "100",
        backgroundImage: bgImg,
        backgroundSize: '100%',
        backgroundRepeat: 'no repeat',
      }}
    >
      
      <div className="object-fit"></div>
      <div
        className="object-fit"
        onMouseOver={() => {
          setIdx(1);
          changeImg(media[1].image.url);
        }}
        onMouseOut={() => {
          setIdx(0);
          changeImg(media[0].image.url);
        }}
      ></div>
      {/* <div className="border-solid border-2" onMouseOver={() => {changeColor("black")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("red")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("lightblue")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("green")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("violet")}} onMouseOut={() => {changeColor("white")}}></div> */}
    </div>
      
    </div>
  );
}
