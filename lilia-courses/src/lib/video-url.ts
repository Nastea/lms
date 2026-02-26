/**
 * Converts YouTube and Vimeo URLs to embed URLs
 * Supports:
 * - YouTube: watch URLs, youtu.be short URLs, existing embed URLs
 * - Vimeo: normal URLs, existing player URLs
 * 
 * @param url - The video URL to convert
 * @returns The embed URL, or the original URL if it's not a recognized video URL
 */
export function normalizeVideoUrl(url: string): string {
  if (!url || !url.trim()) return url;

  const trimmed = url.trim();

  // YouTube patterns
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID (already embed)
  const youtubeWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeWatchMatch) {
    const videoId = youtubeWatchMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // YouTube embed (already correct)
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Vimeo patterns
  // https://vimeo.com/VIDEO_ID
  // https://player.vimeo.com/video/VIDEO_ID (already player)
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // Vimeo player (already correct)
  if (trimmed.includes('player.vimeo.com/video/')) {
    return trimmed;
  }

  // Not a recognized video URL, return as-is
  return trimmed;
}

/**
 * Checks if a URL was converted (i.e., if it's different from the original)
 */
export function wasUrlConverted(original: string, converted: string): boolean {
  return original.trim() !== converted.trim();
}

