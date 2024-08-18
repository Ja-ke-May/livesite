import { useState, useEffect, useRef, useCallback } from 'react';
import UsernamePopUp from '../UsernamePopUp';
import { fetchUserProfile, fetchSupporters, toggleSupport, fetchRecentActivity } from '@/utils/apiClient';

const ViewerMain = ({ mainVideoRef, state, handleGoLiveClick, nextUsername, liveUserId }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [volume, setVolume] = useState(0.5); 
  const [isVolumeVisible, setIsVolumeVisible] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [links, setLinks] = useState([]);  
  const [isUserSupported, setIsUserSupported] = useState(false);  
  const [loadingLinks, setLoadingLinks] = useState(false);  
  const [recentActivity, setRecentActivity] = useState([]);
  const usernameRef = useRef(null);

  useEffect(() => {
    console.log("nextUsername updated:", nextUsername);
  }, [nextUsername]);

  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.volume = volume;
    }
  }, [volume, mainVideoRef]);

  useEffect(() => {
    // Check if liveUserId is null and the user is first in the queue
    if (!liveUserId && state.userPosition === 1) {
      // Update isNext to true
      state.isNext = true;
    }
  }, [liveUserId, state.userPosition, state]);

  const handleUnmuteClick = () => {
    setIsMuted(false);
    setShowVolumeControls(true);
    setIsVolumeVisible(true); 
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = false;
    }
    setTimeout(() => {
      setIsVolumeVisible(false);
    }, 3000);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const togglePopup = async () => {
    setShowPopup(true);
    setPopupPosition({ x: 0, y: 0 }); 

    if (!showPopup) {
        try {
            setLoadingLinks(true);

            const [userProfile, supportersData] = await Promise.all([
                fetchUserProfile(state.liveUserId),
                fetchSupporters(state.liveUserId)
            ]);

            setLinks(userProfile.links || []);
            setIsUserSupported(supportersData.isUserSupported); 
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoadingLinks(false);
        }
    }

    setShowPopup(!showPopup);
};

const handleToggleSupport = useCallback(async () => {
  const newIsUserSupported = !isUserSupported;

  setIsUserSupported(newIsUserSupported);
  try {
    const data = await toggleSupport(liveUserId);
    setIsUserSupported(data.isSupported);

    const recentActivityData = await fetchRecentActivity(liveUserId);
    setRecentActivity(recentActivityData);
  } catch (error) {
    console.error('Failed to toggle support status:', error.message);
    setIsUserSupported(!newIsUserSupported);
  }
}, [isUserSupported, liveUserId]);

  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded text-center bg-gray-800/80 shadow-md w-full group">
      <h2 className="hidden">Live Viewer Component</h2>
      <video ref={mainVideoRef} autoPlay muted={isMuted} className="w-full h-full object-cover" />

      {/* Display the live user's username */}
      {state.liveUserId && (
        <div>
          <div className="absolute top-2 left-2 bg-none text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <span
            ref={usernameRef}
            className="font-bold cursor-pointer"
            onClick={togglePopup}
          >
            {state.liveUserId}
          </span>
          </div>
          <div>
          {showPopup && (
            <UsernamePopUp 
              visible={showPopup} 
              onClose={togglePopup} 
              username={state.liveUserId} 
              position={popupPosition}
              links={links}  // Pass the fetched links
              isUserSupported={isUserSupported}  // Pass the supported status
              onToggleSupport={handleToggleSupport} 
            />
          )}
        </div>
        </div>
      )}

      {/* Display the "Up Next" user */}
      {nextUsername && (
        <div className="absolute inset-0 flex items-center justify-center bg-none text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <p className="text-white">Next Live User... <span className="font-bold">{nextUsername}</span></p>
        </div>
      )}

      {/* Conditionally render the "GO LIVE" button when the user is prompted to go live */}
      {state.isCameraOn && !state.isLive && !state.liveUserId && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleGoLiveClick}
            className="bg-green-600 text-white text-md md:text-lg font-bold rounded p-4 animate-pulse"
          >
            GO LIVE
          </button>
        </div>
      )}

      {/* Unmute Button */}
      {state.liveUserId && isMuted && (
        <button
          onClick={handleUnmuteClick}
          className="absolute bottom-4 right-4 bg-[#000110] text-white text-md font-bold rounded-full p-3"
        >
          Sound On
        </button>
      )}

      {/* Volume Controls */}
      {state.liveUserId && showVolumeControls && (
        <div
          className={`absolute bottom-4 right-4 bg-none text-md rounded p-2 transition-opacity duration-300 ${
            isVolumeVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ViewerMain;
