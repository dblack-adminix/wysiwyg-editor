# Тест PowerShell кода

## Пример 1: Простой скрипт

```powershell
param(
    [string]$name = "World",
    [int]$count = 5
)

Write-Host "Hello, $name!"

for ($i = 1; $i -le $count; $i++) {
    Write-Output "Iteration $i"
}
```

## Пример 2: Сканер IP (ваш код)

```powershell
param(
    [string]$ipListFile = "ip.txt",
    [string]$outputFile = "ip_scan_results.txt",
    [string]$csvFile    = "ip_scan_results.csv",
    [string]$logFile    = "ip_scan.log",
    [int]$timeout = 5,
    [switch]$verbose,
    [switch]$htmlReport,
    [string]$htmlFile = "ip_scan_report.html",
    [switch]$traceroute,
    [int]$portTimeoutMs = 800
)

# safer encoding for console output
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)

function Write-Log {
    param([string]$message, [string]$level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[{0}] [{1}] {2}" -f $timestamp, $level, $message
    Write-Host $line
    if ($logFile) { 
        Add-Content -Path $logFile -Value $line -Encoding UTF8 
    }
}

function Get-OpenPorts {
    param([string]$ip, [int[]]$ports, [int]$timeoutMs)
    $open = New-Object System.Collections.Generic.List[int]
    
    foreach ($port in $ports) {
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $iar = $client.BeginConnect($ip, $port, $null, $null)
            if ($iar.AsyncWaitHandle.WaitOne($timeoutMs, $false) -and $client.Connected) {
                $open.Add($port)
            }
            $client.Close()
        } catch {
            # ignore
        }
    }
    
    return $open.ToArray()
}
```

## Пример 3: Работа с файлами

```powershell
$files = Get-ChildItem -Path "C:\Temp" -Filter "*.txt"

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    Write-Host "Processing: $($file.Name)"
    
    $lineCount = ($content | Measure-Object -Line).Lines
    Write-Output "Lines: $lineCount"
}
```

## Пример 4: Cmdlets и пайплайны

```powershell
Get-Process | 
    Where-Object { $_.CPU -gt 100 } |
    Sort-Object CPU -Descending |
    Select-Object -First 10 Name, CPU, WorkingSet |
    Format-Table -AutoSize

Get-Service |
    Where-Object { $_.Status -eq "Running" } |
    Export-Csv -Path "services.csv" -NoTypeInformation
```

## Как тестировать

1. Откройте редактор: http://localhost:5176
2. Скопируйте любой из примеров выше
3. Вставьте в редактор (Ctrl+V)
4. Проверьте:
   - ✅ Код определён как PowerShell
   - ✅ Бейдж показывает "POWERSHELL"
   - ✅ Применена подсветка синтаксиса
   - ✅ Цветная рамка присутствует

## Характерные признаки PowerShell

Редактор определяет PowerShell по:
- `param()` блокам
- Переменным с `$` (например, `$name`, `$ipListFile`)
- Типам в квадратных скобках: `[string]`, `[int]`, `[switch]`
- Cmdlets: `Get-`, `Set-`, `New-`, `Write-`, `Add-`
- Параметрам с дефисом: `-Path`, `-Filter`, `-Encoding`

## Минимальные требования

- Минимум 20 символов
- Минимум 3 характерных признака кода
- Наличие хотя бы одного из: `param()`, cmdlets, `$переменные`, типы `[string]`
