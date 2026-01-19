// detectLanguage.ts
import { DETECT_TABLE, type DetectResult, type DetectHit } from "./codeDetectorRules";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function detectLanguage(textRaw: string): DetectResult {
  const text = (textRaw ?? "").trim();
  if (!text) return { lang: "plain-text", confidence: 0, reasons: ["empty"], score: 0 };

  // ограничиваем длину для скорости на вставке
  const sample = text.length > 20000 ? text.slice(0, 20000) : text;

  const results = DETECT_TABLE.map((set) => {
    let score = 0;
    const hits: DetectHit[] = [];

    for (const rule of set.rules) {
      // Подсчёт совпадений (ограниченный maxHits)
      let count = 0;
      sample.replace(rule.re, (m) => {
        count++;
        return m;
      });

      if (count > 0) {
        const capped = rule.maxHits ? Math.min(count, rule.maxHits) : count;
        const add = capped * rule.add;
        score += add;
        hits.push({ ruleId: rule.id, add });
      }
    }

    return {
      lang: set.lang,
      priority: set.priority,
      minScore: set.minScore,
      score,
      reasons: hits
        .sort((a, b) => b.add - a.add)
        .slice(0, 8)
        .map((h) => `${h.ruleId} (+${h.add})`),
    };
  });

  // выбираем победителя
  results.sort((a, b) => (b.score - a.score) || (b.priority - a.priority));
  const best = results[0];

  // если ниже порога — plain-text
  if (!best || best.score < best.minScore) {
    return { 
      lang: "plain-text", 
      confidence: 0.2, 
      reasons: ["below-threshold"], 
      score: best?.score ?? 0 
    };
  }

  // confidence: простая нормализация
  const confidence = clamp01(best.score / (best.minScore * 2.2));

  return {
    lang: best.lang,
    confidence,
    reasons: best.reasons,
    score: best.score,
  };
}

// Вспомогательные функции для совместимости с существующим API
export function isCode(text: string): boolean {
  const result = detectLanguage(text);
  return result.lang !== 'plain-text' && result.confidence > 0.2;
}

export function getLanguageDisplayName(lang: string): string {
  const names: Record<string, string> = {
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
