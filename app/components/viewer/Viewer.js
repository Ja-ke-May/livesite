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
  const [timer, setTimer] = useState('');
  const mainVideoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnections = useRef({});
  const socket = useRef(null);
  const timerIntervalRef = useRef(null);
  const [slidePosition, setSlidePosition] = useState(null); 
  const [slidePositionAmount, setSlidePositionAmount] = useState(5);

  useEffect(() => {
    initializeSocket();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (state.isLive && timer === 0) {
      stopVideo();
    } else if (state.isLive) {
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
    socket.current.on("extend-timer", handleExtendTimer);
    socket.current.on("stop-video", handleStopVideo);
  };

  const handleTimerUpdate = (userId, newTimer) => {
    setTimer(newTimer);
  };

  const handleTimerEnd = (userId) => {
    if (userId === state.liveUserId) {
      setState((prevState) => ({ ...prevState, isLive: false }));
      setTimer(0);
    }
  };

  const handleExtendTimer = (additionalTime) => {
    setTimer((prevTimer) => prevTimer + additionalTime);
  };

  const handleStopVideo = () => {
    stopVideo();
  };

  const handleLiveUsers = (liveUsers) => {
    console.log("Currently live users:", liveUsers);
  };

  const handleNewPeer = async (id) => {
    console.log(`Handling new peer: ${id}`);
    if (!streamRef.current || id === socket.current.id) return;
    const peerConnection = createPeerConnection(id);
    streamRef.current.getTracks().forEach((track) => peerConnection.addTrack(track, streamRef.current));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.current.emit("offer", id, offer);
  };

  const handleOffer = async (id, offer) => {
    console.log(`Handling offer from ${id}`);
    if (id === socket.current.id) return;
    const peerConnection = createPeerConnection(id);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.current.emit("answer", id, answer);
  };

  const handleAnswer = (id, answer) => {
    console.log(`Handling answer from ${id}`);
    if (peerConnections.current[id]) {
      peerConnections.current[id].setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = (id, candidate) => {
    console.log(`Handling ICE candidate from ${id}`);
    const candidateObj = new RTCIceCandidate(candidate);
    if (peerConnections.current[id]) {
      peerConnections.current[id].addIceCandidate(candidateObj).catch(console.error);
    }
  };

  const handlePeerDisconnected = (id) => {
    console.log(`Peer disconnected: ${id}`);
    if (peerConnections.current[id]) {
      peerConnections.current[id].close();
      delete peerConnections.current[id];
    }
  };

  const handleGoLive = () => {
    console.log("Go live");
    setState((prevState) => ({
      ...prevState,
      isNext: true,
      showPreviewButton: true,
    }));
  };

  const handleMainFeed = async (liveUserId) => {
    console.log(`Main feed update: ${liveUserId}`);
    setState((prevState) => ({ ...prevState, liveUserId }));
    if (mainVideoRef.current && liveUserId) {
      console.log(`Setting up peer connection to receive stream from: ${liveUserId}`);
      const peerConnection = createPeerConnection(liveUserId);
      peerConnection.ontrack = (event) => {
        console.log("Received remote track", event.streams[0]);
        mainVideoRef.current.srcObject = event.streams[0];
        if (state.autoplayAllowed) {
          mainVideoRef.current.play().catch(console.error);
        }
      };
      socket.current.emit("request-offer", liveUserId); // Request the offer from the live user
    }
  };

  const createPeerConnection = (id) => {
    console.log(`Creating peer connection for ${id}`);
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`Sending ICE candidate to ${id}`, event.candidate);
        socket.current.emit("ice-candidate", id, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("On track event", event.streams[0]);
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
      socket.current.emit("stop-live");
      setSlidePosition(null); 
    }
  };

  const handlePreviewButtonClick = () => startVideo();

  const handleGoLiveClick = () => {
    setState((prevState) => ({ ...prevState, isLive: true, isNext: false }));
    setTimer(60);
    socket.current.emit("go-live"); // Emit the event when going live
    socket.current.emit("set-initial-vote", 50);
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
/>
    </>
  );
};

export default Viewer;
