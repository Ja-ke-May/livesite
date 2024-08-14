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
        console.log("Current state in useEffect:", state);
    }, [state]);
    

    useEffect(() => {
        if (!username) {
            console.error("Username is not defined!");
            return; // Early return if username is not defined
        }

        console.log("Username is available:", username);
        initializeSocket();

        return () => cleanup();
    }, [username]);

    useEffect(() => {
        if (state.isLive && state.liveUserId) {
            if (timer === 0) {
                stopVideo();
                setState((prevState) => ({
                    ...prevState,
                    isLive: false,
                    isCameraOn: false,
                    showPreviewButton: false,
                    isNext: false,
                }));
            }
        }
    }, [timer, state.isLive, state.liveUserId]);
    

    const initializeSocket = () => {
        socket.current = io("http://localhost:5000");

        socket.current.on("connect", () => {
            console.log(`Connected with socket ID: ${socket.current.id}`);
            console.log(`Registering username: ${username}`);
            socket.current.emit("register-user", username);
        });

        socket.current.on("join-queue", () => {
            console.log("Received join-queue event");
            handleJoinQueue();
        });

        socket.current.on("live-users", handleLiveUsers);
        socket.current.on("new-peer", handleNewPeer);
        socket.current.on("offer", handleOffer);
        socket.current.on("answer", handleAnswer);
        socket.current.on("ice-candidate", handleIceCandidate);
        socket.current.on("peer-disconnected", handlePeerDisconnected);
        socket.current.on("main-feed", handleMainFeed);
        socket.current.on("timer-update", handleTimerUpdate);
        socket.current.on("timer-end", handleTimerEnd);
        socket.current.on("stop-video", handleStopVideo);

        socket.current.on("go-live-prompt", () => {
            console.log("Received 'go-live-prompt', setting isNext to true");
            setState((prevState) => ({
                ...prevState,
                isNext: true,
                isLive: false,
            }));
        });

        // Listen for current slide position and amount when the page loads
        socket.current.on("current-position", (position) => {
            setSlidePosition(position);
        });

        socket.current.on("current-slide-amount", (amount) => {
            setSlidePositionAmount(amount);
        });

        socket.current.on("go-live", () => {
            console.log("Received 'go-live' event");
            setState((prevState) => ({ ...prevState, isNext: true }));
        });

        socket.current.on("is-next", (isNext) => {
            console.log("Received 'is-next' event with value:", isNext);
            setState((prevState) => ({
                ...prevState,
                isNext: isNext,
            }));
            console.log("Updated state after 'is-next' event:", { ...state, isNext });
        });

    };

    useEffect(() => {
        console.log("Current state in useEffect (username):", state);
    }, [username]);

    useEffect(() => {
        console.log("Current state in useEffect (isNext):", state.isNext);
    }, [state.isNext]);

    useEffect(() => {
        if (socket.current && state.liveUserId) {
            const handleTimerUpdate = (userId, newTime) => {
                if (userId === state.liveUserId) {
                    setTimer(newTime);
                }
            };
    
            socket.current.on("timer-update", handleTimerUpdate);
    
            return () => {
                socket.current.off("timer-update", handleTimerUpdate);
            };
        }
    }, [state.liveUserId]);
    

    const handleTimerUpdate = (newTimer) => {
        console.log("Handling timer update. New timer value:", newTimer);
        clearInterval(timerIntervalRef.current);
        setTimer(newTimer);
    };

    const handleTimerEnd = (userId) => {
        if (userId === state.liveUserId) {
            console.log("Timer ended for live user:", userId);
            setState((prevState) => ({ ...prevState, isLive: false, }));
        }
    };

    const handleStopVideo = () => {
        console.log("Stopping video.");
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
        console.log(`Peer disconnected with ID: ${id}`);
        if (peerConnections.current[id]) {
            peerConnections.current[id].close();
            delete peerConnections.current[id];
        }
    };

    const handleJoinQueue = () => {
        console.log("Handling join queue. Resetting isNext to false.");
        setState((prevState) => ({
            ...prevState,
            inQueue: true, 
            isNext: false,
            showPreviewButton: true,
        }));
    };

    const handleMainFeed = async (liveUserId) => {
        console.log("Handling main feed update. Live user ID:", liveUserId);
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
        console.log("Cleaning up Viewer component.");
        Object.values(peerConnections.current).forEach((pc) => pc.close());
    
        if (socket.current) {
            socket.current.disconnect();
        }
    
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };
    
    useEffect(() => {
        return () => cleanup();
    }, []);
    

    const handleJoinClick = () => {
        console.log("Handling join click.");
        if (state.inQueue) {
            console.log("User is already in the queue.");
        } else {
            setState((prevState) => ({ ...prevState, isPopUpOpen: true }));
        }
    };

    const handleUserDecisionToJoinQueue = () => {
        console.log("User decided to join queue.");
        setState((prevState) => ({ ...prevState, inQueue: true, showPreviewButton: true }));
        socket.current.emit("join-queue", username); 
    };

    const handleClosePopUp = () => {
        console.log("Closing popup.");
        setState((prevState) => ({ ...prevState, isPopUpOpen: false }));
    };

    const startVideo = () => {
        console.log("Starting video.");
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
        console.log("Stopping video and resetting state. Timer was:", timer);
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
                inQueue: false,
            }));
            clearInterval(timerIntervalRef.current);
            socket.current.emit("stop-live");
            socket.current.emit("set-initial-vote", 50);
            socket.current.emit("current-slide-amount", 5);
        }
    };
    

    const handlePreviewButtonClick = () => startVideo();

    const handleGoLiveClick = () => {
        if (!state.isLive) {
        console.log("User clicked 'Go Live'.");
        clearInterval(timerIntervalRef.current); // Clear any existing interval
        setTimer(60); // Reset timer
        setState((prevState) => ({ ...prevState, isLive: true, isNext: false }));
    
        timerIntervalRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerIntervalRef.current);
                    stopVideo(); // Stop video when timer reaches 0
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    
        socket.current.emit("go-live", username); 
        socket.current.emit("set-initial-vote", 50);
        socket.current.emit("current-slide-amount", 5);
    };
};

    const triggerOverlay = (icon) => {
        console.log("Triggering overlay with icon:", icon);
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
                onJoin={handleUserDecisionToJoinQueue}
            />
            {state.liveUserId && <Timer timer={timer} />}

            {/* Show Votes to everyone only when someone is live */}
            {state.isLive || state.liveUserId ? (
                <Votes
                    stopVideo={stopVideo}
                    slidePosition={slidePosition}
                    slidePositionAmount={slidePositionAmount}
                    setSlidePosition={setSlidePosition}
                    setSlidePositionAmount={setSlidePositionAmount}
                    liveUserId={state.liveUserId || username}
                    triggerOverlay={triggerOverlay}
                    socket={socket.current}
                />
            ) : (
                <div className='mt-2'>Nobody's live at the moment</div>
            )}

            {showOverlay && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <span className="text-red-700 text-9xl animate-pulse">{overlayIcon}</span>
                </div>
            )}
        </>
    );
};

export default Viewer;
