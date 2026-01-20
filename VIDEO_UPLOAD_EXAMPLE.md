# Video Upload - Example Implementation

## Frontend Usage

```tsx
import { useState } from 'react';
import { WysiwygEditor } from './components/WysiwygEditor';

function App() {
  const [content, setContent] = useState('');

  // Функция загрузки видео на сервер
  const handleVideoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
        headers: {
          // Добавьте токен авторизации если нужно
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url; // URL загруженного видео
    } catch (error) {
      console.error('Video upload error:', error);
      throw error;
    }
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

## Backend API Examples

### Node.js + Express + Multer

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/videos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, and OGG are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Endpoint загрузки
app.post('/api/upload/video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const videoUrl = `/uploads/videos/${req.file.filename}`;
  res.json({ url: videoUrl });
});

// Раздача статических файлов
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Python + Flask

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid

app = Flask(__name__)

UPLOAD_FOLDER = './uploads/videos'
ALLOWED_EXTENSIONS = {'mp4', 'webm', 'ogg'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload/video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Генерируем уникальное имя
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    file.save(filepath)
    
    video_url = f"/uploads/videos/{filename}"
    return jsonify({'url': video_url})

@app.route('/uploads/videos/<filename>')
def serve_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### PHP

```php
<?php
header('Content-Type: application/json');

$uploadDir = './uploads/videos/';
$allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
$maxFileSize = 100 * 1024 * 1024; // 100MB

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['video'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['video'];

    // Проверка ошибок
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Upload error']);
        exit;
    }

    // Проверка типа
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    // Проверка размера
    if ($file['size'] > $maxFileSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large']);
        exit;
    }

    // Генерируем уникальное имя
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $videoUrl = '/uploads/videos/' . $filename;
        echo json_encode(['url' => $videoUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save file']);
    }
}
?>
```

## Cloud Storage Examples

### AWS S3

```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function uploadToS3(file: File): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `videos/${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

// В компоненте
<WysiwygEditor
  allowVideoUpload={true}
  onVideoUpload={uploadToS3}
/>
```

### Cloudinary

```typescript
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();
  return data.secure_url;
}

// В компоненте
<WysiwygEditor
  allowVideoUpload={true}
  onVideoUpload={uploadToCloudinary}
/>
```

## Progress Tracking (Advanced)

Для отображения реального прогресса загрузки:

```typescript
async function uploadWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    const formData = new FormData();
    formData.append('video', file);

    xhr.open('POST', '/api/upload/video');
    xhr.send(formData);
  });
}
```

## Security Considerations

1. **Validate file type** on both client and server
2. **Limit file size** (recommended: 100MB max)
3. **Scan for viruses** using ClamAV or similar
4. **Use authentication** to prevent abuse
5. **Rate limiting** to prevent spam
6. **Generate unique filenames** to prevent overwrites
7. **Store outside web root** if possible
8. **Use CDN** for better performance

## Recommended Video Formats

- **MP4** (H.264 codec) - Best compatibility
- **WebM** (VP8/VP9 codec) - Good for web
- **OGG** (Theora codec) - Open source

## Optimization Tips

1. **Compress videos** before upload (FFmpeg)
2. **Generate thumbnails** for preview
3. **Use adaptive streaming** (HLS/DASH) for large videos
4. **Implement chunked upload** for large files
5. **Add retry logic** for failed uploads

---

**Note**: Remember to configure CORS if your API is on a different domain!
