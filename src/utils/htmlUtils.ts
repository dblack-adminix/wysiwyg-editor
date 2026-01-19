export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  // For production, consider using DOMPurify library
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove dangerous event handlers
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return temp.innerHTML;
}

export function normalizeHtml(html: string): string {
  // Normalize HTML structure
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove empty paragraphs
  const emptyPs = temp.querySelectorAll('p:empty');
  emptyPs.forEach(p => p.remove());
  
  // Normalize whitespace
  return temp.innerHTML.trim();
}

export function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countParagraphs(html: string): number {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const blocks = temp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
  return blocks.length || (html.trim() ? 1 : 0);
}
