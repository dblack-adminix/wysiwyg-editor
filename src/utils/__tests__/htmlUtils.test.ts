import { describe, it, expect } from 'vitest';
import { sanitizeHtml, normalizeHtml, stripHtml, countWords, countParagraphs } from '../htmlUtils';

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const html = '<p>Safe</p><script>alert("xss")</script>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<script');
    expect(result).toContain('<p>Safe</p>');
  });

  it('should remove event handlers', () => {
    const html = '<div onclick="alert()">Click</div>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).toContain('Click');
  });

  it('should keep safe HTML', () => {
    const html = '<p><strong>Bold</strong> and <em>italic</em></p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });
});

describe('normalizeHtml', () => {
  it('should remove empty paragraphs', () => {
    const html = '<p></p><p>Text</p><p></p>';
    const result = normalizeHtml(html);
    expect(result).toBe('<p>Text</p>');
  });

  it('should trim whitespace', () => {
    const html = '  <p>Text</p>  ';
    const result = normalizeHtml(html);
    expect(result).toBe('<p>Text</p>');
  });
});

describe('stripHtml', () => {
  it('should remove all HTML tags', () => {
    const html = '<p><strong>Bold</strong> text</p>';
    const result = stripHtml(html);
    expect(result).toBe('Bold text');
  });

  it('should handle nested tags', () => {
    const html = '<div><p><span>Nested</span></p></div>';
    const result = stripHtml(html);
    expect(result).toBe('Nested');
  });
});

describe('countWords', () => {
  it('should count words correctly', () => {
    expect(countWords('Hello world')).toBe(2);
    expect(countWords('One two three four')).toBe(4);
  });

  it('should handle empty string', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('should handle multiple spaces', () => {
    expect(countWords('Hello    world')).toBe(2);
  });
});

describe('countParagraphs', () => {
  it('should count block elements', () => {
    const html = '<p>One</p><p>Two</p><h1>Three</h1>';
    expect(countParagraphs(html)).toBe(3);
  });

  it('should count list items', () => {
    const html = '<ul><li>One</li><li>Two</li></ul>';
    expect(countParagraphs(html)).toBe(2);
  });

  it('should return 1 for non-empty text without blocks', () => {
    expect(countParagraphs('Just text')).toBe(1);
  });

  it('should return 0 for empty string', () => {
    expect(countParagraphs('')).toBe(0);
  });
});
