# Integration Examples / Примеры интеграции

This document provides detailed integration examples for different frameworks and use cases.

Этот документ содержит подробные примеры интеграции для различных фреймворков и сценариев использования.

## Table of Contents / Содержание

1. [Next.js Integration](#nextjs-integration)
2. [Vite + React](#vite--react)
3. [Create React App](#create-react-app)
4. [Remix](#remix)
5. [Form Integration](#form-integration)
6. [Validation](#validation)
7. [Custom Image Upload](#custom-image-upload)
8. [Custom Video Upload](#custom-video-upload)
9. [Backend Sync](#backend-sync)
10. [Multi-Editor Management](#multi-editor-management)

---

## Next.js Integration

### App Router (Next.js 13+)

```tsx
// app/editor/page.tsx
'use client';

import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    if (response.ok) {
      alert('Saved!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Editor</h1>
      
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
        placeholder="Start writing your article..."
        enableAutosave={true}
        autosaveKey="article-draft"
      />
      
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Article
      </button>
    </div>
  );
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/editor.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import type { NextPage } from 'next';

const EditorPage: NextPage = () => {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>Editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
};

export default EditorPage;
```

### SSR Considerations / Учет SSR

```tsx
// app/editor/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Динамический импорт без SSR
const WysiwygEditor = dynamic(
  () => import('@your-org/wysiwyg-editor').then(mod => mod.WysiwygEditor),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <div>
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
}
```

---

## Vite + React

### Basic Setup

```tsx
// src/App.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="App">
      <h1>My Editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html, meta) => {
          setContent(html);
          console.log(`Words: ${meta.wordCount}, Chars: ${meta.charCount}`);
        }}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;
```

### With TypeScript

```tsx
// src/App.tsx
import { WysiwygEditor, EditorMeta } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<EditorMeta>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0
  });

  const handleChange = (html: string, newMeta: EditorMeta) => {
    setContent(html);
    setMeta(newMeta);
  };

  return (
    <div className="App">
      <WysiwygEditor value={content} onChange={handleChange} />
      
      <div className="stats">
        <span>Words: {meta.wordCount}</span>
        <span>Characters: {meta.charCount}</span>
        <span>Paragraphs: {meta.paragraphCount}</span>
      </div>
    </div>
  );
}

export default App;
```

---

## Create React App

### JavaScript

```jsx
// src/App.js
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import './App.css';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>WYSIWYG Editor Demo</h1>
      </header>
      
      <main>
        <WysiwygEditor
          value={content}
          onChange={(html) => setContent(html)}
          placeholder="Start writing..."
        />
      </main>
    </div>
  );
}

export default App;
```

### TypeScript

```tsx
// src/App.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('');

  return (
    <div className="App">
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
};

export default App;
```

---

## Remix

```tsx
// app/routes/editor.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const content = formData.get('content');
  
  // Save to database
  // await db.articles.create({ content });
  
  return json({ success: true });
}

export default function EditorRoute() {
  const [content, setContent] = useState('');
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Editor</h1>
      
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
      
      <Form method="post">
        <input type="hidden" name="content" value={content} />
        <button type="submit">Save</button>
      </Form>
      
      {actionData?.success && <p>Saved successfully!</p>}
    </div>
  );
}
```

---

## Form Integration

### With React Hook Form

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useForm, Controller } from 'react-hook-form';

interface ArticleForm {
  title: string;
  content: string;
  author: string;
}

function ArticleForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<ArticleForm>();

  const onSubmit = (data: ArticleForm) => {
    console.log('Submitting:', data);
    // Send to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <input {...field} type="text" />
          )}
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <div>
        <label>Content</label>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'Content is required' }}
          render={({ field }) => (
            <WysiwygEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Write your article..."
            />
          )}
        />
        {errors.content && <span>{errors.content.message}</span>}
      </div>

      <div>
        <label>Author</label>
        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <input {...field} type="text" />
          )}
        />
      </div>

      <button type="submit">Publish</button>
    </form>
  );
}
```

### With Formik

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ArticleSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  content: Yup.string().required('Required'),
});

function ArticleForm() {
  return (
    <Formik
      initialValues={{ title: '', content: '' }}
      validationSchema={ArticleSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <div>
            <label>Title</label>
            <Field name="title" type="text" />
            {errors.title && touched.title && <div>{errors.title}</div>}
          </div>

          <div>
            <label>Content</label>
            <WysiwygEditor
              value={values.content}
              onChange={(html) => setFieldValue('content', html)}
            />
            {errors.content && touched.content && <div>{errors.content}</div>}
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

---

## Validation

### Character Limit

```tsx
import { WysiwygEditor, stripHtml } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function ValidatedEditor() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  const MAX_CHARS = 5000;
  const MIN_CHARS = 10;

  const handleChange = (html: string) => {
    setContent(html);
    
    const text = stripHtml(html);
    const length = text.length;
    
    if (length < MIN_CHARS) {
      setError(`Minimum ${MIN_CHARS} characters required`);
    } else if (length > MAX_CHARS) {
      setError(`Maximum ${MAX_CHARS} characters allowed`);
    } else {
      setError('');
    }
  };

  const charCount = stripHtml(content).length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  return (
    <div>
      <WysiwygEditor
        value={content}
        onChange={handleChange}
      />
      
      <div style={{ 
        color: isValid ? 'green' : 'red',
        marginTop: '8px'
      }}>
        {charCount} / {MAX_CHARS} characters
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button disabled={!isValid}>
        Submit
      </button>
    </div>
  );
}
```

### Word Limit

```tsx
import { WysiwygEditor, EditorMeta } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function WordLimitEditor() {
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState<EditorMeta>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0
  });
  
  const MAX_WORDS = 500;

  const handleChange = (html: string, newMeta: EditorMeta) => {
    if (newMeta.wordCount <= MAX_WORDS) {
      setContent(html);
      setMeta(newMeta);
    }
  };

  const progress = (meta.wordCount / MAX_WORDS) * 100;

  return (
    <div>
      <WysiwygEditor
        value={content}
        onChange={handleChange}
      />
      
      <div style={{ marginTop: '8px' }}>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: progress > 90 ? 'red' : 'green',
            borderRadius: '2px',
            transition: 'width 0.3s'
          }} />
        </div>
        
        <div style={{ marginTop: '4px' }}>
          {meta.wordCount} / {MAX_WORDS} words
        </div>
      </div>
    </div>
  );
}
```

---

## Custom Image Upload

### Upload to Server

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function EditorWithImageUpload() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);

    // Upload to your server
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    // Return the URL of uploaded image
    return data.url; // e.g., "https://cdn.example.com/images/abc123.jpg"
  };

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      allowImageUpload={true}
      onImageUpload={handleImageUpload}
    />
  );
}
```

### Upload to AWS S3

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

function EditorWithS3Upload() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET!,
      Key: `images/${fileName}`,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  };

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      onImageUpload={handleImageUpload}
    />
  );
}
```

---

## Custom Video Upload

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function EditorWithVideoUpload() {
  const [content, setContent] = useState('');

  const handleVideoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch('/api/upload/video', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Video upload failed');
    }

    const data = await response.json();
    return data.url; // URL to video file or streaming URL
  };

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      allowVideoUpload={true}
      onVideoUpload={handleVideoUpload}
    />
  );
}
```

---

## Backend Sync

### Auto-save to Backend

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState, useEffect, useRef } from 'react';

function EditorWithBackendSync() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const saveToBackend = async (html: string) => {
    setIsSaving(true);
    
    try {
      await fetch('/api/articles/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: html })
      });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (html: string) => {
    setContent(html);
    
    // Debounce save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveToBackend(html);
    }, 2000); // Save after 2 seconds of inactivity
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        {isSaving && <span>Saving...</span>}
        {lastSaved && !isSaving && (
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>
      
      <WysiwygEditor
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}
```

---

## Multi-Editor Management

### Multiple Editors on Same Page

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

function MultiEditorPage() {
  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: 'Introduction', content: '' },
    { id: '2', title: 'Main Content', content: '' },
    { id: '3', title: 'Conclusion', content: '' }
  ]);

  const updateSection = (id: string, content: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, content } : section
      )
    );
  };

  return (
    <div>
      <h1>Multi-Section Article</h1>
      
      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: '32px' }}>
          <h2>{section.title}</h2>
          <WysiwygEditor
            value={section.content}
            onChange={(html) => updateSection(section.id, html)}
            autosaveKey={`section-${section.id}`}
            enableAutosave={true}
          />
        </div>
      ))}
    </div>
  );
}
```

---

## Minimal Configuration

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function MinimalEditor() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      // Disable advanced features
      enablePreviewPanel={false}
      enableSourceTab={false}
      enableFindReplace={false}
      enablePrint={false}
      enableFullscreen={false}
      allowVideoEmbeds={false}
      allowTables={false}
      // Keep only basic formatting
      placeholder="Simple editor with basic formatting only"
    />
  );
}
```

---

## Read-Only Display

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';

function ArticleDisplay({ content }: { content: string }) {
  return (
    <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
      <WysiwygEditor
        value={content}
        enablePreviewPanel={false}
        // No onChange = read-only
      />
    </div>
  );
}
```

---

## Custom Styling

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';
import './CustomEditor.css';

function CustomStyledEditor() {
  const [content, setContent] = useState('');

  return (
    <div className="custom-editor-wrapper">
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
        className="my-custom-editor"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}
```

```css
/* CustomEditor.css */
.custom-editor-wrapper {
  padding: 20px;
  background: #f5f5f5;
}

.my-custom-editor {
  border-radius: 8px;
  overflow: hidden;
}

/* Override CSS variables */
:root {
  --primary: #ff6b6b;
  --primary-dark: #ee5a52;
}
```

---

## Troubleshooting / Решение проблем

### CSS Not Loading

```tsx
// Make sure to import CSS
import '@your-org/wysiwyg-editor/style.css';
```

### TypeScript Errors

```bash
# Make sure types are installed
npm install --save-dev @types/react @types/react-dom
```

### Build Errors in Next.js

```js
// next.config.js
module.exports = {
  transpilePackages: ['@your-org/wysiwyg-editor']
};
```

### SSR Errors

Use dynamic import:

```tsx
const WysiwygEditor = dynamic(
  () => import('@your-org/wysiwyg-editor').then(mod => mod.WysiwygEditor),
  { ssr: false }
);
```

---

## More Examples

For more examples, see:
- [README.md](./README.md) - Main documentation
- [demo/App.tsx](./demo/App.tsx) - Demo application
- [EXAMPLES.md](./EXAMPLES.md) - Additional examples

Для дополнительных примеров см.:
- [README.md](./README.md) - Основная документация
- [demo/App.tsx](./demo/App.tsx) - Демо приложение
- [EXAMPLES.md](./EXAMPLES.md) - Дополнительные примеры
