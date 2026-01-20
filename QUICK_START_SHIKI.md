# Quick Start - Shiki Code Highlighting

## Installation

```bash
npm install
```

## Basic Usage

Just paste code into the editor - it will be automatically detected and highlighted!

### Example 1: Paste PowerShell Script

Copy this code:
```powershell
param([string]$Path = "E:\backup")
Get-ChildItem $Path -Filter *.zip | Remove-Item -Force
```

Paste it (Ctrl+V) → Automatically becomes a highlighted PowerShell code block!

### Example 2: Paste Docker Compose

Copy this code:
```yaml
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
```

Paste it → Automatically becomes a highlighted YAML code block!

### Example 3: Paste Nginx Config

Copy this code:
```nginx
server {
    listen 80;
    server_name example.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Paste it → Automatically becomes a highlighted Nginx code block!

## Features

### 1. Automatic Detection
- Detects 48+ languages automatically
- Confidence threshold: 0.3
- Works on paste (Ctrl+V)

### 2. Interactive Controls
- **Language Badge**: Shows detected language
- **Copy Button** (📋): Copy code to clipboard
- **Wrap Button** (↩️): Toggle line wrapping

### 3. Syntax Highlighting
- VS Code quality highlighting
- Uses Shiki library
- Dark theme (github-dark)

### 4. Preview Support
- Code is highlighted in preview panel
- Copy button works in preview
- Maintains formatting

## Supported Languages

**Most Common:**
- JavaScript, TypeScript, Python, Go, PHP, Ruby, Java, C#, C++
- HTML, CSS, JSON, YAML, Markdown
- Bash, PowerShell, SQL

**DevOps:**
- Docker, Docker Compose, Kubernetes, Terraform, Ansible
- Nginx, Apache, Caddyfile

**Full list:** See `SHIKI_FINAL.md`

## Manual Code Block

If automatic detection doesn't work:

1. Click **Code** button in toolbar
2. Paste your code
3. Click language badge to change language
4. Done!

## Tips

### Tip 1: Line Wrapping
- Click ↩️ button to toggle line wrapping
- Default: ON (lines wrap)
- Useful for long lines

### Tip 2: Copy Code
- Click 📋 button to copy
- Works in editor and preview
- Copies plain text (no formatting)

### Tip 3: Change Language
- Click language badge (e.g., "PowerShell")
- Select from dropdown
- Code re-highlights automatically

### Tip 4: Large Code Files
- Files >10MB may timeout
- Use manual code block for very large files
- Consider splitting into smaller blocks

## Troubleshooting

### Code Not Detected?
- Check if confidence > 0.3
- Use manual code block button
- Check console for errors

### Code Not Highlighting?
- Wait for Shiki to initialize (~1s first time)
- Check browser console for errors
- Try refreshing page

### Special Characters?
- All special characters are supported
- Uses Base64 encoding internally
- Quotes, slashes, etc. work fine

## Performance

- **First highlight**: ~500-1000ms (one-time init)
- **Subsequent**: <10ms (cached)
- **Cache**: 500 entries max
- **Hit rate**: ~80-90%

## Examples

### Example: PowerShell Cleanup Script
```powershell
param(
    [string]$Path = "E:\backup",
    [int]$RetentionCount = 7
)

Get-ChildItem $Path -Filter *.zip | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip $RetentionCount |
    ForEach-Object { Remove-Item $_.FullName -Force }
```

### Example: Docker Compose
```yaml
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
  app:
    build: .
    environment:
      - NODE_ENV=production
```

### Example: Nginx Config
```nginx
upstream app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
    }
}
```

## Next Steps

- Read `SHIKI_FINAL.md` for complete documentation
- Check `FIXTURES_ALL_LANGUAGES.md` for all language examples
- See `ADVANCED_CODE_DETECTOR.md` for detection details

---

Happy coding! 🚀
