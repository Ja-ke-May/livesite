import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const UserLinkAds = () => {
  const [ads, setAds] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getActiveAds = async () => {
      try {
        setLoading(true);
        const response = await fetchUserAds(); 
        console.log(response);
        if (response && response.ads && response.ads.length > 0) {
          setAds(response.ads); // Set the ads directly since they already contain base64 images
        } else {
          setAds([]); 
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAds([]); 
      } finally {
        setLoading(false);
      }
    };

    getActiveAds();
  }, []);

  const renderAd = (ad, index) => {
    const link = ad.links?.[0];
  
    if (!link || !link.imageUrl || !link.url) {
      return null;
    }

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id}>
        <div
          id={ad.id || ad._id}
          className={`ad-container ad-animation-${index} flex justify-center items-center pointer-events-auto cursor-pointer`}
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={link.imageUrl} // Directly use the base64 image
              alt={link.text || `Ad ${ad.id || ad._id}`}
              className="w-full h-full rounded pointer-events-auto cursor-pointer"
            />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading ads...</div>;
  }

  return (
    <div className="w-full">
      {ads.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
