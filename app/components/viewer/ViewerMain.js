import { useState, useEffect, useRef, useCallback } from 'react';
import UsernamePopUp from '../UsernamePopUp';
import { fetchUserProfile, fetchSupporters, toggleSupport, fetchRecentActivity } from '@/utils/apiClient';

const ViewerMain = ({ mainVideoRef, state, handleGoLiveClick, upNext, liveUserId, username }) => {
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
  const [profilePicture, setProfilePicture] = useState(null); 
  const [showGoLiveButton, setShowGoLiveButton] = useState(false);
  const goLiveTimerRef = useRef(null);
  const usernameRef = useRef(null);

  useEffect(() => {
  }, [upNext]);

  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.volume = volume;
    }
  }, [volume, mainVideoRef]);

  useEffect(() => {
    if (!liveUserId && state.userPosition === 1 && !state.isNext) {
      setState(prevState => ({
        ...prevState,
        isNext: true,
      }));
    }
  }, [liveUserId, state.userPosition, state.isNext]);
  
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (upNext) {
        try {
          setProfilePicture(null);
          const userProfile = await fetchUserProfile(upNext);
          setProfilePicture(userProfile.profilePicture ? `data:image/jpeg;base64,${userProfile.profilePicture}` : '/images/logo.jpg');
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setProfilePicture('/images/logo.jpg');  
        }
      }
    };

    fetchProfilePicture();
  }, [upNext]);

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

  useEffect(() => {
    if (username === liveUserId) {
      setVolume(0);
      if (mainVideoRef.current) {
        mainVideoRef.current.volume = 0;
      }
    }
  }, [username, liveUserId, mainVideoRef]);

  const togglePopup = async (userId) => {
    setShowPopup(true);
    setPopupPosition({ x: 0, y: 0 });

    if (!showPopup) {
        try {
            setLoadingLinks(true);

            const [userProfile, supportersData] = await Promise.all([
                fetchUserProfile(userId),
                fetchSupporters(userId)
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

useEffect(() => {
  if (state.isCameraOn && !state.isLive && !state.liveUserId) {
    goLiveTimerRef.current = setTimeout(() => {
      window.location.reload(); 
    }, 30000);
  } else {
    if (goLiveTimerRef.current) {
      clearTimeout(goLiveTimerRef.current);
    }
  }

  return () => {
    if (goLiveTimerRef.current) {
      clearTimeout(goLiveTimerRef.current);
    }
  };
}, [state.isCameraOn, state.isLive, state.liveUserId]);

useEffect(() => {
  if (state.isCameraOn && !state.isLive && !state.liveUserId) {
    const timer = setTimeout(() => {
      setShowGoLiveButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  } else {
    setShowGoLiveButton(false);  // Reset if the conditions change
  }
}, [state.isCameraOn, state.isLive, state.liveUserId]);


  return (
    <div className="relative h-[300px] md:h-[340px] lg:h-[400px] rounded text-center bg-transparent shadow-md w-full group">
      <h2 className="hidden">Live Viewer Component</h2>
      <video ref={mainVideoRef} autoPlay muted={isMuted} className="w-full h-full object-cover" />

      {state.liveUserId && (
        <div>
          <div className="absolute top-2 left-2 bg-none text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <span
            ref={usernameRef}
            className="font-bold cursor-pointer"
            onClick={() => togglePopup(state.liveUserId)} 
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
              links={links} 
              isUserSupported={isUserSupported} 
              onToggleSupport={handleToggleSupport} 
            />
          )}
        </div>
        </div>
      )}

         {!state.liveUserId && !state.isCameraOn && upNext && (
          <div>
        <div className="absolute inset-0 flex flex-col text-center items-center justify-center bg-[#000110] text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <p onClick={() => togglePopup(upNext)} className="text-white">Up Next: <span className="font-bold">{upNext}</span></p>
          
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile Picture"
              className="max-w-40 max-h-40 rounded-[10%] mt-2"
            />
          )}
        </div>
         <div>
         {showPopup && (
           <UsernamePopUp 
             visible={showPopup} 
             onClose={togglePopup} 
             username={upNext} 
             position={popupPosition}
             links={links}  
             isUserSupported={isUserSupported}  
             onToggleSupport={handleToggleSupport} 
           />
         )}
       </div>
       </div>
      )}

      {state.isCameraOn && !state.isLive && !state.liveUserId && showGoLiveButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
           onClick={() => {
            clearTimeout(goLiveTimerRef.current);
            handleGoLiveClick()
          }}
           className="bg-green-600 text-white text-md md:text-lg font-bold rounded p-4 animate-pulse"
          >
            GO LIVE
          </button>
        </div>
      )}

      {state.liveUserId && isMuted && (
        <button
          onClick={handleUnmuteClick}
          className="absolute bottom-4 right-4 bg-[#000110] text-white text-md font-bold rounded-full p-3"
        >
          Sound On
        </button>
      )}

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
