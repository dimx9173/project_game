# 安裝指南

## 前置需求

| 軟體 | 版本 | 說明 |
|------|------|------|
| Node.js | 20.11+ | 建議使用 nvm 管理 |
| PostgreSQL | 15.x | 中央資料庫 |
| SQLite | 3.x | 本地資料庫 (已內建) |
| Redis | 7.x | 快取 (可選) |
| Docker | 24+ | 可選 |

## 安裝步驟

### 1. 複製專案

```bash
git clone https://github.com/dimx9173/project_game.git
cd project_game
```

### 2. 安裝 Node.js 依賴

```bash
npm install
```

### 3. 設定環境變數

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# 資料庫
DATABASE_URL=postgresql://postgres:password@localhost:5432/gamedb?schema=public

# Redis (可選)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# 伺服器
PORT=3000
NODE_ENV=development
```

### 4. 初始化資料庫

```bash
# 自動遷移 (若支援)
npm run db:migrate

# 或手動執行 SQL
psql $DATABASE_URL -f init.sql
```

### 5. 啟動開發伺服器

```bash
# 啟動全部服務
npm run dev

# 或分開啟動
npm run dev:backend  # 後端 :3000
npm run dev:frontend # 前端 :5173
```

### 6. 驗證安裝

開啟瀏覽器存取：
- 前端: http://localhost:5173
- 後端 API: http://localhost:3000/api/v1/health

## Docker 部署

### 使用 Docker Compose

```bash
# 啟動全部服務
docker-compose up -d

# 查看日誌
docker-compose logs -f app

# 停止服務
docker-compose down
```

### 環境變數 (Docker)

```yaml
# docker-compose.yml 部分
environment:
  - DATABASE_URL=postgresql://postgres:password@db:5432/gamedb
  - REDIS_URL=redis://redis:6379
  - JWT_SECRET=production-secret
```

## 常見問題

### Q: 資料庫連線失敗
A: 確認 PostgreSQL 已啟動，且 DATABASE_URL 正確

### Q: Port 被佔用
A: 修改 .env 中的 PORT 或殺掉佔用程序

### Q: Node modules 問題
A: 刪除 node_modules 並重新安裝
```bash
rm -rf node_modules
npm install
```
