/**
 * Автоматическое определение программного кода
 */

export interface CodeBlock {
  language: string;
  code: string;
}

// Паттерны для определения языков программирования
const patterns = {
  powershell: [
    /\bparam\s*\(/i,
    /\$\w+/,
    /\b(function|param|switch|if|else|foreach|while|return)\b/i,
    /-\w+/,
    /\[string\]|\[int\]|\[switch\]/i,
    /Get-|Set-|New-|Write-|Add-/,
    /\$_|\$PSItem/
  ],
  javascript: [
    /\b(function|const|let|var|class|import|export|async|await|return)\b/,
    /=>/,
    /console\.(log|error|warn)/,
    /\$\{.*\}/,
    /\.then\(|\.catch\(/
  ],
  typescript: [
    /:\s*(string|number|boolean|any|void|never|unknown)\b/,
    /interface\s+\w+/,
    /type\s+\w+\s*=/,
    /<.*>/
  ],
  python: [
    /\b(def|class|import|from|if|elif|else|for|while|return|print)\b/,
    /:\s*$/m,
    /__init__|__name__|__main__/,
    /\bself\./
  ],
  java: [
    /\b(public|private|protected|static|void|class|interface)\b/,
    /System\.(out|err)\.print/,
    /@Override|@Deprecated/
  ],
  csharp: [
    /\b(public|private|protected|static|void|class|interface|namespace|using)\b/,
    /Console\.Write/,
    /\[.*\]/
  ],
  php: [
    /<\?php/,
    /\$\w+/,
    /\b(function|class|public|private|protected|static|echo|print)\b/,
    /->/
  ],
  html: [
    /<\/?[a-z][\s\S]*>/i,
    /<!DOCTYPE/i,
    /<(div|span|p|a|img|table|form|input|button)/i
  ],
  css: [
    /\{[^}]*:[^}]*\}/,
    /\.([\w-]+)\s*\{/,
    /#[\w-]+\s*\{/,
    /@media|@keyframes/
  ],
  sql: [
    /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|CREATE|TABLE|DATABASE)\b/i,
    /\bGROUP BY|ORDER BY|HAVING\b/i
  ],
  json: [
    /^\s*\{[\s\S]*\}\s*$/,
    /^\s*\[[\s\S]*\]\s*$/,
    /"[\w-]+":\s*["{[\d]/
  ]
};

/**
 * Определяет, является ли текст программным кодом
 */
export function isCode(text: string): boolean {
  if (!text || text.length < 10) return false;
  
  // Проверка на наличие характерных символов кода
  const codeIndicators = [
    /[{}\[\]();]/g,
    /\b(function|const|let|var|class|def|public|private|param)\b/i,
    /[=<>!]+/,
    /\/\/|\/\*|\*\/|#/,
    /\$\w+/,  // Переменные в PowerShell, PHP, Bash
    /-\w+/    // Параметры в PowerShell, CLI
  ];
  
  let score = 0;
  for (const pattern of codeIndicators) {
    if (pattern.test(text)) score++;
  }
  
  return score >= 2;
}

/**
 * Определяет язык программирования
 */
export function detectLanguage(code: string): string {
  let maxScore = 0;
  let detectedLang = 'javascript';
  
  // PowerShell имеет приоритет если есть param() или cmdlets
  if (/\bparam\s*\(/i.test(code) || /Get-|Set-|New-|Write-|Add-/.test(code)) {
    return 'powershell';
  }
  
  for (const [lang, langPatterns] of Object.entries(patterns)) {
    let score = 0;
    for (const pattern of langPatterns) {
      if (pattern.test(code)) score++;
    }
    
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }
  
  return maxScore > 0 ? detectedLang : 'javascript';
}

/**
 * Оборачивает код в блок с подсветкой
 */
export function wrapCodeBlock(code: string, language?: string): string {
  const lang = language || detectLanguage(code);
  
  return `<pre class="code-block" data-language="${lang}"><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
}

/**
 * Экранирует HTML
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Автоматически оборачивает код при вставке
 */
export function autoWrapCode(text: string): string {
  if (isCode(text)) {
    return wrapCodeBlock(text);
  }
  return text;
}
