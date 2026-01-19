/**
 * Commands - все команды редактора (чистый JS, без React)
 */

import { detectLanguage, getLanguageDisplayName } from '../utils/detectLanguage';

export type BasicCommand = 
  | 'bold' | 'italic' | 'underline' | 'strikeThrough'
  | 'subscript' | 'superscript' | 'undo' | 'redo'
  | 'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull'
  | 'insertUnorderedList' | 'insertOrderedList'
  | 'indent' | 'outdent' | 'removeFormat'
  | 'insertHorizontalRule';

export interface CommandsAPI {
  // Basic formatting
  exec(command: BasicCommand): void;
  queryState(command: BasicCommand): boolean;
  
  // Text styling
  setForeColor(color: string): void;
  setBackColor(color: string): void;
  setFontName(fontName: string): void;
  setFontSize(size: string): void;
  setFormatBlock(format: string): void;
  
  // Insert content
  insertHTML(html: string): void;
  insertText(text: string): Promise<void>;
  insertLink(url: string, text?: string): void;
  insertImage(src: string, alt?: string): void;
  insertVideo(embedUrl: string): void;
  insertTable(rows: number, cols: number): void;
  insertCodeBlock(code?: string): void;
  insertEmoji(emoji: string): void;
  insertHR(): void;
  
  // Find & Replace
  find(text: string): boolean;
  replace(findText: string, replaceText: string): void;
  replaceAll(findText: string, replaceText: string): void;
}

export class Commands implements CommandsAPI {
  constructor(private element: HTMLElement) {}

  exec(command: BasicCommand): void {
    document.execCommand(command, false, undefined);
    this.element.focus();
  }

  queryState(command: BasicCommand): boolean {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  setForeColor(color: string): void {
    console.log('[Commands] setForeColor called:', color);
    try {
      const result = document.execCommand('foreColor', false, color);
      console.log('[Commands] execCommand result:', result);
      this.element.focus();
    } catch (err) {
      console.error('[Commands] setForeColor error:', err);
    }
  }

  setBackColor(color: string): void {
    console.log('[Commands] setBackColor called:', color);
    try {
      const result = document.execCommand('hiliteColor', false, color);
      console.log('[Commands] execCommand result:', result);
      this.element.focus();
    } catch (err) {
      console.error('[Commands] setBackColor error:', err);
    }
  }

  setFontName(fontName: string): void {
    document.execCommand('fontName', false, fontName);
    this.element.focus();
  }

  setFontSize(size: string): void {
    document.execCommand('fontSize', false, size);
    this.element.focus();
  }

  setFormatBlock(format: string): void {
    document.execCommand('formatBlock', false, format);
    this.element.focus();
  }

  insertHTML(html: string): void {
    document.execCommand('insertHTML', false, html);
    this.element.focus();
  }

  async insertText(text: string): Promise<void> {
    // Используем продвинутый детектор кода
    const detection = detectLanguage(text);
    
    if (detection.lang !== 'plain-text' && detection.confidence > 0.3) {
      const langId = detection.lang;
      const displayName = getLanguageDisplayName(langId);
      
      // Сохраняем исходный код в base64 для безопасного хранения в атрибуте
      const escapedCode = this.escapeHtml(text);
      const base64Code = btoa(unescape(encodeURIComponent(text))); // UTF-8 safe base64
      
      this.insertHTML(
        `<pre class="code-block" data-language="${langId}" data-display-name="${displayName}" data-original-code="${base64Code}"><code class="language-${langId}">${escapedCode}</code></pre>`
      );
    } else {
      document.execCommand('insertText', false, text);
      this.element.focus();
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  insertLink(url: string, text?: string): void {
    // Если текст не указан, используем URL
    const linkText = text || url;
    
    // Используем createLink для обертывания выделенного текста
    if (text) {
      // Если передан текст, значит нужно обернуть выделение
      document.execCommand('createLink', false, url);
      
      // Устанавливаем target="_blank" для новой ссылки
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const parent = selection.anchorNode.parentElement;
        if (parent && parent.tagName === 'A') {
          parent.setAttribute('target', '_blank');
        }
      }
    } else {
      // Если текст не передан, вставляем новую ссылку
      this.insertHTML(`<a href="${url}" target="_blank">${linkText}</a>`);
    }
    
    this.element.focus();
  }

  insertImage(src: string, alt: string = 'Image'): void {
    this.insertHTML(`<img src="${src}" alt="${alt}" />`);
  }

  insertVideo(embedUrl: string): void {
    const videoHTML = `
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;">
        <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
      </div>
    `;
    this.insertHTML(videoHTML);
  }

  insertTable(rows: number, cols: number): void {
    console.log('[Commands] insertTable called:', { rows, cols });
    
    let tableHTML = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHTML += '<th>Заголовок</th>';
    }
    tableHTML += '</tr></thead><tbody>';
    for (let r = 0; r < rows - 1; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += '<td>Ячейка</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    
    console.log('[Commands] Table HTML generated, length:', tableHTML.length);
    
    // Focus element before inserting
    this.element.focus();
    
    const result = document.execCommand('insertHTML', false, tableHTML);
    console.log('[Commands] insertHTML result:', result);
    
    this.element.focus();
  }

  insertCodeBlock(code?: string): void {
    // Получаем выделенный текст
    const selection = window.getSelection();
    let selectedText = '';
    
    if (selection && selection.rangeCount > 0) {
      selectedText = selection.toString().trim();
    }
    
    // Если есть выделенный текст, используем его
    if (selectedText) {
      // Удаляем выделенный текст
      document.execCommand('delete', false);
      
      // Определяем язык
      const detection = detectLanguage(selectedText);
      const langId = detection.lang;
      const displayName = getLanguageDisplayName(langId);
      
      // Сохраняем код в base64
      const escapedCode = this.escapeHtml(selectedText);
      const base64Code = btoa(unescape(encodeURIComponent(selectedText)));
      
      this.insertHTML(
        `<pre class="code-block" data-language="${langId}" data-display-name="${displayName}" data-original-code="${base64Code}"><code class="language-${langId}">${escapedCode}</code></pre>`
      );
    } else {
      // Если ничего не выделено, вставляем пустой блок кода
      const defaultCode = code || '// Введите код здесь';
      const langId = 'javascript';
      const displayName = getLanguageDisplayName(langId);
      const escapedCode = this.escapeHtml(defaultCode);
      const base64Code = btoa(unescape(encodeURIComponent(defaultCode)));
      
      this.insertHTML(
        `<pre class="code-block" data-language="${langId}" data-display-name="${displayName}" data-original-code="${base64Code}"><code class="language-${langId}">${escapedCode}</code></pre>`
      );
    }
  }

  insertEmoji(emoji: string): void {
    this.insertText(emoji);
  }

  insertHR(): void {
    this.exec('insertHorizontalRule');
  }

  find(text: string): boolean {
    // @ts-ignore - window.find is not in TypeScript types but exists in browsers
    return window.find ? window.find(text) : false;
  }

  replace(findText: string, replaceText: string): void {
    const html = this.element.innerHTML;
    this.element.innerHTML = html.replace(findText, replaceText);
  }

  replaceAll(findText: string, replaceText: string): void {
    const html = this.element.innerHTML;
    this.element.innerHTML = html.split(findText).join(replaceText);
  }
}
