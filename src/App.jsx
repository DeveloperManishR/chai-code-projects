import { useEffect, useState } from "react";

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/quotes"
        );
        const data = await res.json();

        console.log("API RESPONSE:", data);

        const items = data?.data?.data || [];

        setQuotes(items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading quotes...
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>💬 Quotes Listing</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {quotes.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: "14px", marginBottom: "10px" }}>
              “{item?.content || item?.quote || "No quote"}”
            </p>

            <h4 style={{ fontSize: "13px", color: "gray" }}>
              — {item?.author || "Unknown"}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}