/**
 * SelectionManager - управление selection без React
 */
export class SelectionManager {
  private savedRange: Range | null = null;

  save(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
  }

  restore(): void {
    if (this.savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.savedRange);
      }
    }
  }

  clear(): void {
    this.savedRange = null;
  }

  hasSaved(): boolean {
    return this.savedRange !== null;
  }

  getRange(): Range | null {
    return this.savedRange;
  }
}
