# 📋 GitHub Issues для решения

## Issue #1: Preview Panel жестко привязан к редактору

**Title:** Make Preview Panel optional and detachable

**Description:**

### Problem
The Preview Panel is tightly coupled to the main editor component and cannot be:
- Disabled
- Moved to a different location
- Used independently
- Customized separately

### Solution
1. Make preview panel optional via `enablePreviewPanel` prop
2. Export `PreviewPanel` as a separate component
3. Allow custom positioning (right, bottom, none)
4. Allow using preview in custom layouts

### Example Usage
```tsx
// Option 1: Disable preview
<WysiwygEditor enablePreviewPanel={false} />

// Option 2: Use preview separately
import { WysiwygEditor, PreviewPanel } from 'wysiwyg-editor-3lab';

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
  <WysiwygEditor enablePreviewPanel={false} value={html} onChange={setHtml} />
  <PreviewPanel html={html} />
</div>
```

### Acceptance Criteria
- [ ] Preview can be disabled
- [ ] Preview can be positioned (right, bottom, none)
- [ ] PreviewPanel exported as separate component
- [ ] Works in custom layouts
- [ ] Documentation updated
- [ ] Examples provided

**Labels:** enhancement, customization, v1.1.0

---

## Issue #2: Styles are tightly coupled to editor

**Title:** Make editor styles flexible and themeable

**Description:**

### Problem
The editor styles are hardcoded and difficult to customize:
- Colors are not easily changeable
- Cannot adapt to website design
- CSS variables are limited
- No theme system

### Solution
1. Expand CSS variables for all components
2. Add `theme` prop (light, dark, auto, custom)
3. Add `customTheme` prop for color customization
4. Add `customClassName` and `customStyles` props
5. Create theme system (light, dark, minimal, colorful)

### Example Usage
```tsx
// Option 1: Use predefined theme
<WysiwygEditor theme="dark" />

// Option 2: Custom colors
<WysiwygEditor
  theme="custom"
  customTheme={{
    primary: '#ff6b6b',
    bgPrimary: '#f5f5f5',
    textPrimary: '#333333',
  }}
/>

// Option 3: Custom CSS
<WysiwygEditor
  customClassName="my-editor-theme"
  customStyles={{ maxWidth: '900px' }}
/>
```

### Acceptance Criteria
- [ ] CSS variables expanded
- [ ] Theme prop added
- [ ] customTheme prop added
- [ ] customClassName prop added
- [ ] customStyles prop added
- [ ] Multiple themes available
- [ ] Documentation updated
- [ ] Examples for different websites

**Labels:** enhancement, customization, styling, v1.1.0

---

## Issue #3: Components are not flexible

**Title:** Allow optional and custom components

**Description:**

### Problem
All components (Toolbar, StatusBar, PreviewPanel) are always rendered and cannot be:
- Disabled
- Replaced with custom versions
- Repositioned

### Solution
1. Make components optional via props
2. Allow custom component replacement
3. Allow component repositioning
4. Document component API

### Example Usage
```tsx
// Option 1: Disable components
<WysiwygEditor
  showToolbar={false}
  showStatusBar={false}
/>

// Option 2: Custom toolbar
function MyToolbar(props) {
  return <div className="my-toolbar">...</div>;
}

<WysiwygEditor customToolbar={MyToolbar} />
```

### Acceptance Criteria
- [ ] Components can be disabled
- [ ] Custom components can be provided
- [ ] Component API documented
- [ ] Examples provided
- [ ] Tests added

**Labels:** enhancement, customization, v1.2.0

---

## Issue #4: No CSS-in-JS support

**Title:** Add support for styled-components and Tailwind CSS

**Description:**

### Problem
Users cannot easily style the editor with:
- styled-components
- Tailwind CSS
- CSS-in-JS libraries

### Solution
1. Ensure className prop works with Tailwind
2. Ensure styled-components can wrap component
3. Provide examples
4. Document best practices

### Example Usage
```tsx
// Tailwind CSS
<WysiwygEditor
  customClassName="rounded-lg border-2 border-gray-300 shadow-lg"
/>

// styled-components
const StyledEditor = styled(WysiwygEditor)`
  .editor-toolbar {
    background: ${props => props.theme.primary};
  }
`;
```

### Acceptance Criteria
- [ ] Works with Tailwind CSS
- [ ] Works with styled-components
- [ ] Examples provided
- [ ] Documentation updated

**Labels:** enhancement, customization, v1.2.0

---

## Issue #5: Documentation for customization

**Title:** Add comprehensive customization guide

**Description:**

### Problem
Users don't know how to customize the editor for their needs.

### Solution
Create documentation:
1. CUSTOMIZATION_GUIDE.md - for users
2. CUSTOMIZATION_API.md - for developers
3. Examples for different use cases
4. Theme examples

### Content
- How to disable components
- How to customize colors
- How to use custom themes
- How to integrate with websites
- How to use custom layouts
- CSS variable reference
- Props reference

### Acceptance Criteria
- [ ] CUSTOMIZATION_GUIDE.md created
- [ ] CUSTOMIZATION_API.md created
- [ ] Examples provided
- [ ] Props documented
- [ ] CSS variables documented

**Labels:** documentation, customization

---

## Issue #6: Create theme builder UI

**Title:** Add interactive theme builder

**Description:**

### Problem
Users need an easy way to create custom themes without coding.

### Solution
Create a theme builder:
1. Interactive color picker
2. Live preview
3. Export theme as JSON
4. Import theme from JSON

### Example
```tsx
<ThemeBuilder onThemeChange={setTheme} />
```

### Acceptance Criteria
- [ ] Color picker UI
- [ ] Live preview
- [ ] Export/import functionality
- [ ] Documentation

**Labels:** enhancement, customization, v1.3.0

---

## Priority and Timeline

### v1.1.0 (Next Release)
- Issue #1: Preview Panel optional
- Issue #2: Flexible styles
- Issue #5: Documentation

### v1.2.0 (Future)
- Issue #3: Flexible components
- Issue #4: CSS-in-JS support

### v1.3.0 (Future)
- Issue #6: Theme builder UI

---

## How to Create Issues on GitHub

1. Go to: https://github.com/dblack-adminix/wysiwyg-editor/issues
2. Click "New issue"
3. Copy content from above
4. Add labels
5. Assign to yourself
6. Click "Submit new issue"

---

## Labels to Create

- `customization` - customization related
- `styling` - styling related
- `enhancement` - new feature
- `documentation` - documentation
- `v1.1.0` - for version 1.1.0
- `v1.2.0` - for version 1.2.0
- `v1.3.0` - for version 1.3.0

---

*These issues will help track the customization improvements and make the editor more flexible for different use cases.*
