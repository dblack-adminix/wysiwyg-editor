/**
 * codeHighlight.ts - Shiki integration with caching and theme support
 */

import { 
  createHighlighter, 
  type Highlighter, 
  type BundledLanguage,
  type BundledTheme 
} from 'shiki';

// Singleton highlighter instance
let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

// Cache for highlighted code: key = `${lang}:${theme}:${hash(code)}`
const highlightCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

// Themes
const THEMES: Record<'light' | 'dark', BundledTheme> = {
  light: 'github-light',
  dark: 'github-dark'
};

// Language aliases mapping to Shiki language IDs
const LANG_ALIASES: Record<string, BundledLanguage> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'yml': 'yaml',
  'dockerfile': 'docker',
  'docker-compose': 'yaml',
  'kubernetes': 'yaml',
  'k8s': 'yaml',
  'caddyfile': 'nginx', // Fallback to nginx for Caddyfile
  'nginx': 'nginx',
  'apache': 'apache',
  'terraform': 'hcl',
  'hcl': 'hcl',
  'ansible': 'yaml',
  'dotenv': 'dotenv',
  'env': 'dotenv',
  'ini': 'ini',
  'toml': 'toml',
  'json': 'json',
  'jsonc': 'jsonc',
  'jsonl': 'json',
  'html': 'html',
  'xml': 'xml',
  'svg': 'xml',
  'css': 'css',
  'scss': 'scss',
  'less': 'less',
  'markdown': 'markdown',
  'md': 'markdown',
  'mdx': 'mdx',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'go': 'go',
  'php': 'php',
  'ruby': 'ruby',
  'rb': 'ruby',
  'java': 'java',
  'csharp': 'csharp',
  'cs': 'csharp',
  'cpp': 'cpp',
  'c++': 'cpp',
  'c': 'c',
  'rust': 'rust',
  'rs': 'rust',
  'sql': 'sql',
  'postgresql': 'sql',
  'postgres': 'sql',
  'mysql': 'sql',
  'bash': 'bash',
  'powershell': 'powershell',
  'ps1': 'powershell',
  'cmd': 'bat',
  'bat': 'bat',
  'log': 'log',
  'nginx-access-log': 'log',
  'nginx-error-log': 'log',
  'csv': 'csv',
  'plain-text': 'plaintext' as BundledLanguage
};

/**
 * Get or create singleton highlighter instance
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (highlighterPromise) {
    return highlighterPromise;
  }

  highlighterPromise = createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [] // Start with no languages, load on demand
  }).then(h => {
    highlighterInstance = h;
    return h;
  }).catch(err => {
    console.error('[Shiki] Failed to initialize highlighter:', err);
    highlighterPromise = null;
    throw err;
  });

  return highlighterPromise;
}

/**
 * Load language dynamically if not already loaded
 */
async function ensureLanguageLoaded(highlighter: Highlighter, lang: BundledLanguage): Promise<void> {
  const loadedLangs = highlighter.getLoadedLanguages();
  if (!loadedLangs.includes(lang)) {
    await highlighter.loadLanguage(lang);
  }
}

/**
 * Normalize language alias to Shiki language ID
 */
export function normalizeLang(lang: string): BundledLanguage {
  const normalized = lang.toLowerCase().trim();
  return (LANG_ALIASES[normalized] as BundledLanguage) || (normalized as BundledLanguage);
}

/**
 * Check if language is supported by Shiki
 */
export function isSupportedLang(lang: string): boolean {
  const normalized = normalizeLang(lang);
  
  // List of commonly used languages that we'll load dynamically
  const supported = [
    'javascript', 'typescript', 'jsx', 'tsx',
    'python', 'go', 'php', 'ruby', 'java', 'csharp', 'cpp', 'c', 'rust',
    'bash', 'powershell', 'bat',
    'yaml', 'toml', 'ini', 'dotenv', 'json', 'jsonc',
    'html', 'xml', 'css', 'scss', 'less',
    'markdown', 'mdx', 'sql',
    'docker', 'nginx', 'apache', 'hcl',
    'log', 'csv', 'plaintext'
  ];
  
  return supported.includes(normalized);
}

/**
 * Simple hash function for cache keys
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Highlight code to HTML with caching
 */
export async function highlightToHtml(
  code: string,
  lang: string,
  theme: 'light' | 'dark' = 'dark'
): Promise<string> {
  const normalizedLang = normalizeLang(lang);
  const cacheKey = `${normalizedLang}:${theme}:${hashCode(code)}`;
  
  // Check cache
  if (highlightCache.has(cacheKey)) {
    return highlightCache.get(cacheKey)!;
  }
  
  try {
    const highlighter = await getHighlighter();
    
    // Fallback to plaintext if language not supported
    const langToUse = isSupportedLang(lang) ? normalizedLang : 'plaintext';
    
    // Load language dynamically
    await ensureLanguageLoaded(highlighter, langToUse as BundledLanguage);
    
    const html = highlighter.codeToHtml(code, {
      lang: langToUse,
      theme: THEMES[theme]
    });
    
    // Cache result
    if (highlightCache.size >= MAX_CACHE_SIZE) {
      // Simple LRU: remove first entry
      const firstKey = highlightCache.keys().next().value;
      if (firstKey) {
        highlightCache.delete(firstKey);
      }
    }
    highlightCache.set(cacheKey, html);
    
    return html;
  } catch (error) {
    console.error('[Shiki] Highlighting error:', error);
    // Fallback to plain pre/code
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

/**
 * Clear highlight cache (useful when switching themes)
 */
export function clearHighlightCache(): void {
  highlightCache.clear();
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get all supported language IDs
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(LANG_ALIASES).sort();
}
