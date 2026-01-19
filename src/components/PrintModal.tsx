import { useRef } from 'react';
import { Theme } from '../types';
import styles from '../WysiwygEditor.module.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  theme?: Theme;
}

export function PrintModal({ isOpen, onClose, html, theme = 'dark' }: PrintModalProps) {
  const isLight = theme === 'light';
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!previewRef.current) return;

    try {
      // Показываем индикатор загрузки
      const loadingEl = document.createElement('div');
      loadingEl.textContent = 'Генерация PDF...';
      loadingEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:8px;z-index:10000;';
      document.body.appendChild(loadingEl);

      // Конвертируем HTML в canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Создаем PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Добавляем первую страницу
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Добавляем дополнительные страницы если нужно
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Сохраняем PDF
      pdf.save('document.pdf');

      // Удаляем индикатор загрузки
      document.body.removeChild(loadingEl);
      
      // Закрываем модальное окно
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ошибка при создании PDF. Попробуйте еще раз.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : ''}`} onClick={onClose}>
      <div 
        className={`${styles.modal} ${isLight ? styles.light : ''}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>🖨️ Предпросмотр печати</h3>
          <button 
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onClose}
            title="Закрыть"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Предпросмотр документа */}
        <div 
          style={{ 
            flex: 1,
            overflow: 'auto',
            background: isLight ? '#f5f5f5' : '#1a1a1a',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}
        >
          <div 
            ref={previewRef}
            className="print-preview-page"
            style={{
              background: 'white',
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              margin: '0 auto',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              color: '#000',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12pt',
              lineHeight: '1.6'
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Кнопки действий */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
            onClick={onClose}
          >
            Отмена
          </button>
          <button 
            className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
            onClick={handlePrint}
            style={{ background: '#6366f1' }}
          >
            <i className="fas fa-print" style={{ marginRight: '8px' }}></i>
            Печать
          </button>
          <button 
            className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
            onClick={handleSavePDF}
            style={{ background: '#10b981' }}
          >
            <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
            Сохранить PDF
          </button>
        </div>
      </div>

      {/* Стили для печати */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-preview-page,
          .print-preview-page * {
            visibility: visible;
          }
          .print-preview-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            margin: 0;
            padding: 20mm;
          }
        }
        
        .print-preview-page table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        
        .print-preview-page table td,
        .print-preview-page table th {
          border: 1px solid #333;
          padding: 8px;
        }
        
        .print-preview-page table th {
          background: #f0f0f0;
          font-weight: bold;
        }
        
        .print-preview-page pre {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          border: 1px solid #ddd;
        }
        
        .print-preview-page img {
          max-width: 100%;
          height: auto;
        }
        
        .print-preview-page h1 {
          font-size: 24pt;
          margin: 0.5em 0;
        }
        
        .print-preview-page h2 {
          font-size: 20pt;
          margin: 0.5em 0;
        }
        
        .print-preview-page h3 {
          font-size: 16pt;
          margin: 0.5em 0;
        }
        
        .print-preview-page p {
          margin: 0.5em 0;
        }
        
        .print-preview-page ul,
        .print-preview-page ol {
          margin: 0.5em 0;
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
}
