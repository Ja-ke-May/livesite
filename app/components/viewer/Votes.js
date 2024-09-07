import React, { useState, useEffect, useRef } from 'react'; 
import { deductTokens, awardTokens } from '@/utils/apiClient';

const Votes = ({ slidePosition, slidePositionAmount, setSlidePosition, setSlidePositionAmount, liveUserId, socket, isInteractive, username, nextUsername, stopVideo, isBlocked }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [stars, setStars] = useState([]);
  const [clickedIcon, setClickedIcon] = useState(null);
  const [hasVoted, setHasVoted] = useState(false); 
  const [showBuyVotePrompt, setShowBuyVotePrompt] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const previousLiveUserIdRef = useRef(null);

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

       socket.on('reset-votes', () => {
        setHasVoted(false); 
      });

      return () => {
        socket.off('vote-update');
        socket.off('current-position');
        socket.off('current-slide-amount');
        socket.off('go-live');
        socket.off('reset-votes');
      };
    }
  }, [socket, setSlidePosition, setSlidePositionAmount]);

  useEffect(() => {
    if (liveUserId === null) {
        setSlidePosition(50);
        setSlidePositionAmount(5);
    } else if (liveUserId) {
        setClickedIcon(null);
        setHasVoted(false);
        setIsPulsing(false);
    }
}, [liveUserId, setSlidePosition, setSlidePositionAmount]);

  const handleClickCross = () => {
    if (!isInteractive || isBlocked) return;
    if (hasVoted) {
      promptBuyVote();
    } else {
      const newPosition = Math.max(slidePosition - slidePositionAmount, 0);
      setSlidePosition(newPosition);
      setClickedIcon('cross');
      triggerPulse();
      socket.emit('vote', newPosition);
      setHasVoted(true);
    }
  };

  const handleClickStar = () => {
    if (!isInteractive || isBlocked) return;
    if (hasVoted) {
      promptBuyVote();
    } else {
      let newPosition = Math.min(slidePosition + slidePositionAmount, 100);
      setSlidePosition(newPosition);
      setClickedIcon('star');
      triggerPulse();
      socket.emit('vote', newPosition);
      setHasVoted(true);

      if (newPosition >= 100) {
        setSlidePositionAmount(prevAmount => prevAmount / 2); 
        socket.emit('timer-update', liveUserId, 60);
        setHasVoted(false);
        handleRewardUser();
      }
    }
  };

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
    }, 1000);
  };

  const promptBuyVote = () => {
    setShowBuyVotePrompt(true);
  };

  const handleBuyVote = async () => {
    
    try {
      setLoading(true);
      await deductTokens(10); 
      setShowBuyVotePrompt(false); 
      setHasVoted(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to deduct tokens:', error);
    }
  };

  useEffect(() => {
    if (slidePosition === 0) {
     
      setSlidePosition(50);
      stopVideo(true);

      if (previousLiveUserIdRef.current === username && nextUsername !== username) {
        
            window.location.reload();
       
    }
    } else if (slidePosition === 100) {
      setSlidePosition(50);
      triggerStars();
    }
    previousLiveUserIdRef.current = liveUserId;
  }, [slidePosition, setSlidePosition, socket, username, liveUserId, nextUsername, stopVideo]);

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

  const handleRewardUser = async () => {
    if (liveUserId) {
      try {
        await awardTokens(liveUserId, 100);
        console.log(`Sent 100 tokens to ${liveUserId}`);
      } catch (error) {
        console.error('Failed to award tokens:', error);
      }
    }
  };

  if (!liveUserId) {
    return <div className='mt-2'></div>;
  }

  if (showBuyVotePrompt) {
    return (
      <div className="mt-2">
        <div className="flex justify-center items-center">
          <span>Buy 1 vote for 10 tokens?</span>

          <button
            className="hover:bg-blue-700 text-white px-1 ml-2 rounded-md shadow-sm bg-[#0000110] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 max-w-[50%]"
            onClick={() => setShowBuyVotePrompt(false)}
          >
            No
          </button>

          <button
            className={`hover:bg-yellow-400 hover:text-[#000110] px-1 ml-1 rounded-md shadow-sm bg-[#0000110] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] brightness-125 ${loading ? 'animate-pulse bg-yellow-400 text-[#000110]' : ''}`}
            onClick={handleBuyVote}
          >
            Yes
          </button>
          
        </div>
      </div>
    );
  }


  return (
    <div className="mt-1 w-full text-center flex justify-between items-center relative">
      <span
        className={`text-red-700 text-2xl pl-2 md:pl-10 brightness-125 cursor-pointer ${isPulsing && clickedIcon === 'cross' ? 'animate-pulse' : ''} ${isInteractive ? 'opacity-100' : 'opacity-50'}`}
        onClick={isInteractive ? handleClickCross : null}
      >
        ❌
      </span>
      <div className="flex-1 ml-2">
        <div className="flex justify-center items-center relative">
          <div className="h-4 w-full bg-gradient-to-r from-red-700 to-yellow-400 brightness-125 rounded"></div>
          <div
            className="mt-2 h-6 md:h-10 bg-white rounded w-2 md:w-4 border border-black absolute top-0 transform -translate-y-2/4 transition-all duration-200 linear"
            style={{ left: `calc((100% - 4px) * ${slidePosition / 100})` }}
          ></div>
        </div>
      </div>
      <span
        className={`text-yellow-400 brightness-125 text-3xl pl-2 pr-2 md:pr-10 cursor-pointer ${isPulsing && clickedIcon === 'star' ? 'animate-pulse' : ''} ${isInteractive ? 'opacity-100' : 'opacity-50'}`}
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
