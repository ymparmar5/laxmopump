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
  const [bannerUrl, setBannerUrl] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

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
        const catalogBanners = [];
        imgSnap.forEach((d) => {
          const data = d.data();
          if (data.type === "catalog") catalogBanners.push(data);
        });
        // pick the most recent one's imgurl1
        if (catalogBanners.length > 0) {
          catalogBanners.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0));
          setBannerUrl(catalogBanners[0].imgurl1 || "");
        }
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
      <section className="catalog-hero" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
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
        <div className="catalog-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
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
                className={`catalog-card ${hoveredId === cat.id ? "catalog-card--hovered" : ""}`}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* banner */}
                <div className="catalog-card-img-wrap">
                  {cat.bannerUrl ? (
                    <img src={cat.bannerUrl} alt={cat.title} className="catalog-card-img" />
                  ) : (
                    <div className="catalog-card-img-placeholder">
                      <i className="fa-solid fa-book-open fa-2x" />
                    </div>
                  )}
                  {/* PDF badge */}
                  <div className="catalog-pdf-badge">
                    <i className="fa-solid fa-file-pdf" />
                    PDF
                  </div>
                  {/* hover overlay */}
                  <div className="catalog-card-overlay">
                    <div className="catalog-overlay-icons">
                      <a
                        href={getViewUrl(cat.pdfUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="catalog-overlay-btn catalog-overlay-btn--view"
                        title="View PDF"
                      >
                        <i className="fa-solid fa-eye" />
                      </a>
                      <button
                        className="catalog-overlay-btn catalog-overlay-btn--download"
                        onClick={() => handleDownload(cat.pdfUrl, cat.title)}
                        title="Download PDF"
                      >
                        <i className="fa-solid fa-download" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* body */}
                <div className="catalog-card-body">
                  <h3 className="catalog-card-title">{cat.title}</h3>
                  {cat.description && (
                    <p className="catalog-card-desc">{cat.description}</p>
                  )}
                  <div className="catalog-card-footer">
                    <span className="catalog-card-date">
                      <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
                      {cat.date}
                    </span>
                    <button
                      id={`download-catalog-${cat.id}`}
                      className="catalog-download-btn"
                      onClick={() => handleDownload(cat.pdfUrl, cat.title)}
                    >
                      <i className="fa-solid fa-download" style={{ marginRight: 6 }} />
                      Download
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
