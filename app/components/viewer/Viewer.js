import { useState, useRef, useEffect, useContext } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";
import Timer from "./timer";
import io from "socket.io-client";
import { AuthContext } from "@/utils/AuthContext";

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
  const mainVideoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnections = useRef({});
  const socket = useRef(null);

  useEffect(() => {
    initializeSocket();
    return () => cleanup();
  }, []);

  const initializeSocket = () => {
    socket.current = io("http://localhost:5000");

    socket.current.on("live-users", (liveUsers) => {
      console.log("Currently live users:", liveUsers);
    });

    socket.current.on("new-peer", handleNewPeer);
    socket.current.on("offer", handleOffer);
    socket.current.on("answer", handleAnswer);
    socket.current.on("ice-candidate", handleIceCandidate);
    socket.current.on("peer-disconnected", handlePeerDisconnected);
    socket.current.on("go-live", handleGoLive);
    socket.current.on("main-feed", handleMainFeed);
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
    }
  };

  const handlePreviewButtonClick = () => startVideo();

  const handleTimeout = () => stopVideo();

  const handleGoLiveClick = () => {
    setState((prevState) => ({ ...prevState, isLive: true, isNext: false }));
    socket.current.emit("go-live"); // Emit the event when going live
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
              disabled={state.inQueue}
            >
              JOIN
            </button>
          </>
        )}
      </div>
      <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md w-full">
        <h2 className="hidden">Viewer Component</h2>
        <video ref={mainVideoRef} autoPlay muted className="w-full h-full object-cover" />
        {!state.isLive && state.isCameraOn && state.isNext && (
          <div className="absolute inset-0 flex items-center justify-center items-center">
            <button
              onClick={handleGoLiveClick}
              className="bg-green-600 text-white text-md md:text-lg font-bold rounded p-4 animate-pulse"
            >
              GO LIVE
            </button>
          </div>
        )}
      </div>
      <LiveQueuePopUp
        visible={state.isPopUpOpen}
        onClose={handleClosePopUp}
        onJoin={() => setState((prevState) => ({ ...prevState, showPreviewButton: true }))}
      />
      {state.isLive && <Timer isActive={state.isLive} onTimeout={handleTimeout} />}
    </>
  );
};

export default Viewer;

