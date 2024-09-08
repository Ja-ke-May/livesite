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
        console.log("Fetched ads:", response.ads); // Log the fetched ads

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
    const isDefaultAd = !ad.links; // Check if it's a default ad (if `links` doesn't exist)
    const link = isDefaultAd ? ad : ad.links[0]; // Access the first link if it's a user ad

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div id={ad.id || ad._id || index} className={`ad-container ad-animation-${index} flex justify-center items-center`}>
          <a href={isDefaultAd ? ad.linkUrl : link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={isDefaultAd ? ad.imageUrl : `data:image/jpeg;base64,${link.imageUrl}`} // Use base64 for user ads
              alt={link.text || `Ad ${ad.id || ad._id || index}`}
              className="w-full h-full rounded"
            />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading ads...</div>; // Loading state
  }

  // Fill with default ads if not enough user ads are available
  const allAds = [...ads, ...defaultAds.slice(ads.length)].slice(0, 20); // Ensure 20 ads

  console.log("Ads being rendered:", allAds); // Log the final list of ads being rendered

  return (
    <div className="w-full">
      {allAds.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;