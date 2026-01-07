import React from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoPlayer = ({ isOpen, onClose, videoSrc, title = "Video" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          aria-label="Close video"
        >
          <FaTimes className="text-3xl" />
        </button>

        {/* Video Container */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <video
              className="absolute top-0 left-0 w-full h-full"
              controls
              autoPlay
              src={videoSrc}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
