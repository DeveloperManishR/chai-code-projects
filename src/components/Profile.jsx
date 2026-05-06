function Profile({ user, setUser }) {
  const logoutUser = async () => {
    try {
      const res = await fetch(
        "https://api.freeapi.app/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}` // 👈 IMPORTANT FIX
          }
        }
      );

      const data = await res.json();
      console.log(data);

      setUser(null); // logout after success
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>👤 Profile</h2>

      <pre
        style={{
          background: "#eee",
          padding: "10px"
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>

      <button onClick={logoutUser}>Logout</button>
    </div>
  );
}

export default Profile;