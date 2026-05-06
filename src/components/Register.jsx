import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const registerUser = async () => {
    const res = await fetch(
      "https://api.freeapi.app/api/v1/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "ADMIN"
        })
      }
    );

    const data = await res.json();
    alert(data.message || "Registered Successfully");
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />
      <br />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
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

      <button onClick={registerUser}>Register</button>
    </div>
  );
}

export default Register;