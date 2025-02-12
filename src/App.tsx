import './App.css';
import BitInteraction from './components/BitInteraction';
function App() {
  return (
    <div className="App">
      <header>
        <h1>Binary Toy</h1>
        <p>An interactive tool for exploring binary numbers for education and fun</p>
      </header>
      <BitInteraction />
      <footer>
        <p>Created by Jim Kass / <a href="https://github.com/filmjbrandon/binary-toy">Link to github</a></p>
      </footer>
    </div>
  );
}
export default App;
