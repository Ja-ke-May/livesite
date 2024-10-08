import React from 'react';

const MyMeLogo = ({ isDarkBackground }) => {
  const logoColor = isDarkBackground ? 'text-white' : 'text-[#000110]';

  return (
    <a href="/" className={`fixed top-0 left-0 ${logoColor}  font-black flex items-center pt-1 pl-1 md:pt-2 md:pr-4 md:pb-4 md:pl-4 z-[100]`}>
      <div className="flex items-center justify-center">
        <p className="text-5xl">M</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl leading-none">Y</p>
        <p className="text-xl leading-none">E</p>
      </div>
    </a>
  );
};

export default MyMeLogo;
