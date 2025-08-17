import React from 'react';
import { createCheckout } from '@/utils/apiClient';

const TokenPurchasePopup = ({ onClose, username }) => {
  const tokenOptions = [
    { amount: 400, price: '£9.99', sku: 'tokens_400' },
    { amount: 2000, price: '£29.99', sku: 'tokens_2000' },
    { amount: 10000, price: '£99.99', sku: 'tokens_10000' },
    { amount: 150000, price: '£499.99', sku: 'tokens_150000' },
    { amount: 400000, price: '£999.99', sku: 'tokens_400000' },
    { amount: 1000000, price: '£1999.99', sku: 'tokens_1000000' },
    
  ];

  const handleBuy = async (sku) => {
    try {
      const data = await createCheckout(sku, username);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Sorry, something went wrong creating your checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000110] bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-[#000110] p-6 rounded-md shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-2 text-center">Buy Tokens</h2>
        <p className="m-2 bg-yellow-400 brightness-125 rounded text-[#000110] font-black text-center">
          SPECIAL OFFER! <br /> DOUBLE TOKENS!
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-4">
          {tokenOptions.map((option, index) => (
            <li key={index} className="m-4 flex justify-between">
              <span className="text-yellow-400 brightness-125">
                <span className="line-through text-yellow-400">
                  {option.amount / 2} Tokens
                </span>{' '}
                <br />
                {option.amount} Tokens <br />
                <span className="text-white">{option.price}</span>
              </span>
              <button
                onClick={() => handleBuy(option.sku)}
                className="ml-2 bg-yellow-400 font-bold text-[#000110] brightness-125 px-1 py-1 rounded-md shadow-sm hover:bg-yellow-600 flex justify-center items-center text-center"
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={onClose}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchasePopup;