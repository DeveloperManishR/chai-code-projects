import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://api.freeapi.app/api/v1/public/randomusers"
        );

        const result = await response.json();

        console.log(result);

        // Correct API Data
        setUsers(result.data.data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Loading State
  if (loading) {
    return (
      <h1
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "Arial",
        }}
      >
        Loading Users...
      </h1>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Random Users API
      </h1>

      {/* Users Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* User Image */}
            <img
              src={user.picture.large}
              alt={user.name.first}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />

            {/* User Details */}
            <div style={{ padding: "15px" }}>
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {user.name.title} {user.name.first} {user.name.last}
              </h2>

              <p>
                <strong>Gender:</strong> {user.gender}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Phone:</strong> {user.phone}
              </p>

              <p>
                <strong>Country:</strong> {user.location.country}
              </p>

              <p>
                <strong>City:</strong> {user.location.city}
              </p>

              <p>
                <strong>Username:</strong> {user.login.username}
              </p>

              <p>
                <strong>Age:</strong> {user.dob.age}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;