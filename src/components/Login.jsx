import { useState } from "react";

function Login({ setUser }) {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const loginUser = async () => {
    try {
      const res = await fetch(
        "https://api.freeapi.app/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (data?.data) {
        setUser(data.data);
      }

      alert(data.message || "Login done");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      <br />

      <button onClick={loginUser}>Login</button>
    </div>
  );
}

export default Login;