import { useState } from 'react';
import { WysiwygEditor } from '../src';
import '../src/WysiwygEditor.module.css';

/**
 * Примеры интеграции редактора с разными стилями сайтов
 * Демонстрирует, как редактор приспосабливается к дизайну
 */

export function StyleIntegrationExample() {
  const [activeExample, setActiveExample] = useState<'bootstrap' | 'tailwind' | 'material' | 'custom'>('bootstrap');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎨 Примеры интеграции стилей редактора</h1>
      <p>Выберите пример, чтобы увидеть, как редактор приспосабливается к разным стилям сайтов</p>

      {/* Выбор примера */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveExample('bootstrap')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeExample === 'bootstrap' ? '#0d6efd' : '#e9ecef',
            color: activeExample === 'bootstrap' ? 'white' : '#212529',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Bootstrap
        </button>
        <button
          onClick={() => setActiveExample('tailwind')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeExample === 'tailwind' ? '#06b6d4' : '#e9ecef',
            color: activeExample === 'tailwind' ? 'white' : '#212529',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Tailwind CSS
        </button>
        <button
          onClick={() => setActiveExample('material')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeExample === 'material' ? '#1976d2' : '#e9ecef',
            color: activeExample === 'material' ? 'white' : '#212529',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Material Design
        </button>
        <button
          onClick={() => setActiveExample('custom')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeExample === 'custom' ? '#ff6b6b' : '#e9ecef',
            color: activeExample === 'custom' ? 'white' : '#212529',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Пользовательский
        </button>
      </div>

      {/* Bootstrap пример */}
      {activeExample === 'bootstrap' && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Bootstrap интеграция</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Редактор использует цвета и стили Bootstrap
          </p>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
          }}>
            <WysiwygEditor
              themeName="custom"
              customTheme={{
                primary: '#0d6efd',           // Bootstrap primary
                primaryDark: '#0a58ca',
                primaryLight: '#cfe2ff',
                bgPrimary: '#ffffff',
                bgSecondary: '#f8f9fa',
                textPrimary: '#212529',
                textSecondary: '#6c757d',
                borderRadius: '0.375rem',    // Bootstrap border-radius
                borderWidth: '1px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px',
              }}
              customStyles={{
                maxWidth: '100%',
              }}
              placeholder="Введите текст в стиле Bootstrap..."
            />
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e7f3ff',
            borderRadius: '6px',
            borderLeft: '4px solid #0d6efd',
            color: '#004085',
          }}>
            <strong>Особенности:</strong>
            <ul style={{ marginTop: '10px', marginBottom: '0' }}>
              <li>Синий цвет (#0d6efd) как основной</li>
              <li>Белый фон с серым вторичным</li>
              <li>Bootstrap border-radius (0.375rem)</li>
              <li>Системный шрифт Bootstrap</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tailwind CSS пример */}
      {activeExample === 'tailwind' && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Tailwind CSS интеграция</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Редактор использует цвета и стили Tailwind CSS
          </p>
          
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #cffafe',
          }}>
            <WysiwygEditor
              themeName="custom"
              customTheme={{
                primary: '#06b6d4',          // Tailwind cyan-500
                primaryDark: '#0891b2',
                primaryLight: '#cffafe',
                bgPrimary: '#ffffff',
                bgSecondary: '#f0f9ff',
                textPrimary: '#0c4a6e',
                textSecondary: '#475569',
                borderRadius: '0.5rem',      // Tailwind rounded-lg
                borderWidth: '1px',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px',
              }}
              customStyles={{
                maxWidth: '100%',
              }}
              placeholder="Введите текст в стиле Tailwind..."
            />
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            borderLeft: '4px solid #06b6d4',
            color: '#065f46',
          }}>
            <strong>Особенности:</strong>
            <ul style={{ marginTop: '10px', marginBottom: '0' }}>
              <li>Cyan цвет (#06b6d4) как основной</li>
              <li>Светлый фон с голубым вторичным</li>
              <li>Tailwind border-radius (0.5rem)</li>
              <li>Tailwind система шрифтов</li>
            </ul>
          </div>
        </div>
      )}

      {/* Material Design пример */}
      {activeExample === 'material' && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Material Design интеграция</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Редактор использует цвета и стили Material Design
          </p>
          
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          }}>
            <WysiwygEditor
              themeName="custom"
              customTheme={{
                primary: '#1976d2',          // Material primary
                primaryDark: '#1565c0',
                primaryLight: '#e3f2fd',
                bgPrimary: '#ffffff',
                bgSecondary: '#f5f5f5',
                textPrimary: '#212121',
                textSecondary: '#757575',
                borderRadius: '4px',         // Material border-radius
                borderWidth: '1px',
                fontFamily: '"Roboto", sans-serif',
                fontSize: '14px',
                shadowMd: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
              }}
              customStyles={{
                maxWidth: '100%',
              }}
              placeholder="Введите текст в стиле Material Design..."
            />
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            color: '#1565c0',
          }}>
            <strong>Особенности:</strong>
            <ul style={{ marginTop: '10px', marginBottom: '0' }}>
              <li>Синий цвет (#1976d2) как основной</li>
              <li>Белый фон с серым вторичным</li>
              <li>Material border-radius (4px)</li>
              <li>Roboto шрифт</li>
              <li>Material тени</li>
            </ul>
          </div>
        </div>
      )}

      {/* Пользовательский пример */}
      {activeExample === 'custom' && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Пользовательский стиль</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Редактор с полностью пользовательским дизайном
          </p>
          
          <div style={{
            backgroundColor: '#fff5f5',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #ff6b6b',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)',
          }}>
            <WysiwygEditor
              themeName="custom"
              customTheme={{
                primary: '#ff6b6b',          // Красный
                primaryDark: '#fa5252',
                primaryLight: '#ffe0e0',
                bgPrimary: '#ffffff',
                bgSecondary: '#fff5f5',
                textPrimary: '#2d3748',
                textSecondary: '#718096',
                borderRadius: '8px',
                borderWidth: '2px',
                fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                fontSize: '15px',
                shadowMd: '0 4px 8px rgba(255, 107, 107, 0.15)',
              }}
              customStyles={{
                maxWidth: '100%',
              }}
              placeholder="Введите текст в пользовательском стиле..."
            />
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#ffe0e0',
            borderRadius: '8px',
            borderLeft: '4px solid #ff6b6b',
            color: '#c92a2a',
          }}>
            <strong>Особенности:</strong>
            <ul style={{ marginTop: '10px', marginBottom: '0' }}>
              <li>Красный цвет (#ff6b6b) как основной</li>
              <li>Светлый розовый фон</li>
              <li>Закругленные углы (8px)</li>
              <li>Толстая граница (2px)</li>
              <li>Пользовательские тени</li>
              <li>Inter шрифт</li>
            </ul>
          </div>
        </div>
      )}

      {/* Информация о гибкости */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd',
      }}>
        <h3 style={{ marginTop: '0', color: '#0369a1' }}>ℹ️ Информация о гибкости редактора</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
          <div>
            <h4 style={{ marginTop: '0' }}>✅ Что можно кастомизировать:</h4>
            <ul style={{ marginBottom: '0' }}>
              <li>Основной цвет (primary)</li>
              <li>Цвета фона (bgPrimary, bgSecondary)</li>
              <li>Цвета текста (textPrimary, textSecondary)</li>
              <li>Шрифт и размер</li>
              <li>Скругление углов</li>
              <li>Тени</li>
              <li>Толщина границ</li>
              <li>Пользовательские классы</li>
              <li>Встроенные стили</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginTop: '0' }}>🎯 Способы интеграции:</h4>
            <ul style={{ marginBottom: '0' }}>
              <li>Встроенные темы (light, dark, minimal, colorful)</li>
              <li>Пользовательские цвета (customTheme)</li>
              <li>CSS переменные (:root)</li>
              <li>Пользовательские классы (customClassName)</li>
              <li>Встроенные стили (customStyles)</li>
              <li>Комбинирование методов</li>
              <li>Адаптивный дизайн</li>
              <li>Темная/светлая тема системы</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #bae6fd' }}>
          <strong>Вывод:</strong> Редактор полностью гибкий и может приспосабливаться к любому стилю вашего сайта!
        </div>
      </div>
    </div>
  );
}
