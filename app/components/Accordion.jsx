import {useState} from 'react';

export function AccordionItem({children, initState = false, title = '', className=''}) {
  const [dropshow, setDropshow] = useState(initState);
  const toggleShow = () => {
    setDropshow(!dropshow);
  };

  return (
    <div className={`accordion-item relative ${className}`}>
      <div className="flex w-full">
        <h2 className="flex-grow">{title}</h2>
        <button className="w-4" onClick={toggleShow}>
          {dropshow ? <div>-</div> : <div>+</div>}
        </button>
      </div>
      {dropshow ? children : <></>}
    </div>
  );
}
