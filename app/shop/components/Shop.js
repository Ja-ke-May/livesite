"use client"; 

import { useState, useContext, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { AuthContext } from '@/utils/AuthContext';
import TokenPurchasePopup from './TokenPurchasePopup'; 
import { updateColor, deductTokens, fetchUserProfile, sendLinkToAds, fetchAdsCount } from '@/utils/apiClient';
import UserLinkAds from '@/app/components/viewer/UserLinkAds';

const Shop = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/shop');
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [color, setColor] = useState('#ffffff'); 
  const [borderColor, setBorderColor] = useState('#000110'); 
  const [usernameColor, setUsernameColor] = useState('#ffffff');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedTokens, setSelectedTokens] = useState(''); 
  const [userTokens, setUserTokens] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState({ message: '', type: '' });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [userLinks, setUserLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(''); 
  const [adsCount, setAdsCount] = useState(0); 

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3YM558MVY4';
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3YM558MVY4');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchUserColorsAndTokens = async () => {
      try {
        if (username) {
          setLoading(true);
          const userProfile = await fetchUserProfile(username);
          setColor(userProfile.commentColor || '#ffffff');
          setBorderColor(userProfile.borderColor || '#000110');
          setUsernameColor(userProfile.usernameColor || '#ffffff');
          setUserTokens(userProfile.tokens || 0);  
          setUserLinks(userProfile.links || []);
        
          const count = await fetchAdsCount();
          setAdsCount(count); 
        }
      } catch (error) {
        console.error('Failed to fetch user colors and tokens:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserColorsAndTokens();
  }, [username]);

  useEffect(() => {
    const fetchTokensInterval = setInterval(async () => {
      try {
        if (username) {
          const userProfile = await fetchUserProfile(username);
          setUserTokens(userProfile.tokens || 0);
        }
      } catch (error) {
        console.error('Failed to fetch user tokens:', error);
      }
    }, 5000); 

    return () => clearInterval(fetchTokensInterval);
  }, [username]);

  useEffect(() => {
    const fetchAdsCountInterval = setInterval(async () => {
      try {
        const count = await fetchAdsCount();
        setAdsCount(count); 
      } catch (error) {
        console.error('Failed to fetch ads count:', error);
      }
    }, 10000); 

    return () => clearInterval(fetchAdsCountInterval);
  }, []);


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
    setIsPurchasing(true);
  
    try {
      const { name } = selectedItem;
  
      if (name === 'Promote Your Link for 1 Week') {
        await deductTokens(selectedTokens);
        const selectedLinkObject = userLinks.find(link => link._id === selectedLink);
        await sendLinkToAds(selectedLinkObject);
  
        setPurchaseStatus({ message: `Success! Your link has been featured in ads for 1 week.`, type: 'success' });
      } else {
        const { color } = selectedItem;
  
        let colorType;
        if (name === 'this Comment Colour') {
          colorType = 'commentColor';
        } else if (name === 'this Border Colour') {
          colorType = 'borderColor';
        } else if (name === 'this Username Colour') {
          colorType = 'usernameColor';
        }
  
        await updateColor(username, colorType, color);
  
        await deductTokens(selectedTokens);
  
        setPurchaseStatus({ message: `Success! You purchased ${name}.`, type: 'success' });
      }
  
      setTimeout(() => {
        setPurchaseStatus({ message: '', type: '' });
        setShowConfirmation(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to complete the purchase:', error);
      setPurchaseStatus({ message: 'Purchase failed. Please try again.', type: 'error' });
  
      setTimeout(() => {
        setPurchaseStatus({ message: '', type: '' });
        setShowConfirmation(false);
      }, 2000);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePurchaseAdClick = () => {
    const selectedLinkObject = userLinks.find(link => link._id === selectedLink); 
    
    if (!selectedLinkObject) {
      setPurchaseStatus({ message: 'Please select a link to feature in ads.', type: 'error' });
      return;
    }
    
   
    setShowConfirmation(true);
    setSelectedItem({ name: 'Promote Your Link for 1 Week', color: '' });
    setSelectedTokens(2500); 
  };
  

 
  if (loading) {  
    return (
      <div>
        <Navbar />
        <div className='bg-[#000110] w-[100%] h-[100%] flex justify-center items-center animate-pulse mt-10'>Loading...</div>
      </div>
    );
  }

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
              Your Tokens: {userTokens}
            </h2>
          </div>
        )}

        
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

        
        <div className="relative h-[400px] w-full">
          <div className="p-20 text-center">
            <p className="text-xl">Feature your links between streamers for 1 week!</p>
            {isLoggedIn && username && adsCount < 15 && ( 
              <>
               <p className={`${adsCount >= 15 ? 'text-red-500' : 'text-yellow-400 brightness-125'} text-center text-lg`}>
  {adsCount >= 15 ? 'No spaces available' : `Spaces available ${15 - adsCount}`}
</p>
                
                {userLinks.length > 0 && (
                  <select
                    className="mt-2 bg-gray-800 p-2 rounded text-lg"
                    value={selectedLink}
                    onChange={(e) => setSelectedLink(e.target.value)}
                  >
                    <option value="">Select a link</option>
                    {userLinks.map((link) => (
                      <option key={link._id} value={link._id}>
                        {link.text}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-yellow-400 brightness-125 mt-2 md:mt-4">2500 Tokens</p>
                <button
                  className={`mt-2 mb-5 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600 ${
                    isPurchasing ? 'animate-pulse' : ''
                  }`}
                  onClick={handlePurchaseAdClick}
                  disabled={isPurchasing || !selectedLink}
                >
                  Purchase
                </button>
              </>
            )}
            {adsCount >= 15 && (
              <p className="text-red-500 mt-4">Sorry, spaces are now full. Please check back later!</p>
            )}
          </div>

          <UserLinkAds />
        </div>


        <hr className='mt-10' />

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
            <>             <p className="text-yellow-400 brightness-125 mt-2 md:mt-4">200 Tokens</p>
          <button
            className={`mt-4 mb-5 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
            onClick={() => handlePurchaseClick('this Comment Colour', 200)}
            disabled={isPurchasing}
          >
            Purchase
          </button>
          </>

          )}
        </div>

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
            <>             <p className="text-yellow-400 brightness-125 mt-2 md:mt-4">200 Tokens</p>
          <button
            className={`mt-4 mb-5 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
            onClick={() => handlePurchaseClick('this Border Colour', 200)}
            disabled={isPurchasing}
          >
            Purchase
          </button>
          </>
          )}
        </div>
        
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
            <>             <p className="text-yellow-400 brightness-125 mt-2 md:mt-4">200 Tokens</p>
          <button
            className={`mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
            onClick={() => handlePurchaseClick('this Username Colour', 200)}
            disabled={isPurchasing}
          >
            Purchase
          </button>
          </>
          )}
        </div>

        <hr className='mt-10' />
        <p className='mt-4'>More coming soon...</p>

      

      </div> 
      
      {showTokenPopup && (
        <TokenPurchasePopup onClose={closeTokenPopup}
        username={username}
         />
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-[#000110] p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Purchase</h2>
            <p>Are you sure you want to purchase <strong style={{ color: selectedItem.color }}>   
              
          {` ${selectedItem.name} `}
        </strong>
          for <span className='text-yellow-400 brightness-125'><strong>{selectedTokens}</strong> tokens?</span></p>
            {purchaseStatus.message && (
              <div className={`mt-2 p-4 rounded-md shadow-sm font-bold ${purchaseStatus.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                {purchaseStatus.message}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeConfirmationPopup}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className={`ml-2 mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-4 py-2 rounded-md shadow-sm hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
                disabled={isPurchasing}
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
