import React, { useState } from 'react';
import TermsAndConditionsModal from '../login/components/TermsAndConditionsModal';

const Over18 = ({ onConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000110]/80 z-50">
      <div className="p-4 md:p-6 rounded-lg shadow-lg bg-[#000110]/80">
        <h2 className="text-xl text-center mb-2">You must be over 18 to use this site. Are you over 18?</h2>
       
        <TermsAndConditionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
        <div className="flex justify-center mb-4">
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
        <p className="text-center text-sm text-red-500 mb-2">
          No pornographic or illegal content is allowed on this platform. Violators will be banned.
        </p>
        <div className="flex justify-center">
          
          <button
            className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-none hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            onClick={handleOpenModal}
          >
            View Terms and Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Over18;
