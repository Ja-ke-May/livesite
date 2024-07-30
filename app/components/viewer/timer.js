import React, { useEffect, useRef, useState } from "react";

const Timer = ({ isActive, onTimeout }) => {
  const [timer, setTimer] = useState(60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isActive]);

  const startTimer = () => {
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => onTimeout(), 0);  // Schedule onTimeout call outside render phase
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="bg-[#000110]/20 z-[100] text-white text-md md:text-md">
      {timer}s
    </div>
  );
};

export default Timer;
