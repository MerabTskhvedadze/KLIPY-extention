chrome.runtime.onInstalled.addListener(() => {
  console.log("Klipy installed");
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "KLIPY_FETCH_GIF_FILE") return;

  (async () => {
    try {
      const res = await fetch(message.gifUrl);
      if (!res.ok) {
        sendResponse({ ok: false, error: `Fetch failed: ${res.status}` });
        return;
      }

      const blob = await res.blob();
      const buffer = await blob.arrayBuffer();

      sendResponse({
        ok: true,
        mimeType: blob.type || "image/gif",
        fileName: message.fileName || "klipy.gif",
        bytes: Array.from(new Uint8Array(buffer))
      });
    } catch (err) {
      sendResponse({
        ok: false,
        error: err?.message || "Failed to fetch GIF file"
      });
    }
  })();

  return true;
});

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Klipy installed");
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message?.type !== "KLIPY_FETCH_GIF_FILE") return;

//   (async () => {
//     try {
//       const res = await fetch(message.gifUrl);
//       if (!res.ok) {
//         sendResponse({ ok: false, error: `Fetch failed: ${res.status}` });
//         return;
//       }

//       const blob = await res.blob();
//       const buffer = await blob.arrayBuffer();

//       sendResponse({
//         ok: true,
//         mimeType: blob.type || "image/gif",
//         fileName: message.fileName || "klipy.gif",
//         bytes: Array.from(new Uint8Array(buffer))
//       });
//     } catch (err) {
//       sendResponse({
//         ok: false,
//         error: err?.message || "Failed to fetch GIF file"
//       });
//     }
//   })();

//   return true;
// });