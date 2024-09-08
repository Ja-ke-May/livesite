import React, { useState, useEffect } from 'react'; 
import { fetchUserAds } from '@/utils/apiClient';

const defaultAds = [
  { id: 'Ad1', imageUrl: '/images/logo.jpg', linkUrl: 'https://myme.live' },
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
        console.log("Fetched ads:", response?.ads || []); // Log the fetched ads

        if (response?.ads?.length > 0) {
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

  // Function to prefix base64 image data
  const getBase64ImageSrc = (base64Data) => {
    // Check if the data seems to be PNG or JPEG based on the start of the base64 string
    if (base64Data.startsWith('iVBORw0KGgo')) {
      return `data:image/png;base64,${base64Data}`;
    } else {
      return `data:image/jpeg;base64,${base64Data}`;
    }
  };

  // Render each ad
  const renderAd = (ad, index) => {
    const isDefaultAd = !ad.links || !ad.links[0]; // Check if it's a default ad or user ad
    const link = isDefaultAd ? ad : ad.links[0]; // Access the first link if it's a user ad

    // Determine the image source based on whether it's a default ad or user ad with base64 image
    const imageSrc = isDefaultAd
      ? ad.imageUrl
      : getBase64ImageSrc(link.imageUrl);

    // Log the image source for debugging
    console.log(`Ad ${index} image source:`, imageSrc);

    return (
      <div className="w-full flex justify-center" key={ad.id || ad._id || index}>
        <div id={ad.id || ad._id || index} className={`ad-container ad-animation-${index} flex justify-center items-center`}>
          <a href={isDefaultAd ? ad.linkUrl : link.url} target="_blank" rel="noopener noreferrer">
            <img
              src={imageSrc} // Use the correct image source
              alt={link.text || `Ad ${ad.id || ad._id || index}`}
              className="w-full h-full rounded"
              onError={(e) => { e.target.src = '/images/fallback-image.jpg'; }} // Fallback image on error
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

  console.log("Ads being rendered:", allAds); // Log the final list of ads being rendered

  return (
    <div className="w-full">
      {allAds.map((ad, index) => renderAd(ad, index))}
    </div>
  );
};

export default UserLinkAds;
