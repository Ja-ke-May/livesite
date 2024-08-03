import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const Votes = ({ stopVideo }) => {
  const [slidePosition, setSlidePosition] = useState(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState(null);
  const [stars, setStars] = useState([]);
  const [clickedIcon, setClickedIcon] = useState(null);
  const [slidePositionAmount, setSlidePositionAmount] = useState(5);

  useEffect(() => {
    // Request the current slide position and amount from the server
    socket.emit('request-current-position');

    socket.on('vote-update', (newPosition) => {
      setSlidePosition(newPosition);
    });

    socket.on('current-position', (currentPosition) => {
      setSlidePosition(currentPosition);
    });

    socket.on('current-slide-amount', (currentSlideAmount) => {
      setSlidePositionAmount(currentSlideAmount);
    });

    socket.on('go-live', () => {
      setSlidePosition(50); // Initialize the vote position to 50 when 'GO LIVE' is clicked
    });

    return () => {
      socket.off('vote-update');
      socket.off('current-position');
      socket.off('current-slide-amount');
      socket.off('go-live');
    };
  }, []);

  const handleClickCross = () => {
    const newPosition = Math.max(slidePosition - slidePositionAmount, 0);
    setSlidePosition(newPosition);
    setClickedIcon('cross');
    triggerPulse();
    socket.emit('vote', newPosition);
  };

  const handleClickStar = () => {
    let newPosition = Math.min(slidePosition + slidePositionAmount, 100);
    setSlidePosition(newPosition);
    setClickedIcon('star');
    triggerPulse();
    socket.emit('vote', newPosition);

    if (newPosition === 100) {
      setSlidePositionAmount(prevAmount => prevAmount / 2);
    }
  };

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
    }, 1000);
  };

  useEffect(() => {
    if (slidePosition === 0) {
      setShowOverlay(true);
      setOverlayIcon('❌');
      stopVideo();
      socket.emit('stop-video');
      

      setTimeout(() => {
        setSlidePosition(null);
        setShowOverlay(false);
        setStars([]);
      }, 2000);

      

    } else if (slidePosition === 100) {
      setShowOverlay(true);
      setSlidePosition(50);
      setOverlayIcon(null);
      socket.emit('extend-timer', 60);

      for (let i = 0; i < 6; i++) {
        const delay = i * 150;
        setTimeout(() => {
          const left = `${Math.random() * 100}%`;
          setStars((prevStars) => [...prevStars, { left }]);
        }, delay);
      }

      setTimeout(() => {
        setShowOverlay(false);
        setStars([]);
      }, 2000);
    }
  }, [slidePosition, stopVideo]);

  if (slidePosition === null) {
    return <div>Nobody's live at the moment</div>;
  }

  return (
    <div className="mt-1 w-full text-center flex justify-between items-center relative">
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {overlayIcon ? (
            <span className="text-red-700 text-9xl animate-pulse">{overlayIcon}</span>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {stars.map((star, index) => (
                <span
                  key={index}
                  className="brightness-125 text-3xl absolute"
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
        className={`text-red-700 text-2xl pl-2 md:pl-10 brightness-125 cursor-pointer ${isPulsing && clickedIcon === 'cross' ? 'animate-pulse' : ''}`}
        onClick={handleClickCross}
      >
        ❌
      </span>
      <div className="flex-1 ml-2">
        <div className="flex justify-center items-center relative">
          <div className="h-4 w-full bg-gradient-to-r from-red-700 to-yellow-400 brightness-125 rounded"></div>
          <div
            className="mt-2 h-6 md:h-10 bg-white rounded w-2 md:w-4 border border-black absolute top-0 transform -translate-y-2/4"
            style={{ left: `calc((100% - 4px) * ${slidePosition / 100})` }}
          ></div>
        </div>
      </div>
      <span
        className={`text-yellow-400 brightness-125 text-3xl pl-2 pr-2 md:pr-10 cursor-pointer ${isPulsing && clickedIcon === 'star' ? 'animate-pulse' : ''}`}
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
