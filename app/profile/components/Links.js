import React, { useState, useCallback } from 'react';

const LinksSection = ({ links, handleAddLink, newLinkText, setNewLinkText, newLinkUrl, setNewLinkUrl, newLinkImage, setNewLinkImage, handleDeleteLink }) => {
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  const toggleAddLinkForm = useCallback(() => {
    setShowAddLinkForm(prev => !prev);
  }, []);

  const handleAddLinkClick = useCallback(() => {
    handleAddLink();
    setShowAddLinkForm(false);
  }, [handleAddLink]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewLinkImage(imageUrl);

      return () => URL.revokeObjectURL(imageUrl); // Cleanup URL after component unmount
    }
  }, [setNewLinkImage]);

  return (
    <div className='flex justify-center'>
      <div className="bg-gray-800/80 rounded-lg shadow-md p-4 md:p-6 mt-4 w-full max-w-md md:max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 underline text-center">Links</h3>
        <div className="flex flex-wrap justify-center mb-4 text-xl md:text-2xl">
          {links.map((link) => (
            <div key={link.id} className="flex items-center mb-2 mx-2 text-white">
              <a
                href={link.url}
                className="flex items-center hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.imageUrl && (
                  <img
                    src={link.imageUrl}
                    alt={link.text}
                    className="h-8 w-8 mr-2 rounded-[10%]"
                  />
                )}
                {link.text}
              </a>
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="ml-2 text-sm text-red-500 hover:text-red-700"
                aria-label="Delete link"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center flex-col items-center">
          <button
            className="bg-[#000110] m-4 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            onClick={toggleAddLinkForm}
          >
            {showAddLinkForm ? 'Hide Add Link' : 'Add Link'}
          </button>

          {showAddLinkForm && (
            <div className="flex flex-col items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
              <input
                type="text"
                className="bg-gray-800/80 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                placeholder="Link Text"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
              />
              <input
                type="text"
                className="bg-gray-800/80 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                placeholder="Link URL"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="bg-gray-800/80 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 max-w-[80%]"
                onChange={handleImageChange}
              />
              <button
                className="bg-[#000110] text-white px-4 py-2 rounded border border-green-600 shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
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
