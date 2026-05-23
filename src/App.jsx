import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <h1 className="main-heading">
        Stopwatch & Timer
      </h1>

      <div className="cards-container">
        <Stopwatch />
        <Timer />
      </div>
    </div>
  );
}
