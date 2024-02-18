import "./App.css";
import RegistrationQuery from "./pages/SpotReg";

function App() {
  return (
    <>
      <div className="main container">
        <div className="w-full h-screen pr-4 pl-4 flex justify-center items-center overflow-hidden">
          <RegistrationQuery />
        </div>
      </div>
    </>
  );
}

export default App;
