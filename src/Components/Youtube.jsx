import React from 'react';
import '../Style/Youtube.css';

const YouTubeSection = () => {
  return (
    <section className="youtube-section">
      <div className="youtube-container">
        <div className="content-card">
          <div className="video-side">
            <div className="video-frame">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/7kuiDE4q_GU?si=S2cVn-Pa5H3IAl81" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
          
          <div className="description-side">
            <div className="description-content">
              <h2 className="section-title">Discover Laxmo Pumps</h2>
              
              
              <p className="intro-text">
                Your Trusted Partner in Premium Pumping Solutions
              </p>
              
              <div className="description-text">
                <p>
                  <strong>Laxmo Industries Pvt Ltd</strong> is a leading manufacturer and exporter based in Surat, Gujarat, specializing in comprehensive pumping and industrial solutions. With years of expertise in the industry, we deliver high-performance products that meet the diverse needs of domestic, agricultural, and industrial sectors.
                </p>
                
                <p>
                  Our diverse range spans across multiple categories including Water Pumps, Generators, Air Compressors, Vacuum Cleaners, High Pressure Washers, Pump Controllers, and Welding Machines. Each product undergoes meticulous testing to ensure optimal performance, earning us the trust of leading enterprises across India.
                </p>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;