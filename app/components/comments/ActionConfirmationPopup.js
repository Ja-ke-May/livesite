import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';

const ActionConfirmationPopup = forwardRef(({ action, onClose }, ref) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  useImperativeHandle(ref, () => ({
    openPopup: () => setConfirmVisible(true),
  }));

  const handleConfirmClose = async (confirm) => {
    if (confirm && action === 'Record') {
      if (!recording) {
        startRecording();
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

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setRecording(true);

    const audioChunks = [];
    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorderRef.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setRecording(false);
    });

    setTimeout(() => {
      stopRecording();
    }, 4000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReRecord = () => {
    setAudioUrl(null);
    startRecording();
  };

  const handleSend = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setConfirmVisible(false);
      audio.play();
      audio.onended = () => {
        setAudioUrl(null);
        
        if (onClose) {
          onClose(true);
        }
      };
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
            {recording ? (
              <p className="text-center text-white mb-6">Recording...</p>
            ) : (
              <>
                <p className="text-center text-white mb-6">Record 3 seconds of audio for 100 tokens?</p>
                {audioUrl && (
                  <div className="mt-4">
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}
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

export default ActionConfirmationPopup;
