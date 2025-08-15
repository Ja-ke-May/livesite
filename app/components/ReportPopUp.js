import React, { useImperativeHandle, useRef, useEffect, forwardRef, useState } from 'react';
import { reportUser, blockUser } from '@/utils/apiClient'; 

const ReportPopUp = forwardRef(({ visible, onClose, username, isAdmin }, ref) => {
  const popupRef = useRef(null);
  const [reportText, setReportText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  
  const [showBlockOptions, setShowBlockOptions] = useState(false); 

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current && popupRef.current.contains(element),
  }));

  useEffect(() => {
  }, [isAdmin]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  const handleReportSubmit = async () => {
    setLoading(true);
    setError(null);  
    try {
      await reportUser(username, reportText);
      setSubmitted(true);
      setReportText('');
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      setError('Failed to submit report. Please try again.');
      console.error('Failed to submit report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = () => {
    setShowBlockOptions(true);  
  };

  const handleBlockUser = async (duration) => {
    setLoading(true);
    try {
      await blockUser(username, duration); 
      setTimeout(() => onClose(), 1000); 
    } catch (error) {
      setError('Failed to block user. Please try again.');
      console.error('Failed to block user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div ref={popupRef} className="relative absolute right-0 top-0 bg-[#000110] p-4 rounded-[5%] shadow-lg mt-2 max-w-md w-full z-[101]">
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>

      {!submitted ? (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-4 text-center">Report {username}</h3>
          <div className='max-h-[400px] overflow-y-auto'>
            <textarea
              className="w-full h-32 p-2 mb-4 border border-gray-600 rounded-md bg-gray-700 text-white resize-none"
              placeholder={`Please explain why you are reporting ${username}`}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
            <button
              onClick={handleReportSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={loading}  // Disable button while loading
            >
              {loading ? 'Submitting...' : 'Report'}
            </button>
            {error && (
              <p className="text-red-500 mt-2 text-center">{error}</p>  // Display error message if any
            )}
          </div>

           {/* Admin-only Button */}
           {isAdmin && (
            <div className="mt-4">
              {!showBlockOptions ? (
                <button
                  onClick={handleAdminAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Admin Actions
                </button>
              ) : (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleBlockUser('1 day')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Block for 1 Day
                  </button>
                  <button
                    onClick={() => handleBlockUser('1 week')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Block for 1 Week
                  </button>
                  <button
                    onClick={() => handleBlockUser('1 month')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Block for 1 Month
                  </button>
                  <button
                    onClick={() => handleBlockUser('permanent')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Permanent Ban
                  </button>
                </div>
              )}
            </div>
          )}

        </>
      ) : (
        <div className="text-center text-white mt-4">
          <p>Thank you for your report.</p>
        </div>
      )}
    </div>
  );
});

export default ReportPopUp;
