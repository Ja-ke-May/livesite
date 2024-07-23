import React, { useState } from 'react';
import './menu.css';

const MenuIcon = ({ onMenuToggle, isDarkBackground }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleContainerClick = () => {
    onMenuToggle();
    setIsClicked(prevState => !prevState);
  };

  const logoColor = isDarkBackground ? 'bg-white' : 'bg-[#000110]';

  return (
    <button
      id='menu-icon'
      className="items-center fixed top-0 right-0 md:right-2 font-mono z-50"
      onClick={handleContainerClick}
    >
      <div
        className={`w-[40px] md:w-[60px] h-2 ${logoColor} m-2 md:mt-3 rounded-full ${isClicked ? 'top-animation' : 'top-animation-reverse'}`}
      ></div>
      <div className={`w-[40px] md:w-[60px] h-2 ${logoColor} m-2 rounded-full`}></div>
      <div
        className={`w-[40px] md:w-[60px] h-2 ${logoColor} m-2 rounded-full ${isClicked ? 'bottom-animation' : 'bottom-animation-reverse'}`}
      ></div>
    </button>
  );
};



export default MenuIcon;
