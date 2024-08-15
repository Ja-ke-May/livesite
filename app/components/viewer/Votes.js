import React, { useState, useEffect } from 'react';


const Votes = ({ stopVideo, slidePosition, slidePositionAmount, setSlidePosition, setSlidePositionAmount, liveUserId, triggerOverlay, socket, isInteractive }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [stars, setStars] = useState([]);
  const [clickedIcon, setClickedIcon] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit('request-current-position');

      socket.on('vote-update', (newPosition) => {
        setSlidePosition(newPosition);
      });

      socket.on('current-position', (currentPosition) => {
        if (currentPosition !== null && currentPosition !== undefined) {
          setSlidePosition(currentPosition);
        } else {
          setSlidePosition(50);
        }
      });

      socket.on('current-slide-amount', (currentSlideAmount) => {
        setSlidePositionAmount(currentSlideAmount);
      });

      socket.on('go-live', () => {
        setSlidePosition(50);
        setSlidePositionAmount(5);
      });

      return () => {
        socket.off('vote-update');
        socket.off('current-position');
        socket.off('current-slide-amount');
        socket.off('go-live');
      };
    }
  }, [socket, setSlidePosition, setSlidePositionAmount]);

  const handleClickCross = () => {
    if (!isInteractive) return;
    const newPosition = Math.max(slidePosition - slidePositionAmount, 0);
    setSlidePosition(newPosition);
    setClickedIcon('cross');
    triggerPulse();
    socket.emit('vote', newPosition);
  };

  const handleClickStar = () => {
    if (!isInteractive) return;
    let newPosition = Math.min(slidePosition + slidePositionAmount, 100);
    setSlidePosition(newPosition);
    setClickedIcon('star');
    triggerPulse();
    socket.emit('vote', newPosition);

    if (newPosition === 100) {
      setSlidePositionAmount(prevAmount => prevAmount / 2); 
      socket.emit('timer-update', liveUserId, 60);
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
      triggerOverlay('❌'); // Trigger overlay with red cross
      stopVideo();
      setSlidePosition(50);
      socket.emit('stop-video');
    } else if (slidePosition === 100) {
      setSlidePosition(50);
      triggerStars();
    }
  }, [slidePosition, stopVideo, setSlidePosition, triggerOverlay]);

  const triggerStars = () => {
    setStars([]);
    for (let i = 0; i < 6; i++) {
      const delay = i * 150;
      setTimeout(() => {
        const left = `${Math.random() * 90}%`;
        setStars((prevStars) => [...prevStars, { left }]);
      }, delay);
    }

    setTimeout(() => {
      setStars([]);
    }, 2000);
  };

  if (!liveUserId) {
    return <div className='mt-2'>Nobody's live at the moment</div>;
  }

  return (
    <div className="mt-1 w-full text-center flex justify-between items-center relative">
      <span
        className={`text-red-700 text-2xl pl-2 md:pl-10 brightness-125 cursor-pointer ${isPulsing && clickedIcon === 'cross' ? 'animate-pulse' : ''}`}
        onClick={isInteractive ? handleClickCross : null}
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
        onClick={isInteractive ? handleClickStar : null}
      >
        ⭐
      </span>

      {/* Falling Stars */}
      {stars.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
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