# Integration Examples

Real-world examples of integrating the WYSIWYG Editor into different types of applications.

## Table of Contents

1. [Blog Platform](#blog-platform)
2. [E-commerce Product Description](#e-commerce-product-description)
3. [CMS Admin Panel](#cms-admin-panel)
4. [Comment System](#comment-system)
5. [Email Template Builder](#email-template-builder)
6. [Documentation Editor](#documentation-editor)

## Blog Platform

A full-featured blog editor with autosave and preview.

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function BlogEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />

      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
        themeName="light"
        enablePreviewPanel={true}
        previewPosition="right"
        previewWidth={400}
        enableAutosave={true}
        autosaveKey={`blog-${title}`}
        autosaveIntervalMs={2000}
        allowImages={true}
        allowImageUpload={true}
        allowVideoEmbeds={true}
        allowTables={true}
        enableFindReplace={true}
        enablePrint={true}
        enableFullscreen={true}
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => console.log('Save:', { title, content })}>
          Publish
        </button>
        <button onClick={() => console.log('Draft saved')}>
          Save Draft
        </button>
      </div>
    </div>
  );
}
```

## E-commerce Product Description

Lightweight editor for product descriptions with brand colors.

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function ProductDescriptionEditor() {
  const [description, setDescription] = useState('');

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2>Product Description</h2>
      
      <WysiwygEditor
        value={description}
        onChange={(html) => setDescription(html)}
        themeName="custom"
        customTheme={{
          primary: '#ff6b35',           // Brand orange
          bgPrimary: '#ffffff',
          textPrimary: '#1a1a1a',
          borderRadius: '6px',
        }}
        enablePreviewPanel={false}
        enableFindReplace={false}
        enablePrint={false}
        enableFullscreen={false}
        allowImages={true}
        allowImageUpload={false}
        allowVideoEmbeds={false}
        allowTables={false}
        placeholder="Enter product description..."
        style={{ minHeight: '300px' }}
      />

      <div style={{ marginTop: '15px' }}>
        <button onClick={() => console.log('Save description:', description)}>
          Save Description
        </button>
      </div>
    </div>
  );
}
```

## CMS Admin Panel

Full-featured admin editor with dark theme and all features enabled.

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function CMSEditor() {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({
    title: '',
    slug: '',
    category: '',
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Page Title"
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2d2d3f',
            color: '#fff',
          }}
        />
        <input
          type="text"
          placeholder="URL Slug"
          value={metadata.slug}
          onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2d2d3f',
            color: '#fff',
          }}
        />
        <select
          value={metadata.category}
          onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2d2d3f',
            color: '#fff',
          }}
        >
          <option value="">Select Category</option>
          <option value="blog">Blog</option>
          <option value="docs">Documentation</option>
          <option value="news">News</option>
        </select>
      </div>

      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
        themeName="dark"
        customTheme={{
          primary: '#6366f1',
          bgPrimary: '#1e1e2e',
          textPrimary: '#e0e0e0',
        }}
        enablePreviewPanel={true}
        previewPosition="right"
        enableSourceTab={true}
        enableFindReplace={true}
        enablePrint={true}
        enableFullscreen={true}
        allowImages={true}
        allowImageUpload={true}
        allowVideoEmbeds={true}
        allowVideoUpload={true}
        allowTables={true}
        enableAutosave={true}
        autosaveKey={`cms-${metadata.slug}`}
        autosaveIntervalMs={1000}
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Publish
        </button>
        <button style={{ padding: '10px 20px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Draft
        </button>
        <button style={{ padding: '10px 20px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Preview
        </button>
      </div>
    </div>
  );
}
```

## Comment System

Lightweight editor for user comments with minimal features.

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function CommentEditor() {
  const [comment, setComment] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '20px 0' }}>
      <h3>Leave a Comment</h3>
      
      <WysiwygEditor
        value={comment}
        onChange={(html) => setComment(html)}
        themeName="light"
        enablePreviewPanel={false}
        enableFindReplace={false}
        enablePrint={false}
        enableFullscreen={false}
        allowImages={false}
        allowVideoEmbeds={false}
        allowTables={false}
        placeholder="Share your thoughts..."
        style={{ minHeight: '150px', maxHeight: '300px' }}
      />

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => {
            console.log('Post comment:', comment);
            setComment('');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Post Comment
        </button>
        <button
          onClick={() => setComment('')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ddd',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
```

## Email Template Builder

Editor for creating email templates with preview.

```tsx
import { WysiwygEditor, PreviewPanel } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function EmailTemplateBuilder() {
  const [template, setTemplate] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
      <div>
        <h2>Email Template Editor</h2>
        <WysiwygEditor
          value={template}
          onChange={(html) => setTemplate(html)}
          themeName="light"
          enablePreviewPanel={false}
          enableFindReplace={true}
          enablePrint={false}
          enableFullscreen={false}
          allowImages={true}
          allowImageUpload={true}
          allowVideoEmbeds={false}
          allowTables={true}
          placeholder="Design your email template..."
        />
      </div>

      <div>
        <h2>Preview</h2>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}>
          <PreviewPanel
            html={template}
            theme="light"
            onExportHtml={() => console.log('Export:', template)}
            onExportText={() => {}}
            onCopyHtml={() => navigator.clipboard.writeText(template)}
            enableSourceTab={true}
          />
        </div>
      </div>
    </div>
  );
}
```

## Documentation Editor

Professional documentation editor with all features.

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { useState } from 'react';

export function DocumentationEditor() {
  const [doc, setDoc] = useState('');
  const [docInfo, setDocInfo] = useState({
    title: '',
    version: '1.0.0',
    author: '',
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <input
          type="text"
          placeholder="Document Title"
          value={docInfo.title}
          onChange={(e) => setDocInfo({ ...docInfo, title: e.target.value })}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <input
          type="text"
          placeholder="Version"
          value={docInfo.version}
          onChange={(e) => setDocInfo({ ...docInfo, version: e.target.value })}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <input
          type="text"
          placeholder="Author"
          value={docInfo.author}
          onChange={(e) => setDocInfo({ ...docInfo, author: e.target.value })}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <WysiwygEditor
        value={doc}
        onChange={(html) => setDoc(html)}
        themeName="light"
        enablePreviewPanel={true}
        previewPosition="right"
        previewWidth={450}
        enableSourceTab={true}
        enableFindReplace={true}
        enablePrint={true}
        enableFullscreen={true}
        allowImages={true}
        allowImageUpload={true}
        allowVideoEmbeds={true}
        allowTables={true}
        enableAutosave={true}
        autosaveKey={`doc-${docInfo.title}`}
        autosaveIntervalMs={3000}
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Publish
        </button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Export as PDF
        </button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Save Draft
        </button>
      </div>
    </div>
  );
}
```

## Tips for Integration

### 1. Responsive Design
```tsx
const isMobile = window.innerWidth < 768;

<WysiwygEditor
  previewPosition={isMobile ? 'bottom' : 'right'}
  previewHeight={isMobile ? '300px' : undefined}
  mobileOptimized={true}
/>
```

### 2. Theme Switching
```tsx
const [isDark, setIsDark] = useState(false);

<WysiwygEditor
  themeName={isDark ? 'dark' : 'light'}
/>
```

### 3. Content Validation
```tsx
const handleSave = (html: string) => {
  if (!html.trim()) {
    alert('Content cannot be empty');
    return;
  }
  // Save content
};

<WysiwygEditor onChange={handleSave} />
```

### 4. File Upload Handling
```tsx
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
};

<WysiwygEditor onImageUpload={handleImageUpload} />
```

### 5. Autosave with Backend
```tsx
const handleChange = async (html: string) => {
  setContent(html);
  
  // Debounced save to backend
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: html }),
    });
  }, 2000);
};

<WysiwygEditor onChange={handleChange} />
```

## Support

For more examples and help, visit the [GitHub repository](https://github.com/dblack-adminix/wysiwyg-editor).
