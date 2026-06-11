/**
 * CloudnaryPdf.jsx
 * Upload PDFs to Cloudinary using the raw endpoint.
 * Uses the same unsigned 'Images' upload_preset.
 *
 * Returns the ORIGINAL secure_url (no fl_attachment).
 * Use getDownloadUrl() to add fl_attachment at download time.
 */

const CLOUD_NAME = 'dn5vvxkra';
const UPLOAD_PRESET = 'Images'; // same unsigned preset as images

/**
 * Convert a Cloudinary raw URL into a force-download URL
 * by injecting the fl_attachment flag.
 *
 * @param {string} url - original Cloudinary secure_url
 * @returns {string}   - URL with fl_attachment (browser will download instead of display)
 */
export const getDownloadUrl = (url) => {
  if (!url) return '';
  // Strip fl_attachment if already present so we have the clean base URL
  const clean = url.replace('/fl_attachment/', '/');
  // Inject fl_attachment after /raw/upload/
  return clean.replace(/\/raw\/upload\//, '/raw/upload/fl_attachment/');
};

/**
 * Convert a Cloudinary raw URL into a viewable URL via Google Docs Viewer.
 *
 * Cloudinary raw/upload serves files with Content-Type: application/octet-stream,
 * which prevents the browser's built-in PDF viewer from rendering the file.
 * Google Docs Viewer acts as a proxy that properly interprets and renders the PDF.
 *
 * @param {string} url - original Cloudinary secure_url (or one with fl_attachment)
 * @returns {string}   - Google Docs Viewer URL that renders the PDF inline
 */
export const getViewUrl = (url) => {
  if (!url) return '#';
  // Strip fl_attachment if present — we want the raw file URL for the viewer
  const clean = url.replace('/fl_attachment/', '/');
  return `https://docs.google.com/gview?url=${encodeURIComponent(clean)}&embedded=true`;
};

/**
 * Upload a PDF file to Cloudinary (raw endpoint).
 * @param {File}     file       - The PDF File object
 * @param {Function} onProgress - optional callback(percent: number)
 * @returns {Promise<string>}   - public URL (without fl_attachment — use getDownloadUrl() for download)
 */
export const uploadPdf = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr      = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file',          file);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          if (data.secure_url) {
            // ✅ Return the ORIGINAL URL — no fl_attachment baked in.
            // View button uses this URL directly (browser shows PDF inline).
            // Download button uses getDownloadUrl() to add fl_attachment.
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error?.message || 'Cloudinary upload failed — no secure_url returned'));
          }
        } catch {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        let msg = `Upload failed — HTTP ${xhr.status}`;
        try {
          const err = JSON.parse(xhr.responseText);
          msg = err.error?.message || msg;
        } catch { /* ignore */ }
        reject(new Error(msg));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during PDF upload')));
    xhr.addEventListener('abort', () => reject(new Error('PDF upload aborted')));

    // raw/upload is the correct endpoint for non-image files (PDFs, ZIPs, etc.)
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`);
    xhr.send(formData);
  });
};