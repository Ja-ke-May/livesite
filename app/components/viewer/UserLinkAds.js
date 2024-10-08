import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const isBase64 = (str) => {
  if (typeof str !== 'string') {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
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

        const adsWithValidImages = fetchedAds.ads.map((ad, index) => {

          const imageUrl = ad.links && ad.links.imageUrl ? ad.links.imageUrl : ad.imageUrl;

          if (!isBase64(imageUrl)) {
            ad.imageUrl = '/images/logo.jpg'; 
          } else {
            ad.imageUrl = `data:image/png;base64,${imageUrl}`; 
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
      <div className={`ad-container ad-animation-${index} flex justify-center items-center pointer-events-auto cursor-pointer`}>
        <a href={ad.links?.url} target="_blank" rel="noopener noreferrer">
          <img
            src={ad.imageUrl.startsWith('data:image') ? ad.imageUrl : '/images/logo.jpg'}
            alt={ad.links?.text || 'Ad Link Image'} 
            className="max-w-[50px] md:max-w-[100px] max-h-[50px] md:max-h-[100px] rounded"
          />
        </a>
      </div>
    </div>
  );

  if (loading) {
    return <div></div>; 
  }

  return (
    <div className="">
      {ads.map((ad, index) => renderAd(ad, index))} 
    </div>
  );
};

export default UserLinkAds;
