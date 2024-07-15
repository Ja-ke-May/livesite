// components/CustomComponent.js
import React from 'react';

const MyMeLogo = () => {
  return (
    <div className="absolute top-0 left-0 flex items-center text-[#000110] pt-4 md:pt-5 md:pr-4 md:pb-4 md:pl-4">
      <div className="flex items-center justify-center">
        <p className="text-5xl font-black">M</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-black leading-none">Y</p>
        <p className="text-xl font-black leading-none">E</p>
      </div>
    </div>
  );
};

export default MyMeLogo;
