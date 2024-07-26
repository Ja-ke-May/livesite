import React, { useState, useCallback } from 'react';
import { addLink, deleteLink } from '../../../utils/apiClient';

const LinksSection = ({ links, setLinks, isLoggedIn }) => {
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLinkText, setNewLinkText] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkImage, setNewLinkImage] = useState(null);

  const toggleAddLinkForm = useCallback(() => {
    setShowAddLinkForm((prev) => !prev);
  }, []);

  const handleAddLink = useCallback(async () => {
    try {
      const newLink = {
        text: newLinkText,
        url: newLinkUrl,
        imageFile: newLinkImage,
      };
      const updatedLinks = await addLink(newLink);
      setLinks(updatedLinks);
      setNewLinkText('');
      setNewLinkUrl('');
      setNewLinkImage(null);
      setShowAddLinkForm(false);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  }, [newLinkText, newLinkUrl, newLinkImage, setLinks]);

  const handleDeleteLink = useCallback(async (linkId) => {
    try {
      const updatedLinks = await deleteLink(linkId);
      setLinks(updatedLinks);
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  }, [setLinks]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLinkImage(file);
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-gray-800/80 rounded-lg shadow-md p-4 md:p-6 mt-4 w-full max-w-md md:max-w-2xl">
        <h3 className="text-4xl md:text-5xl font-semibold mb-4 text-center text-[#000110]">Links</h3>
        <p className='text-xs text-center mb-4'><span className='text-red-600'>Please note:</span> MyMe.live is not responsible for the content of external links found on user profiles. Only click on links from users you trust.</p>
        <div className="flex flex-wrap justify-center mb-4 text-xl md:text-2xl">
          {links.map((link) => (
            <div key={link._id} className="flex items-center mb-2 mx-2 text-white">
              <a
                href={link.url}
                className="flex items-center hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.imageUrl && (
                  <img
                    src={`data:image/jpeg;base64,${link.imageUrl}`}
                    alt={link.text}
                    className="h-8 w-8 m-2 rounded-[10%]"
                  />
                )}
                {link.text}
              </a>
              {isLoggedIn && (
                <button
                  onClick={() => handleDeleteLink(link._id)}
                  className="ml-2 text-sm text-red-500 hover:text-red-700"
                  aria-label="Delete link"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>

        {isLoggedIn && (
          <div className="flex justify-center flex-col items-center">
            <button
              className="bg-[#000110] mb-4 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              onClick={toggleAddLinkForm}
            >
              {showAddLinkForm ? 'Hide Add Link' : 'Add Link'}
            </button>

            {showAddLinkForm && (
              <div className="flex flex-col items-center space-y-2 w-full">
                <input
                  type="text"
                  className="bg-gray-800/80 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  placeholder="Link Text"
                  value={newLinkText}
                  onChange={(e) => setNewLinkText(e.target.value)}
                />
                <input
                  type="text"
                  className="bg-gray-800/80 text-white px-4 py-2 rounded border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 mb-4"
                  placeholder="Link URL"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="bg-gray-800/80 text-white rounded p-1 border border-blue-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 mb-4"
                  onChange={handleImageChange}
                />
                <button
                  className="bg-[#000110] text-white px-4 py-2 rounded border border-green-600 shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 mt-4"
                  onClick={handleAddLink}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksSection;
