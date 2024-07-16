import React, { useState, useEffect } from 'react';

const Votes = () => {
  const [slidePosition, setSlidePosition] = useState(50);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState(null);
  const [stars, setStars] = useState([]);

  const handleClickCross = () => {
    if (slidePosition >= 0.5) {
      setSlidePosition(slidePosition - 0.5);
    } else {
      setSlidePosition(0);
    }
  };

  const handleClickStar = () => {
    if (slidePosition <= 99.5) {
      setSlidePosition(slidePosition + 0.5);
    } else {
      setSlidePosition(100);
    }
  };

  useEffect(() => {
    if (slidePosition === 0 || slidePosition === 100) {
      setIsPulsing(true);
      setShowOverlay(true);

      if (slidePosition === 0) {
        setOverlayIcon('❌');
      } else {
        setOverlayIcon(null);

        for (let i = 0; i < 10; i++) {
          const delay = i * 150; 
          setTimeout(() => {
            const left = `${Math.random() * 100}%`;
            setStars((prevStars) => [...prevStars, { left }]);
          }, delay);
        }
      }

      setTimeout(() => {
        setIsPulsing(false);
        setShowOverlay(false);
        setStars([]); // Clear stars after animation
      }, 2000); // Adjust timing as needed
    }
  }, [slidePosition]);

  return (
    <div className="mt-4 w-full text-center flex justify-between items-center relative">
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {overlayIcon ? (
            <span className="text-red-700 text-9xl animate-pulse">{overlayIcon}</span>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {stars.map((star, index) => (
                <span
                  key={index}
                  className="text-yellow-400 text-3xl absolute"
                  style={{
                    left: star.left,
                    animation: `fall-${index} 2s linear forwards`,
                    zIndex: 100 - index,
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <span
        className={`text-red-700 text-2xl pl-2 md:pl-10 cursor-pointer ${isPulsing ? 'animate-pulse' : ''}`}
        onClick={handleClickCross}
      >
        ❌
      </span>
      <div className="flex-1 ml-2">
        <div className="flex justify-center items-center relative">
          <div className="h-4 w-full bg-gradient-to-r from-red-700 to-yellow-400 rounded"></div>
          <div
            className="mt-2 h-6 md:h-10 bg-white rounded w-2 md:w-4 border border-black absolute top-0 transform -translate-y-2/4 left-0"
            style={{ left: `calc((100% - 4px) * ${slidePosition / 100})` }}
          ></div>
        </div>
      </div>
      <span
        className={`text-yellow-400 text-3xl pl-2 pr-2 md:pr-10 cursor-pointer ${isPulsing ? 'animate-pulse' : ''}`}
        onClick={handleClickStar}
      >
        ⭐
      </span>

      {/* CSS for animations */}
      <style>
        {stars.map((_, index) => (
          `@keyframes fall-${index} {
            0% {
              transform: translateY(-100vh);
            }
            100% {
              transform: translateY(100vh);
            }
          }`
        ))}
      </style>
    </div>
  );
};

export default Votes;
