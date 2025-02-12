import './App.css';
import BitInteraction from './components/BitInteraction';
function App() {
  return (
    <div className="App">
      <BitInteraction startingIntValue={256} numberOfBits={9}/>
    </div>
  );
}
export default App;
