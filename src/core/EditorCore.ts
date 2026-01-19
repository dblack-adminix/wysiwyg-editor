/**
 * EditorCore - главный headless движок (БЕЗ React)
 * Управляет contenteditable элементом и всеми операциями
 */

import { Commands, CommandsAPI } from './Commands';
import { SelectionManager } from './SelectionManager';
import { Stats, EditorStats } from './Stats';
import { Autosave, AutosaveOptions } from './Autosave';
import { DragDrop, DragDropCallback } from './DragDrop';
import { Export } from './Export';
import { detectLanguage } from '../utils/detectLanguage';

export interface EditorCoreOptions {
  placeholder?: string;
  autosave?: Partial<AutosaveOptions>;
  sanitize?: boolean;
  onChange?: (html: string, stats: EditorStats) => void;
  theme?: 'light' | 'dark';
}

export interface EditorCoreAPI {
  // Lifecycle
  mount(element: HTMLElement): void;
  unmount(): void;
  
  // Content
  getHTML(): string;
  setHTML(html: string): void;
  clear(): void;
  
  // Commands
  commands: CommandsAPI;
  
  // Selection
  selection: SelectionManager;
  
  // Stats
  getStats(): EditorStats;
  
  // Autosave
  enableAutosave(): void;
  disableAutosave(): void;
  saveNow(): void;
  loadSaved(): string | null;
  
  // Drag & Drop
  enableDragDrop(onDrop: DragDropCallback): void;
  disableDragDrop(): void;
  
  // Export
  export: Export;
  
  // Focus
  focus(): void;
}

export class EditorCore implements EditorCoreAPI {
  private element: HTMLElement | null = null;
  private options: EditorCoreOptions;
  private inputHandler: (() => void) | null = null;
  private mouseUpHandler: (() => void) | null = null;
  private keyUpHandler: (() => void) | null = null;
  private pasteHandler: ((e: ClipboardEvent) => Promise<void>) | null = null;
  
  public commands: Commands;
  public selection: SelectionManager;
  private stats: Stats;
  private autosave: Autosave;
  private dragDrop: DragDrop;
  public export: Export;

  constructor(options: EditorCoreOptions = {}) {
    this.options = options;
    this.selection = new SelectionManager();
    
    // Create temporary element for initialization
    const tempElement = document.createElement('div');
    this.commands = new Commands(tempElement);
    this.stats = new Stats(tempElement);
    this.autosave = new Autosave(tempElement, options.autosave);
    this.dragDrop = new DragDrop(tempElement);
    this.export = new Export(tempElement);
  }

  mount(element: HTMLElement): void {
    if (this.element) {
      this.unmount();
    }

    this.element = element;
    
    // Re-initialize modules with real element
    this.commands = new Commands(element);
    this.stats = new Stats(element);
    this.autosave = new Autosave(element, this.options.autosave);
    this.dragDrop = new DragDrop(element);
    this.export = new Export(element);

    // Setup contenteditable
    element.contentEditable = 'true';
    if (this.options.placeholder) {
      element.dataset.placeholder = this.options.placeholder;
    }

    // Load autosaved content
    if (this.autosave.isEnabled()) {
      const saved = this.autosave.load();
      if (saved) {
        element.innerHTML = saved;
      }
      this.autosave.start();
    }

    // Event handlers
    this.inputHandler = () => this.handleInput();
    this.mouseUpHandler = () => this.handleSelectionChange();
    this.keyUpHandler = () => this.handleSelectionChange();
    this.pasteHandler = (e: ClipboardEvent) => this.handlePaste(e);

    element.addEventListener('input', this.inputHandler);
    element.addEventListener('mouseup', this.mouseUpHandler);
    element.addEventListener('keyup', this.keyUpHandler);
    element.addEventListener('paste', this.pasteHandler);
  }

  unmount(): void {
    if (!this.element) return;

    // Remove event listeners
    if (this.inputHandler) {
      this.element.removeEventListener('input', this.inputHandler);
    }
    if (this.mouseUpHandler) {
      this.element.removeEventListener('mouseup', this.mouseUpHandler);
    }
    if (this.keyUpHandler) {
      this.element.removeEventListener('keyup', this.keyUpHandler);
    }
    if (this.pasteHandler) {
      this.element.removeEventListener('paste', this.pasteHandler);
    }

    // Cleanup modules
    this.autosave.stop();
    this.dragDrop.disable();

    this.element = null;
    this.inputHandler = null;
    this.mouseUpHandler = null;
    this.keyUpHandler = null;
    this.pasteHandler = null;
  }

  getHTML(): string {
    if (!this.element) return '';
    
    let html = this.element.innerHTML;
    
    if (this.options.sanitize) {
      html = this.sanitizeHTML(html);
    }
    
    return html;
  }

  setHTML(html: string): void {
    if (!this.element) return;
    this.element.innerHTML = html;
    this.handleInput();
  }

  clear(): void {
    this.setHTML('');
  }

  getStats(): EditorStats {
    return this.stats.get();
  }

  enableAutosave(): void {
    this.autosave.start();
  }

  disableAutosave(): void {
    this.autosave.stop();
  }

  saveNow(): void {
    this.autosave.save();
  }

  loadSaved(): string | null {
    return this.autosave.load();
  }

  enableDragDrop(onDrop: DragDropCallback): void {
    this.dragDrop.enable(onDrop);
  }

  disableDragDrop(): void {
    this.dragDrop.disable();
  }

  focus(): void {
    this.element?.focus();
  }

  private handleInput(): void {
    if (!this.element) return;
    
    const html = this.getHTML();
    const stats = this.getStats();
    
    this.options.onChange?.(html, stats);
  }

  private async handlePaste(e: ClipboardEvent): Promise<void> {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;
    
    const text = clipboardData.getData('text/plain');
    const html = clipboardData.getData('text/html');
    
    // Если есть HTML (статья, веб-страница), очищаем его от inline стилей
    // НЕ проверяем на код, т.к. это форматированный контент
    if (html && html.trim().length > 0) {
      e.preventDefault();
      
      const cleanHtml = this.cleanPastedHTML(html);
      
      // Вставляем очищенный HTML
      if (this.commands) {
        this.commands.insertHTML(cleanHtml);
      }
      return;
    }
    
    // Если только plain text (без HTML), проверяем на код
    if (text && text.length >= 10) {
      const detection = detectLanguage(text);
      
      if (detection.lang !== 'plain-text' && detection.confidence > 0.3) {
        // Предотвращаем стандартную вставку
        e.preventDefault();
        
        // Вставляем как код через commands
        if (this.commands) {
          await this.commands.insertText(text);
        }
        return;
      }
    }
    
    // Иначе даём браузеру вставить как обычно
  }

  private cleanPastedHTML(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Удаляем все inline стили
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      // Удаляем style атрибут
      el.removeAttribute('style');
      
      // Удаляем class атрибут (могут быть внешние стили)
      el.removeAttribute('class');
      
      // Удаляем id
      el.removeAttribute('id');
      
      // Удаляем data-* атрибуты (кроме наших)
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && 
            !attr.name.startsWith('data-language') && 
            !attr.name.startsWith('data-display-name') &&
            !attr.name.startsWith('data-original-code')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return temp.innerHTML;
  }

  private handleSelectionChange(): void {
    // Can be used to update toolbar state
  }

  private sanitizeHTML(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove script tags
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers
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
}
