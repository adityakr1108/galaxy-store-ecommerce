
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { database, PromoBanner } from '@/lib/database';
import { useTheme } from '@/contexts/ThemeContext';

export const BannerCarousel: React.FC = () => {
  const { theme } = useTheme();
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const activeBanners = database.getActivePromoBanners();
    setBanners(activeBanners);
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary mb-12 shadow-2xl">
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-black/20' : 'bg-black/40'}`} />
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <div className="text-center">
            <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${
              theme === 'light' ? 'text-white drop-shadow-lg' : 'text-white'
            }`}>
              Welcome to <span className="text-gradient">Galaxy Store</span>
            </h2>
            <p className={`text-xl md:text-2xl mb-8 ${
              theme === 'light' ? 'text-white/90 drop-shadow-lg' : 'text-gray-200'
            }`}>
              Your cosmic shopping destination
            </p>
            <Button asChild className="btn-primary text-lg px-8 py-4">
              <Link to="/shop">
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden mb-12 shadow-2xl">
      <div className="absolute inset-0">
        {currentBanner.imageUrl ? (
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary via-primary/80 to-primary" />
        )}
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-black/30' : 'bg-black/50'}`} />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="text-center max-w-4xl">
          <h2 className={`text-4xl md:text-6xl font-bold mb-4 animate-fade-in ${
            theme === 'light' ? 'text-white drop-shadow-2xl' : 'text-white'
          }`}>
            {currentBanner.title}
          </h2>
          <p className={`text-xl md:text-2xl mb-8 animate-fade-in ${
            theme === 'light' ? 'text-white/95 drop-shadow-lg' : 'text-gray-200'
          }`}>
            {currentBanner.description}
          </p>
          {currentBanner.link && (
            <Button asChild className="btn-primary text-lg px-8 py-4 animate-scale-in">
              <Link to={currentBanner.link}>
                Shop Now
              </Link>
            </Button>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-900 hover:bg-white/90 shadow-lg' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-900 hover:bg-white/90 shadow-lg' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? theme === 'light' 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white scale-125'
                    : theme === 'light' 
                      ? 'bg-white/60 hover:bg-white/80 shadow-md' 
                      : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
