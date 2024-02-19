import "./App.css";
import { RouterPaths } from "./components/Router";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      <Router>
        <div className="overflow-container">
          <RouterPaths />
        </div>
      </Router>
    </div>
  );
}

export default App;
