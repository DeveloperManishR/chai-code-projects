import { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/randomproducts"
        );
        const data = await res.json();

        console.log("FULL API RESPONSE:", data);

        // ✅ SAFE EXTRACTION (handles all possible structures)
        const items =
          data?.data?.data ||
          data?.data ||
          [];

        console.log("PRODUCTS ARRAY:", items);

        setProducts(items);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading products...
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Product Listing</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {products.map((item, index) => {
          // 🔥 SAFE IMAGE HANDLING (MAIN FIX)
          const image =
            item?.image ||
            item?.images?.[0] ||
            item?.thumbnail ||
            "https://via.placeholder.com/300";

          return (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE */}
              <img
                src={image}
                alt={item?.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "14px" }}>
                  {item?.title || "No Title"}
                </h3>

                <p style={{ fontSize: "12px", color: "gray" }}>
                  {item?.category || "No Category"}
                </p>

                <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                  ₹{item?.price || 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}