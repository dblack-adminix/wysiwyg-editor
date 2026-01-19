import { EditorCommand, EditorMeta } from '../types';
import { countWords, countParagraphs, stripHtml, sanitizeHtml, normalizeHtml } from '../utils/htmlUtils';
import { saveSelection, restoreSelection } from '../utils/selection';

export class EditorController {
  private editorElement: HTMLElement | null = null;
  private savedSelection: Range | null = null;
  private sanitize: boolean = false;
  private normalize: boolean = false;

  constructor(options?: { sanitize?: boolean; normalize?: boolean }) {
    this.sanitize = options?.sanitize ?? false;
    this.normalize = options?.normalize ?? false;
  }

  setEditorElement(element: HTMLElement | null): void {
    this.editorElement = element;
  }

  execCommand(command: EditorCommand): void {
    if (!this.editorElement) return;
    document.execCommand(command, false, undefined);
    this.editorElement.focus();
  }

  execCommandWithValue(command: string, value: string): void {
    if (!this.editorElement) return;
    document.execCommand(command, false, value);
    this.editorElement.focus();
  }

  insertHtml(html: string): void {
    if (!this.editorElement) return;
    
    let processedHtml = html;
    if (this.sanitize) {
      processedHtml = sanitizeHtml(processedHtml);
    }
    
    document.execCommand('insertHTML', false, processedHtml);
    this.editorElement.focus();
  }

  getHtml(): string {
    if (!this.editorElement) return '';
    
    let html = this.editorElement.innerHTML;
    
    if (this.sanitize) {
      html = sanitizeHtml(html);
    }
    if (this.normalize) {
      html = normalizeHtml(html);
    }
    
    return html;
  }

  setHtml(html: string): void {
    if (!this.editorElement) return;
    this.editorElement.innerHTML = html;
  }

  getMeta(): EditorMeta {
    if (!this.editorElement) {
      return { wordCount: 0, charCount: 0, paragraphCount: 0 };
    }

    const text = stripHtml(this.editorElement.innerHTML);
    const html = this.editorElement.innerHTML;

    return {
      wordCount: countWords(text),
      charCount: text.length,
      paragraphCount: countParagraphs(html)
    };
  }

  saveSelection(): void {
    this.savedSelection = saveSelection();
  }

  restoreSelection(): void {
    restoreSelection(this.savedSelection);
  }

  queryCommandState(command: EditorCommand): boolean {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  insertLink(url: string, text?: string): void {
    this.restoreSelection();
    const linkText = text || url;
    this.insertHtml(`<a href="${url}" target="_blank">${linkText}</a>`);
  }

  insertImage(src: string, alt: string = 'Image'): void {
    this.restoreSelection();
    this.insertHtml(`<img src="${src}" alt="${alt}">`);
  }

  insertVideo(embedHtml: string): void {
    this.restoreSelection();
    this.insertHtml(embedHtml);
  }

  insertTable(rows: number, cols: number): void {
    this.restoreSelection();
    
    let tableHtml = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHtml += '<th>Заголовок</th>';
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows - 1; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += '<td>Ячейка</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    
    this.insertHtml(tableHtml);
  }

  insertHorizontalRule(): void {
    this.execCommand('insertHorizontalRule' as EditorCommand);
  }

  insertCodeBlock(code?: string): void {
    const codeContent = code || 'код';
    this.insertHtml(`<pre><code>${codeContent}</code></pre>`);
  }

  insertEmoji(emoji: string): void {
    this.insertHtml(emoji);
  }

  setForeColor(color: string): void {
    this.execCommandWithValue('foreColor', color);
  }

  setBackColor(color: string): void {
    this.execCommandWithValue('hiliteColor', color);
  }

  setFontName(fontName: string): void {
    this.execCommandWithValue('fontName', fontName);
  }

  setFontSize(size: string): void {
    this.execCommandWithValue('fontSize', size);
  }

  setFormatBlock(format: string): void {
    this.execCommandWithValue('formatBlock', format);
  }

  findText(text: string): boolean {
    // @ts-ignore - window.find is not in TypeScript types but exists in browsers
    return window.find ? window.find(text) : false;
  }

  replaceText(findText: string, replaceText: string): void {
    if (!this.editorElement) return;
    const html = this.editorElement.innerHTML;
    this.editorElement.innerHTML = html.replace(findText, replaceText);
  }

  replaceAllText(findText: string, replaceText: string): void {
    if (!this.editorElement) return;
    const html = this.editorElement.innerHTML;
    this.editorElement.innerHTML = html.split(findText).join(replaceText);
  }

  focus(): void {
    this.editorElement?.focus();
  }

  clear(): void {
    if (this.editorElement) {
      this.editorElement.innerHTML = '';
    }
  }
}
