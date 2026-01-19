/**
 * Advanced Code Detector - определение всех видов кода и конфигов
 * Двухуровневая система: эвристики + fallback
 */

export interface DetectionResult {
  lang: LanguageId;
  confidence: number;
  reasons: string[];
}

// Canonical language IDs
export type LanguageId = 
  // Web / Frontend
  | 'html' | 'xml' | 'svg' | 'css' | 'scss' | 'less'
  | 'javascript' | 'typescript' | 'jsx' | 'tsx'
  | 'json' | 'jsonc' | 'markdown' | 'mdx'
  // Backend / Programming
  | 'python' | 'go' | 'php' | 'ruby' | 'java' | 'csharp' | 'cpp' | 'c' | 'rust'
  // DevOps / Config
  | 'yaml' | 'yml' | 'toml' | 'ini' | 'dotenv'
  | 'dockerfile' | 'docker-compose' | 'nginx' | 'apache' | 'caddyfile'
  | 'kubernetes' | 'terraform' | 'ansible'
  // Databases
  | 'sql' | 'postgresql' | 'mysql'
  // Shell / OS
  | 'bash' | 'sh' | 'powershell' | 'cmd' | 'bat'
  // Logs / Data
  | 'log' | 'nginx-access-log' | 'nginx-error-log' | 'jsonl' | 'csv'
  // Fallback
  | 'plain-text';

interface LanguagePattern {
  id: LanguageId;
  aliases: string[];
  patterns: RegExp[];
  keywords?: string[];
  structure?: RegExp[];
  priority?: number; // Для разрешения конфликтов
}

// Определения языков с паттернами
const LANGUAGE_DEFINITIONS: LanguagePattern[] = [
  // DevOps / Config (высокий приоритет - специфичные форматы)
  {
    id: 'dockerfile',
    aliases: ['Dockerfile'],
    priority: 100,
    patterns: [
      /^FROM\s+[\w:.-]+/im,
      /^RUN\s+/im,
      /^CMD\s+/im,
      /^ENTRYPOINT\s+/im,
      /^COPY\s+/im,
      /^ADD\s+/im,
      /^WORKDIR\s+/im,
      /^ENV\s+/im,
      /^EXPOSE\s+\d+/im,
      /^LABEL\s+/im
    ]
  },
  {
    id: 'docker-compose',
    aliases: ['docker-compose.yml', 'docker-compose.yaml'],
    priority: 100,
    patterns: [
      /^version:\s*['"]?\d/im,
      /^services:/im,
      /^\s+image:/im,
      /^\s+build:/im,
      /^\s+volumes:/im,
      /^\s+ports:/im,
      /^\s+environment:/im,
      /^\s+depends_on:/im
    ]
  },
  {
    id: 'kubernetes',
    aliases: ['k8s', 'kubectl'],
    priority: 100,
    patterns: [
      /^apiVersion:\s*[\w./]+/im,
      /^kind:\s*(Deployment|Service|Pod|ConfigMap|Secret|Ingress|StatefulSet)/im,
      /^metadata:/im,
      /^\s+namespace:/im,
      /^\s+labels:/im,
      /^spec:/im,
      /^\s+replicas:/im,
      /^\s+selector:/im
    ]
  },
  {
    id: 'nginx',
    aliases: ['nginx.conf'],
    priority: 95,
    patterns: [
      /server\s*\{/,
      /location\s+[~/^].+\{/,
      /proxy_pass\s+http/,
      /upstream\s+\w+\s*\{/,
      /listen\s+\d+/,
      /server_name\s+[\w.-]+/,
      /root\s+\/[\w/]+/,
      /include\s+[\w/.]+\.conf/
    ]
  },
  {
    id: 'apache',
    aliases: ['httpd.conf', 'apache2.conf'],
    priority: 95,
    patterns: [
      /<VirtualHost\s+/i,
      /<Directory\s+/i,
      /ServerName\s+/i,
      /DocumentRoot\s+/i,
      /AllowOverride\s+/i,
      /RewriteEngine\s+On/i,
      /LoadModule\s+/i
    ]
  },
  {
    id: 'caddyfile',
    aliases: ['Caddyfile'],
    priority: 95,
    patterns: [
      /^[\w.-]+\s*\{/m,
      /reverse_proxy\s+/,
      /file_server\s*/,
      /encode\s+gzip/,
      /tls\s+[\w@.-]+/,
      /root\s+\*/,
      /respond\s+/
    ]
  },
  {
    id: 'terraform',
    aliases: ['hcl', 'tf'],
    priority: 90,
    patterns: [
      /^resource\s+"[\w_]+"\s+"[\w_]+"\s*\{/m,
      /^provider\s+"[\w_]+"\s*\{/m,
      /^variable\s+"[\w_]+"\s*\{/m,
      /^output\s+"[\w_]+"\s*\{/m,
      /^module\s+"[\w_]+"\s*\{/m,
      /^data\s+"[\w_]+"/m
    ]
  },
  {
    id: 'ansible',
    aliases: ['ansible-playbook'],
    priority: 90,
    patterns: [
      /^---\s*$/m,
      /^-\s+name:/m,
      /^\s+hosts:/m,
      /^\s+tasks:/m,
      /^\s+become:/m,
      /^\s+vars:/m,
      /^\s+ansible\./m
    ]
  },
  
  // Shell / OS
  {
    id: 'bash',
    aliases: ['sh', 'shell'],
    priority: 85,
    patterns: [
      /^#!\/bin\/(ba)?sh/,
      /^set -[euxo]/m,
      /\bexport\s+\w+=/,
      /\bsudo\s+/,
      /&&|\|\|/,
      /\$\{[\w_]+\}/,
      /\[\[\s+.+\s+\]\]/,
      /\bif\s+\[/,
      /\bfor\s+\w+\s+in\b/
    ]
  },
  {
    id: 'powershell',
    aliases: ['ps1', 'pwsh'],
    priority: 85,
    patterns: [
      /^param\s*\(/im,
      /\$\w+/,
      /\[string\]|\[int\]|\[switch\]|\[bool\]/i,
      /Get-|Set-|New-|Write-|Add-|Remove-/,
      /-\w+\s+/,
      /\$_|\$PSItem/,
      /\|\s*Where-Object|\|\s*ForEach-Object/
    ]
  },
  {
    id: 'cmd',
    aliases: ['bat', 'batch'],
    priority: 80,
    patterns: [
      /@echo\s+(off|on)/i,
      /^REM\s+/im,
      /^set\s+\w+=/im,
      /^if\s+exist/im,
      /^goto\s+:\w+/im,
      /%\w+%/,
      /^call\s+/im
    ]
  },
  
  // Config formats
  {
    id: 'yaml',
    aliases: ['yml'],
    priority: 70,
    patterns: [
      /^[\w_-]+:\s*.+$/m,
      /^\s+-\s+\w+/m,
      /^---\s*$/m,
      /^\s+[\w_-]+:\s*$/m
    ],
    structure: [
      /:\s*$/m,
      /^\s+-\s+/m
    ]
  },
  {
    id: 'toml',
    aliases: [],
    priority: 75,
    patterns: [
      /^\[[\w.-]+\]/m,
      /^[\w_-]+\s*=\s*.+$/m,
      /^\[\[[\w.-]+\]\]/m
    ]
  },
  {
    id: 'ini',
    aliases: ['conf'],
    priority: 65,
    patterns: [
      /^\[[\w\s.-]+\]/m,
      /^[\w_-]+\s*=\s*.+$/m,
      /^;\s*.+$/m
    ]
  },
  {
    id: 'dotenv',
    aliases: ['.env'],
    priority: 75,
    patterns: [
      /^[A-Z_][A-Z0-9_]*=/m,
      /^export\s+[A-Z_]/m,
      /^#\s*\.env/im
    ]
  },
  
  // Programming languages
  {
    id: 'python',
    aliases: ['py'],
    priority: 80,
    patterns: [
      /^def\s+\w+\s*\(/m,
      /^class\s+\w+/m,
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /:\s*$/m,
      /__init__|__name__|__main__/,
      /\bself\./,
      /\bprint\s*\(/
    ]
  },
  {
    id: 'javascript',
    aliases: ['js'],
    priority: 75,
    patterns: [
      /\b(function|const|let|var)\s+\w+/,
      /=>/,
      /console\.(log|error|warn)/,
      /\bimport\s+.+\bfrom\b/,
      /\bexport\s+(default|const|function)/,
      /\basync\s+function/,
      /\.then\(|\.catch\(/
    ]
  },
  {
    id: 'typescript',
    aliases: ['ts'],
    priority: 78,
    patterns: [
      /:\s*(string|number|boolean|any|void|never|unknown)\b/,
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /\benum\s+\w+/,
      /<[\w,\s<>]+>/,
      /\bas\s+\w+/
    ]
  },
  {
    id: 'jsx',
    aliases: [],
    priority: 76,
    patterns: [
      /<\w+[^>]*>/,
      /\breturn\s*\(/,
      /className=/,
      /\bReact\./,
      /\buseState\(|\buseEffect\(/
    ]
  },
  {
    id: 'tsx',
    aliases: [],
    priority: 79,
    patterns: [
      /:\s*(string|number|boolean)\b/,
      /<\w+[^>]*>/,
      /\binterface\s+\w+Props/,
      /React\.FC</
    ]
  },
  {
    id: 'go',
    aliases: ['golang'],
    priority: 80,
    patterns: [
      /^package\s+\w+/m,
      /^import\s+\(/m,
      /^func\s+\w+/m,
      /^type\s+\w+\s+struct/m,
      /:=/,
      /\bfmt\./,
      /\bgo\s+func/
    ]
  },
  {
    id: 'rust',
    aliases: ['rs'],
    priority: 80,
    patterns: [
      /^fn\s+\w+/m,
      /^pub\s+fn/m,
      /^struct\s+\w+/m,
      /^impl\s+\w+/m,
      /let\s+mut\s+/,
      /::\w+/,
      /\bSome\(|\bNone\b/
    ]
  },
  {
    id: 'java',
    aliases: [],
    priority: 80,
    patterns: [
      /\b(public|private|protected)\s+class\s+\w+/,
      /\bpublic\s+static\s+void\s+main/,
      /\bSystem\.(out|err)\.print/,
      /@Override|@Deprecated/,
      /\bimport\s+java\./
    ]
  },
  {
    id: 'csharp',
    aliases: ['cs', 'c#'],
    priority: 80,
    patterns: [
      /\bnamespace\s+\w+/,
      /\busing\s+System/,
      /\bpublic\s+class\s+\w+/,
      /\bConsole\.Write/,
      /\bvar\s+\w+\s*=/,
      /\basync\s+Task/
    ]
  },
  {
    id: 'cpp',
    aliases: ['c++', 'cc'],
    priority: 80,
    patterns: [
      /#include\s*<[\w.]+>/,
      /\bstd::/,
      /\bnamespace\s+\w+/,
      /\bclass\s+\w+/,
      /\btemplate\s*</,
      /cout\s*<<|cin\s*>>/
    ]
  },
  {
    id: 'c',
    aliases: [],
    priority: 75,
    patterns: [
      /#include\s*<[\w.]+>/,
      /\bint\s+main\s*\(/,
      /\bprintf\s*\(/,
      /\bscanf\s*\(/,
      /\bmalloc\s*\(/
    ]
  },
  {
    id: 'php',
    aliases: [],
    priority: 85,
    patterns: [
      /<\?php/,
      /\$\w+/,
      /\bfunction\s+\w+\s*\(/,
      /\bclass\s+\w+/,
      /->/,
      /\becho\s+/,
      /\bnamespace\s+/
    ]
  },
  {
    id: 'ruby',
    aliases: ['rb'],
    priority: 80,
    patterns: [
      /^def\s+\w+/m,
      /^class\s+\w+/m,
      /^module\s+\w+/m,
      /\bend\s*$/m,
      /\bputs\s+/,
      /@\w+/,
      /:\w+\s*=>/
    ]
  },
  
  // Databases
  {
    id: 'sql',
    aliases: [],
    priority: 85,
    patterns: [
      /\b(SELECT|INSERT|UPDATE|DELETE)\b.+\bFROM\b/i,
      /\bCREATE\s+(TABLE|DATABASE|INDEX)\b/i,
      /\bJOIN\b.+\bON\b/i,
      /\bWHERE\b.+=/i,
      /\bGROUP\s+BY\b/i,
      /\bORDER\s+BY\b/i
    ]
  },
  {
    id: 'postgresql',
    aliases: ['postgres', 'psql'],
    priority: 87,
    patterns: [
      /\bSERIAL\b|\bBIGSERIAL\b/i,
      /\bGENERATED\s+ALWAYS\s+AS\s+IDENTITY/i,
      /\bON\s+CONFLICT\b/i,
      /\bRETURNING\b/i,
      /::/
    ]
  },
  {
    id: 'mysql',
    aliases: [],
    priority: 87,
    patterns: [
      /\bAUTO_INCREMENT\b/i,
      /\bENGINE\s*=\s*InnoDB/i,
      /\bCHARSET\s*=\s*utf8/i,
      /SHOW\s+(TABLES|DATABASES)/i
    ]
  },
  
  // Markup / Data
  {
    id: 'html',
    aliases: ['htm'],
    priority: 80,
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /<html[\s>]/i,
      /<(div|span|p|a|img|table|form|input|button|header|footer|nav|section)/i,
      /<\/\w+>/
    ]
  },
  {
    id: 'xml',
    aliases: [],
    priority: 75,
    patterns: [
      /<\?xml\s+version/i,
      /<[\w:]+[^>]*xmlns/i,
      /<\/[\w:]+>/
    ]
  },
  {
    id: 'svg',
    aliases: [],
    priority: 85,
    patterns: [
      /<svg[\s>]/i,
      /<path\s+d=/i,
      /<circle\s+cx=/i,
      /<rect\s+/i,
      /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/
    ]
  },
  {
    id: 'json',
    aliases: [],
    priority: 70,
    patterns: [
      /^\s*\{[\s\S]*\}\s*$/,
      /^\s*\[[\s\S]*\]\s*$/,
      /"[\w-]+":\s*["{[\d\-]/
    ]
  },
  {
    id: 'jsonc',
    aliases: ['json-with-comments'],
    priority: 72,
    patterns: [
      /"[\w-]+":\s*["{[\d]/,
      /\/\/.+$/m,
      /\/\*[\s\S]*?\*\//
    ]
  },
  {
    id: 'jsonl',
    aliases: ['ndjson'],
    priority: 75,
    patterns: [
      /^\{.+\}\s*$/m,
      /^\{.+\}\n\{.+\}/m
    ]
  },
  {
    id: 'csv',
    aliases: [],
    priority: 70,
    patterns: [
      /^[\w\s]+,[\w\s]+,/m,
      /^"[^"]+","[^"]+"/m,
      /^\w+,\w+,\w+/m
    ]
  },
  {
    id: 'markdown',
    aliases: ['md'],
    priority: 75,
    patterns: [
      /^#{1,6}\s+.+$/m,
      /^\*\*[^*]+\*\*$/m,
      /^\*[^*]+\*$/m,
      /^\-\s+.+$/m,
      /^\d+\.\s+.+$/m,
      /\[.+\]\(.+\)/,
      /^```[\w]*$/m
    ]
  },
  {
    id: 'mdx',
    aliases: [],
    priority: 77,
    patterns: [
      /^import\s+.+\bfrom\b/m,
      /^export\s+/m,
      /<\w+[^>]*>/,
      /^#{1,6}\s+/m
    ]
  },
  {
    id: 'css',
    aliases: [],
    priority: 75,
    patterns: [
      /[\w-]+\s*\{[^}]*:[^}]*\}/,
      /\.([\w-]+)\s*\{/,
      /#[\w-]+\s*\{/,
      /@media|@keyframes|@import/,
      /[\w-]+:\s*[^;]+;/
    ]
  },
  {
    id: 'scss',
    aliases: ['sass'],
    priority: 77,
    patterns: [
      /\$[\w-]+:\s*.+;/,
      /@mixin\s+\w+/,
      /@include\s+\w+/,
      /&:[\w-]+/,
      /@extend\s+/
    ]
  },
  {
    id: 'less',
    aliases: [],
    priority: 77,
    patterns: [
      /@[\w-]+:\s*.+;/,
      /\.[\w-]+\s*\(/,
      /&:[\w-]+/
    ]
  },
  
  // Logs
  {
    id: 'log',
    aliases: [],
    priority: 60,
    patterns: [
      /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/,
      /\b(INFO|WARN|ERROR|DEBUG|TRACE|FATAL)\b/,
      /\[\d{4}-\d{2}-\d{2}/,
      /^\[.+\]\s+/m
    ]
  },
  {
    id: 'nginx-access-log',
    aliases: [],
    priority: 85,
    patterns: [
      /^\d+\.\d+\.\d+\.\d+\s+-\s+-\s+\[/m,
      /"(GET|POST|PUT|DELETE|HEAD|OPTIONS)\s+\/[\w/.-]*\s+HTTP\/\d\.\d"/,
      /\s+\d{3}\s+\d+\s+"/
    ]
  },
  {
    id: 'nginx-error-log',
    aliases: [],
    priority: 85,
    patterns: [
      /\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s+\[(error|warn|crit|alert|emerg)\]/i,
      /client:\s+\d+\.\d+\.\d+\.\d+/,
      /server:\s+[\w.-]+/
    ]
  }
];

/**
 * Основная функция определения языка
 */
export function detectLanguage(text: string): DetectionResult {
  if (!text || text.trim().length === 0) {
    return { lang: 'plain-text', confidence: 1, reasons: ['Empty text'] };
  }

  const results: Array<{ lang: LanguageId; score: number; reasons: string[] }> = [];

  // Проверяем каждый язык
  for (const langDef of LANGUAGE_DEFINITIONS) {
    let score = 0;
    const reasons: string[] = [];

    // Проверяем паттерны
    for (const pattern of langDef.patterns) {
      if (pattern.test(text)) {
        score++;
        reasons.push(`Pattern matched: ${pattern.source.substring(0, 50)}`);
      }
    }

    // Проверяем структуру (если есть)
    if (langDef.structure) {
      for (const structPattern of langDef.structure) {
        if (structPattern.test(text)) {
          score += 0.5;
          reasons.push(`Structure matched: ${structPattern.source.substring(0, 50)}`);
        }
      }
    }

    if (score > 0) {
      // Применяем приоритет
      const finalScore = score * (langDef.priority || 50) / 100;
      results.push({ lang: langDef.id, score: finalScore, reasons });
    }
  }

  // Сортируем по score
  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return { lang: 'plain-text', confidence: 1, reasons: ['No patterns matched'] };
  }

  const best = results[0];
  const maxPossibleScore = LANGUAGE_DEFINITIONS.find(d => d.id === best.lang)?.patterns.length || 1;
  const confidence = Math.min(best.score / maxPossibleScore, 1);

  return {
    lang: best.lang,
    confidence,
    reasons: best.reasons.slice(0, 5) // Топ 5 причин
  };
}

/**
 * Быстрая проверка - является ли текст кодом
 */
export function isCode(text: string): boolean {
  if (!text || text.length < 10) return false;

  const result = detectLanguage(text);
  return result.lang !== 'plain-text' && result.confidence > 0.2;
}

/**
 * Получить список всех поддерживаемых языков
 */
export function getSupportedLanguages(): LanguageId[] {
  return LANGUAGE_DEFINITIONS.map(d => d.id);
}

/**
 * Получить алиасы для языка
 */
export function getLanguageAliases(lang: LanguageId): string[] {
  const def = LANGUAGE_DEFINITIONS.find(d => d.id === lang);
  return def?.aliases || [];
}

/**
 * Нормализовать название языка (алиас -> canonical)
 */
export function normalizeLanguage(input: string): LanguageId {
  const lower = input.toLowerCase();
  
  for (const def of LANGUAGE_DEFINITIONS) {
    if (def.id === lower) return def.id;
    if (def.aliases.some(a => a.toLowerCase() === lower)) return def.id;
  }
  
  return 'plain-text';
}

/**
 * Получить человекочитаемое название языка
 */
export function getLanguageDisplayName(lang: LanguageId): string {
  const names: Record<LanguageId, string> = {
    'html': 'HTML',
    'xml': 'XML',
    'svg': 'SVG',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'jsx': 'JSX',
    'tsx': 'TSX',
    'json': 'JSON',
    'jsonc': 'JSON with Comments',
    'markdown': 'Markdown',
    'mdx': 'MDX',
    'python': 'Python',
    'go': 'Go',
    'php': 'PHP',
    'ruby': 'Ruby',
    'java': 'Java',
    'csharp': 'C#',
    'cpp': 'C++',
    'c': 'C',
    'rust': 'Rust',
    'yaml': 'YAML',
    'yml': 'YAML',
    'toml': 'TOML',
    'ini': 'INI',
    'dotenv': '.env',
    'dockerfile': 'Dockerfile',
    'docker-compose': 'Docker Compose',
    'nginx': 'Nginx',
    'apache': 'Apache',
    'caddyfile': 'Caddyfile',
    'kubernetes': 'Kubernetes',
    'terraform': 'Terraform',
    'ansible': 'Ansible',
    'sql': 'SQL',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'bash': 'Bash',
    'sh': 'Shell',
    'powershell': 'PowerShell',
    'cmd': 'CMD',
    'bat': 'Batch',
    'log': 'Log',
    'nginx-access-log': 'Nginx Access Log',
    'nginx-error-log': 'Nginx Error Log',
    'jsonl': 'JSON Lines',
    'csv': 'CSV',
    'plain-text': 'Plain Text'
  };
  
  return names[lang] || lang.toUpperCase();
}
