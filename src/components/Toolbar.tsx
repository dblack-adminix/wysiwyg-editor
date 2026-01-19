import { useState, useRef, useEffect } from 'react';
import { EditorCore } from '../core/EditorCore';
import { BasicCommand } from '../core/Commands';
import { Theme } from '../types';
import { COLORS, EMOJIS } from '../constants';
import styles from '../WysiwygEditor.module.css';

interface ToolbarProps {
  core: EditorCore;
  theme: Theme;
  onLinkClick: () => void;
  onImageClick: () => void;
  onVideoClick: () => void;
  onTableClick: () => void;
  onFindClick: () => void;
  onFullscreenClick: () => void;
  onPrintClick: () => void;
  isFullscreen: boolean;
  allowImages?: boolean;
  allowVideoEmbeds?: boolean;
  allowTables?: boolean;
  enableFindReplace?: boolean;
  enablePrint?: boolean;
  enableFullscreen?: boolean;
  isMobile?: boolean;
}

export function Toolbar({
  core,
  theme,
  onLinkClick,
  onImageClick,
  onVideoClick,
  onTableClick,
  onFindClick,
  onFullscreenClick,
  onPrintClick,
  isFullscreen,
  allowImages = true,
  allowVideoEmbeds = true,
  allowTables = true,
  enableFindReplace = true,
  enablePrint = true,
  enableFullscreen = true,
  isMobile = false
}: ToolbarProps) {
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
  const [showTextColorPalette, setShowTextColorPalette] = useState(false);
  const [showBgColorPalette, setShowBgColorPalette] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const textColorRef = useRef<HTMLDivElement>(null);
  const bgColorRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const updateToolbarState = () => {
    const commands: BasicCommand[] = [
      'bold', 'italic', 'underline', 'strikeThrough',
      'subscript', 'superscript',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
      'insertUnorderedList', 'insertOrderedList'
    ];
    
    const active = new Set<string>();
    commands.forEach(cmd => {
      if (core.commands.queryState(cmd)) {
        active.add(cmd);
      }
    });
    setActiveCommands(active);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setShowTextColorPalette(false);
      }
      if (bgColorRef.current && !bgColorRef.current.contains(e.target as Node)) {
        setShowBgColorPalette(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCommand = (command: BasicCommand) => {
    core.commands.exec(command);
    updateToolbarState();
  };

  const isLight = theme === 'light';

  return (
    <div className={`${styles.toolbar} ${isLight ? styles.light : ''}`}>
      {/* History */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => handleCommand('undo')}
          title="Отменить (Ctrl+Z)"
        >
          <i className="fas fa-undo"></i>
        </button>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => handleCommand('redo')}
          title="Повторить (Ctrl+Y)"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>

      {/* Format - упрощаем на мобильных */}
      {!isMobile && (
        <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
          <select
            className={`${styles.toolbarSelect} ${isLight ? styles.light : ''}`}
            onChange={(e) => core.commands.setFormatBlock(e.target.value)}
          >
            <option value="p">Параграф</option>
            <option value="h1">Заголовок 1</option>
            <option value="h2">Заголовок 2</option>
            <option value="h3">Заголовок 3</option>
            <option value="h4">Заголовок 4</option>
            <option value="pre">Код</option>
            <option value="blockquote">Цитата</option>
          </select>
          
          <select
            className={`${styles.toolbarSelect} ${isLight ? styles.light : ''}`}
            onChange={(e) => core.commands.setFontName(e.target.value)}
          >
            <option value="Segoe UI">Segoe UI</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>
          
          <select
            className={`${styles.toolbarSelect} ${isLight ? styles.light : ''}`}
            onChange={(e) => core.commands.setFontSize(e.target.value)}
            defaultValue="3"
          >
            <option value="1">Мелкий</option>
            <option value="2">Малый</option>
            <option value="3">Обычный</option>
            <option value="4">Средний</option>
            <option value="5">Большой</option>
            <option value="6">Огромный</option>
            <option value="7">Максимальный</option>
          </select>
        </div>
      )}

      {/* Text Formatting */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        {(['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'] as BasicCommand[]).map(cmd => (
          <button
            key={cmd}
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''} ${activeCommands.has(cmd) ? styles.active : ''}`}
            onClick={() => handleCommand(cmd)}
          >
            <i className={`fas fa-${cmd === 'strikeThrough' ? 'strikethrough' : cmd}`}></i>
          </button>
        ))}
      </div>

      {/* Colors */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        <div className={styles.colorPickerWrapper} ref={textColorRef}>
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              // Save selection before opening palette
              core.selection.save();
              setShowTextColorPalette(!showTextColorPalette);
              setShowBgColorPalette(false);
              setShowEmojiPicker(false);
            }}
            title="Цвет текста"
          >
            <i className="fas fa-font" style={{ borderBottom: '3px solid #ff6b6b' }}></i>
          </button>
          <div className={`${styles.colorPalette} ${showTextColorPalette ? styles.show : ''}`}>
            {COLORS.map(color => (
              <div
                key={color}
                className={styles.colorSwatch}
                style={{ background: color }}
                onClick={() => {
                  console.log('[Toolbar] Setting foreColor:', color);
                  // Restore selection before applying color
                  core.selection.restore();
                  core.commands.setForeColor(color);
                  setShowTextColorPalette(false);
                }}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.colorPickerWrapper} ref={bgColorRef}>
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              // Save selection before opening palette
              core.selection.save();
              setShowBgColorPalette(!showBgColorPalette);
              setShowTextColorPalette(false);
              setShowEmojiPicker(false);
            }}
            title="Цвет фона"
          >
            <i className="fas fa-highlighter" style={{ borderBottom: '3px solid #feca57' }}></i>
          </button>
          <div className={`${styles.colorPalette} ${showBgColorPalette ? styles.show : ''}`}>
            {COLORS.map(color => (
              <div
                key={color}
                className={styles.colorSwatch}
                style={{ background: color }}
                onClick={() => {
                  console.log('[Toolbar] Setting backColor:', color);
                  // Restore selection before applying color
                  core.selection.restore();
                  core.commands.setBackColor(color);
                  setShowBgColorPalette(false);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        {(['insertUnorderedList', 'insertOrderedList'] as BasicCommand[]).map(cmd => (
          <button
            key={cmd}
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''} ${activeCommands.has(cmd) ? styles.active : ''}`}
            onClick={() => handleCommand(cmd)}
          >
            <i className={`fas fa-list-${cmd === 'insertUnorderedList' ? 'ul' : 'ol'}`}></i>
          </button>
        ))}
      </div>

      {/* Alignment */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        {(['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'] as BasicCommand[]).map(cmd => (
          <button
            key={cmd}
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''} ${activeCommands.has(cmd) ? styles.active : ''}`}
            onClick={() => handleCommand(cmd)}
          >
            <i className={`fas fa-align-${cmd.replace('justify', '').toLowerCase()}`}></i>
          </button>
        ))}
      </div>

      {/* Lists */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''} ${activeCommands.has('insertUnorderedList') ? styles.active : ''}`}
          onClick={() => handleCommand('insertUnorderedList')}
          title="Маркированный список"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''} ${activeCommands.has('insertOrderedList') ? styles.active : ''}`}
          onClick={() => handleCommand('insertOrderedList')}
          title="Нумерованный список"
        >
          <i className="fas fa-list-ol"></i>
        </button>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => handleCommand('indent')}
          title="Увеличить отступ"
        >
          <i className="fas fa-indent"></i>
        </button>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => handleCommand('outdent')}
          title="Уменьшить отступ"
        >
          <i className="fas fa-outdent"></i>
        </button>
      </div>

      {/* Insert */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={onLinkClick}
          title="Вставить ссылку (Ctrl+K)"
        >
          <i className="fas fa-link"></i>
        </button>
        {allowImages && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onImageClick}
            title="Вставить изображение"
          >
            <i className="fas fa-image"></i>
          </button>
        )}
        {allowVideoEmbeds && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onVideoClick}
            title="Вставить видео"
          >
            <i className="fas fa-video"></i>
          </button>
        )}
        {allowTables && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onTableClick}
            title="Вставить таблицу"
          >
            <i className="fas fa-table"></i>
          </button>
        )}
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => core.commands.insertHR()}
          title="Горизонтальная линия"
        >
          <i className="fas fa-minus"></i>
        </button>
      </div>

      {/* Special */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        <div className={styles.colorPickerWrapper} ref={emojiRef}>
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              // Save selection before opening emoji picker
              core.selection.save();
              setShowEmojiPicker(!showEmojiPicker);
              setShowTextColorPalette(false);
              setShowBgColorPalette(false);
            }}
            title="Эмодзи"
          >
            <i className="fas fa-smile"></i>
          </button>
          <div className={`${styles.emojiPicker} ${showEmojiPicker ? styles.show : ''}`}>
            <div className={styles.emojiGrid}>
              {EMOJIS.map((emoji, i) => (
                <div
                  key={i}
                  className={styles.emojiItem}
                  onClick={() => {
                    // Restore selection before inserting emoji
                    core.selection.restore();
                    core.commands.insertEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => core.commands.insertCodeBlock()}
          title="Блок кода"
        >
          <i className="fas fa-code"></i>
        </button>
        <button
          className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
          onClick={() => handleCommand('removeFormat')}
          title="Очистить форматирование"
        >
          <i className="fas fa-eraser"></i>
        </button>
      </div>

      {/* Actions */}
      <div className={`${styles.toolbarGroup} ${isLight ? styles.light : ''}`}>
        {enableFindReplace && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onFindClick}
            title="Поиск и замена (Ctrl+F)"
          >
            <i className="fas fa-search"></i>
          </button>
        )}
        {enablePrint && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onPrintClick}
            title="Печать (Ctrl+P)"
          >
            <i className="fas fa-print"></i>
          </button>
        )}
        {enableFullscreen && (
          <button
            className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`}
            onClick={onFullscreenClick}
            title="Полный экран (F11)"
          >
            <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
          </button>
        )}
      </div>
    </div>
  );
}
