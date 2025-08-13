import React from 'react';

const TokenPurchasePopup = ({ onClose, username }) => {
  // Replace with your actual Xsolla project ID
  const PROJECT_ID = 286753;
  const RETURN_URL = 'https://myme.live/shop';

  const tokenOptions = [
    { amount: 400, price: '£9.99', sku: 'tokens_400' },
    { amount: 1000, price: '£19.99', sku: 'tokens_1000' },
    { amount: 2000, price: '£29.99', sku: 'tokens_2000' },
    { amount: 4000, price: '£49.99', sku: 'tokens_4000' },
    { amount: 10000, price: '£99.99', sku: 'tokens_10000' },
  ];

  const handleBuy = (sku) => {
    if (!username) {
      alert('Username is required to proceed with payment.');
      return;
    }

    // Build the direct Pay Station URL
    const url = `https://secure.xsolla.com/paystation4/?project=${PROJECT_ID}&sku=${sku}&user=${encodeURIComponent(username)}&return_url=${encodeURIComponent(RETURN_URL)}`;

    // Open the payment page in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#000110] bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-[#000110] p-6 rounded-md shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-2 text-center">Buy Tokens</h2>
        <p className="m-2 bg-yellow-400 brightness-125 rounded text-[#000110] font-black text-center">
          SPECIAL OFFER! <br /> DOUBLE TOKENS!
        </p>
        <ul className="mt-4">
          {tokenOptions.map((option, index) => (
            <li key={index} className="m-4 flex justify-between">
              <span className="text-yellow-400 brightness-125">
                <span className="line-through text-yellow-400">{option.amount / 2} Tokens</span> <br />
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
