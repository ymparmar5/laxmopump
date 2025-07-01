import React, { useState, useEffect } from 'react';
import HeroSection from '../Components/HeroSection';
import Category from '../Components/Category';
import HomeProductCard from '../Components/HomeProductCard';
import Popup from '../Components/Popup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show popup once per session
      if (hasShownPopup) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight * 100;
      
      // Show popup when user scrolls 40% of the page
      if (scrollPercentage > 40) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownPopup]);

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