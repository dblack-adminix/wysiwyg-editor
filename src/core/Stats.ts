/**
 * Stats - подсчёт статистики (чистый JS)
 */

export interface EditorStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
}

export class Stats {
  constructor(private element: HTMLElement) {}

  get(): EditorStats {
    const html = this.element.innerHTML;
    const text = this.stripHTML(html);

    return {
      wordCount: this.countWords(text),
      charCount: text.length,
      paragraphCount: this.countParagraphs(html)
    };
  }

  private stripHTML(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  private countWords(text: string): number {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  private countParagraphs(html: string): number {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const blocks = temp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    return blocks.length || (html.trim() ? 1 : 0);
  }
}
