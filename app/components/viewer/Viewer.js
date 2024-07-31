import { useState, useRef } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";
import Timer from "./timer";

const Viewer = () => {
  const [state, setState] = useState({
    isPopUpOpen: false,
    isCameraOn: false,
    showPreviewButton: false,
    isLive: false, // New state to manage live status
  });
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleJoinClick = () => setState(prevState => ({ ...prevState, isPopUpOpen: true }));

  const handleClosePopUp = () => setState(prevState => ({ ...prevState, isPopUpOpen: false }));

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setState(prevState => ({ ...prevState, isCameraOn: true }));
        }
      })
      .catch(error => {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your device settings.");
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setState(prevState => ({ ...prevState, isCameraOn: false, showPreviewButton: false, isLive: false }));
    }
  };

  const handlePreviewButtonClick = () => startVideo();

  const handleTimeout = () => stopVideo();

  const handleGoLiveClick = () => {
    setState(prevState => ({ ...prevState, isLive: true }));
  };

  return (
    <>
      <div className="mt-2 h-8 bg-yellow-400 w-full font-bold text-md md:text-md text-center text-[#000110] brightness-125 rounded">
        {state.isCameraOn ? (
          <div className="relative w-full flex justify-center h-full ">
            <button
              onClick={stopVideo}
              className="absolute text-white border-2 border-red-700 pr-1 pl-1 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600"
            >
              Leave
            </button>
          </div>
        ) : state.showPreviewButton ? (
          <button
            onClick={handlePreviewButtonClick}
            className="text-white border-2 border-red-700 pr-1 pl-1 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600 animate-pulse"
          >
            Preview Your Camera
          </button>
        ) : (
          <>
            <p className="md:font-extrabold inline">Join the live queue</p>
            <button
              className="border-2 border-[#000110] pr-1 pl-1 m-1 text-sm md:text-md hover:bg-yellow-600 hover:brightness-125 rounded animate-pulse"
              onClick={handleJoinClick}
            >
              JOIN
            </button>
          </>
        )}
      </div>
      <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md w-full">
        <h2 className="hidden">Viewer Component</h2>
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover"
        />
        {!state.isLive && state.isCameraOn && (

          <div
           
            className="absolute inset-0 flex items-center justify-center items-center"
          >
            <button  onClick={handleGoLiveClick}
            className="bg-green-600 text-white text-md md:text-lg font-bold rounded p-4 animate-pulse">GO LIVE</button>
           
          </div>
        )}
      </div>

      <LiveQueuePopUp
        visible={state.isPopUpOpen}
        onClose={handleClosePopUp}
        onJoin={() => setState(prevState => ({ ...prevState, showPreviewButton: true }))}
      />
      {state.isLive && <Timer isActive={state.isLive} onTimeout={handleTimeout} />}
    </>
  );
};

export default Viewer;


