import React, { useEffect, useRef, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../FireBase/FireBaseConfig';
import '../Style/HeroSection.css';

/**
 * Ultra-optimized HeroSection with seamless loading and fixed slider
 * Key improvements:
 * - Instant display with cached data
 * - Fixed slider functionality 
 * - Removed loading text
 * - Critical resource prioritization
 * - Memory efficient with proper cleanup
 * - Smooth transitions without interruption
 */

const LS_SLIDES_KEY = 'heroSlides';
const LS_LOADED_KEY = 'heroLoadedImages';
const LS_CACHE_TIME_KEY = 'heroCacheTime';
const SLIDE_INTERVAL_MS = 8000;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour for better performance
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// Optimized utility functions
const safeJSONParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeJSONWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
};

const isCacheValid = () => {
  try {
    const cacheTime = localStorage.getItem(LS_CACHE_TIME_KEY);
    return cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION;
  } catch {
    return false;
  }
};

const compareSlides = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((slide, i) => slide?.src === b[i]?.src);
};

const HeroSection = () => {
  // Initialize with cached data immediately for instant display
  const [slides, setSlides] = useState(() => safeJSONParse(LS_SLIDES_KEY, []));
  const [slideIndex, setSlideIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(() => safeJSONParse(LS_LOADED_KEY, {}));
  const [isReady, setIsReady] = useState(false);

  // Refs for cleanup and performance
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const preloadCache = useRef(new Map());
  const isMountedRef = useRef(true);
  const currentSlideRef = useRef(0);
  const loadingStatesRef = useRef(new Set());

  // Keep slide ref in sync
  useEffect(() => {
    currentSlideRef.current = slideIndex;
  }, [slideIndex]);

  // Optimized image preloader with immediate resolution for cached images
  const preloadImage = useCallback((src, index, priority = false) => {
    if (!src || !isMountedRef.current) return Promise.resolve(false);
    
    // Check if already loaded
    if (loadedImages[index]) return Promise.resolve(true);
    
    // Check cache
    const cacheKey = `${src}-${index}`;
    if (preloadCache.current.has(cacheKey)) {
      return preloadCache.current.get(cacheKey);
    }

    const promise = new Promise((resolve) => {
      const img = new Image();
      
      // Set high priority for critical images
      if (priority) {
        img.fetchPriority = 'high';
        img.loading = 'eager';
      }

      img.onload = () => {
        if (!isMountedRef.current) return resolve(true);
        
        setLoadedImages(prev => {
          const updated = { ...prev, [index]: true };
          safeJSONWrite(LS_LOADED_KEY, updated);
          return updated;
        });
        loadingStatesRef.current.delete(index);
        resolve(true);
      };

      img.onerror = () => {
        loadingStatesRef.current.delete(index);
        resolve(false);
      };

      loadingStatesRef.current.add(index);
      img.src = src;
    });

    preloadCache.current.set(cacheKey, promise);
    return promise;
  }, [loadedImages]);

  // Fast initial setup
  useEffect(() => {
    const initializeHero = () => {
      // If we have cached slides, show them immediately
      if (slides.length > 0) {
        setIsReady(true);
        
        // Preload current image with highest priority
        const currentSlide = slides[currentSlideRef.current];
        if (currentSlide?.src) {
          preloadImage(currentSlide.src, currentSlideRef.current, true);
        }
        
        // Start slideshow immediately if cache is valid
        if (isCacheValid()) {
          startSlideshow();
          // Preload remaining images in background
          slides.forEach((slide, i) => {
            if (i !== currentSlideRef.current) {
              setTimeout(() => preloadImage(slide.src, i), i * 200);
            }
          });
          return;
        }
      }

      // Fetch fresh data from Firestore
      fetchImages();
    };

    initializeHero();
  }, []); // Only run once

  // Optimized Firestore fetch
  const fetchImages = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

      const querySnapshot = await getDocs(collection(fireDB, 'Images'));
      clearTimeout(timeoutId);

      const homeImages = [];
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.type === 'home') homeImages.push(data);
      });

      if (homeImages.length === 0) {
        setIsReady(true);
        return;
      }

      // Get latest images
      homeImages.sort((a, b) => (b?.time?.seconds || 0) - (a?.time?.seconds || 0));
      const latest = homeImages[0];
      
      const newSlides = [];
      for (let i = 1; i <= 5; i++) {
        const imgUrl = latest[`imgurl${i}`];
        if (imgUrl) {
          newSlides.push({
            src: `${imgUrl}?f_auto,q_auto:best,w_1920,h_800,c_fill`,
            placeholder: `${imgUrl}?f_auto,q_auto:low,w_40,h_20,c_fill`,
            name: `Slide ${i}`,
          });
        }
      }

      const hasChanged = !compareSlides(newSlides, slides);
      
      if (hasChanged || !isCacheValid()) {
        setSlides(newSlides);
        safeJSONWrite(LS_SLIDES_KEY, newSlides);
        safeJSONWrite(LS_CACHE_TIME_KEY, Date.now().toString());

        if (hasChanged) {
          setLoadedImages({});
          safeJSONWrite(LS_LOADED_KEY, {});
          preloadCache.current.clear();
        }

        // Priority load current slide
        if (newSlides[currentSlideRef.current]?.src) {
          await preloadImage(newSlides[currentSlideRef.current].src, currentSlideRef.current, true);
        }
      }

      setIsReady(true);
      startSlideshow();

      // Preload remaining images
      newSlides.forEach((slide, i) => {
        if (i !== currentSlideRef.current) {
          setTimeout(() => preloadImage(slide.src, i), i * 150);
        }
      });

    } catch (error) {
      console.warn('Failed to fetch images:', error);
      setIsReady(true);
      if (slides.length > 0) startSlideshow();
    }
  }, [slides, preloadImage]);

  // Slideshow controls
  const startSlideshow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setSlideIndex(prev => {
          const nextIndex = (prev + 1) % slides.length;
          // Preload next image
          const nextSlide = slides[(nextIndex + 1) % slides.length];
          if (nextSlide?.src) {
            preloadImage(nextSlide.src, (nextIndex + 1) % slides.length);
          }
          return nextIndex;
        });
      }, SLIDE_INTERVAL_MS);
    }
  }, [slides, preloadImage]);

  const stopSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle manual slide change
  const handleSlideChange = useCallback((index) => {
    if (index === slideIndex) return; // Avoid unnecessary changes
    
    stopSlideshow();
    setSlideIndex(index);
    
    // Preload selected slide immediately
    const selectedSlide = slides[index];
    if (selectedSlide?.src) {
      preloadImage(selectedSlide.src, index, true);
    }
    
    // Restart slideshow after brief delay
    timeoutRef.current = setTimeout(startSlideshow, 100);
  }, [slideIndex, slides, preloadImage, startSlideshow, stopSlideshow]);

  // Visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSlideshow();
      } else if (isReady && slides.length > 1) {
        startSlideshow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isReady, slides.length, startSlideshow, stopSlideshow]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      preloadCache.current.clear();
    };
  }, []);

  // Don't render anything if no slides (seamless loading)
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div id="hero">
      <div className="slideshow-container">
        {slides.map((slide, index) => {
          const isLoaded = loadedImages[index];
          const isActive = index === slideIndex;
          const shouldShowBlur = !isLoaded && loadingStatesRef.current.has(index);

          return (
            <img
              key={`slide-${index}-${slide.src.split('?')[0].split('/').pop()}`}
              className={`hero-fade ${isActive ? 'loaded' : ''}`}
              src={isLoaded ? slide.src : slide.placeholder}
              alt={slide.name}
              loading={index <= 1 ? 'eager' : 'lazy'} // Eager load first 2 slides
              decoding={index === slideIndex ? 'sync' : 'async'}
              style={{
                filter: shouldShowBlur ? 'blur(20px)' : 'blur(0px)',
                transition: 'filter 0.2s ease-out',
              }}
              onLoad={() => {
                if (!isLoaded) {
                  setLoadedImages(prev => {
                    const updated = { ...prev, [index]: true };
                    safeJSONWrite(LS_LOADED_KEY, updated);
                    return updated;
                  });
                }
              }}
            />
          );
        })}
      </div>

      <br />
      <div style={{ textAlign: 'center', height: '0px' }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === slideIndex ? 'active' : ''}`}
            onClick={() => handleSlideChange(index)}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSlideChange(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;