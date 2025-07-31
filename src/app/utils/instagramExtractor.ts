export async function extractInstagramVideoUrl(instagramUrl: string): Promise<{ videoUrl: string, previewUrl: string }> {
  try {
    // Step 1: Extract shortcode from URL
    const shortcode = extractShortcodeFromUrl(instagramUrl);
    if (!shortcode) {
      throw new Error('Invalid Instagram URL');
    }

    // Step 2: Make API request to our backend
    const response = await fetch('/api/instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shortcode })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from Instagram API:', data);

    return { videoUrl: data.videoUrl, previewUrl: data.previewUrl };

  } catch (error) {
    console.error('Error extracting video URL:', error);
    throw error;
  }
}

function extractShortcodeFromUrl(url: string): string | null {
  const shareRegex = /^https:\/\/(?:www\.)?instagram\.com\/share\/([a-zA-Z0-9_-]+)\/?/;
  const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;

  let match = url.match(shareRegex) || url.match(postRegex) || url.match(reelRegex);
  
  if (match) {
    return match[1];
  }
  
  return null;
}
