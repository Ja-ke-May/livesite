import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { deductTokens } from '@/utils/apiClient';

const ActionConfirmationPopup = forwardRef(({ action, onClose, socket, username }, ref) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [countdown, setCountdown] = useState(0);  // Countdown state

  useImperativeHandle(ref, () => ({
    openPopup: () => setConfirmVisible(true),
  }));

  const handleConfirmClose = async (confirm) => {
    if (confirm && action === 'Record') {
      if (!recording) {
        startCountdown();  // Start the countdown
      } else {
        stopRecording();
      }
    } else {
      setConfirmVisible(false);
      if (onClose) {
        onClose(confirm);
      }
    }
  };

  // Start countdown from 3 to 0
  const startCountdown = () => {
    setCountdown(3); // Set initial countdown to 3 seconds
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);  // Stop the countdown when it reaches 0
          startRecording();  // Start recording
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Decrease countdown by 1 every second
  };

  const startRecording = async () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null); 
    }
    setAudioChunks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setAudioChunks([]); 
      mediaRecorderRef.current.start();
      setRecording(true);
      setError(null);

      mediaRecorderRef.current.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob([...audioChunks], { type: 'audio/wav' });
        const newAudioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(newAudioUrl);
        setRecording(false);
      };

      setTimeout(() => {
        stopRecording();
      }, 3500);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to record audio.');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());

      mediaRecorderRef.current = null;
    }
  };

  const handleReRecord = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    startRecording();
  };

  const handleSend = async () => {
    if (audioUrl && audioChunks.length) {
      try {
        await deductTokens(200);

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64AudioMessage = reader.result;
          socket.emit('send-audio', base64AudioMessage);
        };

        socket.emit('new-comment', { 
          username, 
          comment: 'SENT A RECORDING!' 
        });

        const audio = new Audio(audioUrl);
        setConfirmVisible(false);
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          setError('Error playing audio, please try again.');
        });

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); 
          setAudioUrl(null); 
          setAudioChunks([]);
          if (onClose) {
            onClose(true);
          }
        };
      } catch (error) {
        setError('Failed to deduct tokens. Please try again.');
        console.error('Error deducting tokens:', error);
      }
    }
  };

  if (!confirmVisible) return null;

  return (
    <div className="fixed bg-[#000110]/80 inset-0 min-h-full flex items-center justify-center z-[102]">
      <div className="bg-[#000110] p-4 rounded shadow-lg mt-2 max-w-md w-full relative rounded-[5%] z-[102]">
        <button
          onClick={() => handleConfirmClose(false)}
          className="absolute top-2 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mt-4 mb-6 text-center">{action} Confirmation</h3>
        {action === 'Record' ? (
          <>
            {countdown > 0 ? (
              <p className="text-center text-white mb-6">Recording will start in {countdown}...</p>  // Show countdown
            ) : (
              <>
                {recording ? (
                  <p className="text-center text-white mb-6">Recording...</p>
                ) : (
                  <>
                    {!audioUrl && !recording && (
                      <p className="text-center text-white mb-6">Record 3 seconds of audio for <span className='text-yellow-400 brightness-125'>200 tokens?</span></p>
                    )}
                    {audioUrl && (
                      <div className="mt-4">
                        <audio controls src={audioUrl} className="w-full" />
                        <p className="text-center text-yellow-400 brightness-125 mt-4">Please check your recording before sending</p>
                      </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {audioUrl ? (
                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          onClick={handleReRecord}
                          className="text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%]"
                        >
                          Re-record
                        </button>
                        <button
                          onClick={handleSend}
                          className="hover:bg-yellow-400 hover:brightness-125 hover:text-[#000110] text-white px-4 py-2 rounded-md shadow-sm bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] brightness-125"
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleConfirmClose(false)}
                          className="text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmClose(true)}
                          className="hover:bg-yellow-400 hover:brightness-125 hover:text-[#000110] text-white px-4 py-2 rounded-md shadow-sm bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] brightness-125"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <div>
            <p className="text-center text-white mb-6">
              {action} costs 100 tokens, are you sure you want to continue?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleConfirmClose(false)}
                className="text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmClose(true)}
                className="hover:bg-yellow-400 hover:brightness-125 hover:text-[#000110] text-white px-4 py-2 rounded-md shadow-sm bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] brightness-125"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ActionConfirmationPopup.propTypes = {
  action: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

ActionConfirmationPopup.defaultProps = {
  onClose: () => {},
};

export default ActionConfirmationPopup;
