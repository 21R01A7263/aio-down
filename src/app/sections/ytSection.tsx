import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ThumbCard from '../components/thumbCard'

const YtSection = React.memo(() => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [debouncedUrl, setDebouncedUrl] = useState('')

  // Debounce URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrl(url)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [url])

  // Optimized regex patterns (most common first for performance)
  const youtubePatterns = useMemo(() => [
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/, // Most common - youtu.be short links
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/, // Standard watch URLs
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/, // Embed URLs
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/, // Shorts URLs
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/, // Live URLs
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/, // V URLs
  ], [])

  const extractYouTubeVideoId = useCallback((url: string): string | null => {
    if (!url?.trim()) return null
    
    const cleanUrl = url.trim()
    
    // Quick domain check
    if (!/(?:youtube\.com|youtu\.be|m\.youtube\.com)/i.test(cleanUrl)) {
      return null
    }

    // Try patterns in order of likelihood
    for (const pattern of youtubePatterns) {
      const match = cleanUrl.match(pattern)
      if (match?.[1]) {
        return match[1]
      }
    }
    
    return null
  }, [youtubePatterns])

  const videoId = useMemo(() => {
    // Only validate if there's a debounced URL and it looks like it could be a YouTube URL
    if (!debouncedUrl) {
      setError('')
      return ''
    }

    // Check if URL contains youtube-like domains before showing error
    const hasYoutubeDomain = /(?:youtube\.com|youtu\.be|m\.youtube\.com)/i.test(debouncedUrl)
    
    const id = extractYouTubeVideoId(debouncedUrl)
    
    if (hasYoutubeDomain && !id) {
      setError('Invalid YouTube URL')
    } else {
      setError('')
    }
    
    return id || ''
  }, [debouncedUrl, extractYouTubeVideoId])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    
    // Clear error immediately when input is cleared
    if (!newUrl.trim()) {
      setError('')
    }
  }, [])

  const handleClearInput = useCallback(() => {
    setUrl('')
    setDebouncedUrl('')
    setError('')
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 select-none">
      <div className='flex items-center justify-center h-36 text-4xl font-bold text-gray-800'>
        YouTube Thumbnail Download
      </div>
      
      <div className='flex justify-center mb-4'>
        <div className="relative w-full max-w-2xl">
          <input 
            className={`border-2 focus:outline-none p-4 w-full h-12 shadow-xl shadow-neutral-400/40 rounded-md transition-colors ${
              error ? 'border-red-500' : 'border-gray-300 focus:border-gray-600'
            }`}
            placeholder='Enter YouTube URL' 
            type="text" 
            name="url" 
            id="url" 
            value={url}
            onChange={handleInputChange}
          />
          {url && (
            <button
              onClick={handleClearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear input"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex justify-center mb-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <div className='flex justify-center items-end gap-16 mt-20 flex-wrap'>
        <div className="flex flex-col items-center gap-2">
          <ThumbCard size='medium' videoId={videoId} />
          
        </div>
        <div className="flex flex-col items-center gap-2">
          <ThumbCard size='large' videoId={videoId} />
          
        </div>
      </div>
    </div>
  )
})

YtSection.displayName = 'YtSection'

export default YtSection