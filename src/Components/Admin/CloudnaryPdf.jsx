/**
 * CloudnaryPdf.jsx
 * Upload PDFs to Node.js backend.
 *
 * Returns the URL of the uploaded file.
 */

export const getDownloadUrl = (url) => {
  if (!url) return '';
  return url;
};

export const getViewUrl = (url) => {
  if (!url) return '#';
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

export const uploadPdf = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr      = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          if (data.url) {
            resolve(data.url);
          } else {
            reject(new Error(data.error || 'Upload failed — no URL returned'));
          }
        } catch {
          reject(new Error('Failed to parse backend response'));
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

    xhr.addEventListener('error', () => reject(new Error('Network error during PDF upload')));
    xhr.addEventListener('abort', () => reject(new Error('PDF upload aborted')));

    let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);
    xhr.open('POST', `${backendUrl}/upload-pdf`);
    xhr.send(formData);
  });
};