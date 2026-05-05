import { useEffect, useState } from "react";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/youtube/videos"
        );
        const data = await res.json();

        console.log("FULL RESPONSE:", data);

        const raw = data?.data?.data || [];

        // 🔥 IMPORTANT FIX (flatten nested items)
        const flattened = raw
          .map((item) => item?.items)
          .flat()
          .filter(Boolean);

        console.log("FLATTENED VIDEOS:", flattened);

        setVideos(flattened);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>YouTube Videos Listing</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {videos.map((video, index) => {
          const snippet = video?.snippet || {};

          const thumb =
            snippet?.thumbnails?.high?.url ||
            snippet?.thumbnails?.medium?.url ||
            snippet?.thumbnails?.default?.url ||
            "https://via.placeholder.com/300";

          const videoId =
            snippet?.resourceId?.videoId ||
            video?.id ||
            "";

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
                src={thumb}
                alt="video"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "14px" }}>
                  {snippet?.title || "No Title"}
                </h3>

                <p style={{ fontSize: "12px", color: "gray" }}>
                  {snippet?.channelTitle || "Unknown Channel"}
                </p>

                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "12px", color: "blue" }}
                >
                  Watch Video
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}