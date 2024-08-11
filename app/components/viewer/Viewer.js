import { useState, useRef, useEffect, useContext } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";
import Timer from "./LiveTimer";
import io from "socket.io-client";
import { AuthContext } from "@/utils/AuthContext";
import ViewerHeader from "./ViewerHeader";
import ViewerMain from "./ViewerMain";
import Votes from "./Votes";

const Viewer = () => {
  const { username } = useContext(AuthContext);
  const [state, setState] = useState({
    isPopUpOpen: false,
    isCameraOn: false,
    showPreviewButton: false,
    isLive: false,
    inQueue: false,
    isNext: false,
    autoplayAllowed: true,
    liveUserId: null,
  });
  const [timer, setTimer] = useState(60);
  const [showOverlay, setShowOverlay] = useState(false); 
  const [overlayIcon, setOverlayIcon] = useState(null);

  const mainVideoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnections = useRef({});
  const socket = useRef(null);
  const timerIntervalRef = useRef(null);
  const [slidePosition, setSlidePosition] = useState(50); 
  const [slidePositionAmount, setSlidePositionAmount] = useState(5);

  useEffect(() => {
    initializeSocket();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (state.isLive && timer === 0) {
      stopVideo();
    } else if (state.isLive) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [state.isLive, timer]);

  const initializeSocket = () => {
    socket.current = io("http://localhost:5000");

    socket.current.on("live-users", handleLiveUsers);
    socket.current.on("new-peer", handleNewPeer);
    socket.current.on("offer", handleOffer);
    socket.current.on("answer", handleAnswer);
    socket.current.on("ice-candidate", handleIceCandidate);
    socket.current.on("peer-disconnected", handlePeerDisconnected);
    socket.current.on("go-live", handleGoLive);
    socket.current.on("main-feed", handleMainFeed);
    socket.current.on("timer-update", handleTimerUpdate);
    socket.current.on("timer-end", handleTimerEnd);
    socket.current.on("stop-video", handleStopVideo);
  };



  useEffect(() => {
    socket.current.on("timer-update", (userId, newTime) => {
      if (userId === state.liveUserId) {
        setTimer(newTime); 
      }
    });
  
    return () => {
      socket.current.off("timer-update");
    };
  }, [state.liveUserId]);
  
  

  const handleTimerUpdate = (userId, newTimer) => {
    clearInterval(timerIntervalRef.current);
    setTimer(newTimer);
  };

  const handleTimerEnd = (userId) => {
    if (userId === state.liveUserId) {
      setState((prevState) => ({ ...prevState, isLive: false }));
    }
  };



  const handleStopVideo = () => {
    stopVideo();
  };

  const handleLiveUsers = (liveUsers) => {
    console.log("Currently live users:", liveUsers);
  };

  const handleNewPeer = async (id) => {
    if (!streamRef.current || id === socket.current.id) return;
    const peerConnection = createPeerConnection(id);
    streamRef.current.getTracks().forEach((track) => peerConnection.addTrack(track, streamRef.current));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.current.emit("offer", id, offer);
  };

  const handleOffer = async (id, offer) => {
    if (id === socket.current.id) return;
    const peerConnection = createPeerConnection(id);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.current.emit("answer", id, answer);
  };

  const handleAnswer = (id, answer) => {
    if (peerConnections.current[id]) {
      peerConnections.current[id].setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = (id, candidate) => {
    const candidateObj = new RTCIceCandidate(candidate);
    if (peerConnections.current[id]) {
      peerConnections.current[id].addIceCandidate(candidateObj).catch(console.error);
    }
  };

  const handlePeerDisconnected = (id) => {
    if (peerConnections.current[id]) {
      peerConnections.current[id].close();
      delete peerConnections.current[id];
    }
  };

  const handleGoLive = () => {
    setState((prevState) => ({
      ...prevState,
      isNext: true,
      showPreviewButton: true,
    }));
  };

  const handleMainFeed = async (liveUserId) => {
    setTimer(60); 
    clearInterval(timerIntervalRef.current);
    
    setState((prevState) => ({ ...prevState, liveUserId }));
    if (mainVideoRef.current && liveUserId) {
      const peerConnection = createPeerConnection(liveUserId);
      peerConnection.ontrack = (event) => {
        mainVideoRef.current.srcObject = event.streams[0];
        if (state.autoplayAllowed) {
          mainVideoRef.current.play().catch(console.error);
        }
      };
      socket.current.emit("request-offer", liveUserId);
    }
  };

  const createPeerConnection = (id) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", id, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (mainVideoRef.current) {
        mainVideoRef.current.srcObject = event.streams[0];
        if (state.autoplayAllowed) {
          mainVideoRef.current.play().catch(console.error);
        }
      }
    };

    peerConnections.current[id] = peerConnection;
    return peerConnection;
  };

  const cleanup = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    socket.current.disconnect();
  };

  const handleJoinClick = () => {
    setState((prevState) => ({ ...prevState, isPopUpOpen: true, inQueue: true }));
    socket.current.emit("join-queue");
  };

  const handleClosePopUp = () => setState((prevState) => ({ ...prevState, isPopUpOpen: false }));

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setState((prevState) => ({ ...prevState, isCameraOn: true }));
      })
      .catch((error) => {
        alert("Unable to access the camera. Please check your device settings.");
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      if (mainVideoRef.current) {
        mainVideoRef.current.srcObject = null;
      }
      setState((prevState) => ({
        ...prevState,
        isCameraOn: false,
        showPreviewButton: false,
        isLive: false,
        isNext: false,
      }));
      clearInterval(timerIntervalRef.current);
      socket.current.emit("stop-live");
      socket.current.emit("set-initial-vote", 50);
      socket.current.emit("current-slide-amount", 5); 

      

    }
  };

  const handlePreviewButtonClick = () => startVideo();

  const handleGoLiveClick = () => {
    setState((prevState) => ({ ...prevState, isLive: true, isNext: false }));
    
    clearInterval(timerIntervalRef.current);
    socket.current.emit("go-live"); 
    socket.current.emit("set-initial-vote", 50);
    socket.current.emit("current-slide-amount", 5);
  };

  const triggerOverlay = (icon) => {
    setOverlayIcon(icon);
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
  };

  return (
    <>
      <ViewerHeader 
        state={state} 
        handleJoinClick={handleJoinClick} 
        handlePreviewButtonClick={handlePreviewButtonClick} 
        stopVideo={stopVideo} 
      />
      <ViewerMain 
        mainVideoRef={mainVideoRef} 
        state={state} 
        handleGoLiveClick={handleGoLiveClick} 
      />
      <LiveQueuePopUp
        visible={state.isPopUpOpen}
        onClose={handleClosePopUp}
        onJoin={() => setState((prevState) => ({ ...prevState, showPreviewButton: true }))}
      />
      {state.liveUserId && <Timer timer={timer} />}
      
      <Votes 
        stopVideo={stopVideo}
        slidePosition={slidePosition}
        slidePositionAmount={slidePositionAmount}
        setSlidePosition={setSlidePosition}
        setSlidePositionAmount={setSlidePositionAmount}
        liveUserId={state.liveUserId}
        triggerOverlay={triggerOverlay} 
        socket={socket.current} 
      />

      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <span className="text-red-700 text-9xl animate-pulse">{overlayIcon}</span>
        </div>
      )}
    </>
  );
};

export default Viewer;
