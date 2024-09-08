import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

// Helper function to convert image URLs to base64
const toBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${url}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in toBase64 function:', error);
    throw error;
  }
};

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

          // Convert image URLs to base64 if necessary
          const updatedAds = await Promise.all(response.ads.map(async (ad, index) => {
            const link = ad.links?.[0];
            console.log(`Processing ad ${index + 1}/${response.ads.length}:`, ad);

            if (link && link.imageUrl && !link.imageUrl.startsWith('data:')) {
              try {
                console.log(`Converting image for ad ${index + 1} to base64:`, link.imageUrl);
                const base64Image = await toBase64(link.imageUrl);
                link.imageUrl = base64Image; // Update imageUrl with base64 string
                console.log(`Base64 image set for ad ${index + 1}`);
              } catch (error) {
                console.error(`Error converting image for ad ${index + 1}:`, error);
                link.imageUrl = 'default-placeholder-image.png'; // Set a default fallback
              }
            } else {
              console.log(`Ad ${index + 1} already has a base64 image or no image URL`);
            }

            return ad;
          }));
          setAds(updatedAds); 
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
    const link = ad.links?.[0];
  
    if (!link || !link.imageUrl || !link.url) {
      console.warn(`Ad ${index + 1} missing required fields (imageUrl or url)`);
      return null;
    }

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div
          id={ad.id || ad._id || index}
          className={`ad-container ad-animation-${index} flex justify-center items-center pointer-events-auto cursor-pointer`}
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={link.imageUrl || 'default-placeholder-image.png'} // Fallback if no image URL
              alt={link.text || `Ad ${ad.id || ad._id || index}`}
              className="w-full h-full rounded pointer-events-auto cursor-pointer"
            />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading ads...</div>;  // Display loading message or spinner
  }

  if (ads.length === 0) {
    return <div>No ads to display.</div>;  // Handle case where no ads are available
  }

  return (
    <div className="w-full">
      {ads.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
