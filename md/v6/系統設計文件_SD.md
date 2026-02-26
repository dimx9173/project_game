# 遊戲平台管理系統 - 系統設計文件（SD）

> **版本**：v1.0  
> **日期**：2026 年 2 月 25 日  
> **適用系統**：遊戲平台管理系統

---

## 1. 系統概述

### 1.1 系統目標

本系統旨在提供一個穩定可靠的遊戲平台管理解決方案，支援：
- 集中式後台統一管理
- 單機本地後台離線運作
- 雙向資料同步與對帳
- 第三方遊戲 API 串接

### 1.2 系統架構

```
┌─────────────────────────────────────────────────────────────────┐
│                         玩家端應用程式                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      單機本地後台                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React    │  │  Express    │  │   SQLite   │              │
│  │   Frontend │  │   Backend   │  │  Database  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      集中式後台                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React    │  │  Express    │  │ PostgreSQL  │              │
│  │   Frontend │  │   Backend   │  │  Database  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │  遊戲商 API  │
                      └─────────────┘
```

---

## 2. 技術架構

### 2.1 前端技術

| 項目 | 技術 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| UI 框架 | Tailwind CSS | 4.x |
| 路由 | Wouter | latest |
| 狀態管理 | React Context | - |
| 圖表 | Recharts | latest |
| UI 元件 | shadcn/ui | latest |

### 2.2 後端技術

| 項目 | 技術 | 版本 |
|------|------|------|
| 執行環境 | Node.js | 20.x |
| 框架 | Express.js | 4.x |
| 集中式資料庫 | PostgreSQL | 15.x |
| 本地資料庫 | SQLite | 3.x |
| 認證 | JWT | latest |
| 加密 | AES-256 + RSA | - |

### 2.3 通訊架構

| 通訊方式 | 用途 |
|----------|------|
| RESTful API | 資料 CRUD |
| WebSocket | 即時狀態推送 |
| HTTPS | 安全傳輸 |

---

## 3. 資料庫設計

### 3.1 集中式資料庫（PostgreSQL）

#### 核心資料表

```sql
-- 機台表
CREATE TABLE machines (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'offline',
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 遊戲表
CREATE TABLE games (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 玩家表
CREATE TABLE players (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 交易表
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id),
    machine_id UUID REFERENCES machines(id),
    game_id UUID REFERENCES games(id),
    type VARCHAR(20) NOT NULL, -- bet, payout, deposit, withdraw
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 系統使用者表
CREATE TABLE system_users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin, agent, operator
    agent_id UUID REFERENCES system_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 同步日誌表
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY,
    machine_id UUID REFERENCES machines(id),
    direction VARCHAR(10), -- upload, download
    status VARCHAR(20),
    records_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 本地資料庫（SQLite）

```sql
-- 單機本地資料表
CREATE TABLE local_transactions (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    game_id TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    balance_before REAL,
    balance_after REAL,
    status TEXT DEFAULT 'pending', -- pending, synced, failed
    created_at TEXT DEFAULT (datetime('now'))
);

-- 同步佇列
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
);
```

---

## 4. API 設計

### 4.1 集中式後台 API

#### 認證

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | /api/auth/login | 登入 |
| POST | /api/auth/logout | 登出 |
| GET | /api/auth/verify | 驗證 Token |

#### 機台管理

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/machines | 機台列表 |
| GET | /api/machines/:id | 機台詳情 |
| POST | /api/machines | 新增機台 |
| PUT | /api/machines/:id | 更新機台 |
| POST | /api/machines/:id/command | 遠端指令 |

#### 遊戲管理

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/games | 遊戲列表 |
| POST | /api/games | 新增遊戲 |
| PUT | /api/games/:id | 更新遊戲 |

#### 玩家管理

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/players | 玩家列表 |
| GET | /api/players/:id | 玩家詳情 |
| PUT | /api/players/:id/balance | 調整餘額 |

#### 交易管理

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/transactions | 交易列表 |
| POST | /api/transactions | 建立交易 |

#### 同步

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | /api/sync/upload | 上傳本地資料 |
| GET | /api/sync/download | 下載中央資料 |
| GET | /api/sync/status | 同步狀態 |

### 4.2 本地後台 API

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | /api/local/login | PIN 登入 |
| GET | /api/local/machine | 機台資訊 |
| POST | /api/local/cash-in | 開分 |
| POST | /api/local/cash-out | 洗分 |
| GET | /api/local/transactions | 本地交易 |
| POST | /api/local/sync | 觸發同步 |

---

## 5. 離線同步機制

### 5.1 斷線重試佇列

```
1. 本地交易產生
2. 寫入 SQLite + sync_queue
3. 背景 Worker 每 3 分鐘檢查
4. 嘗試上傳到中央
5. 成功 → 刪除 queue
6. 失敗 → retry_count++
7. retry_count > 5 → 標記失敗
```

### 5.2 同步流程

```
本地後台                    集中式後台
    │                          │
    │──── POST /sync/upload ────>│
    │     (上傳本地交易)         │
    │<─── 交換版本號 ───────────│
    │                          │
    │──── 衝突檢測 ────────────>│
    │     (時間戳/版本號)       │
    │<─── 下載中央變更 ─────────│
    │                          │
    │──── 確認套用 ────────────>│
    │<─── 對帳報告 ────────────│
```

---

## 6. 安全性設計

### 6.1 認證與授權

- JWT Token 認證
- RBAC 角色權限（Admin / Agent / Operator）
- PIN 碼保護本地操作

### 6.2 資料加密

- 敏感資料：AES-256 加密儲存
- 傳輸：HTTPS 加密
- 交易：RSA 數位簽名

### 6.3 稽核日誌

- 記錄所有重要操作
- 包含：操作者、時間、內容、結果

---

## 7. 部署架構

### 7.1 集中式後台

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CDN      │────▶│   Nginx    │────▶│  Express   │
│  (Static)  │     │  (Proxy)   │     │  (Backend) │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌───────────────────────────┼───────────────┐
                    │                           │               │
                    ▼                           ▼               ▼
              ┌─────────┐               ┌─────────────┐   ┌──────────┐
              │ PostgreSQL           │  Redis      │   │  Game   │
              │  (Primary)          │  (Cache)    │   │   API   │
              └─────────┘               └─────────────┘   └──────────┘
```

### 7.2 本地後台

```
┌────────────────────────────────────────┐
│            單機設備                       │
│  ┌──────────┐   ┌──────────┐          │
│  │  React   │   │ Express  │          │
│  │  Frontend│   │  Backend │          │
│  └──────────┘   └────┬─────┘          │
│                       │                 │
│                 ┌─────▼─────┐           │
│                 │  SQLite   │           │
│                 └───────────┘           │
└────────────────────────────────────────┘
```

---

## 8. 效能設計

### 8.1 效能目標

| 項目 | 目標 |
|------|------|
| API 響應時間 | < 200ms |
| 資料庫查詢 | < 500ms |
| 系統可用性 | ≥ 99.5% |
| 支援機台數 | 1000+ |

### 8.2 優化策略

- 資料庫索引優化
- CDN 加速靜態資源
- Redis 快取
- 非同步處理

---

## 9. 監控設計

### 9.1 監控項目

- 機台心跳監控（1 分鐘間隔）
- API 響應時間
- 資料庫連線池
- 同步成功率

### 9.2 告警規則

| 條件 | 動作 |
|------|------|
| 機台離線 > 15 分鐘 | 告警 |
| API 錯誤率 > 5% | 告警 |
| 同步失敗 > 3 次 | 告警 |

---

## 10. 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0 | 2026-02-25 | 初版系統設計 |
