# Shiki Integration - Testing Guide

## Quick Test

1. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Server should be running at http://localhost:5176

2. **Test Auto-Detection**
   
   Paste these code snippets into the editor:

   ### JavaScript
   ```javascript
   const greeting = 'Hello World';
   console.log(greeting);
   ```

   ### TypeScript
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   const user: User = { name: 'John', age: 30 };
   ```

   ### Python
   ```python
   def fibonacci(n):
       if n <= 1:
           return n
       return fibonacci(n-1) + fibonacci(n-2)
   ```

   ### PowerShell
   ```powershell
   param([string]$name = "World")
   Write-Host "Hello, $name!"
   Get-Process | Where-Object { $_.CPU -gt 100 }
   ```

   ### YAML
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: my-service
   spec:
     selector:
       app: MyApp
     ports:
       - protocol: TCP
         port: 80
   ```

   ### Nginx
   ```nginx
   server {
       listen 80;
       server_name example.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
       }
   }
   ```

   ### SQL
   ```sql
   SELECT users.name, orders.total
   FROM users
   INNER JOIN orders ON users.id = orders.user_id
   WHERE orders.total > 100
   ORDER BY orders.total DESC;
   ```

3. **Test UI Controls**

   For each code block, verify:
   - ✅ Language badge displays correctly (top-left)
   - ✅ Click language badge to open dropdown
   - ✅ Select different language from dropdown
   - ✅ Click copy button (📋) - should show checkmark (✓)
   - ✅ Click wrap button (↔/⤸) - should toggle line wrapping
   - ✅ Syntax highlighting matches VS Code quality

4. **Test Theme Switching**

   - Click theme toggle button in toolbar
   - Verify code blocks update to light/dark theme
   - Check that highlighting remains correct

5. **Test Performance**

   - Paste the same code multiple times
   - Should be instant (cached)
   - Check browser console for any errors

## Expected Results

### Auto-Detection
- All code snippets should be automatically detected
- Wrapped in code blocks with correct language
- Highlighted immediately on paste

### UI Controls
- Language badge shows display name (e.g., "JavaScript", not "js")
- Dropdown shows all 60+ supported languages
- Copy button copies raw code to clipboard
- Wrap button toggles between scroll and wrap

### Themes
- Dark theme: `github-dark` (default)
- Light theme: `github-light`
- Smooth transition between themes
- No flash of unstyled content

### Performance
- First highlight: ~400ms (initialization)
- Cached highlights: <1ms
- No lag when typing
- No memory leaks

## Common Issues

### Code Not Highlighting
**Symptom**: Code appears as plain text  
**Fix**: Check browser console for Shiki errors

### Language Not Detected
**Symptom**: Code wrapped as plain-text  
**Fix**: Increase confidence threshold or add more patterns

### Dropdown Not Opening
**Symptom**: Click on badge does nothing  
**Fix**: Verify `editable={true}` prop on CodeBlock

### Copy Button Not Working
**Symptom**: Nothing copied to clipboard  
**Fix**: Check HTTPS (clipboard API requires secure context)

### Theme Not Switching
**Symptom**: Code blocks stay same color  
**Fix**: Verify theme prop is passed to CodeBlock

## Browser Console Commands

Test the API directly in browser console:

```javascript
// Import functions (if exposed globally)
import { detectLanguage } from './src/utils/detectLanguage';
import { highlightToHtml, normalizeLang } from './src/utils/codeHighlight';

// Test detection
const code = 'const x = 42;';
const result = detectLanguage(code);
console.log(result); // { lang: 'javascript', confidence: 0.8, ... }

// Test highlighting
highlightToHtml(code, 'javascript', 'dark').then(html => {
  console.log(html); // <pre>...</pre>
});

// Test normalization
console.log(normalizeLang('js')); // 'javascript'
console.log(normalizeLang('py')); // 'python'
```

## Smoke Test Checklist

- [ ] Dev server starts without errors
- [ ] Editor loads and is interactive
- [ ] Paste JavaScript code → auto-detected and highlighted
- [ ] Paste TypeScript code → auto-detected and highlighted
- [ ] Paste Python code → auto-detected and highlighted
- [ ] Paste YAML code → auto-detected and highlighted
- [ ] Paste PowerShell code → auto-detected and highlighted
- [ ] Language badge displays correct name
- [ ] Click badge → dropdown opens
- [ ] Select language from dropdown → highlighting updates
- [ ] Copy button → code copied to clipboard
- [ ] Wrap button → line wrapping toggles
- [ ] Theme toggle → code blocks update theme
- [ ] No console errors
- [ ] No performance issues

## Success Criteria

✅ All 48+ languages supported  
✅ Auto-detection works for common languages  
✅ VS Code-quality highlighting  
✅ UI controls functional  
✅ Theme switching works  
✅ Performance is fast (<1ms cached)  
✅ No console errors  
✅ Tests pass (21/21)  

## Next Steps

If all tests pass:
1. ✅ Shiki integration complete
2. ✅ Ready for production use
3. ✅ Can remove Prism.js completely

If issues found:
1. Check SHIKI_INTEGRATION.md troubleshooting section
2. Review browser console errors
3. Verify Shiki version compatibility
4. Check React version compatibility
