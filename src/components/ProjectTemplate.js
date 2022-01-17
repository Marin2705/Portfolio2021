function ProjectTemplate(props) {
  return (
    <div className={'projectElem cl-' + props.i + ' lg:left-0 lgct-' + 100 * props.i} 
    onClick={() => props.updateCurrentProject(props.i)}
    id={'projectElem-'+props.i}>
      <figure className='projectFig cursor-pointer'>
        <img src={props.thumb} alt={props.thumbAlt} className="max-w-[60vw]"/>
        <figcaption>{props.thumbCaption}</figcaption>
        <p className="font-thin lg:text-1xl">{props.text.substring(0,50)}... <br /><a href="#root" className="inline-block underline transition-all transform hover:scale-110">Learn more</a></p>
      </figure>
    </div>
  );
}

export default ProjectTemplate;