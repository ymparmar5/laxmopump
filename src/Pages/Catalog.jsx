/* ═══════════════════════════════════════════════
   Catalog Page  –  src/Pages/Catalog.jsx
   ═══════════════════════════════════════════════ */
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import { getDownloadUrl, getViewUrl } from "../Components/Admin/CloudnaryPdf";
import "../Style/Catalog.css";

const Catalog = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);


  /* ── fetch catalogs + banner image ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch catalogs
        const snap = await getDocs(collection(fireDB, "catalogs"));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0));
        setCatalogs(list);

        // fetch catalog-specific banner from Images collection (type === "catalog")
        const imgSnap = await getDocs(collection(fireDB, "Images"));
        imgSnap.forEach((d) => {
          const data = d.data();
          if (data.type === "catalog") catalogBanners.push(data);
        });

      } catch (err) {
        console.error("Catalog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── PDF download helper ── */
  const handleDownload = (pdfUrl, title) => {
    if (!pdfUrl) return;
    // Use Cloudinary's fl_attachment flag for a proper forced download
    const dlUrl = getDownloadUrl(pdfUrl);
    // Open in a new tab — the fl_attachment flag tells Cloudinary to send
    // Content-Disposition: attachment, so the browser downloads instead of displaying
    window.open(dlUrl, '_blank', 'noreferrer');
  };

  return (
    <main className="catalog-page">
      {/* ══ Hero Banner ══ */}
      <section className="catalog-hero">
        <div className="catalog-hero-overlay">
          <div className="catalog-hero-content">
            <span className="catalog-hero-tag">Downloads</span>
            <h1 className="catalog-hero-title">Our Catalogs</h1>
            <p className="catalog-hero-sub">
              Download our product catalogs to explore the complete range of Laxmo pumps &amp; motors.
            </p>
          </div>
        </div>
        {/* wave divider */}

      </section>

      {/* ══ Grid ══ */}
      <section className="catalog-section">
        <div className="catalog-section-header">
          <h2 className="catalog-section-title">Product Catalogs</h2>
          <p className="catalog-section-sub">Click any catalog to view or download the PDF</p>
        </div>

        {loading ? (
          <div className="catalog-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="catalog-skeleton" />
            ))}
          </div>
        ) : catalogs.length === 0 ? (
          <div className="catalog-empty">
            <i className="fa-solid fa-folder-open fa-3x" style={{ color: "#cbd5e0" }} />
            <p>No catalogs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {catalogs.map((cat) => (
              <article
                key={cat.id}
                className={`catalog-card`}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* PDF Image Header */}
                <div className="catalog-card-header" style={{
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: "#f1f5f9",
                  padding: "1rem"
                }}>
                  <img src="/pdf.png" alt="PDF icon" style={{ height: "100%", width: "auto", objectFit: "contain" }} />
                </div>

                {/* body */}
                <div className="catalog-card-body">
                  <h3 className="catalog-card-title" style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#1e293b", fontWeight: 700 }}>{cat.title}</h3>
                  <div className="catalog-card-footer" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <a
                      href={getViewUrl(cat.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="catalog-download-btn"
                      style={{ flex: 1, justifyContent: "center", textDecoration: "none", background: "#3b82f6" }}
                      title="View PDF"
                    >
                      <i className="fa-solid fa-eye" style={{ marginRight: "6px" }} /> View
                    </a>
                    <button
                      className="catalog-download-btn"
                      onClick={() => handleDownload(cat.pdfUrl, cat.title)}
                      style={{ flex: 1, justifyContent: "center" }}
                      title="Download PDF"
                    >
                      <i className="fa-solid fa-download" style={{ marginRight: "6px" }} /> Download
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Catalog;
