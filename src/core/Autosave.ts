/**
 * Autosave - автосохранение в localStorage (чистый JS)
 */

export interface AutosaveOptions {
  key: string;
  intervalMs: number;
  enabled: boolean;
}

export class Autosave {
  private intervalId: number | null = null;
  private options: AutosaveOptions;

  constructor(
    private element: HTMLElement,
    options: Partial<AutosaveOptions> = {}
  ) {
    this.options = {
      key: options.key || 'wysiwyg-autosave',
      intervalMs: options.intervalMs || 2000,
      enabled: options.enabled ?? false
    };
  }

  start(): void {
    if (!this.options.enabled) return;

    this.stop(); // Clear existing interval
    
    this.intervalId = window.setInterval(() => {
      this.save();
    }, this.options.intervalMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  save(): void {
    if (!this.options.enabled) return;
    
    const html = this.element.innerHTML;
    localStorage.setItem(this.options.key, html);
  }

  load(): string | null {
    if (!this.options.enabled) return null;
    return localStorage.getItem(this.options.key);
  }

  clear(): void {
    localStorage.removeItem(this.options.key);
  }

  isEnabled(): boolean {
    return this.options.enabled;
  }

  getKey(): string {
    return this.options.key;
  }
}
