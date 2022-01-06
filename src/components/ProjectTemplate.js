function ProjectTemplate(props) {
  return (
    <div className={'projectElem cl-' + props.i + ' lg:left-0 lgct-' + 100 * props.i} 
    onClick={() => props.updateCurrentProject(props.i)}
    id={'projectElem-'+props.i}>
      <figure className='projectFig'>
        <img src={props.thumb} alt={props.thumbAlt} className="max-w-[60vw]"/>
        <figcaption>{props.thumbCaption}</figcaption>
      </figure>
    </div>
  );
}

export default ProjectTemplate;