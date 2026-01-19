import { describe, it, expect } from 'vitest';
import { parseVideoUrl, createVideoEmbed } from '../videoParser';

describe('parseVideoUrl', () => {
  it('should parse standard YouTube URL', () => {
    const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toEqual({
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      provider: 'youtube'
    });
  });

  it('should parse short YouTube URL', () => {
    const result = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
    expect(result).toEqual({
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      provider: 'youtube'
    });
  });

  it('should parse YouTube URL with query params', () => {
    const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s');
    expect(result).toEqual({
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      provider: 'youtube'
    });
  });

  it('should parse Vimeo URL', () => {
    const result = parseVideoUrl('https://vimeo.com/123456789');
    expect(result).toEqual({
      embedUrl: 'https://player.vimeo.com/video/123456789',
      provider: 'vimeo'
    });
  });

  it('should return null for invalid URL', () => {
    const result = parseVideoUrl('https://example.com/video');
    expect(result).toBeNull();
  });

  it('should return null for empty string', () => {
    const result = parseVideoUrl('');
    expect(result).toBeNull();
  });
});

describe('createVideoEmbed', () => {
  it('should create responsive iframe embed', () => {
    const embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const html = createVideoEmbed(embedUrl);
    
    expect(html).toContain('<iframe');
    expect(html).toContain(embedUrl);
    expect(html).toContain('allowfullscreen');
    expect(html).toContain('position:relative');
    expect(html).toContain('padding-bottom:56.25%');
  });
});
