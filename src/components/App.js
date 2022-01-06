import './css/output.css';
import FixedPresentation from './FixedPresentation';
import Projects from './Projects';

function App() {
  return (
    <div className="overflow-y-visible font-roboto font-medium overflow-x-hidden lg:overflow-x-auto lg:overflow-y-hidden w-screen h-screen relative transform" id='scrollContainer'>
        <FixedPresentation/>
        <Projects/>
    </div>
  );
}

export default App;