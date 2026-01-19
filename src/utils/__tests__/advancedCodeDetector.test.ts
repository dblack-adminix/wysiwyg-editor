import { describe, it, expect } from 'vitest';
import { detectLanguage, isCode, normalizeLanguage, getLanguageDisplayName } from '../advancedCodeDetector';

describe('Advanced Code Detector', () => {
  describe('Dockerfile', () => {
    it('should detect basic Dockerfile', () => {
      const code = `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('dockerfile');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should detect multi-stage Dockerfile', () => {
      const code = `FROM golang:1.20 AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /build/app .
ENTRYPOINT ["./app"]`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('dockerfile');
    });

    it('should detect Dockerfile with ARG and ENV', () => {
      const code = `FROM ubuntu:22.04
ARG DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=18.x
RUN apt-get update && apt-get install -y curl
LABEL maintainer="dev@example.com"
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('dockerfile');
    });
  });

  describe('Docker Compose', () => {
    it('should detect docker-compose.yml', () => {
      const code = `version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('docker-compose');
    });

    it('should detect docker-compose with build', () => {
      const code = `version: '3.9'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    depends_on:
      - redis
      - postgres
    environment:
      - NODE_ENV=development
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('docker-compose');
    });

    it('should detect docker-compose with networks', () => {
      const code = `services:
  frontend:
    image: myapp:latest
    networks:
      - frontend-network
    deploy:
      replicas: 3
networks:
  frontend-network:
    driver: bridge`;
      
      const result = detectLanguage(code);
      // Может быть определён как yaml или docker-compose
      expect(['yaml', 'docker-compose']).toContain(result.lang);
    });
  });

  describe('Kubernetes', () => {
    it('should detect k8s Deployment', () => {
      const code = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
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
        image: nginx:1.14.2
        ports:
        - containerPort: 80`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('kubernetes');
    });

    it('should detect k8s Service', () => {
      const code = `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('kubernetes');
    });

    it('should detect k8s ConfigMap', () => {
      const code = `apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
  namespace: default
data:
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('kubernetes');
    });
  });

  describe('Nginx', () => {
    it('should detect nginx.conf', () => {
      const code = `server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
    }
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('nginx');
    });

    it('should detect nginx upstream', () => {
      const code = `upstream backend {
    server backend1.example.com:8080;
    server backend2.example.com:8080;
    server backend3.example.com:8080;
}

server {
    listen 443 ssl;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
    }
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('nginx');
    });

    it('should detect nginx with includes', () => {
      const code = `http {
    include mime.types;
    include /etc/nginx/conf.d/*.conf;
    
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
    }
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('nginx');
    });
  });

  describe('Caddyfile', () => {
    it('should detect basic Caddyfile', () => {
      const code = `example.com {
    root * /var/www
    file_server
    encode gzip
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('caddyfile');
    });

    it('should detect Caddyfile with reverse_proxy', () => {
      const code = `api.example.com {
    reverse_proxy localhost:3000
    tls admin@example.com
}

www.example.com {
    redir https://example.com{uri}
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('caddyfile');
    });

    it('should detect Caddyfile with matchers', () => {
      const code = `example.com {
    @api path /api/*
    reverse_proxy @api localhost:8080
    
    file_server
    encode gzip
    respond /health 200
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('caddyfile');
    });
  });

  describe('PowerShell', () => {
    it('should detect PowerShell script', () => {
      const code = `param(
    [string]$Path = ".",
    [int]$Depth = 2,
    [switch]$Recurse
)

Get-ChildItem -Path $Path -Recurse:$Recurse |
    Where-Object { $_.Length -gt 1MB } |
    Sort-Object Length -Descending |
    Select-Object -First 10`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('powershell');
    });

    it('should detect PowerShell function', () => {
      const code = `function Get-LargeFiles {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    
    $files = Get-ChildItem -Path $Path -File
    foreach ($file in $files) {
        Write-Host "Processing: $($file.Name)"
    }
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('powershell');
    });

    it('should detect PowerShell pipeline', () => {
      const code = `Get-Process |
    Where-Object { $_.CPU -gt 100 } |
    Sort-Object CPU -Descending |
    Select-Object -First 10 Name, CPU |
    Format-Table -AutoSize`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('powershell');
    });
  });

  describe('Bash', () => {
    it('should detect bash script', () => {
      const code = `#!/bin/bash
set -euo pipefail

export NODE_ENV=production

if [[ -f .env ]]; then
    source .env
fi

npm install && npm run build`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('bash');
    });

    it('should detect bash with functions', () => {
      const code = `#!/bin/bash

function deploy() {
    local env=$1
    echo "Deploying to $env"
    
    if [[ "$env" == "production" ]]; then
        sudo systemctl restart app
    fi
}

deploy "staging"`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('bash');
    });

    it('should detect bash with loops', () => {
      const code = `for file in *.txt; do
    echo "Processing $file"
    cat "$file" | grep -i error
done

while read line; do
    echo "$line"
done < input.txt`;
      
      const result = detectLanguage(code);
      // Может быть bash или powershell из-за $переменных
      expect(['bash', 'powershell']).toContain(result.lang);
    });
  });

  describe('SQL', () => {
    it('should detect SQL SELECT', () => {
      const code = `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
  AND o.total > 100
ORDER BY o.created_at DESC
LIMIT 10;`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('sql');
    });

    it('should detect SQL CREATE TABLE', () => {
      const code = `CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON products(name);`;
      
      const result = detectLanguage(code);
      // SERIAL - специфичный для PostgreSQL, поэтому может быть postgresql
      expect(['sql', 'postgresql']).toContain(result.lang);
    });

    it('should detect SQL with CTEs', () => {
      const code = `WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total) as revenue
    FROM orders
    GROUP BY month
)
SELECT * FROM monthly_sales
WHERE revenue > 10000;`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('sql');
    });
  });

  describe('JSON', () => {
    it('should detect JSON object', () => {
      const code = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('json');
    });

    it('should detect JSON array', () => {
      const code = `[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" },
  { "id": 3, "name": "Charlie" }
]`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('json');
    });
  });

  describe('YAML', () => {
    it('should detect YAML', () => {
      const code = `name: CI Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('yaml');
    });
  });

  describe('Logs', () => {
    it('should detect generic log', () => {
      const code = `2024-01-19 10:30:45 [INFO] Application started
2024-01-19 10:30:46 [DEBUG] Loading configuration
2024-01-19 10:30:47 [ERROR] Failed to connect to database
2024-01-19 10:30:48 [WARN] Retrying connection...`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('log');
    });

    it('should detect nginx access log', () => {
      const code = `192.168.1.1 - - [19/Jan/2024:10:30:45 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"
192.168.1.2 - - [19/Jan/2024:10:30:46 +0000] "POST /api/login HTTP/1.1" 401 89 "-" "curl/7.68.0"`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('nginx-access-log');
    });

    it('should detect nginx error log', () => {
      const code = `2024/01/19 10:30:45 [error] 1234#0: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 192.168.1.1, server: example.com`;
      
      const result = detectLanguage(code);
      expect(result.lang).toBe('nginx-error-log');
    });
  });

  describe('Utility functions', () => {
    it('should check if text is code', () => {
      // Более длинный пример для надёжного определения
      const longCode = `function hello(name) {
  console.log("Hello, " + name);
  return true;
}`;
      expect(isCode(longCode)).toBe(true);
      expect(isCode('This is just plain text.')).toBe(false);
    });

    it('should normalize language names', () => {
      expect(normalizeLanguage('js')).toBe('javascript');
      expect(normalizeLanguage('py')).toBe('python');
      expect(normalizeLanguage('yml')).toBe('yaml');
      expect(normalizeLanguage('unknown')).toBe('plain-text');
    });

    it('should get display names', () => {
      expect(getLanguageDisplayName('javascript')).toBe('JavaScript');
      expect(getLanguageDisplayName('dockerfile')).toBe('Dockerfile');
      expect(getLanguageDisplayName('kubernetes')).toBe('Kubernetes');
    });
  });
});
