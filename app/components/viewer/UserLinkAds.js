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

        // Check if the response has the expected structure
        if (response && response.ads && Array.isArray(response.ads)) {
          console.log(`Ads found: ${response.ads.length}`);

          // Process the ads
          const updatedAds = response.ads.map((ad, index) => {
            const links = ad.links?.[0]; // Ensure links is an array and has at least one entry

            // Debugging: Log the structure of the ad to check `linkss`, `imageUrl`, and `url`
            console.log(`Processing ad ${index + 1}/${response.ads.length}:`, ad);
            console.log('Links:', links);

            if (links && links.imageUrl && links.url) {
              // Ensure URL case sensitivity is handled properly
              if (links.url.startsWith('Https://')) {
                links.url = links.url.replace('Https://', 'https://');
              }

              // Ensure imageUrl has the correct base64 prefix if it's missing
              if (!links.imageUrl.startsWith('data:image/png;base64,') && !links.imageUrl.startsWith('data:image/jpeg;base64,')) {
                links.imageUrl = `data:image/png;base64,${links.imageUrl}`;
              }

              return ad;
            } else {
              console.warn(`Ad ${index + 1} missing required fields (imageUrl or url)`, links);
              return null; // Skip ads with missing fields
            }
          });

          // Filter out any null ads (ads that were skipped due to missing fields)
          const validAds = updatedAds.filter(ad => ad !== null);
          console.log(`Valid ads after filtering: ${validAds.length}`);
          setAds(validAds);
        } else {
          console.warn('No ads found or invalid structure in response.');
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
 

    if (!links || !links.imageUrl || !links.url) {
      console.warn(`Ad ${index + 1} missing required fields (imageUrl or url)`, links);
      return null;
    }

  
    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div
          id={ad.id || ad._id || index}
          className={`ad-container ad-animation-${index} flex justify-center items-center pointer-events-auto cursor-pointer`}
        >
          <a href={links.url} target="_blank" rel="noopener noreferrer">
            <img
              src={links.imageUrl} // Base64 image already prefixed correctly
              alt={links.text || `Ad ${ad.id || ad._id || index}`}
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

  if (!ads || ads.length === 0) {
    return <div>No ads available at this time.</div>;
  }

  return (
    <div className="w-full">
      {ads.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
