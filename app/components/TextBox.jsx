export function TextBox({box}) {
  
  const [dropshow, setDropshow] = useState("hidden");
  const showBodyText = () => {
    setDropshow((prevDropshow) => (prevDropshow === "hidden" ? "" : "hidden"));
  };

  return (
    <div className='border border-black' id={box.id_tag.value}>
      <img className='border border-black' src={box.image.reference.image.url} />
      <div className='flex flex-row p-4'>
        <div className='text-wrap grow'>
          <div>
            <b>{box.title.value}</b>
          </div>
          <div>
            <i>{box.subtitle.value}</i> 
          </div>
          <div className={`text-wrap mt-4 ${dropshow}`}>
            {box.description.value
              .split('\n')
              .map((desc, index) => (
              <div key={index}>{desc}</div>
            ))}
          </div>
        </div>
        <div className="w-16 text-right">
          <button onClick={showBodyText}>
            {dropshow=="hidden" ? (<b>EXPAND [+]</b>) : (<b>HIDE [-]</b>)}
          </button>
        </div>
      </div>
    </div>
  )
}
