/**
 * DragDrop - обработка drag & drop изображений (чистый JS)
 */

export type DragDropCallback = (dataUrl: string, fileName: string) => void;

export class DragDrop {
  private onDropCallback: DragDropCallback | null = null;
  private dragOverHandler: ((e: DragEvent) => void) | null = null;
  private dragLeaveHandler: ((e: DragEvent) => void) | null = null;
  private dropHandler: ((e: DragEvent) => void) | null = null;

  constructor(private element: HTMLElement) {}

  enable(onDrop: DragDropCallback): void {
    this.onDropCallback = onDrop;

    this.dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      this.element.classList.add('drag-over');
    };

    this.dragLeaveHandler = (e: DragEvent) => {
      e.preventDefault();
      this.element.classList.remove('drag-over');
    };

    this.dropHandler = (e: DragEvent) => {
      e.preventDefault();
      this.element.classList.remove('drag-over');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target?.result as string;
            this.onDropCallback?.(dataUrl, file.name);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
  }

  disable(): void {
    if (this.dragOverHandler) {
      this.element.removeEventListener('dragover', this.dragOverHandler);
    }
    if (this.dragLeaveHandler) {
      this.element.removeEventListener('dragleave', this.dragLeaveHandler);
    }
    if (this.dropHandler) {
      this.element.removeEventListener('drop', this.dropHandler);
    }

    this.dragOverHandler = null;
    this.dragLeaveHandler = null;
    this.dropHandler = null;
    this.onDropCallback = null;
  }
}
