import React from 'react';

const Over18 = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000110]/80 z-50">
      <div className="p-4 md:p-6 rounded-lg shadow-lg bg-[#000110]/80">
        <h2 className="text-xl text-center mb-4">You must be over 18 to use this site. Are you over 18?</h2>
        <div className="flex justify-center">
          <button
            className="mr-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            onClick={() => onConfirm(false)}
          >
            No
          </button>
          <button
            className="mr-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            onClick={() => onConfirm(true)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Over18;
