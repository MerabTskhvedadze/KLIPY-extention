import { useEffect, useState } from "react";
import { getTrendingGifs } from "./api/gifs";

export default function App() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadTrending() {
      try {
        setLoading(true);
        setError("");
        const items = await getTrendingGifs();
        setGifs(items);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch gifs");
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);

  async function handleGifClick(gif) {
    try {
      setStatus("");

      const gifUrl =
        gif?.file?.sm?.gif?.url ||
        gif?.file?.md?.gif?.url ||
        gif?.file?.hd?.gif?.url;

      if (!gifUrl) {
        setStatus("GIF URL not found");
        return;
      }

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.id) {
        setStatus("No active tab found");
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "KLIPY_ATTACH_GIF_FILE",
        gifUrl,
        fileName: `${gif.slug || gif.id || "klipy"}.gif`
      });

      if (response?.ok) {
        setStatus("GIF attached as file");
      } else {
        setStatus(response?.error || "Attach failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("Open Facebook or Messenger chat first");
    }
  }

  if (loading) {
    return <div style={{ padding: 16 }}>Loading trending gifs...</div>;
  }

  if (error) {
    return <div style={{ padding: 16 }}>{error}</div>;
  }

  return (
    <div style={{ padding: 16, width: 380 }}>
      <h1>Trending GIFs</h1>
      {status && <p style={{ fontSize: 12 }}>{status}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10
        }}
      >
        {gifs.map((gif) => {
          const previewUrl =
            gif?.file?.sm?.webp?.url ||
            gif?.file?.sm?.gif?.url ||
            gif?.file?.xs?.webp?.url ||
            gif?.file?.xs?.gif?.url;

          return (
            <button
              key={gif.id}
              onClick={() => handleGifClick(gif)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 8,
                background: "#fff",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={gif.title}
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    display: "block"
                  }}
                />
              ) : (
                <div>No image</div>
              )}

              <p style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                {gif.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}