# 遊戲平台管理系統 - 系統設計文件（SD）

> **版本**：v1.2  
> **日期**：2026 年 2 月 26 日  
> **適用系統**：遊戲平台管理系統 V6 (MVP / 標準版 / 旗艦版)

---

## 1. 系統概述

### 1.1 系統目標

本系統旨在提供一個穩定可靠的遊戲平台管理解決方案，支援：
- 集中式後台統一管理
- 單機本地後台離線運作
- 雙向資料同步與對帳
- 第三方遊戲 API 串接

### 1.2 版本差異對照表

| 功能模組 | v6/2 MVP | v6/3 標準版 | v6/4 旗艦版 |
|----------|----------|-------------|-------------|
| **中央後台** | ✅ | ✅ | ✅ |
| - 機台管理 | ✅ | ✅ | ✅ |
| - 玩家管理 | ✅ | ✅ | ✅ |
| - 交易管理 | ✅ | ✅ | ✅ |
| - 系統使用者 | ✅ | ✅ | ✅ |
| - 儀表板 | - | ✅ | ✅ |
| - 即時機台監控 | - | ✅ | ✅ |
| - 第三方遊戲商管理 | - | ✅ | ✅ |
| - 代理商管理 | - | ✅ | ✅ |
| - 三層權限管理 | - | ✅ | ✅ |
| - 第三方錢包轉帳 | - | ✅ | ✅ |
| - OTA 遠端更新 | - | - | ✅ |
| - 硬體監控 | - | - | ✅ |
| - 錯帳對帳管理 | - | - | ✅ |
| - 錢包自動對帳 | - | - | ✅ |
| **單機本地後台** | ✅ | ✅ | ✅ |
| - PIN 登入 | ✅ | ✅ | ✅ |
| - 開分/洗分 | ✅ | ✅ | ✅ |
| - 離線交易 | ✅ | ✅ | ✅ |
| - 同步機制 | ✅ | ✅ | ✅ |

### 1.3 系統架構

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
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │  RG 電子   │ │  JDB 電子   │ │  其他遊戲商 │
       └─────────────┘ └─────────────┘ └─────────────┘
```

---

## 2. 技術架構

### 2.1 前端技術

| 項目 | 技術 | 版本 | 備註 |
|------|------|------|------|
| 框架 | React | 18.x | 建議穩定版 |
| UI 框架 | Tailwind CSS | 4.x | |
| 路由 | Wouter | latest | 輕量路由庫 |
| 狀態管理 | Zustand | latest | 推薦替代 Context |
| 圖表 | Recharts | latest | |
| UI 元件 | shadcn/ui | latest | 基於 Radix UI |

### 2.2 後端技術

| 項目 | 技術 | 版本 | 備註 |
|------|------|------|------|
| 執行環境 | Node.js | 20.11.x LTS | |
| 框架 | Express.js | 4.x | |
| 集中式資料庫 | PostgreSQL | 15.x | |
| 本地資料庫 | better-sqlite3 | 3.x | 原生效能更好 |
| 快取 | Redis | 7.x | |
| 認證 | jose | latest | JWT 處理庫 |
| 加密 | AES-256-GCM + RSA | - | |
| WebSocket | Socket.io | 4.x | |
| API 文件 | Swagger | - | |

### 2.3 通訊架構

| 通訊方式 | 用途 |
|----------|------|
| RESTful API | 資料 CRUD |
| WebSocket | 即時狀態推送、心跳監控 |
| HTTPS | 安全傳輸 (TLS 1.3) |

---

## 3. 資料庫設計

### 3.1 集中式資料庫（PostgreSQL）- 核心資料表

```sql
-- 機台表
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    machine_type VARCHAR(50),
    provider_id UUID REFERENCES providers(id),
    status VARCHAR(20) DEFAULT 'offline',
    heartbeat_interval INTEGER DEFAULT 60,
    last_heartbeat TIMESTAMP,
    software_version VARCHAR(20),
    hardware_info JSONB,
    config JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 遊戲商表
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    api_endpoint VARCHAR(500),
    api_key_hash VARCHAR(255),
    api_secret_hash VARCHAR(255),
    webhook_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    balance DECIMAL(15,2) DEFAULT 0,
    min_balance_warning DECIMAL(15,2) DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 遊戲表
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    name VARCHAR(100) NOT NULL,
    game_code VARCHAR(50),
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    rtp DECIMAL(5,2),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 玩家表
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    password_hash VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0,
    pending_balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    vip_level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- 代理商表
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    parent_agent_id UUID REFERENCES agents(id),
    commission_rate DECIMAL(5,2) DEFAULT 0,
    balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 交易表
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    machine_id UUID REFERENCES machines(id),
    game_id UUID REFERENCES games(id),
    provider_id UUID REFERENCES providers(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    external_tx_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    error_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 系統使用者表
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    agent_id UUID REFERENCES agents(id),
    permissions JSONB DEFAULT '[]',
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 稽核日誌表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_type VARCHAR(20),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 本地資料庫（SQLite）

```sql
-- 本地交易
CREATE TABLE local_transactions (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    game_id TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    balance_before REAL,
    balance_after REAL,
    status TEXT DEFAULT 'pending',
    sync_attempts INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 同步佇列
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 本機設定
CREATE TABLE local_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- PIN 認證
CREATE TABLE local_auth (
    pin_hash TEXT NOT NULL,
    pin_salt TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TEXT
);
```

### 3.3 索引設計

```sql
CREATE INDEX idx_transactions_player ON transactions(player_id);
CREATE INDEX idx_transactions_machine ON transactions(machine_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

---

## 4. API 設計

### 4.1 API 回應格式

```json
// 成功
{ "success": true, "data": {}, "pagination": {} }

// 失敗
{ "success": false, "error": { "code": "AUTH_001", "message": "" } }
```

### 4.2 API 端點 (精簡版)

#### 認證
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/verify
- POST /api/v1/auth/refresh

#### 機台
- GET/POST /api/v1/machines
- GET/PUT/DELETE /api/v1/machines/:id
- POST /api/v1/machines/:id/command

#### 遊戲商 (v6/3)
- GET/POST /api/v1/providers
- GET/PUT /api/v1/providers/:id
- GET /api/v1/providers/:id/balance

#### 玩家
- GET /api/v1/players
- GET /api/v1/players/:id
- PUT /api/v1/players/:id/balance

#### 交易
- GET /api/v1/transactions
- POST /api/v1/transactions/:id/reverse

#### OTA (v6/4)
- GET/POST /api/v1/ota/versions
- POST /api/v1/ota/deploy

#### 錯帳 (v6/4)
- GET /api/v1/discrepancies
- POST /api/v1/discrepancies/:id/resolve

### 4.3 API 錯誤碼

| 錯誤碼 | 說明 | HTTP |
|--------|------|------|
| AUTH_001 | 登入失敗 | 401 |
| AUTH_002 | Token 過期 | 401 |
| AUTH_003 | 權限不足 | 403 |
| AUTH_004 | 帳號已停用 | 403 |
| RES_001 | 資源不存在 | 404 |
| VAL_001 | 參數驗證失敗 | 400 |
| VAL_002 | 餘額不足 | 400 |
| TXN_001 | 交易失敗 | 500 |
| TXN_002 | 交易處理中 | 202 |
| SYNC_001 | 同步失敗 | 500 |
| EXT_001 | 第三方 API 錯誤 | 502 |

---

## 5. 離線同步機制

### 5.1 重試策略 (指數退避)
- 重試 1: 30 秒
- 重試 2: 1 分鐘
- 重試 3: 2 分鐘
- 重試 4: 5 分鐘
- 重試 5: 10 分鐘
- 超過 5 次: 標記失敗 + 告警

### 5.2 衝突解決
- 餘額衝突: 中央優先
- 重複交易: UUID 去重
- 版本衝突: 中央優先

---

## 6. 安全性設計

### 6.1 認證
- JWT (Access 15分鐘, Refresh 7天)
- RBAC: Super Admin / Admin / Agent / Operator
- PIN: 6位數, bcrypt, 錯誤5次鎖定30分

### 6.2 權限矩陣

| 功能 | Super Admin | Admin | Agent | Operator |
|------|-------------|-------|-------|----------|
| 系統設定 | ✅ | ❌ | ❌ | ❌ |
| 新增機台 | ✅ | ✅ | ❌ | ❌ |
| 調整餘額 | ✅ | ✅ | ❌ | ❌ |
| 查看交易 | ✅ | ✅ | ✅ | ✅ |
| 開分/洗分 | ✅ | ✅ | ✅ | ✅ |

### 6.3 加密
- 密碼: bcrypt (cost 12)
- 敏感資料: AES-256-GCM
- 傳輸: TLS 1.3
- API 簽名: RSA-2048

---

## 7. 第三方遊戲商串接 (v6/3)

### 7.1 支援遊戲商
| 代碼 | 名稱 | 遊戲類型 |
|------|------|----------|
| rg | RG 電子 | 老虎機、捕魚 |
| jdb | JDB 電子 | 老虎機、棋牌 |
| rt | RT 電子 | 老虎機 |

### 7.2 串接流程
1. 新增遊戲商設定 (API Endpoint, Key, Secret)
2. 測試連線 (health check, 餘額查詢)
3. 正式上線 (遊戲開通, 錢包建立)

### 7.3 錢包轉帳流程
```
玩家 → 中央錢包 → 第三方 API(轉入) → 遊戲商錢包 → 遊戲
遊戲 → 遊戲商錢包 → 第三方 API(轉出) → 中央錢包 → 玩家
```

---

## 8. OTA 遠端更新 (v6/4)

### 8.1 流程
1. 上傳版本 (檔案, MD5, 版本資訊)
2. 測試派發 (2-3台, 24小時)
3. 正式派發 (全部/分批, 即時/預約)
4. 監控進度

### 8.2 安全
- SHA-256 檔案驗證
- 差異更新支援
- 版本相容性檢查

---

## 9. 硬體監控 (v6/4)

### 9.1 監控項目
| 項目 | 警告閾值 | 嚴重閾值 |
|------|----------|----------|
| CPU | > 80% | > 90% |
| 記憶體 | > 80% | > 90% |
| 硬碟 | < 15% | < 5% |
| 網路延遲 | > 100ms | > 500ms |
| 溫度 | > 60°C | > 75°C |

### 9.2 心跳
- 間隔: 1 分鐘
- 超過 3 分鐘無心跳 → 離線

---

## 10. 錯帳對帳管理 (v6/4)

### 10.1 錯帳類型
- missing_deposit: 轉帳未到帳
- missing_withdrawal: 轉出未確認
- payout_error: 派彩錯誤

### 10.2 處理流程
1. 偵測錯帳 (自動/人工)
2. 調查原因 (日誌, 遊戲商)
3. 處理 (補發/退款/沖銷)
4. 產生憑證 (PDF)

---

## 11. 部署架構

### 11.1 集中式後台
```
CDN → Nginx → Node.js Backend → PostgreSQL + Redis
                                      ↓
                               Game APIs (RG/JDB)
```

### 11.2 容器化
```yaml
services:
  backend:
    image: node:20
    ports:
      - "3000:3000"
  postgres:
    image: postgres:15
  redis:
    image: redis:7-alpine
```

---

## 12. 效能設計

### 12.1 目標
- API P95 < 200ms
- DB 查詢 P95 < 500ms
- 可用性 ≥ 99.5%
- 支援 1000+ 機台

### 12.2 優化
- 資料庫索引
- Redis 快取 (5分鐘)
- 非同步處理
- 連線池管理

---

## 13. 監控設計

### 13.1 告警
| 條件 | 動作 |
|------|------|
| 機台離線 > 15分 | Telegram |
| API 錯誤率 > 5% | Telegram |
| 同步失敗 > 3次 | Telegram |

---

## 14. 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0 | 2026-02-25 | 初版 |
| v1.1 | 2026-02-26 | docs 新增章節 |
| v1.2 | 2026-02-26 | code 技術審查修訂 |

---

*文件維護：docs agent + code agent 審查*
*審查狀態：✅ 第 1 輪審查完成*
