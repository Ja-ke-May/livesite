import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

// Utility function to check if a string is a valid base64 string
const isBase64 = (str) => {
  if (typeof str !== 'string') {
    return false;
  }
  try {
    const result = btoa(atob(str)) === str;
    console.log('Valid base64:', result, str);
    return result;
  } catch (err) {
    console.log('Invalid base64:', str);
    return false;
  }
};

const UserLinkAds = () => {
  const [ads, setAds] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const fetchedAds = await fetchUserAds();
        console.log('Fetched Ads:', fetchedAds); // Log fetched ads

        const adsWithValidImages = fetchedAds.ads.map((ad, index) => {
          console.log(`Checking ad #${index}:`, ad);

          if (!isBase64(ad.imageUrl)) {
            console.log(`Invalid imageUrl for ad #${index}, using fallback.`);
            // If imageUrl is not in base64, use a fallback image
            ad.imageUrl = '/images/logo.jpg'; // Fallback image
          } else {
            console.log(`Valid base64 image for ad #${index}`);
          }
          return ad;
        });

        setAds(adsWithValidImages);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching ads:', error);
        setLoading(false);
      }
    };
    
    fetchAds();
  }, []);

  const renderAd = (ad, index) => (
    <div className="w-full flex justify-center" key={index}>
      <div className={`ad-container ad-animation-${index} flex justify-center items-center`}>
        <a href={ad.url} target="_blank" rel="noopener noreferrer">
          <img
            src={ad.imageUrl.startsWith('data:image') ? ad.imageUrl : '/images/logo.jpg'}
            alt={ad.text || 'Ad Image'} // Fallback alt text
            className="w-full h-full rounded"
          />
        </a>
      </div>
    </div>
  );

  if (loading) {
    return <div></div>; 
  }

  return (
    <div className="w-full relative">
      {ads.map((ad, index) => renderAd(ad, index))} 
    </div>
  );
};

export default UserLinkAds;
