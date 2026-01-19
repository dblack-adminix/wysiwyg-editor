import { VideoEmbedResult } from '../types';

export function parseVideoUrl(url: string): VideoEmbedResult | null {
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        provider: 'youtube'
      };
    }
  }
  
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        provider: 'youtube'
      };
    }
  }

  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (videoId) {
      return {
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        provider: 'vimeo'
      };
    }
  }

  return null;
}

export function createVideoEmbed(embedUrl: string): string {
  return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;">
    <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
  </div>`;
}
