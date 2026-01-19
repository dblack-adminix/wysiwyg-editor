/**
 * Tests for codeHighlight.ts
 */

import { describe, it, expect } from 'vitest';
import { 
  normalizeLang, 
  isSupportedLang, 
  getSupportedLanguages,
  highlightToHtml 
} from '../codeHighlight';

describe('codeHighlight', () => {
  describe('normalizeLang', () => {
    it('should normalize common aliases', () => {
      expect(normalizeLang('js')).toBe('javascript');
      expect(normalizeLang('ts')).toBe('typescript');
      expect(normalizeLang('py')).toBe('python');
      expect(normalizeLang('sh')).toBe('bash');
      expect(normalizeLang('yml')).toBe('yaml');
    });

    it('should handle uppercase input', () => {
      expect(normalizeLang('JS')).toBe('javascript');
      expect(normalizeLang('PYTHON')).toBe('python');
    });

    it('should handle whitespace', () => {
      expect(normalizeLang('  javascript  ')).toBe('javascript');
    });

    it('should map docker-compose to yaml', () => {
      expect(normalizeLang('docker-compose')).toBe('yaml');
      expect(normalizeLang('kubernetes')).toBe('yaml');
    });

    it('should map terraform to hcl', () => {
      expect(normalizeLang('terraform')).toBe('hcl');
    });

    it('should return input if no alias found', () => {
      expect(normalizeLang('unknown-lang')).toBe('unknown-lang');
    });
  });

  describe('isSupportedLang', () => {
    it('should return true for supported languages', () => {
      expect(isSupportedLang('javascript')).toBe(true);
      expect(isSupportedLang('typescript')).toBe(true);
      expect(isSupportedLang('python')).toBe(true);
      expect(isSupportedLang('yaml')).toBe(true);
      expect(isSupportedLang('nginx')).toBe(true);
      expect(isSupportedLang('powershell')).toBe(true);
    });

    it('should return true for aliases', () => {
      expect(isSupportedLang('js')).toBe(true);
      expect(isSupportedLang('ts')).toBe(true);
      expect(isSupportedLang('py')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(isSupportedLang('unknown')).toBe(false);
      expect(isSupportedLang('fake-lang')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(isSupportedLang('JAVASCRIPT')).toBe(true);
      expect(isSupportedLang('Python')).toBe(true);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return array of language aliases', () => {
      const langs = getSupportedLanguages();
      expect(Array.isArray(langs)).toBe(true);
      expect(langs.length).toBeGreaterThan(0);
    });

    it('should include common languages', () => {
      const langs = getSupportedLanguages();
      expect(langs).toContain('js'); // alias for javascript
      expect(langs).toContain('py'); // alias for python
      expect(langs).toContain('yml'); // alias for yaml
      expect(langs).toContain('nginx');
      expect(langs).toContain('powershell');
    });

    it('should be sorted', () => {
      const langs = getSupportedLanguages();
      const sorted = [...langs].sort();
      expect(langs).toEqual(sorted);
    });
  });

  describe('highlightToHtml', () => {
    it('should highlight JavaScript code', async () => {
      const code = 'const x = 42;';
      const html = await highlightToHtml(code, 'javascript', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('const');
      expect(html.length).toBeGreaterThan(code.length);
    });

    it('should highlight TypeScript code', async () => {
      const code = 'interface User { name: string; }';
      const html = await highlightToHtml(code, 'typescript', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('interface');
    });

    it('should highlight YAML code', async () => {
      const code = 'name: test\nversion: 1.0';
      const html = await highlightToHtml(code, 'yaml', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('name');
    });

    it('should highlight Nginx config', async () => {
      const code = 'server {\n  listen 80;\n}';
      const html = await highlightToHtml(code, 'nginx', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('server');
    });

    it('should highlight PowerShell code', async () => {
      const code = '$var = "test"\nWrite-Host $var';
      const html = await highlightToHtml(code, 'powershell', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('$var');
    });

    it('should work with light theme', async () => {
      const code = 'const x = 42;';
      const html = await highlightToHtml(code, 'javascript', 'light');
      
      expect(html).toContain('<pre');
      expect(html).toContain('const');
    });

    it('should fallback to plaintext for unsupported language', async () => {
      const code = 'some text';
      const html = await highlightToHtml(code, 'unknown-lang', 'dark');
      
      expect(html).toContain('<pre');
      expect(html).toContain('some text');
    });

    it('should cache results', async () => {
      const code = 'const cached = true;';
      
      // First call - should compute
      const html1 = await highlightToHtml(code, 'javascript', 'dark');
      
      // Second call - should return cached
      const html2 = await highlightToHtml(code, 'javascript', 'dark');
      
      // Results should be identical
      expect(html1).toBe(html2);
      expect(html1).toContain('const');
    });
  });
});
