import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const UserLinkAds = () => {
  const [ads, setAds] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const fetchedAds = await fetchUserAds(); 
        setAds(fetchedAds.ads); 
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
            src={`data:image/png;base64,${ad.imageUrl}`} 
            alt={ad.text}
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
