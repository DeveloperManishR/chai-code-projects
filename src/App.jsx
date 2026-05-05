import { useEffect, useState } from "react";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/meals"
        );
        const data = await res.json();

        console.log("FULL RESPONSE:", data);


        const items = data?.data?.data || [];

        console.log("MEALS ARRAY:", items);

        setMeals(items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading meals...
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
      <h1 style={{ textAlign: "center" }}>🍽️ Meals Listing</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {meals.map((item) => (
          <div
            key={item?.idMeal}
            style={{
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >

            <img
              src={
                item?.strMealThumb ||
                item?.image ||
                "https://via.placeholder.com/300"
              }
              alt={item?.strMeal}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "10px" }}>
              <h3 style={{ fontSize: "14px" }}>
                {item?.strMeal}
              </h3>

              <p style={{ fontSize: "12px", color: "gray" }}>
                {item?.strCategory}
              </p>

              <p style={{ fontSize: "13px" }}>
                {item?.strArea}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}