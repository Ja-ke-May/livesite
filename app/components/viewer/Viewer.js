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
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayIcon, setOverlayIcon] = useState(null);

    const mainVideoRef = useRef(null);
    const streamRef = useRef(null);
    const peerConnections = useRef({});
    const socket = useRef(null);
    const timerIntervalRef = useRef(null);
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
            console.warn("User is a guest, limited features available.");
        } else {
            console.log("Authenticated user:", username);
            initializeSocket();
        }
    
        return () => cleanup();
    }, [username]);

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

        socket.current.on("answer", (id, answer) => {
            handleAnswer(id, answer);
        });
          
        socket.current.on("ice-candidate", handleIceCandidate);
        socket.current.on("peer-disconnected", handlePeerDisconnected);
        socket.current.on("main-feed", handleMainFeed);
        socket.current.on("timer-update", handleTimerUpdate);
        socket.current.on("timer-end", handleTimerEnd);

        socket.current.on("stop-live", () => {
            console.log("Received 'stop-live'");
            // Only reset state if the live user matches
            if (state.liveUserId === username) {
                setState((prevState) => ({
                    ...prevState,
                    isPopUpOpen: false,
                    isCameraOn: false,
                    showPreviewButton: false,
                    isLive: false,
                    inQueue: false,
                    isNext: false,
                    autoplayAllowed: true,
                    liveUserId: null,
                }));
                handleStopVideo();
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

        socket.current.on("cleanup-connections", () => {
            Object.values(peerConnections.current).forEach((pc) => {
                pc.close();
                delete peerConnections.current[pc];
            });
        
            mainVideoRef.current.srcObject = null;
            console.log("Cleaned up all connections");
        });

        socket.current.on("reset-state", () => {
            console.log("Received 'reset-state' event, resetting the user's state.");
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
        });
        

        socket.current.on("queue-position-update", (position) => {
            console.log("Received queue-position-update event with position:", position);
            setQueuePosition(position);
            console.log("Queue position state updated to:", position);
    
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
            setState((prevState) => ({ ...prevState, isLive: false, liveUserId: null, }));
            stopVideo(true);
        }
    };

    const handleStopVideo = () => {
        console.log("Stopping video.");
    
        // Only proceed if the current user is the live user
        if (state.liveUserId === username) {
            stopVideo(false, true); // The second argument `true` indicates the live user is stopping the video.
            Object.values(peerConnections.current).forEach((pc) => {
                pc.close();
                delete peerConnections.current[pc];
            });
            mainVideoRef.current.srcObject = null;
        } else {
            console.log("Stop video called, but user is not the current live user. No state reset will occur.");
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
                console.log(`Successfully set remote description for peer: ${id}`);
                
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
            const candidateObj = new RTCIceCandidate(candidate);
            peerConnection.addIceCandidate(candidateObj).catch(console.error);
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

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            stopVideo();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    

    const handleJoinClick = () => {
        console.log("Handling join click.");
    
        if (state.inQueue) {
            console.log("Alert: User is already in the queue.");
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000);
        } else if (state.isLive) {
            console.log("Alert: User is currently live.");
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); 
        } else if (state.liveUserId === username) {
            console.log("Alert: User is the current live user.");
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); 
        } else {
            if (username) {
                socket.current.emit("check-username", username, (exists) => {
                    if (exists) {
                        console.log("Alert: Username is already in the queue or currently live.");
                        setShowQueueAlert(true);
                        setTimeout(() => {
                            setShowQueueAlert(false);
                        }, 2000);
                    } else {
                        console.log("Username is available, opening pop-up to join the queue.");
                        setState((prevState) => ({ ...prevState, isPopUpOpen: true }));
                    }
                });
            } else {
                console.log("No username provided, opening pop-up to join the queue.");
                setState((prevState) => ({ ...prevState, isPopUpOpen: true }));
            }
        }
    };
    
    const handleUserDecisionToJoinQueue = (isFastPass = false) => {
        console.log("User decided to join the queue.");
       
    
        if (username) {
            socket.current.emit("check-username", username, (exists) => {
                if (!exists) {
                    console.log("Username is not in use, joining the queue.");
                    setState((prevState) => ({ ...prevState, inQueue: true }));
                    socket.current.emit("join-queue", { username, isFastPass }); 
                    
                } else {
                    console.log("Alert: Username is already in the queue or currently live.");
                    setState((prevState) => ({ ...prevState, inQueue: false }));
                    setShowQueueAlert(true);

                    setTimeout(() => {
                        setShowQueueAlert(false);
                    }, 2000);
                }
            });
        }
    };
    

    const handleClosePopUp = () => {
        console.log("Closing popup.");
        setState((prevState) => ({ ...prevState, isPopUpOpen: false }));
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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

    const stopVideo = (isTimerEnd = false, isLiveUser = false) => {
        console.log("Stopping video and resetting state. Timer was:", timer);
    
        // Check if the stream exists before trying to stop it
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    
        if (mainVideoRef.current) {
            mainVideoRef.current.srcObject = null;
        }
    
        Object.values(peerConnections.current).forEach((pc) => {
            pc.close();
        });
        peerConnections.current = {}; 
    
        if (isLiveUser && socket.current) {
            socket.current.emit("stop-live", username);
            socket.current.emit("set-initial-vote", 50);
            socket.current.emit("current-slide-amount", 5);
    
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
    
            if (isTimerEnd) {
                console.log("Resetting state because the timer ended.");
            }
        } else {
            console.log("Stop video called, but no state reset will occur as the user is not the live user.");
        }
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
    
            socket.current.emit("go-live", username); 
            socket.current.emit("set-initial-vote", 50);
            socket.current.emit("current-slide-amount", 5);
        }
    };

    const triggerOverlay = (icon) => {
        setOverlayIcon(icon);
        setShowOverlay(true);
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    };

    const handleZeroVotes = () => {
        stopVideo(); 
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
                    onZeroVotes={handleZeroVotes}
                    slidePosition={slidePosition}
                    slidePositionAmount={slidePositionAmount}
                    setSlidePosition={setSlidePosition}
                    setSlidePositionAmount={setSlidePositionAmount}
                    liveUserId={state.liveUserId || username}
                    triggerOverlay={triggerOverlay}
                    socket={socket.current}
                    isInteractive={!!username} 
                    username={username}
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
