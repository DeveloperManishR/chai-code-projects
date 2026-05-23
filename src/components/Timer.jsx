import { useEffect, useRef, useState } from "react";

export default function Timer() {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const alarmRef = useRef(null);

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      if (alarmRef.current) {
        alarmRef.current.play();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const total =
      Number(minutes) * 60 + Number(seconds);

    if (total > 0 && timeLeft === 0) {
      setTimeLeft(total);
    }

    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setMinutes("");
    setSeconds("");
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  return (
    <div className="card">
      <h2>Timer</h2>

      <div className="inputs">
        <input
          type="number"
          placeholder="Min"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />

        <input
          type="number"
          placeholder="Sec"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
        />
      </div>

      <div className="time">
        {formatTime()}
      </div>

      <div className="buttons">
        <button
          className="start"
          onClick={startTimer}
        >
          Start
        </button>

        <button
          className="pause"
          onClick={() => setIsRunning(false)}
        >
          Pause
        </button>

        <button
          className="reset"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      <audio
        ref={alarmRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
    </div>
  );
}