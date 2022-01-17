function findPic(urlInAssets){
  try {
    return require('./assets/' + urlInAssets);
  } catch {
    return "";
  }
}

function Picture(props) {
  return (
    <picture>
      <source srcSet={findPic(`${props.src}.webp`)} type="image/webp" />
      <img src={findPic(props.src)} alt={props.alt} className={props.className} />
    </picture>
  );
}

export default Picture;