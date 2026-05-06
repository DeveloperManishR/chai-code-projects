import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🔐 FreeAPI Auth App</h1>

      {!user ? (
        <>
          <Register />
          <Login setUser={setUser} />
        </>
      ) : (
        <Profile user={user} setUser={setUser} />
      )}
    </div>
  );
}

export default App;