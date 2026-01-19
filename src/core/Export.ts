/**
 * Export - экспорт контента (чистый JS)
 */

export class Export {
  constructor(private element: HTMLElement) {}

  toHTML(): string {
    return this.element.innerHTML;
  }

  toText(): string {
    const temp = document.createElement('div');
    temp.innerHTML = this.element.innerHTML;
    return temp.innerText || temp.textContent || '';
  }

  downloadHTML(filename: string = 'document.html'): void {
    const html = this.toHTML();
    this.download(html, filename, 'text/html');
  }

  downloadText(filename: string = 'document.txt'): void {
    const text = this.toText();
    this.download(text, filename, 'text/plain');
  }

  copyHTML(): Promise<void> {
    const html = this.toHTML();
    return navigator.clipboard.writeText(html);
  }

  print(): void {
    const html = this.toHTML();
    
    // Создаем скрытый iframe для печати
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px;
                line-height: 1.6;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
              }
              table td, table th {
                border: 1px solid #333;
                padding: 10px;
              }
              table th {
                background: #f0f0f0;
                font-weight: bold;
              }
              pre {
                background: #f5f5f5;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
              }
              img {
                max-width: 100%;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      iframeDoc.close();
      
      // Ждем загрузки контента, затем печатаем
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Удаляем iframe после печати
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  }

  savePDF(): void {
    // Открываем диалог печати с подсказкой сохранить как PDF
    const html = this.toHTML();
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Save as PDF</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px;
                line-height: 1.6;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
              }
              table td, table th {
                border: 1px solid #333;
                padding: 10px;
              }
              table th {
                background: #f0f0f0;
                font-weight: bold;
              }
              pre {
                background: #f5f5f5;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
              }
              img {
                max-width: 100%;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      iframeDoc.close();
      
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        // Открываем диалог печати (пользователь может выбрать "Сохранить как PDF")
        iframe.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  }

  private download(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
