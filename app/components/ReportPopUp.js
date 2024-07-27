import React, { useImperativeHandle, useRef, useEffect, forwardRef, useState } from 'react';

const ReportPopUp = forwardRef(({ visible, onClose, username }, ref) => {
  const popupRef = useRef(null);
  const [reportText, setReportText] = useState('');
  const [submitted, setSubmitted] = useState(false); // New state for tracking submission

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current && popupRef.current.contains(element),
  }));

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

  const handleReportSubmit = () => {
    // Handle the report submission logic here
    console.log('Reporting:', username);
    console.log('Report Details:', reportText);

    // Set the submission state to true and clear the input field
    setSubmitted(true);
    setReportText('');

    // Optionally close the pop-up after a short delay to allow the user to see the message
    setTimeout(() => {
      onClose();
    }, 1000); // Delay of 2 seconds before closing
  };

  if (!visible) return null;

  return (
    <div ref={popupRef} className="relative absolute right-0 top-0 bg-gray-800 p-4 rounded-[5%] shadow-lg mt-2 max-w-md w-full z-[101]">
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
            >
              Report
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-white mt-4">
          <p>Thank you</p>
        </div>
      )}
    </div>
  );
});

export default ReportPopUp;
