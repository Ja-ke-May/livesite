import { useState, useRef } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";
import Timer from "./timer";

const Viewer = () => {
  const [state, setState] = useState({
    isPopUpOpen: false,
    isCameraOn: false,
    showPreviewButton: false,
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
      setState(prevState => ({ ...prevState, isCameraOn: false, showPreviewButton: false }));
    }
  };

  const handlePreviewButtonClick = () => startVideo();

  const handleTimeout = () => stopVideo();

  return (
    <>
      <div className="mt-2 h-8 bg-yellow-400 w-full font-bold text-md md:text-md text-center text-[#000110] brightness-125">
        {state.isCameraOn ? (
          <div className="relative w-full flex justify-center h-full">
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
            className="border-2 border-red-800 pr-1 pl-1 h-full text-md text-red-800 md:text-md hover:bg-yellow-600 rounded animate-pulse"
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
      <div className="relative mt-2 h-[300px] md:h-[400px] lg:h-[500px] rounded text-center bg-gray-800/80 shadow-md w-full">
        <h2 className="hidden">Viewer Component</h2>
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>

      <LiveQueuePopUp
        visible={state.isPopUpOpen}
        onClose={handleClosePopUp}
        onJoin={() => setState(prevState => ({ ...prevState, showPreviewButton: true }))}
      />
      {state.isCameraOn && <Timer isActive={state.isCameraOn} onTimeout={handleTimeout} />}
    </>
  );
};

export default Viewer;

