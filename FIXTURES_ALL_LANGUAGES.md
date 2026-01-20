# Fixtures - Примеры для всех поддерживаемых языков

Скопируйте и вставьте эти примеры в редактор для тестирования автоопределения.

## DevOps / Config

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.9'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
  redis:
    image: redis:alpine
volumes:
  pgdata:
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: production
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Nginx Config

```nginx
upstream backend {
    server backend1.example.com:8080 weight=3;
    server backend2.example.com:8080;
    server backend3.example.com:8080 backup;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /static {
        root /var/www;
        expires 30d;
    }
}
```

### Caddyfile

```caddyfile
example.com {
    root * /var/www/html
    file_server
    encode gzip
    
    @api path /api/*
    reverse_proxy @api localhost:3000
    
    tls admin@example.com
    
    log {
        output file /var/log/caddy/access.log
    }
}

www.example.com {
    redir https://example.com{uri} permanent
}
```

### Terraform (HCL)

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  
  tags = {
    Name = "WebServer"
    Environment = var.environment
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

output "instance_ip" {
  value = aws_instance.web.public_ip
}
```

### Ansible Playbook

```yaml
---
- name: Deploy web application
  hosts: webservers
  become: yes
  vars:
    app_port: 3000
    app_user: nodejs
  
  tasks:
    - name: Install Node.js
      apt:
        name: nodejs
        state: present
        update_cache: yes
    
    - name: Create app directory
      file:
        path: /opt/app
        state: directory
        owner: "{{ app_user }}"
    
    - name: Copy application files
      copy:
        src: ./dist/
        dest: /opt/app/
        owner: "{{ app_user }}"
    
    - name: Start application
      systemd:
        name: myapp
        state: restarted
        enabled: yes
```

### YAML

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### TOML

```toml
[package]
name = "my-app"
version = "1.0.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }

[[bin]]
name = "server"
path = "src/main.rs"

[profile.release]
opt-level = 3
lto = true
```

### INI / Config

```ini
[database]
host = localhost
port = 5432
username = admin
password = secret

[server]
port = 8080
workers = 4
timeout = 30

[logging]
level = INFO
file = /var/log/app.log
```

### .env

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
API_KEY=sk_live_abc123xyz789
PORT=3000
LOG_LEVEL=info
```

## Programming Languages

### Go

```go
package main

import (
    "fmt"
    "net/http"
)

type Server struct {
    port string
}

func (s *Server) Start() error {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })
    
    return http.ListenAndServe(":"+s.port, nil)
}

func main() {
    server := &Server{port: "8080"}
    if err := server.Start(); err != nil {
        panic(err)
    }
}
```

### Rust

```rust
use std::collections::HashMap;

struct User {
    id: u32,
    name: String,
    email: String,
}

impl User {
    fn new(id: u32, name: &str, email: &str) -> Self {
        User {
            id,
            name: name.to_string(),
            email: email.to_string(),
        }
    }
}

fn main() {
    let mut users: HashMap<u32, User> = HashMap::new();
    
    let user = User::new(1, "Alice", "alice@example.com");
    users.insert(user.id, user);
    
    match users.get(&1) {
        Some(u) => println!("Found user: {}", u.name),
        None => println!("User not found"),
    }
}
```

### Ruby

```ruby
class User
  attr_accessor :name, :email
  
  def initialize(name, email)
    @name = name
    @email = email
  end
  
  def greet
    puts "Hello, #{@name}!"
  end
end

users = []
users << User.new("Alice", "alice@example.com")
users << User.new("Bob", "bob@example.com")

users.each do |user|
  user.greet
end
```

### C++

```cpp
#include <iostream>
#include <vector>
#include <string>

class User {
private:
    std::string name;
    int age;

public:
    User(const std::string& n, int a) : name(n), age(a) {}
    
    void greet() const {
        std::cout << "Hello, " << name << "!" << std::endl;
    }
};

int main() {
    std::vector<User> users;
    users.emplace_back("Alice", 30);
    users.emplace_back("Bob", 25);
    
    for (const auto& user : users) {
        user.greet();
    }
    
    return 0;
}
```

### C

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
} User;

User* create_user(const char* name, int age) {
    User* user = (User*)malloc(sizeof(User));
    strcpy(user->name, name);
    user->age = age;
    return user;
}

int main() {
    User* user = create_user("Alice", 30);
    printf("Hello, %s!\n", user->name);
    free(user);
    return 0;
}
```

## Databases

### PostgreSQL

```sql
-- Create table with PostgreSQL-specific features
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Use PostgreSQL-specific syntax
INSERT INTO users (email) 
VALUES ('alice@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- JSON operations
SELECT 
    id,
    data->>'name' as name,
    data->'address'->>'city' as city
FROM users
WHERE data @> '{"active": true}';
```

### MySQL

```sql
-- Create table with MySQL-specific features
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MySQL-specific syntax
SHOW TABLES;
SHOW DATABASES;

-- Insert with duplicate key update
INSERT INTO products (name, price)
VALUES ('Product 1', 99.99)
ON DUPLICATE KEY UPDATE price = VALUES(price);
```

## Logs

### Generic Application Log

```log
2024-01-19 10:30:45.123 [INFO] Application started on port 3000
2024-01-19 10:30:46.456 [DEBUG] Loading configuration from /etc/app/config.yml
2024-01-19 10:30:47.789 [INFO] Database connection established
2024-01-19 10:31:15.234 [WARN] High memory usage detected: 85%
2024-01-19 10:31:20.567 [ERROR] Failed to process request: Connection timeout
2024-01-19 10:31:20.568 [ERROR] Stack trace:
  at processRequest (/app/src/handler.js:45:12)
  at Server.handleRequest (/app/src/server.js:123:5)
2024-01-19 10:31:25.890 [INFO] Request completed in 5.3s
```

### Nginx Access Log

```log
192.168.1.100 - - [19/Jan/2024:10:30:45 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.101 - - [19/Jan/2024:10:30:46 +0000] "POST /api/login HTTP/1.1" 401 89 "-" "curl/7.68.0"
192.168.1.102 - - [19/Jan/2024:10:30:47 +0000] "GET /static/app.js HTTP/1.1" 304 0 "https://example.com/" "Mozilla/5.0"
10.0.0.50 - - [19/Jan/2024:10:30:48 +0000] "DELETE /api/users/123 HTTP/1.1" 204 0 "-" "axios/0.21.1"
```

### Nginx Error Log

```log
2024/01/19 10:30:45 [error] 1234#0: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 192.168.1.100, server: api.example.com, request: "GET /api/users HTTP/1.1", upstream: "http://127.0.0.1:3000/api/users", host: "api.example.com"
2024/01/19 10:30:46 [warn] 1234#0: *2 upstream server temporarily disabled while connecting to upstream, client: 192.168.1.101
2024/01/19 10:30:47 [crit] 1234#0: *3 SSL_do_handshake() failed (SSL: error:14094410:SSL routines:ssl3_read_bytes:sslv3 alert handshake failure)
```

## Data Formats

### JSON Lines (JSONL)

```jsonl
{"id": 1, "name": "Alice", "email": "alice@example.com", "active": true}
{"id": 2, "name": "Bob", "email": "bob@example.com", "active": false}
{"id": 3, "name": "Charlie", "email": "charlie@example.com", "active": true}
```

### CSV

```csv
id,name,email,age,city
1,Alice,alice@example.com,30,New York
2,Bob,bob@example.com,25,Los Angeles
3,Charlie,charlie@example.com,35,Chicago
4,Diana,diana@example.com,28,Houston
```

## Markup

### SVG

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#6366f1" />
  <rect x="30" y="30" width="40" height="40" fill="#8b5cf6" opacity="0.5" />
  <path d="M 10 10 L 90 90 M 90 10 L 10 90" stroke="#fff" stroke-width="2" />
</svg>
```

### MDX

```mdx
import { Button } from './components/Button'

# Welcome to MDX

This is a **markdown** file with JSX components!

<Button onClick={() => alert('Hello!')}>
  Click me
</Button>

## Features

- Markdown syntax
- React components
- Full TypeScript support

export const meta = {
  title: 'My Page',
  date: '2024-01-19'
}
```

---

## Инструкции по тестированию

1. Откройте редактор: http://localhost:5176
2. Скопируйте любой пример выше
3. Вставьте в редактор (Ctrl+V)
4. Проверьте:
   - ✅ Правильный язык определён
   - ✅ Бейдж показывает корректное название
   - ✅ Подсветка синтаксиса применена
   - ✅ Цветная рамка присутствует

## Ожидаемые результаты

Каждый пример должен быть автоматически определён с confidence > 0.5 и получить соответствующую подсветку синтаксиса.
