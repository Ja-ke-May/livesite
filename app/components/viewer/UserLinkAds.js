import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const toBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
          // Convert image URLs to base64 if necessary
          const updatedAds = await Promise.all(response.ads.map(async (ad) => {
            const link = ad.links?.[0];
            if (link && link.imageUrl && !link.imageUrl.startsWith('data:')) {
              try {
                const base64Image = await toBase64(link.imageUrl); 
                link.imageUrl = base64Image; // Update imageUrl with base64 string
              } catch (error) {
                console.error('Error converting image to base64:', error);
              }
            }
            return ad;
          }));
          setAds(updatedAds); 
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
              src={link.imageUrl}
              alt={link.text || `Ad ${ad.id || ad._id}`}
              className="w-full h-full rounded pointer-events-auto cursor-pointer"
            />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      {ads.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
