import React, { useRef, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoPlayer = ({ isOpen, onClose, videoSrc, title = "Video", onTrackingUpdate }) => {
  const videoRef = useRef(null);
  const [trackingData, setTrackingData] = useState({
    pausePoints: [],
    rewindCount: 0,
    fastForwardCount: 0,
    playbackSpeedChanges: [],
    seekCount: 0,
    completionPoints: [],
    volumeChanges: 0,
    averagePlaybackSpeed: 1.0,
    totalPauses: 0,
    lastPosition: 0
  });
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const pauseStartTime = useRef(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const video = videoRef.current;

    // Track pause events
    const handlePause = () => {
      setIsPaused(true);
      pauseStartTime.current = Date.now();
      const currentTime = video.currentTime;
      
      setTrackingData(prev => ({
        ...prev,
        totalPauses: prev.totalPauses + 1,
        completionPoints: [...prev.completionPoints, (currentTime / video.duration) * 100]
      }));
    };

    // Track play/resume events
    const handlePlay = () => {
      if (pauseStartTime.current) {
        const pauseDuration = (Date.now() - pauseStartTime.current) / 1000;
        const currentTime = video.currentTime;
        
        setTrackingData(prev => ({
          ...prev,
          pausePoints: [...prev.pausePoints, { 
            timestamp: currentTime, 
            duration: pauseDuration 
          }]
        }));
        pauseStartTime.current = null;
      }
      setIsPaused(false);
    };

    // Track seeking (rewind/fast-forward)
    const handleSeeking = () => {
      const currentTime = video.currentTime;
      
      setTrackingData(prev => {
        const wasRewind = currentTime < prev.lastPosition;
        return {
          ...prev,
          seekCount: prev.seekCount + 1,
          rewindCount: wasRewind ? prev.rewindCount + 1 : prev.rewindCount,
          fastForwardCount: !wasRewind ? prev.fastForwardCount + 1 : prev.fastForwardCount,
          lastPosition: currentTime
        };
      });
    };

    // Track playback rate changes
    const handleRateChange = () => {
      const newRate = video.playbackRate;
      
      setTrackingData(prev => ({
        ...prev,
        playbackSpeedChanges: [...prev.playbackSpeedChanges, { 
          speed: newRate, 
          timestamp: video.currentTime 
        }],
        averagePlaybackSpeed: newRate
      }));
    };

    // Track volume changes
    const handleVolumeChange = () => {
      setTrackingData(prev => ({
        ...prev,
        volumeChanges: prev.volumeChanges + 1
      }));
    };

    // Track time updates
    const handleTimeUpdate = () => {
      setTrackingData(prev => ({
        ...prev,
        lastPosition: video.currentTime
      }));
    };

    // Attach event listeners
    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isOpen]);

  // Send tracking data when component closes
  useEffect(() => {
    if (!isOpen && trackingData.totalPauses > 0 && onTrackingUpdate) {
      const duration = (Date.now() - startTime) / 1000;
      onTrackingUpdate({
        ...trackingData,
        totalDuration: duration,
        engagementScore: calculateEngagementScore(trackingData, duration)
      });
    }
  }, [isOpen]);

  const calculateEngagementScore = (data, duration) => {
    // Higher score = better engagement
    let score = 1.0;
    
    // Penalize excessive pauses
    if (data.totalPauses > 5) score -= 0.2;
    
    // Penalize excessive rewinds (confusion indicator)
    if (data.rewindCount > 3) score -= 0.2;
    
    // Reward completion
    const maxCompletion = Math.max(...data.completionPoints, 0);
    score = score * (maxCompletion / 100);
    
    return Math.max(0, Math.min(1, score));
  };

  const handleClose = () => {
    // Send final tracking data
    if (videoRef.current && onTrackingUpdate) {
      const duration = (Date.now() - startTime) / 1000;
      const video = videoRef.current;
      const completionPercentage = (video.currentTime / video.duration) * 100;
      
      onTrackingUpdate({
        ...trackingData,
        totalDuration: duration,
        finalCompletionPercentage: completionPercentage,
        engagementScore: calculateEngagementScore(trackingData, duration)
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          aria-label="Close video"
        >
          <FaTimes className="text-3xl" />
        </button>

        {/* Video Container */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {isPaused && (
              <p className="text-sm text-gray-400 mt-1">
                Paused • {trackingData.totalPauses} pauses • {trackingData.rewindCount} rewinds
              </p>
            )}
          </div>
          
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <video
              ref={videoRef}
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
