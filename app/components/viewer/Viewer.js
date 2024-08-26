import { useState, useRef, useEffect, useContext } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";
import Timer from "./LiveTimer";
import io from "socket.io-client";
import { AuthContext } from "@/utils/AuthContext";
import ViewerHeader from "./ViewerHeader";
import ViewerMain from "./ViewerMain";
import Votes from "./Votes";
import { updateLiveDuration } from "@/utils/apiClient";

const Viewer = () => {
    const { username } = useContext(AuthContext);
    const isGuest = !username;
    
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
    const [liveDuration, setLiveDuration] = useState(0); 

    const mainVideoRef = useRef(null);
    const streamRef = useRef(null);
    const peerConnections = useRef({});
    const socket = useRef(null);
    const timerIntervalRef = useRef(null);
    const liveDurationIntervalRef = useRef(null);
    const previousLiveUserIdRef = useRef(null);
    const [slidePosition, setSlidePosition] = useState(50);
    const [slidePositionAmount, setSlidePositionAmount] = useState(5); 
    const [showQueueAlert, setShowQueueAlert] = useState(false);
    const [queuePosition, setQueuePosition] = useState(null);
    const [nextUsername, setNextUsername] = useState(null);

    useEffect(() => {
        console.log("Current state in useEffect:", state);
    }, [state]);

    useEffect(() => {
        if (isGuest) {
            console.log("User is a guest, limited features available.");
            initializeSocket();
        } else {
            console.log("Authenticated user:", username);
            initializeSocket();
        }
    
        return () => cleanup();
    }, [username]);

    useEffect(() => {
        if (state.liveUserId === username && !liveDurationIntervalRef.current) {
            // Start tracking live duration
            console.log("Starting live duration tracking for user:", username);
            setLiveDuration(0);
            liveDurationIntervalRef.current = setInterval(() => {
                setLiveDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        } else if (state.liveUserId !== username && liveDurationIntervalRef.current) {
            // Stop tracking and record the duration when the user stops being live
            console.log("Stopping live duration tracking for user:", username);
            clearInterval(liveDurationIntervalRef.current);
            liveDurationIntervalRef.current = null;

            if (liveDuration > 0) {
                updateLiveDuration(username, liveDuration)
                    .then(() => console.log('Live duration updated successfully'))
                    .catch((error) => console.error('Failed to update live duration', error));
            }
            setLiveDuration(0);
        }

        previousLiveUserIdRef.current = state.liveUserId;
    }, [state.liveUserId, username, liveDuration]);

    const initializeSocket = () => {
        socket.current = io('https://livesite-backend.onrender.com', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity, 
            reconnectionDelay: 1000, 
            reconnectionDelayMax: 5000, 
        });

        socket.current.on("connect", () => {
            console.log(`Connected with socket ID: ${socket.current.id}`);
            
            if (username) {
                console.log(`Registering username: ${username}`);
                socket.current.emit("register-user", username);
            } else {
                console.log("Connected as a guest.");
            }
        });

        socket.current.on("join-queue", () => {
            console.log("Received join-queue event");
            handleJoinQueue();
        });

        socket.current.on("new-peer", handleNewPeer);
        socket.current.on("offer", handleOffer);
        socket.current.on("answer", handleAnswer);
        socket.current.on("ice-candidate", handleIceCandidate);
        socket.current.on("peer-disconnected", handlePeerDisconnected);
        socket.current.on("main-feed", handleMainFeed);
        socket.current.on("timer-update", handleTimerUpdate);
        socket.current.on("timer-end", handleTimerEnd);

        socket.current.on("stop-live", () => {
            console.log("Received 'stop-live'");
            if (state.liveUserId === username) {
                stopVideo(true, true);
                window.location.reload(); 
            }
        });

        socket.current.on("up-next-update", (nextUser) => {
            console.log("Received up-next-update event with next user:", nextUser);
            setNextUsername(nextUser);  
        });

        socket.current.on("go-live-prompt", () => {
            console.log("Received 'go-live-prompt', setting isNext to true");
            setState((prevState) => ({
                ...prevState,
                isNext: true,
                isLive: false,
                showPreviewButton: true,
            }));
        });

        socket.current.on("current-position", setSlidePosition);
        socket.current.on("current-slide-amount", setSlidePositionAmount);

        socket.current.on("go-live", () => {
            console.log("Received 'go-live' event");
            setState((prevState) => ({ ...prevState, isNext: true }));
        });

        socket.current.on("cleanup-connections", cleanupConnections);

        socket.current.on("reset-state", () => {
            console.log("Received 'reset-state' event, resetting the user's state.");
            resetState();
        });

        socket.current.on("queue-position-update", (position) => {
            console.log("Received queue-position-update event with position:", position);
            setQueuePosition(position);
    
            if (position === 1) {
                setState((prevState) => ({
                    ...prevState,
                    showPreviewButton: true,
                }));
            } else {
                setState((prevState) => ({
                    ...prevState,
                    showPreviewButton: false,
                }));
            }
        });
    };

    const cleanupConnections = () => {
        Object.values(peerConnections.current).forEach((pc) => {
            pc.close();
        });
        peerConnections.current = {};

        if (mainVideoRef.current) {
            mainVideoRef.current.srcObject = null;
        }
        console.log("Cleaned up all connections");
    };

    const resetState = () => {
        setState({
            isPopUpOpen: false,
            isCameraOn: false,
            showPreviewButton: false,
            isLive: false,
            inQueue: false,
            isNext: false,
            autoplayAllowed: true,
            liveUserId: null,
        });
    };

    const cleanup = () => {
        console.log("Cleaning up Viewer component.");
        cleanupConnections();

        if (socket.current) {
            socket.current.disconnect();
        }
    
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        if (liveDurationIntervalRef.current) {
            clearInterval(liveDurationIntervalRef.current);
            liveDurationIntervalRef.current = null;
        }
    };
    
    useEffect(() => {
        return () => cleanup();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            stopVideo();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    const handleTimerUpdate = (newTimer) => {
        console.log("Handling timer update. New timer value:", newTimer);
        clearInterval(timerIntervalRef.current);
        setTimer(newTimer);
    };

    const handleTimerEnd = (userId) => {
        if (userId === state.liveUserId) {
            console.log("Timer ended for live user:", userId);
            stopVideo(true, true);
            window.location.reload();
        }
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
        try {
            const peerConnection = createPeerConnection(id);
            if (peerConnection.signalingState === "stable" || peerConnection.signalingState === "have-local-offer") {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                handleRemoteDescriptionSet(peerConnection); 
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.current.emit("answer", id, answer);
            } else {
                console.warn("Peer connection is not in a stable state to accept an offer.");
            }
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    };

    const handleAnswer = async (id, answer) => {
        try {
            const peerConnection = peerConnections.current[id];
            if (peerConnection && peerConnection.signalingState === "have-local-offer") {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                handleRemoteDescriptionSet(peerConnection);
            } else {
                console.warn(`Peer connection is not in the correct state to accept an answer for peer: ${id}`);
            }
        } catch (error) {
            console.error(`Error handling answer for peer: ${id}`, error);
        }
    };

    const handleIceCandidate = (id, candidate) => {
        const peerConnection = peerConnections.current[id];
        if (!peerConnection) return;
    
        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
        } else {
            if (!peerConnection.iceCandidateBuffer) {
                peerConnection.iceCandidateBuffer = [];
            }
            peerConnection.iceCandidateBuffer.push(candidate);
            console.warn("Buffered ICE candidate, remote description is not set yet.");
        }
    };

    const handleRemoteDescriptionSet = (peerConnection) => {
        if (peerConnection.iceCandidateBuffer) {
            peerConnection.iceCandidateBuffer.forEach(candidate => {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
            });
            delete peerConnection.iceCandidateBuffer;
        }
    };

    const handlePeerDisconnected = (id) => {
        console.log(`Peer disconnected with ID: ${id}`);
        const peerConnection = peerConnections.current[id];
        if (peerConnection) {
            peerConnection.close();
            delete peerConnections.current[id];
        }
    };

    const handleJoinQueue = () => {
        console.log("Handling join queue. Resetting isNext to false.");
        setState((prevState) => ({
            ...prevState,
            inQueue: true, 
            isNext: false,
        }));
        if (username) {
            socket.current.emit("check-queue-position", username, (position) => {
                console.log("Position received from check-queue-position:", position);
                setQueuePosition(position);
                if (position === 1) {
                    setState((prevState) => ({
                        ...prevState,
                        showPreviewButton: true,
                    }));
                }
            });
        }
    };

    const handleMainFeed = async (liveUserId) => {
        console.log("Handling main feed update. Live user ID:", liveUserId);
        clearInterval(timerIntervalRef.current);
        setTimer(60);

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
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
            ],
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

    const stopVideo = (isTimerEnd = false, isLiveUser = false) => {
        console.log("Stopping video and resetting state. Timer was:", timer);
    
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
                console.log(`Track of kind ${track.kind} stopped.`);
            });
            streamRef.current = null;
        }
    
        if (mainVideoRef.current) {
            mainVideoRef.current.srcObject = null;
        }
    
        cleanupConnections();

        if (isLiveUser && socket.current) {
            socket.current.emit("stop-live", username);
            socket.current.emit("set-initial-vote", 50);
            socket.current.emit("current-slide-amount", 5);
    
            resetState();
    
            if (isTimerEnd) {
                console.log("Resetting state because the timer ended.");
            }
        } else {
            console.log("Stop video called, but no state reset will occur as the user is not the live user.");
        }
        console.log("Video stopped successfully.");
    };

    const handlePreviewButtonClick = () => startVideo();

    const handleGoLiveClick = () => {
        if (!state.isLive) {
            console.log("User clicked 'Go Live'.");
            clearInterval(timerIntervalRef.current);
            setTimer(60);
            setState((prevState) => ({ 
                ...prevState, 
                isLive: true, 
                isNext: true, 
                liveUserId: username 
            }));
    
            timerIntervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerIntervalRef.current);
                        stopVideo();
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            
            socket.current.emit("set-initial-vote", 50);
            socket.current.emit("current-slide-amount", 5);
            socket.current.emit("go-live", username); 
        }
    };

    return (
        <>
            <ViewerHeader
                state={state}
                handleJoinClick={handleJoinClick}
                handlePreviewButtonClick={handlePreviewButtonClick}
                stopVideo={stopVideo} 
                showQueueAlert={showQueueAlert} 
                queuePosition={queuePosition}
            />
            <div className="group"> 
                <ViewerMain
                    mainVideoRef={mainVideoRef}
                    state={state}
                    handleGoLiveClick={handleGoLiveClick}
                    liveUserId={state.liveUserId || username}
                    upNext={nextUsername}
                    username={username}
                />
            </div>
            <LiveQueuePopUp
                visible={state.isPopUpOpen}
                onClose={handleClosePopUp}
                onJoin={handleUserDecisionToJoinQueue}
                queuePosition={queuePosition}
            />
            {state.liveUserId && <Timer timer={timer} />}

            {state.liveUserId ? (
                <Votes
                    slidePosition={slidePosition}
                    slidePositionAmount={slidePositionAmount}
                    setSlidePosition={setSlidePosition}
                    setSlidePositionAmount={setSlidePositionAmount}
                    liveUserId={state.liveUserId || username}
                    socket={socket.current}
                    isInteractive={!!username} 
                    username={username}
                    nextUsername={nextUsername}
                    stopVideo={stopVideo}
                />
            ) : (
                <div className='mt-2'>Nobody's live at the moment</div>
            )}

        </>
    );
};

export default Viewer;
