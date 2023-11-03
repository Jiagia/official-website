import {useState} from 'react';

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
  console.log(bgImg);
  return (
    <div
      className={`grid grid-cols-${length} h-40`}
      style={{
        backgroundColor: bgColor,
        height: '600px',
        maxWidth: '450px',
        backgroundImage: bgImg,
        backgroundSize: 'cover',
        backgroundRepeat: 'no repeat',
      }}
    >
      <div></div>
      <div
        className=""
        onMouseOver={() => {
          changeImg(media[1].image.url);
        }}
        onMouseOut={() => {
          changeImg(media[0].image.url);
        }}
      ></div>
      {/* <div className="border-solid border-2" onMouseOver={() => {changeColor("black")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("red")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("lightblue")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("green")}} onMouseOut={() => {changeColor("white")}}></div>
        <div className="" onMouseOver={() => {changeColor("violet")}} onMouseOut={() => {changeColor("white")}}></div> */}
    </div>
  );
}
