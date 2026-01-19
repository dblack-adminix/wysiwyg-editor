// codeDetectorRules.ts
// ВНИМАНИЕ: Это эвристики. Они дают score, а не "истину".
// Побеждает максимальный score. При конфликте — решает priority.

export type DetectHit = { ruleId: string; add: number; match?: string };
export type DetectResult = { lang: LangId; confidence: number; reasons: string[]; score: number };

export type LangId =
  | "plain-text"
  // Web
  | "html" | "xml" | "svg"
  | "css" | "scss" | "less"
  | "javascript" | "typescript" | "jsx" | "tsx"
  | "json" | "jsonc"
  | "markdown" | "mdx"
  // Backend
  | "python" | "go" | "php" | "ruby" | "java" | "csharp" | "c" | "cpp" | "rust"
  // DevOps
  | "yaml" | "toml" | "ini" | "dotenv"
  | "dockerfile" | "docker-compose"
  | "nginx" | "apache" | "caddyfile"
  | "kubernetes" | "terraform" | "ansible"
  // DB
  | "sql" | "postgresql" | "mysql"
  // Shell
  | "bash" | "sh" | "powershell" | "cmd" | "bat"
  // Logs/Data
  | "log" | "nginx-access-log" | "nginx-error-log" | "jsonl" | "csv";

export type Rule = {
  id: string;
  re: RegExp;
  add: number;           // сколько очков даёт совпадение
  maxHits?: number;      // ограничить вклад, чтобы один паттерн не "забивал" всё
  note?: string;
};

export type LanguageRuleSet = {
  lang: LangId;
  aliases: string[];
  priority: number;      // выше = важнее при равных score
  minScore: number;      // минимальный score чтобы язык считался распознанным
  rules: Rule[];
};

const r = (id: string, re: RegExp, add: number, maxHits?: number, note?: string): Rule =>
  ({ id, re, add, maxHits, note });

/**
 * Reference table: как в Monaco/VS Code, только заточено под "вставку кода".
 * Сначала идут более "специфичные" языки (docker-compose/k8s/nginx), затем общие (yaml/json).
 */
export const DETECT_TABLE: LanguageRuleSet[] = [
  // ----------------------- Docker / K8s / Infra (high specificity) -----------------------
  {
    lang: "dockerfile",
    aliases: ["Dockerfile"],
    priority: 100,
    minScore: 20,
    rules: [
      r("df.from", /^\s*FROM\s+[\w./:-]+/gmi, 12, 3, "FROM image"),
      r("df.run", /^\s*RUN\s+/gmi, 6, 6),
      r("df.copy_add", /^\s*(COPY|ADD)\s+/gmi, 8, 4),
      r("df.cmd_entry", /^\s*(CMD|ENTRYPOINT)\s+/gmi, 10, 2),
      r("df.arg_env", /^\s*(ARG|ENV)\s+[A-Z0-9_]+/gmi, 6, 4),
      r("df.workdir", /^\s*WORKDIR\s+/gmi, 6, 2),
      r("df.expose", /^\s*EXPOSE\s+\d+/gmi, 5, 2),
    ],
  },
  {
    lang: "docker-compose",
    aliases: ["docker-compose", "compose", "compose.yml", "compose.yaml"],
    priority: 95,
    minScore: 22,
    rules: [
      r("dc.services", /^\s*services\s*:\s*$/gmi, 14, 1),
      r("dc.image", /^\s*image\s*:\s*["']?[\w./:-]+/gmi, 8, 5),
      r("dc.build", /^\s*build\s*:\s*/gmi, 6, 4),
      r("dc.ports", /^\s*ports\s*:\s*$/gmi, 5, 2),
      r("dc.volumes", /^\s*volumes\s*:\s*$/gmi, 6, 2),
      r("dc.networks", /^\s*networks\s*:\s*$/gmi, 6, 2),
      r("dc.depends_on", /^\s*depends_on\s*:\s*$/gmi, 6, 2),
      r("dc.environment", /^\s*environment\s*:\s*$/gmi, 4, 2),
      r("dc.version", /^\s*version\s*:\s*["']?\d+(\.\d+)?["']?\s*$/gmi, 2, 1),
    ],
  },
  {
    lang: "kubernetes",
    aliases: ["k8s", "kubernetes", "kube"],
    priority: 90,
    minScore: 20,
    rules: [
      r("k8s.apiVersion", /^\s*apiVersion\s*:\s*[\w./-]+\s*$/gmi, 12, 1),
      r("k8s.kind", /^\s*kind\s*:\s*\w+\s*$/gmi, 10, 1),
      r("k8s.metadata", /^\s*metadata\s*:\s*$/gmi, 6, 1),
      r("k8s.spec", /^\s*spec\s*:\s*$/gmi, 4, 2),
      r("k8s.containers", /^\s*containers\s*:\s*$/gmi, 6, 1),
      r("k8s.image", /^\s*image\s*:\s*["']?[\w./:-]+/gmi, 4, 6),
      r("k8s.selector", /^\s*selector\s*:\s*$/gmi, 4, 1),
    ],
  },
  {
    lang: "nginx",
    aliases: ["nginx", "nginx.conf"],
    priority: 88,
    minScore: 18,
    rules: [
      r("ngx.server_block", /^\s*server\s*\{/gmi, 10, 3),
      r("ngx.location", /^\s*location\s+[^ {]+\s*\{/gmi, 8, 5),
      r("ngx.proxy_pass", /^\s*proxy_pass\s+https?:\/\/|^\s*proxy_pass\s+unix:/gmi, 10, 5),
      r("ngx.upstream", /^\s*upstream\s+\w+\s*\{/gmi, 10, 2),
      r("ngx.listen", /^\s*listen\s+\d+/gmi, 5, 5),
      r("ngx.ssl", /^\s*ssl_(certificate|certificate_key)\s+/gmi, 6, 2),
      r("ngx.directive_semicolon", /;\s*$/gm, 2, 20, "nginx directives end with ';'"),
    ],
  },
  {
    lang: "caddyfile",
    aliases: ["caddy", "Caddyfile"],
    priority: 87,
    minScore: 16,
    rules: [
      r("cad.site_block", /^\s*([a-z0-9.-]+\.[a-z]{2,}|:\d+)\s*\{\s*$/gmi, 10, 2),
      r("cad.reverse_proxy", /^\s*reverse_proxy\s+/gmi, 10, 6),
      r("cad.file_server", /^\s*file_server\s*$/gmi, 7, 2),
      r("cad.encode", /^\s*encode\s+/gmi, 5, 2),
      r("cad.header", /^\s*header\s+/gmi, 4, 3),
      r("cad.handle", /^\s*handle(_path)?\s+/gmi, 4, 3),
    ],
  },
  {
    lang: "terraform",
    aliases: ["tf", "terraform", "hcl"],
    priority: 80,
    minScore: 14,
    rules: [
      r("tf.block", /^\s*(resource|data|module|variable|output|provider|terraform)\s+"[^"]+"\s+("?[^\s"]+"?)?\s*\{/gmi, 12, 3),
      r("tf.assign", /^\s*[a-zA-Z0-9_-]+\s*=\s*.+$/gm, 3, 10),
      r("tf.interp", /\${\s*[^}]+\s*}/g, 4, 6),
    ],
  },
  {
    lang: "ansible",
    aliases: ["ansible"],
    priority: 78,
    minScore: 16,
    rules: [
      r("ans.hosts", /^\s*hosts\s*:\s*.+$/gmi, 8, 2),
      r("ans.tasks", /^\s*tasks\s*:\s*$/gmi, 8, 1),
      r("ans.handlers", /^\s*handlers\s*:\s*$/gmi, 6, 1),
      r("ans.module", /^\s*-\s*(name|debug|copy|template|shell|command|service|apt|yum|file|lineinfile)\s*:/gmi, 5, 8),
      r("ans.become", /^\s*become\s*:\s*(true|false)\s*$/gmi, 4, 2),
    ],
  },
  {
    lang: "apache",
    aliases: ["apache", "httpd", "apache.conf"],
    priority: 70,
    minScore: 14,
    rules: [
      r("ap.directive", /^\s*(VirtualHost|Directory|IfModule|Location|ProxyPass|ProxyPassReverse)\b/gmi, 8, 6),
      r("ap.rewrite", /^\s*Rewrite(Engine|Rule|Cond)\b/gmi, 6, 6),
      r("ap.listen", /^\s*Listen\s+\d+/gmi, 4, 2),
    ],
  },
  // ----------------------- Shell / Scripts -----------------------
  {
    lang: "powershell",
    aliases: ["ps", "ps1", "powershell"],
    priority: 75,
    minScore: 14,
    rules: [
      r("ps.param", /^\s*param\s*\(/gmi, 10, 1),
      r("ps.cmdlet", /\b(Get|Set|New|Remove|Start|Stop|Restart|Test|Invoke)-[A-Za-z]+\b/g, 6, 10),
      r("ps.var", /(?<!`)\$[A-Za-z_][A-Za-z0-9_]*/g, 3, 30),
      r("ps.pipeline", /\|\s*(Where-Object|Select-Object|ForEach-Object|Sort-Object|Out-File)\b/g, 5, 10),
      r("ps.hashtable", /@\{\s*[^}]*\}/gs, 5, 2),
      r("ps.comment", /^\s*#(?!\!).*$/gm, 1, 20),
    ],
  },
  {
    lang: "bash",
    aliases: ["bash", "sh"],
    priority: 60,
    minScore: 12,
    rules: [
      r("sh.shebang", /^\s*#!\/(usr\/bin\/env\s+)?(bash|sh)\b.*$/gmi, 10, 1),
      r("sh.set", /^\s*set\s+-[euo]+/gmi, 6, 2),
      r("sh.export", /^\s*export\s+[A-Z_][A-Z0-9_]*=/gm, 4, 10),
      r("sh.if_fi", /^\s*(if|elif|then|fi)\b/gmi, 2, 10),
      r("sh.func", /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(\)\s*\{/gm, 4, 4),
      r("sh.sudo", /\bsudo\b/g, 2, 10),
    ],
  },
  {
    lang: "cmd",
    aliases: ["cmd", "bat"],
    priority: 55,
    minScore: 10,
    rules: [
      r("cmd.at_echo", /^\s*@?echo\s+(on|off)\b/gmi, 8, 1),
      r("cmd.set", /^\s*set\s+[A-Za-z_][A-Za-z0-9_]*=/gmi, 4, 10),
      r("cmd.if", /^\s*if\s+(not\s+)?(exist|defined)\b/gmi, 4, 6),
      r("cmd.goto", /^\s*goto\s+[:A-Za-z0-9_]+/gmi, 4, 5),
      r("cmd.label", /^\s*:[A-Za-z0-9_]+/gm, 3, 10),
    ],
  },
  // ----------------------- Data formats -----------------------
  {
    lang: "jsonl",
    aliases: ["jsonl", "ndjson"],
    priority: 65,
    minScore: 14,
    rules: [
      r("jsonl.lines", /^\s*\{.*\}\s*$/gm, 2, 50),
      r("jsonl.multi", /(\}\s*\n\s*\{)/g, 8, 2, "multiple JSON objects lines"),
    ],
  },
  {
    lang: "json",
    aliases: ["json"],
    priority: 50,
    minScore: 12,
    rules: [
      r("json.braces", /^\s*[\{\[]/m, 4, 1),
      r("json.kv", /"[^"\n]*"\s*:\s*/g, 4, 20),
      r("json.truefalse", /\b(true|false|null)\b/g, 1, 20),
    ],
  },
  {
    lang: "yaml",
    aliases: ["yaml", "yml"],
    priority: 45,
    minScore: 10,
    rules: [
      r("y.key", /^\s*[A-Za-z0-9_.-]+\s*:\s*.*$/gm, 2, 30),
      r("y.list", /^\s*-\s+.+$/gm, 2, 30),
      r("y.doc", /^\s*---\s*$/gm, 4, 2),
      r("y.anchors", /&[A-Za-z0-9_-]+|\*[A-Za-z0-9_-]+/g, 3, 6),
    ],
  },
  {
    lang: "toml",
    aliases: ["toml"],
    priority: 44,
    minScore: 10,
    rules: [
      r("toml.section", /^\s*\[[A-Za-z0-9_.-]+\]\s*$/gm, 6, 6),
      r("toml.kv", /^\s*[A-Za-z0-9_.-]+\s*=\s*.+$/gm, 3, 30),
    ],
  },
  {
    lang: "ini",
    aliases: ["ini", "cfg", "conf"],
    priority: 40,
    minScore: 9,
    rules: [
      r("ini.section", /^\s*\[[^\]\n]+\]\s*$/gm, 6, 8),
      r("ini.kv", /^\s*[A-Za-z0-9_.-]+\s*=\s*.*$/gm, 2, 30),
      r("ini.comment", /^\s*[;#].*$/gm, 1, 30),
    ],
  },
  {
    lang: "dotenv",
    aliases: ["dotenv", ".env", "env"],
    priority: 43,
    minScore: 10,
    rules: [
      r("env.kv", /^\s*[A-Za-z_][A-Za-z0-9_]*\s*=\s*.*$/gm, 3, 40),
      r("env.export", /^\s*export\s+[A-Za-z_][A-Za-z0-9_]*=/gm, 4, 10),
    ],
  },
  {
    lang: "csv",
    aliases: ["csv"],
    priority: 35,
    minScore: 8,
    rules: [
      r("csv.header", /^[^\n,]+(,[^\n,]+){2,}\s*$/m, 6, 1),
      r("csv.rows", /^[^\n,]+(,[^\n,]+){2,}\s*$/gm, 1, 30),
    ],
  },
  // ----------------------- Markup -----------------------
  { lang: "svg", aliases: ["svg"], priority: 60, minScore: 14, rules: [
      r("svg.tag", /<svg\b[^>]*>/i, 14, 1),
      r("svg.path", /<path\b[^>]*d\s*=\s*["'][^"']+/gi, 6, 5),
    ]},
  { lang: "xml", aliases: ["xml"], priority: 52, minScore: 12, rules: [
      r("xml.prolog", /^\s*<\?xml\b[^?]*\?>/mi, 10, 1),
      r("xml.tag", /<([A-Za-z_][\w:.-]*)\b[^>]*>/g, 2, 20),
    ]},
  { lang: "html", aliases: ["html", "htm"], priority: 51, minScore: 11, rules: [
      r("html.doctype", /^\s*<!DOCTYPE\s+html>/gmi, 12, 1),
      r("html.tags", /<\/?(div|span|p|a|img|section|header|footer|main|script|style|link|meta)\b/gi, 2, 30),
      r("html.attr", /\b(class|id|href|src|data-[\w-]+)\s*=\s*["'][^"']*["']/gi, 2, 30),
    ]},
  { lang: "markdown", aliases: ["md", "markdown"], priority: 30, minScore: 9, rules: [
      r("md.headings", /^\s{0,3}#{1,6}\s+.+$/gm, 4, 10),
      r("md.list", /^\s*([-*+]|\d+\.)\s+.+$/gm, 2, 20),
      r("md.codefence", /^\s*```[\w-]*\s*$/gm, 6, 4),
      r("md.link", /\[[^\]]+\]\([^)]+\)/g, 2, 10),
    ]},
  { lang: "mdx", aliases: ["mdx"], priority: 31, minScore: 10, rules: [
      r("mdx.jsx", /<\s*[A-Z][A-Za-z0-9]*\b[^>]*>/g, 6, 10),
      r("mdx.export", /^\s*export\s+default\s+/gm, 4, 2),
      r("mdx.codefence", /^\s*```[\w-]*\s*$/gm, 3, 4),
    ]},
  // ----------------------- Styles -----------------------
  { lang: "css", aliases: ["css"], priority: 25, minScore: 9, rules: [
      r("css.rule", /[^{]+\{\s*[^}]*:\s*[^}]*\}/gs, 6, 4),
      r("css.prop", /\b(display|position|margin|padding|color|background|font-size|border)\s*:/g, 2, 20),
      r("css.selector", /(^|\n)\s*[#.][\w-]+\s*\{/g, 3, 10),
    ]},
  { lang: "scss", aliases: ["scss"], priority: 26, minScore: 10, rules: [
      r("scss.vars", /^\s*\$[\w-]+\s*:\s*.+;$/gm, 6, 10),
      r("scss.nesting", /(^|\n)\s*[#.][\w-]+\s*\{\s*[^}]*\{\s*/g, 4, 3),
      r("scss.mixin", /^\s*@mixin\s+[\w-]+\b/gm, 6, 4),
      r("scss.include", /^\s*@include\s+[\w-]+\b/gm, 5, 6),
    ]},
  { lang: "less", aliases: ["less"], priority: 26, minScore: 9, rules: [
      r("less.vars", /^\s*@[\w-]+\s*:\s*.+;$/gm, 6, 10),
      r("less.mixin", /^\s*\.[\w-]+\s*\([^)]*\)\s*\{/gm, 6, 4),
    ]},
  // ----------------------- SQL -----------------------
  { lang: "postgresql", aliases: ["postgres", "postgresql", "psql"], priority: 42, minScore: 14, rules: [
      r("pg.cast", /::\s*\w+/g, 6, 8),
      r("pg.returning", /\bRETURNING\b/gi, 4, 4),
      r("pg.json", /\bjsonb?\b/gi, 4, 6),
      r("sql.core", /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|WHERE|GROUP\s+BY|ORDER\s+BY)\b/gi, 2, 30),
    ]},
  { lang: "mysql", aliases: ["mysql"], priority: 42, minScore: 14, rules: [
      r("my.backticks", /`[A-Za-z0-9_]+`/g, 6, 10),
      r("my.engine", /\bENGINE\s*=\s*\w+\b/gi, 5, 3),
      r("my.limit", /\bLIMIT\s+\d+(\s*,\s*\d+)?\b/gi, 3, 6),
      r("sql.core", /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|WHERE|GROUP\s+BY|ORDER\s+BY)\b/gi, 2, 30),
    ]},
  { lang: "sql", aliases: ["sql"], priority: 35, minScore: 10, rules: [
      r("sql.core", /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING)\b/gi, 3, 40),
      r("sql.terminator", /;\s*$/gm, 1, 20),
      r("sql.comment", /^\s*--.*$/gm, 2, 20),
    ]},
  // ----------------------- JS/TS -----------------------
  { lang: "tsx", aliases: ["tsx"], priority: 34, minScore: 12, rules: [
      r("tsx.importReact", /^\s*import\s+.*\s+from\s+["']react["'];?$/gm, 6, 2),
      r("tsx.tsTypes", /\b(interface|type)\s+[A-Za-z0-9_]+\s*(=|\{)/g, 4, 10),
      r("tsx.jsx", /<\s*[A-Z][A-Za-z0-9]*\b[^>]*>/g, 5, 20),
      r("ts.generic", /:\s*[A-Za-z_][\w<>\[\]\|& ,]+/g, 2, 20),
    ]},
  { lang: "jsx", aliases: ["jsx"], priority: 33, minScore: 11, rules: [
      r("jsx.jsx", /<\s*[A-Z][A-Za-z0-9]*\b[^>]*>/g, 6, 25),
      r("jsx.export", /^\s*export\s+default\s+/gm, 3, 4),
      r("js.core", /\b(const|let|var|function|return|if|else|import|export|class|new)\b/g, 1, 30),
    ]},
  { lang: "typescript", aliases: ["ts", "typescript"], priority: 32, minScore: 10, rules: [
      r("ts.types", /\b(interface|type|implements|enum|namespace)\b/g, 4, 20),
      r("ts.typed", /:\s*[A-Za-z_][\w<>\[\]\|& ,]+/g, 2, 30),
      r("ts.import", /^\s*import\s+.+from\s+["'][^"']+["'];?$/gm, 2, 10),
    ]},
  { lang: "javascript", aliases: ["js", "javascript"], priority: 31, minScore: 9, rules: [
      r("js.core", /\b(const|let|var|function|return|if|else|import|export|class|new|await|async)\b/g, 2, 40),
      r("js.arrow", /=>/g, 1, 40),
      r("js.console", /\bconsole\.(log|error|warn|info)\b/g, 2, 10),
    ]},
  // ----------------------- Other languages -----------------------
  { lang: "python", aliases: ["py", "python"], priority: 20, minScore: 9, rules: [
      r("py.def", /^\s*def\s+\w+\s*\(/gm, 6, 6),
      r("py.import", /^\s*(import|from)\s+\w+/gm, 3, 10),
      r("py.class", /^\s*class\s+\w+\s*(\(|:)/gm, 4, 6),
      r("py.colonBlocks", /:\s*$/gm, 1, 30),
    ]},
  { lang: "go", aliases: ["go", "golang"], priority: 20, minScore: 9, rules: [
      r("go.package", /^\s*package\s+\w+/gm, 8, 1),
      r("go.import", /^\s*import\s+(\(|"[\w./-]+")/gm, 4, 6),
      r("go.func", /^\s*func\s+(\([\w\s*]+\)\s*)?\w+\s*\(/gm, 5, 10),
    ]},
  { lang: "php", aliases: ["php"], priority: 20, minScore: 9, rules: [
      r("php.open", /<\?php\b/i, 10, 1),
      r("php.var", /\$[A-Za-z_][A-Za-z0-9_]*/g, 2, 30),
      r("php.arrow", /->/g, 1, 30),
    ]},
  { lang: "ruby", aliases: ["rb", "ruby"], priority: 18, minScore: 8, rules: [
      r("rb.def", /^\s*def\s+\w+/gm, 5, 10),
      r("rb.end", /^\s*end\s*$/gm, 3, 15),
      r("rb.class", /^\s*class\s+\w+/gm, 4, 6),
    ]},
  { lang: "java", aliases: ["java"], priority: 18, minScore: 8, rules: [
      r("java.class", /\b(public|private|protected)\s+class\s+\w+/g, 6, 6),
      r("java.import", /^\s*import\s+[\w.]+;/gm, 4, 10),
      r("java.package", /^\s*package\s+[\w.]+;/gm, 4, 2),
    ]},
  { lang: "csharp", aliases: ["cs", "csharp"], priority: 18, minScore: 8, rules: [
      r("cs.using", /^\s*using\s+[\w.]+;/gm, 4, 10),
      r("cs.namespace", /^\s*namespace\s+[\w.]+/gm, 4, 4),
      r("cs.class", /\b(class|record|struct)\s+\w+/g, 3, 12),
      r("cs.linq", /\b(from|select|where)\b/g, 1, 30),
    ]},
  { lang: "rust", aliases: ["rs", "rust"], priority: 18, minScore: 8, rules: [
      r("rs.fn", /^\s*fn\s+\w+\s*\(/gm, 5, 10),
      r("rs.use", /^\s*use\s+[\w:]+;/gm, 4, 10),
      r("rs.let", /\blet\s+mut\b|\blet\b/g, 1, 30),
    ]},
  { lang: "c", aliases: ["c"], priority: 16, minScore: 7, rules: [
      r("c.include", /^\s*#include\s+<[^>]+>/gm, 6, 10),
      r("c.main", /\bint\s+main\s*\(/g, 4, 2),
      r("c.semicolons", /;\s*$/gm, 1, 40),
    ]},
  { lang: "cpp", aliases: ["cpp", "c++"], priority: 16, minScore: 7, rules: [
      r("cpp.include", /^\s*#include\s+<[^>]+>/gm, 4, 10),
      r("cpp.std", /\bstd::\w+/g, 4, 15),
      r("cpp.templates", /template\s*<[^>]+>/g, 4, 5),
    ]},
  // ----------------------- Logs -----------------------
  { lang: "nginx-access-log", aliases: ["nginx access log"], priority: 65, minScore: 14, rules: [
      r("nal.ip", /^\s*\d{1,3}(\.\d{1,3}){3}\s+/gm, 4, 20),
      r("nal.request", /"([A-Z]+)\s+[^"]+\s+HTTP\/\d\.\d"/g, 8, 10),
      r("nal.status", /"\s+\d{3}\s+\d+\s*$/gm, 3, 20),
    ]},
  { lang: "nginx-error-log", aliases: ["nginx error log"], priority: 65, minScore: 14, rules: [
      r("nel.date", /^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s+\[[a-z]+\]/gmi, 10, 10),
      r("nel.level", /\b(crit|error|warn|notice|info|debug)\b/gmi, 3, 20),
      r("nel.client", /\bclient:\s*\d{1,3}(\.\d{1,3}){3}\b/gmi, 4, 10),
    ]},
  { lang: "log", aliases: ["log"], priority: 20, minScore: 8, rules: [
      r("log.isoDate", /^\s*\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/gm, 5, 20),
      r("log.level", /\b(INFO|WARN|WARNING|ERROR|DEBUG|TRACE|FATAL)\b/g, 2, 30),
      r("log.syslog", /^\s*[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+/gm, 5, 10),
    ]},
];
