import { GameProvider } from "contexts/AppContext";
import Table from "./components/Table";


function App() {
  return (
    <GameProvider>
      <div className="App">
        <Table />
      </div>
    </GameProvider>
  );
}

export default App;
