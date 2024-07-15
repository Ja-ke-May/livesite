import { useState } from 'react';

const Votes = () => {
  const [slidePosition, setSlidePosition] = useState(50); // Start position in the center (50 for 50%)

  // Function to handle click on red cross
  const handleClickCross = () => {
    if (slidePosition >= 0.5) {
      setSlidePosition(slidePosition - 0.5);
    } else {
      setSlidePosition(0);
    }
  };

  // Function to handle click on yellow star
  const handleClickStar = () => {
    if (slidePosition <= 99.5) {
      setSlidePosition(slidePosition + 0.5);
    } else {
      setSlidePosition(100);
    }
  };

  return (
    <div className="mt-4 w-full text-center flex justify-between items-center">
      <span className="text-red-700 text-2xl pl-2 md:pl-10 cursor-pointer" onClick={handleClickCross}>
        &#10060;
      </span> {/* Red cross */}
      <div className="flex-1 ml-2">
        <div className="flex justify-center items-center relative">
          <div className="h-4 w-full bg-gradient-to-r from-red-700 to-yellow-400"></div> {/* Gradient bar */}
          <div
            className="mt-2 h-6 md:h-10 bg-white w-2 md:w-4 border border-black absolute top-0 transform -translate-y-2/4 left-0"
            style={{
              left: `calc((100% - 4px) * ${slidePosition / 100})`
            }}
          ></div>
          {/* Sliding bar */}
        </div>
      </div>
      <span className="text-yellow-400 text-3xl pr-2 md:pr-10 cursor-pointer" onClick={handleClickStar}>
        &#11088;
      </span> {/* Yellow star */}
    </div>
  );
};

export default Votes;
