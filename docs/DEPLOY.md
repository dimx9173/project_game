# 部署指南

## 部署架構

```
                    ┌──────────────────┐
                    │   Load Balancer  │
                    │    ( Nginx )     │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
     ┌──────────┐     ┌──────────┐     ┌──────────┐
     │  Server1 │     │  Server2 │     │  Server3 │
     │  (App)   │     │  (App)   │     │  (App)   │
     └────┬─────┘     └────┬─────┘     └────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ PostgreSQL│ │   Redis  │ │  MinIO  │
        │  (Primary)│ │ (Cluster)│ │ (Files) │
        └──────────┘ └──────────┘ └──────────┘
```

## 生產環境檢查清單

- [ ] 設定強密碼和 JWT_SECRET
- [ ] 啟用 HTTPS/SSL
- [ ] 設定防火牆規則
- [ ] 啟用備份機制
- [ ] 設定日誌收集
- [ ] 設定監控告警

## Docker 生產部署

### 1. 建立 image

```bash
docker build -t game-platform:latest .
```

### 2. 使用 Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: game-platform:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/gamedb
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=gamedb

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

### 3. 啟動服務

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes 部署

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: game-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: game-platform
  template:
    spec:
      containers:
      - name: app
        image: game-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: game-secrets
              key: database-url
```

## 備份與還原

### 資料庫備份

```bash
# Postgre備份
pgSQL _dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 還原
psql $DATABASE_URL < backup_20260101.sql
```

### 定時備份 (cron)

```bash
0 2 * * * pg_dump $DATABASE_URL > /backups/gamedb_$(date +\%Y\%m\%d).sql
```

## 監控設定

### 建議監控指標

- CPU / Memory / Disk
- API 響應時間
- 錯誤率
- 資料庫連線數
- JWT 過期數

### 工具建議

- **日誌**: ELK Stack / Loki
- **監控**: Prometheus + Grafana
- **告警**: PagerDuty / Slack

## SSL/HTTPS 設定 (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name api.gameplatform.com;
    
    ssl_certificate /etc/ssl/certs/gameplatform.crt;
    ssl_certificate_key /etc/ssl/private/gameplatform.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```
