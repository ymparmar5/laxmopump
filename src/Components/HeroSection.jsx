import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../FireBase/FireBaseConfig';
import '../Style/HeroSection.css';
import toast from 'react-hot-toast';

const HeroSection = () => {
  const [slides, setSlides] = useState(() => {
    const cached = localStorage.getItem("heroSlides");
    return cached ? JSON.parse(cached) : [];
  });
  const [slideIndex, setSlideIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "Images"));
      const home = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = { id: docSnapshot.id, ...docSnapshot.data() };
        if (data.type === "home") home.push(data);
      });

      home.sort((a, b) => b.time?.seconds - a.time?.seconds);

      if (home.length > 0) {
        const latest = home[0];
        const dynamicSlides = [];

        for (let i = 1; i <= 5; i++) {
          const key = `imgurl${i}`;

          if (latest[key]) {
            dynamicSlides.push({
              src: `${latest[key]}?f_auto,q_auto:best,w_1920,h_800,c_fill`,
              placeholder: `${latest[key]}?f_auto,q_auto:low,w_40,h_20,c_fill`,
              name: `Slide ${i}`,
            });
          }
        }

        setSlides(dynamicSlides);
        localStorage.setItem("heroSlides", JSON.stringify(dynamicSlides));

      }
    } catch (error) {

      console.error("Image fetch error:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) return null; // or loading indicator

  return (
    <div id="hero">
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="hero-bannerSlides fade"
            style={{ display: index === slideIndex ? 'block' : 'none' }}
          >
          
          

               <img
              className={`banner ${loadedImages[index] ? "loaded" : "loading"}`}
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              onLoad={() =>
                setLoadedImages((prev) => ({ ...prev, [index]: true }))
              }
              style={{
                backgroundImage: `url(${slide.placeholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: loadedImages[index] ? "blur(0px)" : "blur(20px)",
                transition: "filter 0.5s ease-out",
              }}
            />
          </div>
        ))}
      </div>

      <br />
      <div style={{ textAlign: 'center', height: '0px' }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === slideIndex ? 'active' : ''}`}
            onClick={() => setSlideIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
