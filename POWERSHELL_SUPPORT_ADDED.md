# ✅ Добавлена поддержка PowerShell

## Проблема
Пользователь вставил PowerShell код, но редактор его не определил как код.

## Причина
PowerShell не был включён в список поддерживаемых языков в детекторе кода.

## Решение

### 1. Добавлен PowerShell в `src/utils/codeDetector.ts`

Добавлены паттерны для определения PowerShell:
```typescript
powershell: [
  /\bparam\s*\(/i,              // param() блоки
  /\$\w+/,                       // $переменные
  /\b(function|param|switch|if|else|foreach|while|return)\b/i,
  /-\w+/,                        // -параметры
  /\[string\]|\[int\]|\[switch\]/i,  // [типы]
  /Get-|Set-|New-|Write-|Add-/,  // Cmdlets
  /\$_|\$PSItem/                 // Специальные переменные
]
```

### 2. Улучшен алгоритм определения кода

Добавлены новые индикаторы:
- `\$\w+` - переменные в PowerShell, PHP, Bash
- `-\w+` - параметры в PowerShell и CLI
- `param` - ключевое слово PowerShell

### 3. Приоритет для PowerShell

PowerShell проверяется первым, если обнаружены:
- `param()` блоки
- Cmdlets (Get-, Set-, New-, Write-, Add-)
- Типы в квадратных скобках ([string], [int], [switch])

### 4. Добавлен Prism.js компонент

В `demo/index.html` добавлена строка:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-powershell.min.js"></script>
```

### 5. Обновлена документация

- `README.md` - добавлен PowerShell в список языков
- `CODE_DETECTION_TEST.md` - добавлен раздел с примерами PowerShell
- `POWERSHELL_TEST.md` - создан отдельный файл с тестами PowerShell

## Тестирование

### Ваш код теперь определяется!

Скопируйте и вставьте ваш код в редактор:

```powershell
param([string]$ipListFile = "ip.txt",[string]$outputFile = "ip_scan_results.txt",[string]$csvFile    = "ip_scan_results.csv",[string]$logFile    = "ip_scan.log",[int]$timeout = 5,[switch]$verbose,[switch]$htmlReport,[string]$htmlFile = "ip_scan_report.html",[switch]$traceroute,[int]$portTimeoutMs = 800)# safer encoding for console output$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)function Write-Log {param([string]$message, [string]$level = "INFO")$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"$line = "[{0}] [{1}] {2}" -f $timestamp, $level, $messageWrite-Host $lineif ($logFile) { Add-Content -Path $logFile -Value $line -Encoding UTF8 }}function Get-OpenPorts {param([string]$ip, [int[]]$ports, [int]$timeoutMs)$open = New-Object System.Collections.Generic.List[int]foreach ($port in $ports) {try {$client = New-Object System.Net.Sockets.TcpClient$iar = $client.BeginConnect($ip, $port, $null, $null)if ($iar.AsyncWaitHandle.WaitOne($timeoutMs, $false) -and $client.Connected) {$open.Add($port)}$client.Close()} catch {# ignore}}return $open.ToArray()}
```

### Что вы увидите:

✅ Код автоматически обёрнут в блок  
✅ Бейдж показывает "POWERSHELL"  
✅ Применена подсветка синтаксиса:
- Ключевые слова (`param`, `function`, `if`, `foreach`) - фиолетовые
- Переменные (`$ipListFile`, `$timeout`) - белые
- Строки (`"ip.txt"`, `"INFO"`) - зелёные
- Cmdlets (`Write-Host`, `Add-Content`, `New-Object`) - жёлтые
- Типы (`[string]`, `[int]`, `[switch]`) - синие
- Комментарии (`# ignore`) - серые

✅ Цветная рамка вокруг кода  
✅ Моноширинный шрифт для читаемости  

## Характерные признаки PowerShell

Редактор определяет PowerShell по следующим признакам:

1. **param() блоки** - объявление параметров скрипта
2. **$переменные** - все переменные начинаются с $
3. **[типы]** - типы в квадратных скобках: [string], [int], [switch]
4. **Cmdlets** - команды с дефисом: Get-Process, Set-Content, New-Object
5. **-параметры** - параметры с дефисом: -Path, -Filter, -Encoding
6. **Специальные переменные** - $_, $PSItem

## Минимальные требования для определения

- ✅ Минимум 20 символов
- ✅ Минимум 3 характерных признака кода
- ✅ Хотя бы один из: param(), cmdlets, $переменные, [типы]

Ваш код соответствует всем требованиям:
- Длина: 1000+ символов ✅
- param() блок ✅
- Множество $переменных ✅
- Типы [string], [int], [switch] ✅
- Cmdlets: Write-Host, Add-Content, New-Object ✅
- Функции: Write-Log, Get-OpenPorts ✅

## Быстрый тест

1. Откройте: http://localhost:5176
2. Вставьте ваш PowerShell код (Ctrl+V)
3. Наслаждайтесь подсветкой! 🎉

## Дополнительные примеры

См. файл `POWERSHELL_TEST.md` для дополнительных примеров PowerShell кода.

## Полный список поддерживаемых языков

1. JavaScript
2. TypeScript
3. Python
4. **PowerShell** ⭐ NEW!
5. Java
6. C#
7. PHP
8. HTML
9. CSS
10. SQL
11. JSON

---

**Статус:** ✅ ИСПРАВЛЕНО  
**Дата:** 19 января 2026  
**Время:** ~15 минут
