import React, { memo, useCallback, useState } from 'react'

interface VideoCardProps {
  videoUrl?: string;
  title?: string;
}

const VideoCard = memo(({ videoUrl, title = "Instagram Video" }: VideoCardProps) => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => setVideoError(true);

  const handleDownload = useCallback(async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `instagram-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [videoUrl]);

  // Reset error state when videoUrl changes
  React.useEffect(() => {
    setVideoError(false);
  }, [videoUrl]);

  return (
    <div className="w-128 aspect-video flex relative rounded-lg overflow-hidden shadow-lg shadow-neutral-400/80 group">
      {videoUrl && !videoError ? (
        <>
          <video 
            src={videoUrl} 
            className="w-full h-full object-cover" 
            onError={handleVideoError}
            autoPlay
            muted
            loop
            preload="metadata"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            aria-label="Download video"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
          <span className="text-gray-700 text-sm font-medium">
            {title}
          </span>
        </div>
      )}
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
