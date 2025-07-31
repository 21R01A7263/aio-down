import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { shortcode } = await request.json();
    
    if (!shortcode) {
      return NextResponse.json({ error: 'Shortcode is required' }, { status: 400 });
    }

    const requestData = encodeGraphqlRequestData(shortcode);

    const response = await fetch('https://www.instagram.com/api/graphql', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-FB-Friendly-Name': 'PolarisPostActionLoadPostQueryQuery',
        'X-CSRFToken': 'RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52',
        'X-IG-App-ID': '1217981644879628',
        'X-FB-LSD': 'AVqbxe3J_YA',
        'X-ASBD-ID': '129477',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'DNT': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
      body: requestData
    });
    
    if (!response.ok) {
      throw new Error(`Instagram API error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const videoUrl = extractVideoUrlFromResponse(data);
    const previewUrl = extractPreviewFromResponse(data);

    return NextResponse.json({ videoUrl, previewUrl });

  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract video URL' }, 
      { status: 500 }
    );
  }
}

function encodeGraphqlRequestData(shortcode: string): string {
  const requestData = {
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "3",
    __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
    dpr: "3",
    __ccg: "UNKNOWN",
    __rev: "1008824440",
    __s: "xf44ne:zhh75g:xr51e7",
    __hsi: "7282217488877343271",
    __dyn: "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
    __csr: "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUaUcojxjxyUW5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
    __comet_req: "7",
    lsd: "AVqbxe3J_YA",
    jazoest: "2957",
    __spin_r: "1008824440",
    __spin_b: "trunk",
    __spin_t: "1695523385",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_comment_count: null,
      fetch_related_profile_media_count: null,
      parent_comment_count: null,
      child_comment_count: null,
      fetch_like_count: null,
      fetch_tagged_user_count: null,
      fetch_preview_comment_count: null,
      has_threaded_comments: false,
      hoisted_comment_id: null,
      hoisted_reply_id: null,
    }),
    server_timestamps: "true",
    doc_id: "10015901848480474",
  };

  return new URLSearchParams(requestData).toString();
}

function extractVideoUrlFromResponse(response: any): string {
  try {
    const mediaData = response.data?.xdt_shortcode_media;
    
    if (!mediaData) {
      throw new Error('No media data found in response');
    }

    if (!mediaData.video_url) {
      throw new Error('No video URL found - this might not be a video post');
    }

    return mediaData.video_url;
  } catch (error) {
    throw new Error('Failed to extract video URL from response: ' + (error as Error).message);
  }
}

function extractPreviewFromResponse(response: any): string {
  try {
    const mediaData = response.data?.xdt_shortcode_media;
    
    if (!mediaData) {
      throw new Error('No media data found in response');
    }

    const displayResources = mediaData.display_resources;
    
    if (!displayResources || !Array.isArray(displayResources) || displayResources.length === 0) {
      throw new Error('No display resources found');
    }

    const lastResource = displayResources[displayResources.length - 1];
    
    if (!lastResource.src) {
      throw new Error('No src found in the last display resource');
    }

    return lastResource.src;
  } catch (error) {
    throw new Error('Failed to extract preview URL from response: ' + (error as Error).message);
  }
}
