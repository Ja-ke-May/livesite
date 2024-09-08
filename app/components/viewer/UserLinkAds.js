"use client";

import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const UserLinkAds = () => {
  const [ads, setAds] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getActiveAds = async () => {
      try {
        setLoading(true);
        console.log('Fetching ads...');
        const response = await fetchUserAds(); 
        console.log('Fetched response:', response);

        if (response && response.ads && response.ads.length > 0) {
          console.log('Ads found:', response.ads.length);

          const updatedAds = response.ads.map((ad, index) => {
            const link = ad.links?.[0]; // Ensure links is an array and has at least one entry

            // Debugging: Log the structure of the ad to check `links`, `imageUrl`, and `url`
            console.log(`Processing ad ${index + 1}/${response.ads.length}:`, ad);
            console.log('Link:', link);

            if (link && link.imageUrl && link.url) {
              console.log(`Ad ${index + 1} has valid fields. ImageUrl: ${link.imageUrl}, Url: ${link.url}`);
            } else {
              console.warn(`Ad ${index + 1} missing required fields (imageUrl or url)`, link);
              return null; // Skip ads with missing fields
            }

            // Ensure URL case sensitivity is handled properly
            if (link.url && link.url.startsWith('Https://')) {
              link.url = link.url.replace('Https://', 'https://');
            }

            return ad;
          });

          // Filter out any null ads (ads that were skipped due to missing fields)
          setAds(updatedAds.filter(ad => ad !== null)); 
        } else {
          console.log('No ads found');
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
    const link = ad.links?.[0]; // Ensure proper access to the `links` array
    
    if (!link || !link.imageUrl || !link.url) {
      console.warn(`Ad ${index + 1} missing required fields (imageUrl or url)`, link);
      return null;
    }

    // Debugging step: ensure the base64 image is correctly rendered
    console.log(`Rendering ad with base64 image. URL: ${link.url}, Image: ${link.imageUrl.slice(0, 50)}...`);

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div
          id={ad.id || ad._id || index}
          className={`ad-container ad-animation-${index} flex justify-center items-center pointer-events-auto cursor-pointer`}
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={`data:image/png;base64,${link.imageUrl}`} // Use base64 data directly in the image source
              alt={link.text || `Ad ${ad.id || ad._id || index}`}
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
