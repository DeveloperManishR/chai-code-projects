import { useEffect, useState } from "react";

export default function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/randomjokes"
        );
        const data = await res.json();

        console.log("API RESPONSE:", data);

        const items = data?.data?.data || [];

        setJokes(items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();
  }, []);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading jokes...
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>😂 Jokes Viewer</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {jokes.map((item, index) => {
          const joke = item?.joke || item?.content || item;

          return (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                {joke}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}