function findFileInput() {
  const selectors = [
    'input[type="file"][accept*="image"]',
    'input[type="file"][multiple]',
    'input[type="file"]'
  ];

  for (const selector of selectors) {
    const inputs = document.querySelectorAll(selector);
    for (const input of inputs) {
      return input;
    }
  }

  return null;
}

async function attachGifFile({ gifUrl, fileName }) {
  const input = findFileInput();

  if (!input) {
    return {
      ok: false,
      error: "File input not found. Open a Facebook/Messenger chat and keep the composer visible."
    };
  }

  const fileResponse = await chrome.runtime.sendMessage({
    type: "KLIPY_FETCH_GIF_FILE",
    gifUrl,
    fileName
  });

  if (!fileResponse?.ok) {
    return {
      ok: false,
      error: fileResponse?.error || "Could not download GIF file"
    };
  }

  const bytes = new Uint8Array(fileResponse.bytes);
  const file = new File([bytes], fileResponse.fileName, {
    type: fileResponse.mimeType || "image/gif"
  });

  const dt = new DataTransfer();
  dt.items.add(file);

  input.files = dt.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));

  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "KLIPY_ATTACH_GIF_FILE") return;

  attachGifFile({
    gifUrl: message.gifUrl,
    fileName: message.fileName
  })
    .then(sendResponse)
    .catch((err) => {
      sendResponse({
        ok: false,
        error: err?.message || "Attach failed"
      });
    });

  return true;
});