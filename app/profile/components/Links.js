import React, { useState } from 'react';

const LinksSection = ({ links, handleAddLink, newLinkText, setNewLinkText, newLinkUrl, setNewLinkUrl }) => {
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  const toggleAddLinkForm = () => {
    setShowAddLinkForm(!showAddLinkForm);
  };

  const handleAddLinkClick = () => {
    handleAddLink();
    setShowAddLinkForm(false); // Hide the form after adding link
  };

  return (
    <div className='flex justify-center'>
    <div className="bg-gray-800/80 rounded-lg shadow-md p-4 md:p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4 underline text-center">Links</h3>
      <div className="flex flex-wrap justify-center mb-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="text-white hover:text-blue-600 mb-2 mr-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.text}
          </a>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          className="bg-[#000110] m-4 text-white px-4 py-2 rounded border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onClick={toggleAddLinkForm}
        >
          Add Link
        </button>

        {showAddLinkForm && (
          <div className="flex flex-row">
            <input
              type="text"
              className="bg-gray-800/80 text-white px-4 py-2 rounded mb-2 md:mb-0 mr-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              placeholder="Link Text"
              value={newLinkText}
              onChange={(e) => setNewLinkText(e.target.value)}
            />
            <input
              type="text"
              className="bg-gray-800/80 text-white px-4 py-2 rounded mb-2 md:mb-0 mr-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              placeholder="Link URL"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
            />
            <button
              className="bg-[#000110] text-white px-4 rounded border border-green-600 rounded-md shadow-sm bg-gray-800/80 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
              onClick={handleAddLinkClick}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default LinksSection;
