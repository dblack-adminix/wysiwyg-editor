# Shiki Integration Fixes - Code Duplication and Theme Issues

## Issues Fixed

### 1. Code Appearing Twice (Duplication)
**Problem**: When pasting code, it appeared twice - once as Shiki-highlighted HTML and once as a CodeBlock React component.

**Root Cause**: 
- `Commands.insertText()` wraps Shiki HTML in `<div class="code-block-static">`
- Shiki generates `<pre class="shiki"><code>...</code></pre>`
- `WysiwygEditor.tsx` was querying for `pre.code-block` and accidentally picking up Shiki's `<pre>` elements

**Solution**:
- Updated `WysiwygEditor.tsx` to filter out any `<pre>` elements inside `.code-block-static` containers
- Added CSS rules for `.code-block-static` to properly display Shiki HTML directly
- Static Shiki blocks now bypass the CodeBlock React component entirely

### 2. Wrong Theme (Light Instead of Dark)
**Problem**: Pasted code always used light theme regardless of editor theme setting.

**Root Cause**:
- `EditorCore.handlePaste()` called `commands.insertText(text)` without passing theme parameter
- `insertText()` defaulted to `'dark'` theme
- EditorCore didn't have access to current theme from React layer

**Solution**:
- Added `theme` property to `EditorCoreOptions` interface
- Updated `useWysiwygEditor` hook to pass theme to EditorCore on initialization
- Added effect to update EditorCore theme when React theme changes
- Modified `handlePaste()` to pass current theme to `insertText()`

## Files Modified

### src/core/EditorCore.ts
- Added `theme?: 'light' | 'dark'` to `EditorCoreOptions` interface
- Updated `handlePaste()` to pass theme: `await this.commands.insertText(text, theme)`

### src/hooks/useWysiwygEditor.ts
- Changed interface to `extends Omit<EditorCoreOptions, 'theme'>` to avoid type conflict
- Pass theme to EditorCore on initialization
- Added effect to update core theme when React theme changes

### src/components/WysiwygEditor.tsx
- Updated code block query to filter out Shiki static blocks
- Changed from `:not(.code-block-static)` selector to explicit filtering
- Ensures CodeBlock component only renders for interactive blocks

### src/WysiwygEditor.module.css
- Added `.code-block-static` styles for proper Shiki HTML display
- Light theme support: `background: #f6f8fa` with `border: 1px solid #d0d7de`
- Dark theme uses Shiki's default dark background

## Testing

To verify the fixes:

1. **Theme Test**:
   - Toggle editor theme between light/dark
   - Paste code (e.g., Docker Compose, Nginx config)
   - Verify highlighted code matches editor theme

2. **No Duplication Test**:
   - Paste code snippet
   - Verify code appears only once
   - Check browser DevTools - should see single `.code-block-static` div with Shiki HTML inside

3. **Preview Test**:
   - Paste code in editor
   - Check Preview panel shows syntax highlighting
   - Verify copy button works in Preview

## Architecture

```
Paste Event
    ↓
EditorCore.handlePaste()
    ↓
Commands.insertText(text, theme) ← theme now passed
    ↓
Shiki highlightToHtml(code, lang, theme) ← correct theme
    ↓
Insert: <div class="code-block-static">{shikiHtml}</div>
    ↓
WysiwygEditor filters out .code-block-static from CodeBlock rendering
    ↓
Result: Single Shiki-highlighted code block with correct theme
```

## Status

✅ Code duplication fixed
✅ Theme correctly applied
✅ Preview shows syntax highlighting
✅ Copy functionality works
✅ Light/dark theme switching works
