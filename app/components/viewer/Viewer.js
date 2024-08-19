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
    const [showQueueAlert, setShowQueueAlert] = useState(false);
    const [queuePosition, setQueuePosition] = useState(null);
    const [nextUsername, setNextUsername] = useState(null);

 

    useEffect(() => {
        console.log("Current state in useEffect:", state);
    }, [state]);

    useEffect(() => {
        if (!username) {
            console.warn("Username is not defined, initializing as a guest.");
        } else {
            console.log("Username is available:", username);
        }
        
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

    useEffect(() => {
        if (socket.current) {
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
    
            return () => {
                socket.current.off("queue-position-update");
            };
        }
    }, []);
    
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("Queue Position updated:", queuePosition);
        }, 10000);
        
        return () => clearInterval(intervalId);
    }, [queuePosition]);

    const initializeSocket = () => {
        socket.current = io("http://localhost:5000");

        socket.current.on("connect", () => {
            console.log(`Connected with socket ID: ${socket.current.id}`);
            
            if (username) {
                console.log(`Registering username: ${username}`);
                socket.current.emit("register-user", username);
            } else {
                console.log("Connected as a guest.");
                // Guests are connected but do not register a username
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
        socket.current.on("stop-video", handleStopVideo);

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
            setState((prevState) => ({ ...prevState, isLive: false }));
        }
    };

    const handleStopVideo = () => {
        console.log("Stopping video.");
        stopVideo();
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
        }));
      // Emit event to check user's position in the queue
      if (username) {
        socket.current.emit("check-queue-position", username, (position) => {
            console.log("Position received from check-queue-position:", position);
            setQueuePosition(position);
            if (position === 1) {
                // User is at the first position in the queue
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
            }, 2000); // Hide the alert after 2 seconds
        } else if (state.isLive) {
            console.log("Alert: User is currently live.");
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); // Hide the alert after 2 seconds
        } else if (state.liveUserId === username) {
            console.log("Alert: User is the current live user.");
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); // Hide the alert after 2 seconds
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
            socket.current.emit("stop-live", username);
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
            setState((prevState) => ({ ...prevState, isLive: true, isNext: true }));
    
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
        }
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
                    isInteractive={!!username} 
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
