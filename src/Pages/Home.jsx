import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../Components/HeroSection';
import Category from '../Components/Category';
import HomeProductCard from '../Components/HomeProductCard';
import Popup from '../Components/Popup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const hasShownPopup = useRef(false); // useRef prevents re-renders

  useEffect(() => {
    const handleScroll = () => {
      if (hasShownPopup.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

    
    };

    const timer = setTimeout(() => {
      if (!hasShownPopup.current) {
        setShowPopup(true);
        hasShownPopup.current = true;
      }
    }, 30000);

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="main-content min-h-screen">
      <HeroSection />
      <Category />  
      <HomeProductCard />
      <Popup isVisible={showPopup} onClose={handleClosePopup} />
      {/* <HomeAbout /> */}
      {/* <Testimonial /> */}
    </div>
  );
};

export default Home;
