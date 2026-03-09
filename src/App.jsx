import { useEffect, useState } from "react";
import { getTrendingGifs } from "./api/gifs";

export default function App() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrending() {
      try {
        setLoading(true);
        setError("");

        const items = await getTrendingGifs();
        setGifs(items);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || "Failed to fetch gifs");
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);
  
  if (loading) {
    return <div style={{ padding: 16 }}>Loading trending gifs...</div>;
  }

  if (error) {
    return <div style={{ padding: 16 }}>{error}</div>;
  }

  return (
    <div style={{ padding: 16, width: 380 }}>
      <h1>Trending GIFs</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {gifs.map((gif) => {
          const imageUrl =
            gif?.file?.sm?.webp?.url ||
            gif?.file?.sm?.gif?.url ||
            gif?.file?.xs?.webp?.url ||
            gif?.file?.xs?.gif?.url;

          return (
            <div
              key={gif.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 8,
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={gif.title}
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    display: "block",
                  }}
                />
              ) : (
                <div>No image</div>
              )}

              <p
                style={{
                  fontSize: 12,
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {gif.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}