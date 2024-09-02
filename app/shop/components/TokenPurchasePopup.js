import React from 'react';

const TokenPurchasePopup = ({ onClose, username }) => {
  
  const tokenOptions = [
    { amount: 400, price: '£9.99', url: `https://buy.stripe.com/9AQ4he2zAdPBbiE9AA?client_reference_id=${username}` },
    { amount: 1000, price: '£19.99', url: `https://buy.stripe.com/3cs152deeaDpeuQ3cd?client_reference_id=${username}` },   
    { amount: 2000, price: '£29.99', url: `https://buy.stripe.com/dR6dROfmm7rd3Qc7su?client_reference_id=${username}` },
    { amount: 4000, price: '£49.99', url: `https://buy.stripe.com/dR67tq3DE9zlgCY5kn?client_reference_id=${username}` },
    { amount: 10000, price: '£99.99', url: `https://buy.stripe.com/cN200Ygqq4f186s9AE?client_reference_id=${username}` },
];


  return (
    <div className="fixed inset-0 bg-[#000110] bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-[#000110] p-6 rounded-md shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-2 text-center">Buy Tokens</h2>
        <p className='m-2 bg-yellow-400 brightness-125 rounded text-[#000110] font-black text-center'>
          LAUNCH OFFER! <br /> DOUBLE TOKENS!
        </p>
        <ul className='mt-4'>
          {tokenOptions.map((option, index) => (
            <li key={index} className="m-4 flex justify-between">
              <span className='text-yellow-400 brightness-125'>
                <span className='line-through text-yellow-400'>{option.amount / 2} Tokens</span> <br />
                {option.amount} Tokens <br />
                <span className='text-white'>{option.price}</span>
              </span>
              <a 
                href={option.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 bg-yellow-400 font-bold text-[#000110] brightness-125 px-1 py-1 rounded-md shadow-sm hover:bg-yellow-600 flex justify-center items-center text-center"
              >
                Buy
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenPurchasePopup;
