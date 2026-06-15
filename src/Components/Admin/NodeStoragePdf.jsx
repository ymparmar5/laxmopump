/**
 * NodeStoragePdf.jsx
 * Upload PDFs to our custom Node.js Backend via Multer
 */

export const uploadPdfNode = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.url) {
            resolve(data.url);
          } else {
            reject(new Error("Upload failed — no URL returned from backend"));
          }
        } catch {
          reject(new Error("Failed to parse backend response"));
        }
      } else {
        let msg = `Upload failed — HTTP ${xhr.status}`;
        try {
          const err = JSON.parse(xhr.responseText);
          msg = err.error || msg;
        } catch { /* ignore */ }
        reject(new Error(msg));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during PDF upload")));
    xhr.addEventListener("abort", () => reject(new Error("PDF upload aborted")));

    // Use environment variable for backend URL (fallback to localhost:5000 for local dev if missing)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    xhr.open("POST", `${backendUrl}/upload-pdf`);
    xhr.send(formData);
  });
};
