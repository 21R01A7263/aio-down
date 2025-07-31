import React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import VideoCard from '../components/videoCard';
import InThumbCard from '../components/InThumbCard';
import { extractInstagramVideoUrl } from '../utils/instagramExtractor';

const InSection = React.memo(() => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [debouncedUrl, setDebouncedUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounce URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrl(url);
    }, 300); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [url]);

  // Instagram URL patterns
  const instagramPatterns = useMemo(
    () => [
      /(?:instagram\.com\/p\/)([a-zA-Z0-9_-]+)/, // Post URLs
      /(?:instagram\.com\/reels?\/)([a-zA-Z0-9_-]+)/, // Reels URLs (plural)
      /(?:instagram\.com\/reel\/)([a-zA-Z0-9_-]+)/, // Reel URLs (singular)
      /(?:instagram\.com\/share\/)([a-zA-Z0-9_-]+)/, // Share URLs
    ],
    []
  );

  const extractInstagramId = useCallback(
    (url: string): string | null => {
      if (!url?.trim()) return null;

      const cleanUrl = url.trim();

      // Quick domain check
      if (!/instagram\.com/i.test(cleanUrl)) {
        return null;
      }

      // Try patterns in order of likelihood
      for (const pattern of instagramPatterns) {
        const match = cleanUrl.match(pattern);
        if (match?.[1]) {
          return match[1];
        }
      }

      return null;
    },
    [instagramPatterns]
  );

  // Extract video URL when debounced URL changes
  useEffect(() => {
    const extractVideo = async () => {
      if (!debouncedUrl) {
        setError('');
        setVideoUrl('');
        setPreviewUrl('');
        return;
      }

      // Check if URL contains instagram domain before showing error
      const hasInstagramDomain = /instagram\.com/i.test(debouncedUrl);

      if (hasInstagramDomain) {
        const id = extractInstagramId(debouncedUrl);

        if (!id) {
          setError('Invalid Instagram URL');
          setVideoUrl('');
          setPreviewUrl('');
          return;
        }

        setLoading(true);
        setError('');

        try {
          // Updated to get both videoUrl and previewUrl
          const {
            videoUrl: extractedVideoUrl,
            previewUrl: extractedPreviewUrl,
          } = await extractInstagramVideoUrl(debouncedUrl);
          setVideoUrl(extractedVideoUrl);
          setPreviewUrl(extractedPreviewUrl);
        } catch (err) {
          setError(
            'Failed to extract video. Please check the URL or try again.'
          );
          setVideoUrl('');
          setPreviewUrl('');
        } finally {
          setLoading(false);
        }
      }
    };

    extractVideo();
  }, [debouncedUrl, extractInstagramId]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setUrl(newUrl);

      // Clear error immediately when input is cleared
      if (!newUrl.trim()) {
        setError('');
        setVideoUrl('');
      }
    },
    []
  );

  const handleClearInput = useCallback(() => {
    setUrl('');
    setDebouncedUrl('');
    setError('');
    setVideoUrl('');
  }, []);
  return (
    <div className='max-w-6xl mx-auto px-4 select-none'>
      <div className='flex items-center justify-center h-36 text-4xl font-bold text-gray-800'>
        Instagram Video Download
      </div>

      <div className='flex justify-center mb-4'>
        <div className='relative w-full max-w-2xl'>
          <input
            className={`border-2 focus:outline-none p-4 w-full h-12 shadow-xl shadow-neutral-400/40 rounded-md transition-colors ${
              error ? 'border-red-500' : 'border-gray-300 focus:border-gray-600'
            }`}
            placeholder='Enter Instagram URL'
            type='text'
            name='url'
            id='url'
            value={url}
            onChange={handleInputChange}
          />
          {url && (
            <button
              onClick={handleClearInput}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              aria-label='Clear input'
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='flex justify-center mb-4'>
          <p className='text-red-500 text-sm'>{error}</p>
        </div>
      )}

      {loading && (
        <div className='flex justify-center mb-4'>
          <p className='text-blue-500 text-sm'>Extracting video...</p>
        </div>
      )}

      <div className='flex justify-center items-end gap-16 mt-20 flex-wrap'>
        <div className='flex flex-row items-center gap-8'>
          <VideoCard videoUrl={videoUrl} />
          <InThumbCard previewUrl={previewUrl} />
        </div>
      </div>
    </div>
  );
});

InSection.displayName = 'InSection';

export default InSection;
