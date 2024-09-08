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
    const getUserAds = async () => {
      try {
        setLoading(true);
        const response = await fetchUserAds(); 

        console.log("Fetched ads:", response.ads);
        
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

    getUserAds();
  }, []);

  const renderAd = (ad, index) => {
    const isDefaultAd = !ad.url; // Check if it's a default ad (if `url` doesn't exist)

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div id={ad.id || ad._id || index} className={`ad-container ad-animation-${index} flex justify-center items-center`}>
          <a href={isDefaultAd ? ad.linkUrl : ad.url} target="_blank" rel="noopener noreferrer">
            <img
              src={isDefaultAd ? ad.imageUrl : `data:image/jpeg;base64,${ad.imageUrl}`} // Use base64 for user ads
              alt={ad.text || `Ad ${ad.id || ad._id || index}`}
              className="w-full h-full rounded"
            />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div></div>; // Loading state
  }

  // Fill with default ads if not enough user ads are available
  const allAds = [...ads, ...defaultAds.slice(ads.length)].slice(0, 20); // Ensure 20 ads

  return (
    <div className="w-full">
      {allAds.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
