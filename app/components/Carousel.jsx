// import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import useSwipe from '../hooks/useSwipe';
import Swipeable from './Swipeable';
/*
Inputs:
array: array of HTML elements of the carousel
number: number of items to display at a time
wrap: boolean 
id: id of the the carousel 
className: classname of the carousel
leftbtn: HTML element of the left button
rightbtn: HTML element of the right button
lbtnclass: classname of the left button
rbtnclass: classname of the right button
*/
export function Carousel({
  array = [],
  number = 3,
  wrap = true,
  id = 'carousel',
  className = '',
  leftbtn = <>&lt;</>,
  rightbtn = <>&gt;</>,
  lbtnclass = '',
  rbtnclass = '',
  indicatorclass = '',
}) {
  const length = array.length - 1;
  const temp = array.concat(array);
  const [start, setStart] = useState(0);
  const [state, setState] = useState('');
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
      <button className={'carousel-prev z-[4] ' + lbtnclass} onClick={prev}>
        {leftbtn}
      </button>
      <Swipeable onSwipeLeft={next} onSwipeRight={prev}>
        <div
          className={`carousel carousel-${number} carousel${state} ${className}`}
          id={id}
        >
          {display.map((element) => {
            // return <Image src={image} key={i} style={{float: 'left'}} width='25%' />;

            return element;
          })}
        </div>
      </Swipeable>
      <button className={'carousel-next z-[4] ' + rbtnclass} onClick={next}>
        {rightbtn}
      </button>
      <p className={`indicator z-[4] text-center ` + indicatorclass}>
        {start + 1}/{array.length}
      </p>
    </>
  );
}
