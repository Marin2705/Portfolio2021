function Details(props) {
  const opacity = {
    opacity: 1
  } 

  return (
    <div className="w-screen h-screen bg-mygray lg:h-full z-40 fixed top-0 left-full lg:w-1/2 flex justify-center items-center overflow-y-scroll" id="details">
      <div className="w-4/5 max-h-[85%]" style={opacity} id="animateDetails">
      <svg className="cursor-pointer mb-8 lg:hidden" width="45" height="30" viewBox="0 0 45 30" fill="none" xmlns="http://www.w3.org/2000/svg" id="arrowDetails">
        <path d="M43 17C44.1046 17 45 16.1046 45 15C45 13.8954 44.1046 13 43 13V17ZM0.585786 13.5858C-0.195262 14.3668 -0.195262 15.6332 0.585786 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857864C15.3611 0.0768158 14.0948 0.0768158 13.3137 0.857864L0.585786 13.5858ZM43 13L2 13V17L43 17V13Z" fill="black"/>
      </svg>
        <h2 className="text-3xl mb-3">{props.title}</h2>
        <p className="font-light italic">{props.date}</p>
        <p className="font-light">{props.text}</p>
        <div className="skills">
          {
            props.skills.map((skill, i) => {
              return(
                <div className="inline-block mt-3 mr-4" key={i}>#{skill}</div>
              )
            })
          }
        </div>

        <figure className='projectFig m-auto text-center mt-20 pb-10'>
          <img src={props.pic} alt={props.picAlt} className="mb-10 w-full" />
          <a href={props.link} target="_blank" className='btn'>Go to projet</a>
        </figure>
      </div>
    </div>
  );
}

export default Details;