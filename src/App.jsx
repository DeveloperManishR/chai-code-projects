import { useEffect, useState } from "react";

export default function App() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCat = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.freeapi.app/api/v1/public/cats/cat/random"
      );
      const data = await res.json();

      console.log("API RESPONSE:", data);

      const image =
        data?.data?.url ||
        data?.data?.imageUrl ||
        data?.data?.image ||
        "";

      setCat(image);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1> Random Cat Viewer</h1>

      {loading ? (
        <h3>Loading cat...</h3>
      ) : (
        <img
          src={cat}
          alt="cat"
          style={{
            width: "320px",
            height: "320px",
            objectFit: "cover",
            borderRadius: "12px",
            marginTop: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        />
      )}

      <br />

      <button
        onClick={fetchCat}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          background: "#111",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        New Cat 🐱
      </button>
    </div>
  );
}