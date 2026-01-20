import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useWysiwygEditor } from '../hooks/useWysiwygEditor';
import { Theme, ThemeConfig, EditorMeta } from '../types';
import { getThemeConfig } from '../themes';
import { COLORS } from '../constants';
import styles from '../WysiwygEditor.module.css';

interface ChatEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string, meta: EditorMeta) => void;
  onSubmit?: (html: string) => void;
  placeholder?: string;
  theme?: Theme;
  customTheme?: ThemeConfig;
  className?: string;
  style?: React.CSSProperties;
  maxHeight?: number | string;
  minHeight?: number | string;
  // Features
  enableEmoji?: boolean;
  enableBold?: boolean;
  enableItalic?: boolean;
  enableUnderline?: boolean;
  enableStrike?: boolean;
  enableLink?: boolean;
  enableCode?: boolean;
  enableList?: boolean;
  enableTextColor?: boolean;
  enableBgColor?: boolean;
  enableImage?: boolean;
  enableVideo?: boolean;
  enableTable?: boolean;
  // Callbacks
  onImageUpload?: (file: File) => Promise<string>;
  // Submit behavior
  submitOnEnter?: boolean;
  submitOnCtrlEnter?: boolean;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export function ChatEditor({
  value,
  defaultValue,
  onChange,
  onSubmit,
  placeholder = 'Введите сообщение...',
  theme: initialTheme = 'dark',
  customTheme,
  className = '',
  style,
  maxHeight = 200,
  minHeight = 40,
  enableEmoji = true,
  enableBold = true,
  enableItalic = true,
  enableUnderline = false,
  enableStrike = false,
  enableLink = true,
  enableCode = true,
  enableList = false,
  enableTextColor = false,
  enableBgColor = false,
  enableImage = false,
  enableVideo = false,
  enableTable = false,
  onImageUpload,
  submitOnEnter = false,
  submitOnCtrlEnter = true,
  submitButtonText = 'Отправить',
  showSubmitButton = true,
}: ChatEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tableRows, setTableRows] = useState('3');
  const [tableCols, setTableCols] = useState('3');
  const emojiRef = useRef<HTMLDivElement>(null);
  const textColorRef = useRef<HTMLDivElement>(null);
  const bgColorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const themeConfig = getThemeConfig(customTheme ? 'custom' : 'dark', customTheme);

  const {
    editorRef,
    core,
    theme,
  } = useWysiwygEditor({
    value,
    defaultValue,
    onChange,
    placeholder,
    theme: initialTheme
  });

  const isLight = theme === 'light';

  // Apply CSS variables locally
  useEffect(() => {
    if (wrapperRef.current) {
      Object.entries(themeConfig).forEach(([key, val]) => {
        if (val) {
          const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          wrapperRef.current!.style.setProperty(cssVarName, val);
        }
      });
    }
  }, [themeConfig]);

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setShowTextColorPicker(false);
      }
      if (bgColorRef.current && !bgColorRef.current.contains(e.target as Node)) {
        setShowBgColorPicker(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle image upload
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (onImageUpload) {
      const url = await onImageUpload(file);
      core.commands.insertImage(url, file.name);
    } else {
      // Fallback: use data URL
      const reader = new FileReader();
      reader.onload = () => {
        core.commands.insertImage(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Insert video from URL
  const handleVideoInsert = () => {
    if (!videoUrl) return;
    
    let embedUrl = '';
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    
    if (youtubeMatch) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    } else if (vimeoMatch) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    } else {
      return;
    }
    
    const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    core.commands.insertHTML(iframe);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  // Insert link
  const handleLinkInsert = () => {
    if (linkUrl) {
      core.selection.restore();
      core.commands.insertLink(linkUrl, '');
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  // Insert table
  const handleTableInsert = () => {
    const rows = parseInt(tableRows) || 0;
    const cols = parseInt(tableCols) || 0;
    
    if (rows > 0 && cols > 0) {
      core.commands.insertTable(rows, cols);
      setTableRows('3');
      setTableCols('3');
      setShowTableModal(false);
    }
  };

  // Modal styles
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999999,
  };

  const modalStyle: React.CSSProperties = {
    background: 'var(--bg-primary, #1e1e2e)',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '300px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--bg-secondary, #2d2d3f)',
    background: 'var(--bg-secondary, #2d2d3f)',
    color: 'var(--text-primary, #fff)',
    fontSize: '14px',
    marginBottom: '12px',
    outline: 'none',
  };

  const btnStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (submitOnEnter && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        handleSubmit();
      } else if (submitOnCtrlEnter && e.ctrlKey) {
        e.preventDefault();
        handleSubmit();
      }
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          if (enableBold) {
            e.preventDefault();
            core.commands.exec('bold');
          }
          break;
        case 'i':
          if (enableItalic) {
            e.preventDefault();
            core.commands.exec('italic');
          }
          break;
        case 'u':
          if (enableUnderline) {
            e.preventDefault();
            core.commands.exec('underline');
          }
          break;
      }
    }
  };

  const handleSubmit = () => {
    const html = core.getHTML();
    if (html && html.trim() && onSubmit) {
      onSubmit(html);
      core.setHTML('');
    }
  };

  const CHAT_EMOJIS = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '✅', '❌', '🎉', '😢'];

  return (
    <div
      ref={wrapperRef}
      className={`chat-editor-wrapper ${isLight ? 'light' : ''} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--bg-secondary)',
        position: 'relative',
        ...style,
      }}
    >
      {/* Compact Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px 8px',
          borderBottom: '1px solid var(--bg-primary)',
          background: 'var(--bg-secondary)',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10,
          borderRadius: '12px 12px 0 0',
        }}
      >
        {enableBold && (
          <button
            className={styles.toolbarBtn}
            onClick={() => core.commands.exec('bold')}
            title="Жирный (Ctrl+B)"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-bold"></i>
          </button>
        )}
        {enableItalic && (
          <button
            className={styles.toolbarBtn}
            onClick={() => core.commands.exec('italic')}
            title="Курсив (Ctrl+I)"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-italic"></i>
          </button>
        )}
        {enableUnderline && (
          <button
            className={styles.toolbarBtn}
            onClick={() => core.commands.exec('underline')}
            title="Подчёркнутый (Ctrl+U)"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-underline"></i>
          </button>
        )}
        {enableStrike && (
          <button
            className={styles.toolbarBtn}
            onClick={() => core.commands.exec('strikeThrough')}
            title="Зачёркнутый"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-strikethrough"></i>
          </button>
        )}
        {enableLink && (
          <button
            className={styles.toolbarBtn}
            onClick={() => {
              core.selection.save();
              setShowLinkModal(true);
            }}
            title="Ссылка"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-link"></i>
          </button>
        )}
        {enableCode && (
          <button
            className={styles.toolbarBtn}
            onClick={() => core.commands.insertCodeBlock()}
            title="Код"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-code"></i>
          </button>
        )}
        {enableList && (
          <>
            <button
              className={styles.toolbarBtn}
              onClick={() => core.commands.exec('insertUnorderedList')}
              title="Список"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              <i className="fas fa-list-ul"></i>
            </button>
          </>
        )}
        {enableEmoji && (
          <div ref={emojiRef} style={{ position: 'relative' }}>
            <button
              className={styles.toolbarBtn}
              onClick={(e) => {
                e.stopPropagation();
                core.selection.save();
                setShowEmojiPicker(!showEmojiPicker);
                setShowTextColorPicker(false);
                setShowBgColorPicker(false);
              }}
              title="Эмодзи"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              <i className="fas fa-smile"></i>
            </button>
            {showEmojiPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-secondary)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '4px',
                  zIndex: 999999,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {CHAT_EMOJIS.map((emoji, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      core.selection.restore();
                      core.commands.insertEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    style={{
                      fontSize: 18,
                      padding: '4px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text Color */}
        {enableTextColor && (
          <div ref={textColorRef} style={{ position: 'relative' }}>
            <button
              className={styles.toolbarBtn}
              onClick={(e) => {
                e.stopPropagation();
                core.selection.save();
                setShowTextColorPicker(!showTextColorPicker);
                setShowBgColorPicker(false);
                setShowEmojiPicker(false);
              }}
              title="Цвет текста"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              <i className="fas fa-font" style={{ borderBottom: '3px solid #ff6b6b' }}></i>
            </button>
            {showTextColorPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-secondary)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '4px',
                  zIndex: 999999,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => {
                      core.selection.restore();
                      core.commands.setForeColor(color);
                      setShowTextColorPicker(false);
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      background: color,
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Background Color */}
        {enableBgColor && (
          <div ref={bgColorRef} style={{ position: 'relative' }}>
            <button
              className={styles.toolbarBtn}
              onClick={(e) => {
                e.stopPropagation();
                core.selection.save();
                setShowBgColorPicker(!showBgColorPicker);
                setShowTextColorPicker(false);
                setShowEmojiPicker(false);
              }}
              title="Цвет фона"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              <i className="fas fa-highlighter" style={{ borderBottom: '3px solid #feca57' }}></i>
            </button>
            {showBgColorPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-secondary)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '4px',
                  zIndex: 999999,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => {
                      core.selection.restore();
                      core.commands.setBackColor(color);
                      setShowBgColorPicker(false);
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      background: color,
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Image */}
        {enableImage && (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              className={styles.toolbarBtn}
              onClick={() => imageInputRef.current?.click()}
              title="Вставить изображение"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              <i className="fas fa-image"></i>
            </button>
          </>
        )}

        {/* Video */}
        {enableVideo && (
          <button
            className={styles.toolbarBtn}
            onClick={() => setShowVideoModal(true)}
            title="Вставить видео"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-video"></i>
          </button>
        )}

        {/* Table */}
        {enableTable && (
          <button
            className={styles.toolbarBtn}
            onClick={() => setShowTableModal(true)}
            title="Вставить таблицу"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            <i className="fas fa-table"></i>
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          padding: '8px 12px',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: 1.5,
          overflowY: 'auto',
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          background: 'var(--bg-primary)',
        }}
      />

      {/* Submit Button */}
      {showSubmitButton && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px',
            borderTop: '1px solid var(--bg-secondary)',
            background: 'var(--bg-secondary)',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              padding: '6px 16px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {submitButtonText}
            {submitOnCtrlEnter && <span style={{ opacity: 0.7, marginLeft: 8, fontSize: 11 }}>Ctrl+Enter</span>}
          </button>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div style={modalOverlayStyle} onClick={() => setShowLinkModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--text-primary, #fff)', fontSize: '16px' }}>
              Вставить ссылку
            </h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={inputStyle}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLinkModal(false)}
                style={{ ...btnStyle, background: 'var(--bg-secondary, #2d2d3f)', color: 'var(--text-primary, #fff)' }}
              >
                Отмена
              </button>
              <button
                onClick={handleLinkInsert}
                style={{ ...btnStyle, background: 'var(--primary, #6366f1)', color: '#fff' }}
              >
                Вставить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div style={modalOverlayStyle} onClick={() => setShowVideoModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--text-primary, #fff)', fontSize: '16px' }}>
              Вставить видео
            </h3>
            <input
              type="url"
              placeholder="YouTube или Vimeo URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={inputStyle}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleVideoInsert()}
            />
            <p style={{ margin: '0 0 12px', color: 'var(--text-secondary, #9ca3af)', fontSize: '12px' }}>
              Поддерживаются: YouTube, Vimeo
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowVideoModal(false)}
                style={{ ...btnStyle, background: 'var(--bg-secondary, #2d2d3f)', color: 'var(--text-primary, #fff)' }}
              >
                Отмена
              </button>
              <button
                onClick={handleVideoInsert}
                style={{ ...btnStyle, background: 'var(--primary, #6366f1)', color: '#fff' }}
              >
                Вставить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div style={modalOverlayStyle} onClick={() => setShowTableModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--text-primary, #fff)', fontSize: '16px' }}>
              Вставить таблицу
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary, #9ca3af)', fontSize: '12px' }}>
                  Строки
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary, #9ca3af)', fontSize: '12px' }}>
                  Столбцы
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTableModal(false)}
                style={{ ...btnStyle, background: 'var(--bg-secondary, #2d2d3f)', color: 'var(--text-primary, #fff)' }}
              >
                Отмена
              </button>
              <button
                onClick={handleTableInsert}
                style={{ ...btnStyle, background: 'var(--primary, #6366f1)', color: '#fff' }}
              >
                Вставить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
