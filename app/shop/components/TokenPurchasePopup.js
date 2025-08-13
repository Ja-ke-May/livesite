import React from 'react';

const TokenPurchasePopup = ({ onClose, username }) => {
  const PROJECT_ID = process.env.NEXT_PUBLIC_XSOLLA_PROJECT_ID;
  const MERCHANT_ID = process.env.NEXT_PUBLIC_XSOLLA_MERCHANT_ID; // Only safe if public-safe key is allowed
  const API_KEY = process.env.NEXT_PUBLIC_XSOLLA_API_KEY; // Only safe if using a public key or sandbox
  const RETURN_URL = 'https://myme.live/shop';
  const SANDBOX = false; 

  const tokenOptions = [
    { amount: 400, price: '£9.99', sku: 'tokens_400' },
    { amount: 1000, price: '£19.99', sku: 'tokens_1000' },
    { amount: 2000, price: '£29.99', sku: 'tokens_2000' },
    { amount: 4000, price: '£49.99', sku: 'tokens_4000' },
    { amount: 10000, price: '£99.99', sku: 'tokens_10000' },
  ];

  const handleBuy = async (sku) => {
    if (!username) {
      alert('Username is required.');
      return;
    }

    try {
      const res = await fetch(`https://api.xsolla.com/merchant/v2/projects/${PROJECT_ID}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${MERCHANT_ID}:${API_KEY}`),
        },
        body: JSON.stringify({
          user: {
            id: { value: username },
          },
          purchase: {
            virtual_items: [{ sku }],
          },
          settings: {
            return_url: RETURN_URL,
            sandbox: SANDBOX,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create token: ${res.status}`);
      }

      const { token } = await res.json();

      const paystationUrl = `${SANDBOX ? 'https://sandbox-secure.xsolla.com' : 'https://secure.xsolla.com'}/paystation3/?token=${token}`;
      window.open(paystationUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert(`Payment setup failed: ${err.message}`);
    }
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
                <span className="line-through text-yellow-400">
                  {option.amount / 2} Tokens
                </span>{' '}
                <br />
                {option.amount} Tokens <br />
                <span className="text-white">{option.price}</span>
              </span>
              <button
                onClick={() => handleBuy(option.sku)}
                className="ml-2 bg-yellow-400 font-bold text-[#000110] brightness-125 px-1 py-1 rounded-md shadow-sm hover:bg-yellow-600"
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
