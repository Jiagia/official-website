// import {Image} from '@shopify/hydrogen';
import {useState} from 'react';

export function Carousel({array = [], number = 3, wrap = true, id = "carousel", className = "", leftbtn = <>&lt;</>, rightbtn = <>&gt;</>, lbtnclass = "", rbtnclass = ""}) {
  const length = array.length - 1;
  const temp = array.concat(array);
  const [start, setStart] = useState(0);
  const [state, setState] = useState("");
  const [aniNo, setAniNo] = useState(true);

  let display = temp.slice(start, start + number);

  const prev = () => {
    setState('-clicked-left-' + aniNo);
    setAniNo(!aniNo);
    wrap
      ? setStart((start + length) % array.length)
      : setStart(start > 0 ? start - 1 : 0);
  };
  const next = () => {
    setState('-clicked-right-' + aniNo);
    setAniNo(!aniNo);
    wrap
      ? setStart((start + 1) % array.length)
      : setStart(start + number > length ? start : start + 1);
  };

  return (
    <>
      <button className={"carousel-prev z-10 "+lbtnclass} onClick={prev}>{leftbtn}</button>
      <div className={`carousel carousel${state} ${className}`} id={id}>
        {display.map((element) => {
          // return <Image src={image} key={i} style={{float: 'left'}} width='25%' />;
          
          return element;
        })}
      </div>
      <button className={"carousel-next z-10 "+rbtnclass} onClick={next}>{rightbtn}</button>
    </>
  );
}
