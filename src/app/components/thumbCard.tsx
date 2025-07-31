import React, { memo, useCallback, useMemo, useState } from 'react'

interface ThumbCardProps {
    size:  'medium' | 'large',
    videoId?: string,
}

const ThumbCard = memo(({ size, videoId }: ThumbCardProps) => {
  const [imageError, setImageError] = useState(false);

  const { thumbnailUrl, sizeClasses } = useMemo(() => {
    const sizeClasses = size === 'medium' ? 'w-96' : 'w-128';
    
    if (!videoId || imageError) {
      return { thumbnailUrl: null, sizeClasses };
    }

    const thumbnailUrl = size === 'medium'
      ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return { thumbnailUrl, sizeClasses };
  }, [size, videoId, imageError]);

  const handleImageError = () => setImageError(true);

  const handleDownload = useCallback(async () => {
    if (!thumbnailUrl) return;
    
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `youtube-thumbnail-${videoId}-${size}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [thumbnailUrl, videoId, size]);

  // Reset error state when videoId changes
  React.useEffect(() => {
    setImageError(false);
  }, [videoId]);

  return (
    <div className={`${sizeClasses} aspect-video flex relative rounded-lg overflow-hidden shadow-lg shadow-neutral-400/80 group`}>
      {thumbnailUrl ? (
        <>
          <img 
            src={thumbnailUrl} 
            alt="YouTube Thumbnail" 
            className="w-full h-full object-cover" 
            onError={handleImageError}
            loading="lazy"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            aria-label="Download thumbnail"
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
          <span className="text-gray-700 text-sm font-medium capitalize">
            {size} thumbnail
          </span>
        </div>
      )}
    </div>
  );
});

ThumbCard.displayName = 'ThumbCard';

export default ThumbCard;
