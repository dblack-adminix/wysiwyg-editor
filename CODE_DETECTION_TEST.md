# Тестирование автоматического определения кода

Скопируйте и вставьте эти примеры кода в редактор, чтобы проверить автоматическое определение и подсветку синтаксиса.

## JavaScript

```javascript
function calculateSum(a, b) {
  const result = a + b;
  console.log(`Sum: ${result}`);
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

const currentUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
```

## Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, x, y):
        self.result = x + y
        return self.result

print("Hello, World!")
```

## PowerShell

```powershell
param(
    [string]$ipListFile = "ip.txt",
    [string]$outputFile = "ip_scan_results.txt",
    [int]$timeout = 5,
    [switch]$verbose
)

function Write-Log {
    param([string]$message, [string]$level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[{0}] [{1}] {2}" -f $timestamp, $level, $message
    Write-Host $line
}

function Get-OpenPorts {
    param([string]$ip, [int[]]$ports, [int]$timeoutMs)
    $open = New-Object System.Collections.Generic.List[int]
    
    foreach ($port in $ports) {
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $iar = $client.BeginConnect($ip, $port, $null, $null)
            if ($iar.AsyncWaitHandle.WaitOne($timeoutMs, $false)) {
                $open.Add($port)
            }
            $client.Close()
        } catch {
            # ignore
        }
    }
    
    return $open.ToArray()
}

Write-Log "Starting IP scan..." "INFO"
Get-OpenPorts -ip "192.168.1.1" -ports @(80, 443, 22) -timeoutMs 800
```

## Java

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        int sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += i;
        }
        
        System.out.println("Sum: " + sum);
    }
}
```

## C#

```csharp
using System;

namespace MyApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            
            var numbers = new List<int> { 1, 2, 3, 4, 5 };
            var doubled = numbers.Select(n => n * 2);
        }
    }
}
```

## PHP

```php
<?php
function greet($name) {
    return "Hello, " . $name . "!";
}

class User {
    private $name;
    
    public function __construct($name) {
        $this->name = $name;
    }
    
    public function getName() {
        return $this->name;
    }
}

$user = new User("John");
echo greet($user->getName());
?>
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>This is a paragraph.</p>
        <button onclick="alert('Hello!')">Click me</button>
    </div>
</body>
</html>
```

## CSS

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
}

.button:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}
```

## SQL

```sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed'
  AND orders.total > 100
ORDER BY orders.created_at DESC
LIMIT 10;

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price) VALUES ('Product 1', 99.99);
```

## JSON

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "gaming"],
  "isActive": true
}
```

## Инструкции по тестированию

1. Откройте редактор в браузере: `http://localhost:5176`
2. Скопируйте любой из примеров кода выше
3. Вставьте его в редактор (Ctrl+V или правый клик → Вставить)
4. Код должен автоматически:
   - Обернуться в блок с цветной рамкой
   - Получить подсветку синтаксиса (через Prism.js)
   - Показать бейдж с названием языка в правом верхнем углу

## Что проверять

✅ Код автоматически определяется при вставке  
✅ Язык программирования определяется правильно  
✅ Применяется подсветка синтаксиса  
✅ Блок кода имеет цветную рамку  
✅ Бейдж с названием языка отображается  
✅ Код остаётся читаемым и форматированным  

## Известные ограничения

- Минимальная длина кода для определения: 20 символов
- Требуется минимум 3 характерных признака кода
- Для коротких фрагментов может потребоваться ручная вставка через кнопку "Code"
