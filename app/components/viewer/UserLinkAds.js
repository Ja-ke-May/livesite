import React, { useState, useEffect } from 'react';
import { fetchUserAds } from '@/utils/apiClient';

const defaultAds = [
  { id: 'Ad1', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad2', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad3', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad4', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad5', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad6', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad7', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad8', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad9', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad10', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad11', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad12', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad13', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad14', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad15', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad16', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad17', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad18', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad19', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
  { id: 'Ad20', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
];

const UserLinkAds = () => {
  const [ads, setAds] = useState([]); // State to store fetched ads
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch ads from backend
  useEffect(() => {
    const getActiveAds = async () => {
      try {
        setLoading(true);
        const response = await fetchUserAds(); // Fetch active ads from backend
        console.log(response);
        if (response && response.ads && response.ads.length > 0) {
          setAds(response.ads); // Set fetched ads if available
        } else {
          setAds([]); // Set to empty if no ads are fetched
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAds([]); // Fallback to default ads if error occurs
      } finally {
        setLoading(false);
      }
    };

    getActiveAds();
  }, []);

  // Combine fetched ads with default ads to always have 20 ads
  const combinedAds = ads.length < 20 
    ? [...ads, ...defaultAds.slice(ads.length, 20)] // Fill the rest with default ads if fetched ads are less than 20
    : ads;

  const renderAd = (ad, index) => {
    // Safely check if 'ad.links' exists and it contains 'url' and 'imageUrl'
    const link = ad.links?.[0]; // Assuming links is an array; use the first link
    
    if (!link || !link.url || !link.imageUrl) {
      console.warn('Missing link or its properties for ad:', ad);
      return null; // Skip rendering if crucial data is missing
    }

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id}>
        <div id={ad.id || ad._id} className={`ad-container ad-animation-${index} flex justify-center items-center`}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={`data:image/jpeg;base64,${link.imageUrl}`}
              alt={link.text || `Ad ${ad.id || ad._id}`}
              className="w-full h-full rounded"
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
    <div className="w-full h-">
      {combinedAds.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
