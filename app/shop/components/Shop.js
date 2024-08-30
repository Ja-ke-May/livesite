"use client";

import { useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { AuthContext } from '@/utils/AuthContext';
import TokenPurchasePopup from './TokenPurchasePopup'; 
import { updateColor, deductTokens } from '@/utils/apiClient';

const Shop = () => {
  const { isLoggedIn, username, tokens } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/shop');
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [color, setColor] = useState('#ffffff'); 
  const [borderColor, setBorderColor] = useState('#000110'); 
  const [usernameColor, setUsernameColor] = useState('#ffffff');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedTokens, setSelectedTokens] = useState('');

  const handleBuyTokens = () => {
    setShowTokenPopup(true);
  };

  const closeTokenPopup = () => {
    setShowTokenPopup(false);
  };

  const handlePurchaseClick = (item, tokens) => {
    let selectedItemDetails = { name: item, color: '' };
    if (item === 'this Comment Colour') {
      selectedItemDetails.color = color;
    } else if (item === 'this Border Colour') {
      selectedItemDetails.color = borderColor;
    } else if (item === 'this Username Colour') {
      selectedItemDetails.color = usernameColor;
    }
    
    setSelectedItem(selectedItemDetails);
    setSelectedTokens(tokens);
    setShowConfirmation(true);
  };
  
  

  const closeConfirmationPopup = () => {
    setShowConfirmation(false);
  };

  
const confirmPurchase = async () => {
  setShowConfirmation(false);

  try {
    const { name, color } = selectedItem;

    // Determine the color type to update
    let colorType;
    if (name === 'this Comment Colour') {
      colorType = 'commentColor';
    } else if (name === 'this Border Colour') {
      colorType = 'borderColor';
    } else if (name === 'this Username Colour') {
      colorType = 'usernameColor';
    }

    // Call the API to update the user's color in the database
    await updateColor(username, colorType, color);

    // Handle token deduction or any other logic here
    await deductTokens(selectedTokens);

    alert(`Purchased ${name} for ${selectedTokens} tokens!`);
  } catch (error) {
    console.error('Failed to complete the purchase:', error);
    alert('Purchase failed. Please try again.');
  }
};

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        username={username}
      />
      <div className="max-w-4xl mx-auto p-4 mb-10">
        <h1 className='hidden mt-4 text-2xl font-bold text-center'>Shop</h1>
        {isLoggedIn && username && (
          <div>
            <h2 className="text-center text-yellow-400 brightness-125 mt-2">
              Your Tokens: {tokens}
            </h2>
          </div>
        )}

        {/* Buy Tokens */}
        {isLoggedIn && username && (
        <div className="mt-4 w-full flex items-center justify-center">
          <button
            onClick={handleBuyTokens}
            className="bg-yellow-400 font-black brightness-125 text-[#000110] px-4 py-2 rounded-md shadow-sm hover:bg-yellow-600"
          >
            Buy Tokens
          </button>
        </div>
 )}
        <hr className='mt-10' />

        {/* Comment Colour */}
        <div className="mt-10">
          <div className="bg-gray-800/80 p-1 lg:p-2 rounded-md shadow-md max-w-sm"
            style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}>
            <h3 className="text-lg font-semibold" style={{ color: usernameColor }}>Comment Colour</h3>
            <p className='mt-2' style={{ color: color }}>Select a colour to customise your comment text.</p>
          </div>
          <input
            type="color"
            id="commentColor"
            name="commentColor"
            className="block mt-4 h-10 w-10 rounded-md shadow-sm"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          {isLoggedIn && username && (
          <button
            className="mt-4 mb-5 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('this Comment Colour', 500)}
          >
            Purchase
          </button>
          )}
        </div>

        {/* Border Colour */}
        <div className='mt-4 text-right'>
          <div className="flex justify-end">
            <div 
              className="bg-gray-800/80 p-1 lg:p-2 rounded-md shadow-md max-w-sm text-right border" 
              style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}
            >
              <h3 className="text-lg font-semibold mb-1" style={{ color: usernameColor }}>Border Colour</h3>
              <p><span className='mt-2' style={{ color: color }}>Select a colour to customise your border.</span></p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <input
              type="color"
              id="borderColor"
              name="borderColor"
              className="h-10 w-10 rounded-md shadow-sm"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
            />
          </div>
          {isLoggedIn && username && (
          <button
            className="mt-4 mb-5 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('this Border Colour', 500)}
          >
            Purchase
          </button>
          )}
        </div>

        {/* Username Colour */}
        <div className="mt-4">
          <div className="bg-gray-800/80 p-1 lg:p-2 rounded-md shadow-md max-w-sm"
            style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}>
            <h3 className="text-lg font-semibold" style={{ color: usernameColor }}>Username Colour</h3>
            <p style={{ color: color }}>Select a colour to customise your username text.</p>
          </div>
          <input
            type="color"
            id="usernameColor"
            name="usernameColor"
            className="block mt-4 h-10 w-10 rounded-md shadow-sm"
            value={usernameColor}
            onChange={(e) => setUsernameColor(e.target.value)}
          />
          {isLoggedIn && username && (
          <button
            className="mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('this Username Colour', 500)}
          >
            Purchase
          </button>
          )}
        </div>

        <hr className='mt-10' />
       <p className='mt-4'>More coming soon...</p>
        
        <div className='hidden mt-10 text-right'>
          
              <h3 className="text-sm font-semibold"><span className='text-3xl'>Username</span> <span className='text-xl'>Text</span> Size</h3>
              <p><span className='mt-2'>Increase your username text size.</span></p>
            
       
              {isLoggedIn && username && (
          <button
            className="mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('Username Text Size Increase', 1000)}
          >
            Purchase
          </button>
              )}
        </div>

       
         <div className="hidden mt-10">
         
            <h3 className="text-3xl font-semibold">Comment <span className='text-xl'>Text</span> <span className='text-sm'>Size</span></h3>
            <p className='mt-2'>Increase your comment text size.</p>
          
            {isLoggedIn && username && (
          <button
            className="mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('Comment Text Size Increase', 1000)}
          >
            Purchase
          </button>
            )}
        </div>

        
        <div className="hidden mt-10 text-right">
        <h3 className="text-xl font-semibold" style={{ letterSpacing: '0.2em' }}>
    Comment Length Increase...
  </h3>
          <p>Increase the maximum length of your comments.</p>
          {isLoggedIn && username && (
          <button
            className="mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600"
            onClick={() => handlePurchaseClick('Comment Length Increase', 1000)}
          >
            Purchase
          </button>
          )}
          </div>
      </div> 
      

      {showTokenPopup && (
        <TokenPurchasePopup onClose={closeTokenPopup} />
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-[#000110] p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Purchase</h2>
            <p>Are you sure you want to purchase <strong style={{ color: selectedItem.color }}>   
              
          {` ${selectedItem.name} `}
        </strong>
          for <span className='text-yellow-400 brightness-125'><strong>{selectedTokens}</strong> tokens?</span></p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeConfirmationPopup}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="ml-2 mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-4 py-2 rounded-md shadow-sm hover:bg-yellow-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
