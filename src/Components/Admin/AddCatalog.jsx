import { Timestamp, addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import "../../Style/AddProductPage.css";
import { uploadImage } from "./CloudnaryImages";
import { uploadPdf, getViewUrl } from "./CloudnaryPdf"; // Cloudinary raw/upload

const AddCatalog = () => {
  const navigate = useNavigate();

  const createEmpty = useCallback(
    () => ({
      title: "",
      description: "",
      bannerUrl: "",
      pdfUrl: "",
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    }),
    []
  );

  const [form, setForm] = useState(createEmpty());
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(null); // null = idle, 0-100 = uploading
  const [updatingMap, setUpdatingMap] = useState({});
  const [updatePdfProgress, setUpdatePdfProgress] = useState({});

  /* ── fetch catalogs ── */
  const fetchCatalogs = useCallback(async () => {
    try {
      const snap = await getDocs(collection(fireDB, "catalogs"));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0));
      setCatalogs(list);
    } catch (err) {
      toast.error("Failed to fetch catalogs");
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchCatalogs(); }, [fetchCatalogs]);

  /* ── banner upload (Cloudinary) ── */
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const valid = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!valid.includes(file.type)) { toast.error("JPEG, PNG, or WebP only"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be < 5 MB"); return; }
    setUploadingBanner(true);
    try {
      const url = await uploadImage(file);
      setForm((p) => ({ ...p, bannerUrl: url }));
      toast.success("Banner uploaded!");
    } catch {
      toast.error("Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  /* ── PDF upload (Firebase Storage) ── */
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("PDF files only"); return; }
    if (file.size > 30 * 1024 * 1024) { toast.error("PDF must be < 30 MB"); return; }
    setPdfProgress(0);
    try {
      const url = await uploadPdf(file, (pct) => setPdfProgress(pct));
      setForm((p) => ({ ...p, pdfUrl: url }));
      toast.success("PDF uploaded successfully!");
    } catch {
      toast.error("PDF upload failed");
    } finally {
      setPdfProgress(null);
    }
  };

  /* ── save new catalog ── */
  const saveCatalog = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.bannerUrl) { toast.error("Upload a banner image first"); return; }
    if (!form.pdfUrl) { toast.error("Upload a PDF first"); return; }
    setLoading(true);
    try {
      await addDoc(collection(fireDB, "catalogs"), {
        ...form,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      });
      toast.success("Catalog saved!");
      setForm(createEmpty());
      await fetchCatalogs();
    } catch (err) {
      toast.error("Failed to save catalog");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ── delete ── */
  const deleteCatalog = async (id) => {
    if (!window.confirm("Delete this catalog?")) return;
    try {
      await deleteDoc(doc(fireDB, "catalogs", id));
      toast.success("Deleted");
      await fetchCatalogs();
    } catch { toast.error("Delete failed"); }
  };

  /* ── inline banner update ── */
  const handleUpdateBanner = async (file, id) => {
    if (!file) return;
    const key = `${id}-banner`;
    setUpdatingMap((p) => ({ ...p, [key]: true }));
    try {
      const url = await uploadImage(file);
      await updateDoc(doc(fireDB, "catalogs", id), { bannerUrl: url });
      toast.success("Banner updated!");
      await fetchCatalogs();
    } catch { toast.error("Update failed"); }
    finally { setUpdatingMap((p) => ({ ...p, [key]: false })); }
  };

  /* ── inline PDF update (Firebase Storage) ── */
  const handleUpdatePdf = async (file, id) => {
    if (!file) return;
    const key = `${id}-pdf`;
    setUpdatingMap((p) => ({ ...p, [key]: true }));
    setUpdatePdfProgress((p) => ({ ...p, [key]: 0 }));
    try {
      const url = await uploadPdf(file, (pct) =>
        setUpdatePdfProgress((p) => ({ ...p, [key]: pct }))
      );
      await updateDoc(doc(fireDB, "catalogs", id), { pdfUrl: url });
      toast.success("PDF updated!");
      await fetchCatalogs();
    } catch { toast.error("PDF update failed"); }
    finally {
      setUpdatingMap((p) => ({ ...p, [key]: false }));
      setUpdatePdfProgress((p) => ({ ...p, [key]: null }));
    }
  };

  /* ── Progress Bar ── */
  const ProgressBar = ({ percent, label }) => (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a5568", marginBottom: 4 }}>
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${percent}%`,
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          borderRadius: 8,
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );

  /* ── Spinner ── */
  const Spinner = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3182ce", fontSize: 13, fontWeight: 500 }}>
      <div style={{
        width: 14, height: 14, border: "2px solid #3182ce",
        borderTop: "2px solid transparent", borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      {label}
    </div>
  );

  return (
    <div className="add-product-container">
      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .cat-input { width:100%; padding:10px 12px; border:1px solid #cbd5e0; border-radius:6px;
          font-size:14px; color:#4a5568; outline:none; margin-bottom:14px; box-sizing:border-box; }
        .cat-input:focus { border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,.15); }
        .upload-box { display:flex; flex-direction:column; align-items:flex-start; padding:16px;
          border:2px dashed #e2e8f0; border-radius:8px; background:#f8fafc; margin-bottom:16px; gap:8px; }
        .upload-box label { font-weight:600; color:#4a5568; font-size:14px; }
        .cat-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px;
          padding:20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,.07); }
        .cat-card-head { display:flex; justify-content:space-between; align-items:flex-start;
          margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid #f1f5f9; }
        .cat-card-head h4 { margin:0; color:#2d3748; font-size:16px; font-weight:600; }
        .cat-card-head small { color:#718096; font-size:12px; }
        .cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:700px){ .cat-grid{grid-template-columns:1fr} }
        .pdf-link { display:flex; align-items:center; gap:8px; color:#e53e3e; font-weight:600;
          font-size:14px; text-decoration:none; padding:10px 14px; border:2px solid #fed7d7;
          border-radius:8px; background:#fff5f5; }
        .pdf-link:hover { background:#fee2e2; }
      `}</style>

      {/* ═══ ADD NEW CATALOG ═══ */}
      <div className="add-product-form-wrapper">
        <div className="add-product-form-header">
          <h2>Add New Catalog</h2>
          <p style={{ color: "#666", fontSize: 14, margin: "5px 0" }}>
            Upload a banner image and PDF. Both are stored on Cloudinary.
          </p>
        </div>

        <div className="add-product-form">
          {/* Title */}
          <label style={{ fontWeight: 600, color: "#4a5568", fontSize: 14, display: "block", marginBottom: 4 }}>
            Catalog Title *
          </label>
          <input
            className="cat-input"
            placeholder="e.g. Laxmo Pump – Product Catalog 2024"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />

          {/* Description */}
          <label style={{ fontWeight: 600, color: "#4a5568", fontSize: 14, display: "block", marginBottom: 4 }}>
            Short Description
          </label>
          <textarea
            className="cat-input"
            rows={3}
            placeholder="Brief description shown on the catalog card…"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            style={{ resize: "vertical" }}
          />

          {/* Banner */}
          <div className="upload-box">
            <label>🖼 Banner / Cover Image *</label>
            <small style={{ color: "#718096", fontSize: 12 }}>JPEG, PNG, WebP — max 5 MB</small>
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleBannerUpload} disabled={uploadingBanner} />
            {uploadingBanner && <Spinner label="Uploading to Cloudinary…" />}
            {form.bannerUrl && (
              <img src={form.bannerUrl} alt="preview"
                style={{ height: 120, borderRadius: 8, border: "2px solid #e2e8f0", objectFit: "cover", marginTop: 4 }} />
            )}
          </div>

          {/* PDF — Cloudinary raw/upload */}
          <div className="upload-box">
            <label>📄 Catalog PDF * <span style={{ fontSize: 11, fontWeight: 400, color: "#718096" }}>(stored on Cloudinary)</span></label>
            <small style={{ color: "#718096", fontSize: 12 }}>PDF only — max 30 MB</small>
            <input type="file" accept="application/pdf"
              onChange={handlePdfUpload} disabled={pdfProgress !== null} />
            {pdfProgress !== null && (
              <ProgressBar percent={pdfProgress} label="Uploading PDF to Cloudinary…" />
            )}
            {form.pdfUrl && pdfProgress === null && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22863a", fontSize: 13, fontWeight: 600 }}>
                <i className="fa-solid fa-circle-check" />
                PDF ready —{" "}
                <a href={getViewUrl(form.pdfUrl)} target="_blank" rel="noreferrer"
                  style={{ color: "#3182ce", textDecoration: "underline" }}>Preview</a>
              </div>
            )}
          </div>

          <button
            className="add-product-add-btn"
            onClick={saveCatalog}
            disabled={loading || uploadingBanner || pdfProgress !== null}
            style={{ opacity: (loading || uploadingBanner || pdfProgress !== null) ? 0.6 : 1, marginTop: 8 }}
          >
            {loading ? "Saving…" : "Save Catalog"}
          </button>
        </div>
      </div>

      {/* ═══ SAVED CATALOGS ═══ */}
      <div className="add-product-form-wrapper" style={{ marginTop: 40 }}>
        <div className="add-product-form-header">
          <h2>Saved Catalogs</h2>
          <p style={{ color: "#666", fontSize: 14, margin: "5px 0" }}>
            {catalogs.length} catalog{catalogs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {catalogs.length === 0 ? (
          <div style={{
            textAlign: "center", padding: 40, color: "#718096",
            fontStyle: "italic", background: "#f7fafc",
            borderRadius: 8, border: "2px dashed #e2e8f0",
          }}>
            No catalogs yet. Add one above.
          </div>
        ) : (
          catalogs.map((cat) => (
            <div className="cat-card" key={cat.id}>
              <div className="cat-card-head">
                <div>
                  <h4>{cat.title}</h4>
                  <small>Added: {cat.date}</small>
                  {cat.description && (
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>{cat.description}</p>
                  )}
                </div>
                <button onClick={() => deleteCatalog(cat.id)}
                  style={{ padding: "7px 14px", fontSize: 12, background: "#ef4444", color: "#fff",
                    border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, flexShrink: 0 }}>
                  Delete
                </button>
              </div>

              <div className="cat-grid">
                {/* Banner update */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#4a5568" }}>Banner Image</p>
                  {cat.bannerUrl ? (
                    <img src={cat.bannerUrl} alt="banner"
                      style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, border: "2px solid #e2e8f0" }} />
                  ) : (
                    <div style={{ height: 140, border: "2px dashed #cbd5e0", borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#a0aec0", fontSize: 13 }}>
                      No banner
                    </div>
                  )}
                  <label style={{ fontSize: 12, color: "#718096" }}>Replace banner:</label>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                    style={{ fontSize: 11 }} disabled={updatingMap[`${cat.id}-banner`]}
                    onChange={(e) => handleUpdateBanner(e.target.files[0], cat.id)} />
                  {updatingMap[`${cat.id}-banner`] && <Spinner label="Updating…" />}
                </div>

                {/* PDF update */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#4a5568" }}>PDF File (Cloudinary)</p>
                  {cat.pdfUrl ? (
                    <a href={getViewUrl(cat.pdfUrl)} target="_blank" rel="noreferrer" className="pdf-link">
                      <i className="fa-solid fa-file-pdf fa-lg" />
                      View / Download PDF
                    </a>
                  ) : (
                    <div style={{ height: 60, border: "2px dashed #cbd5e0", borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#a0aec0", fontSize: 13 }}>
                      No PDF
                    </div>
                  )}
                  <label style={{ fontSize: 12, color: "#718096", marginTop: 8 }}>Replace PDF:</label>
                  <input type="file" accept="application/pdf"
                    style={{ fontSize: 11 }} disabled={!!updatingMap[`${cat.id}-pdf`]}
                    onChange={(e) => handleUpdatePdf(e.target.files[0], cat.id)} />
                  {updatePdfProgress[`${cat.id}-pdf`] != null && (
                    <ProgressBar percent={updatePdfProgress[`${cat.id}-pdf`]} label="Uploading PDF…" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddCatalog;
