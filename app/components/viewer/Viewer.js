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

    const previousLiveUserIdRef = useRef(null);

    useEffect(() => {
    }, [state]);

    useEffect(() => {
        if (isGuest) {
            initializeSocket();
        } else {
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
            
            if (username) {
                socket.current.emit("register-user", username);
            } 
        });

        socket.current.on("join-queue", () => {
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
                stopVideo();
                window.location.reload(); 
            }
        });

        socket.current.on("up-next-update", (nextUser) => {
            setNextUsername(nextUser);  
        });

        socket.current.on("go-live-prompt", () => {
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
            setState((prevState) => ({ ...prevState, isNext: true }));
        });

        socket.current.on("cleanup-connections", () => {
            Object.values(peerConnections.current).forEach((pc) => {
                pc.close();
                delete peerConnections.current[pc];
            });
        
            mainVideoRef.current.srcObject = null;
        });

        socket.current.on("reset-state", () => {
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

    useEffect(() => {
        if (
            state.liveUserId === null && 
            previousLiveUserIdRef.current === username && 
            previousLiveUserIdRef.current !== null &&
            nextUsername !== username 
        ) {
            window.location.reload();
        }
        previousLiveUserIdRef.current = state.liveUserId; 
    }, [state.liveUserId, username, nextUsername]);

    const handleTimerUpdate = (newTimer) => {
        clearInterval(timerIntervalRef.current);
        setTimer(newTimer);
    };

    const handleTimerEnd = (userId) => {
        if (userId === state.liveUserId) {
            setState((prevState) => ({ ...prevState, isLive: false, liveUserId: null, }));

            stopVideo(true);
            
            if (username === userId) {
                window.location.reload();
            }
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
            console.error(`Error handling answer for peer: ${id}, error`);
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
        const peerConnection = peerConnections.current[id];
        
        if (peerConnection) {
            peerConnection.close();
            delete peerConnections.current[id];
        }
    };
    

    const handleJoinQueue = () => {
        setState((prevState) => ({
            ...prevState,
            inQueue: true, 
            isNext: false,
        }));
        if (username) {
            socket.current.emit("check-queue-position", username, (position) => {
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
        const handleBeforeUnload = () => {
            stopVideo();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    

    const handleJoinClick = () => {
    
        if (state.inQueue) {
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000);
        } else if (state.isLive) {
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); 
        } else if (state.liveUserId === username) {
            setShowQueueAlert(true);
            setTimeout(() => {
                setShowQueueAlert(false);
            }, 2000); 
        } else {
            if (username) {
                socket.current.emit("check-username", username, (exists) => {
                    if (exists) {
                        setShowQueueAlert(true);
                        setTimeout(() => {
                            setShowQueueAlert(false);
                        }, 2000);
                    } else {
                        setState((prevState) => ({ ...prevState, isPopUpOpen: true }));
                    }
                });
            } else {
                setState((prevState) => ({ ...prevState, isPopUpOpen: true }));
            }
        }
    };
    
    const handleUserDecisionToJoinQueue = (isFastPass = false) => {
       
    
        if (username) {
            socket.current.emit("check-username", username, (exists) => {
                if (!exists) {
                    setState((prevState) => ({ ...prevState, inQueue: true }));
                    socket.current.emit("join-queue", { username, isFastPass }); 
                    
                } else {
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

      const stopVideo = ( isLiveUser = false) => {
    
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();  
            });
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
        } else {
        }
    };
    

    const handlePreviewButtonClick = () => startVideo();

    const handleGoLiveClick = () => {
        if (!state.isLive) {
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