import Picture from './Picture';

function FixedPresentation() {
  return (
    <div className="bg-mygray w-full min-h-2/3 pb-10 pt-10 lg:h-full lg:w-1/2 lg:fixed flex justify-center items-center headersResponsive" id='fixedPresentation'>
        <div className="w-3/4 h-3/5">
            <Picture src="portrait.jpg" alt="Marin Bouanchaud" className="clip-circle w-1/2 h-auto max-w-[200px]"/>
            <div>
                <h1 className="text-4xl xsm:text-5xl lg:leading-[4vw] lg:text-[5vw] mt-5 uppercase"><span className="font-light">Marin</span><br/> Bouanchaud</h1>
                <h2 className="text-2xl font-thin xsm:text-[6vw] sm:text-4xl mt-2">Multimedia project manager</h2>
                <a href="https://marinb.com" rel="opener" className='btn btn-alignLeft'>CV & contact</a>
                <a href="https://www.linkedin.com/in/marin-bouanchaud/" rel="noopener" target="_blank" className='btn btn-alignLeft'>LinkedIn</a>
            </div>
        </div>
    </div>
  );
}

export default FixedPresentation;