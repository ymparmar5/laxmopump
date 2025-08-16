import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../Components/HeroSection';
import Category from '../Components/Category';
import HomeProductCard from '../Components/HomeProductCard';
import Popup from '../Components/Popup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const hasShownPopup = useRef(
    localStorage.getItem('hasShownPopup') === 'true'
  );

  useEffect(() => {
    if (hasShownPopup.current) return;

    // Show popup after 30s
    const timer = setTimeout(() => {
      setShowPopup(true);
      hasShownPopup.current = true;
      localStorage.setItem('hasShownPopup', 'true'); // persist
    }, 30000);

    return () => clearTimeout(timer);
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
    </div>
  );
};

export default Home;
