# 遊戲平台管理系統 - 系統設計文件（SD）

> **版本**：v1.1  
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
| 快取 | Redis | 7.x |
| 認證 | JWT | latest |
| 加密 | AES-256 + RSA | - |
| WebSocket | Socket.io | 4.x |

### 2.3 通訊架構

| 通訊方式 | 用途 |
|----------|------|
| RESTful API | 資料 CRUD |
| WebSocket | 即時狀態推送、心跳監控 |
| HTTPS | 安全傳輸 |
| Server-Sent Events | 單向即時更新 |

---

## 3. 資料庫設計

### 3.1 集中式資料庫（PostgreSQL）

#### 核心資料表

```sql
-- 機台表
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    machine_type VARCHAR(50), -- slot, fish, table
    provider_id UUID REFERENCES providers(id),
    status VARCHAR(20) DEFAULT 'offline', -- online, offline, maintenance
    heartbeat_interval INTEGER DEFAULT 60, -- 秒
    last_heartbeat TIMESTAMP,
    software_version VARCHAR(20),
    hardware_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 遊戲商表 (v6/3 新增)
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- rg, jdb, rt, dg
    api_endpoint VARCHAR(500),
    api_key_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 遊戲表
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    name VARCHAR(100) NOT NULL,
    game_code VARCHAR(50),
    category VARCHAR(50), -- slot, fish, table, lottery
    status VARCHAR(20) DEFAULT 'active',
    rtp DECIMAL(5,2), -- 理論回報率
    created_at TIMESTAMP DEFAULT NOW()
);

-- 玩家表
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    password_hash VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
    vip_level INTEGER DEFAULT 0,
    kyc_status VARCHAR(20) DEFAULT 'none', -- none, pending, verified
    created_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- 代理商表 (v6/3 新增)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    parent_agent_id UUID REFERENCES agents(id),
    commission_rate DECIMAL(5,2), -- 傭金比例
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
    type VARCHAR(20) NOT NULL, -- bet, payout, deposit, withdraw, transfer_in, transfer_out
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    external_tx_id VARCHAR(100), -- 第三方交易 ID
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, reversed
    error_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 系統使用者表
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- super_admin, admin, agent, operator
    agent_id UUID REFERENCES agents(id),
    permissions JSONB,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 同步日誌表
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID REFERENCES machines(id),
    direction VARCHAR(10), -- upload, download
    status VARCHAR(20), -- success, failed, partial
    records_count INTEGER,
    sync_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- OTA 版本表 (v6/4 新增)
CREATE TABLE ota_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) NOT NULL,
    release_notes TEXT,
    file_size BIGINT,
    file_hash VARCHAR(64),
    mandatory BOOLEAN DEFAULT false,
    target_machines UUID[],
    status VARCHAR(20) DEFAULT 'draft', -- draft, testing, released, deprecated
    created_at TIMESTAMP DEFAULT NOW(),
    released_at TIMESTAMP
);

-- 錯帳記錄表 (v6/4 新增)
CREATE TABLE discrepancy_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    machine_id UUID REFERENCES machines(id),
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20), -- missing_deposit, missing_withdrawal, payout_error
    status VARCHAR(20) DEFAULT 'pending', -- pending, investigating, resolved, voided
    resolution VARCHAR(20), -- reimbursement, write_off, pending
    resolved_by UUID REFERENCES system_users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- 稽核日誌表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_type VARCHAR(20), -- system_user, player, agent
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
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
    sync_attempts INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 同步佇列
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    status TEXT DEFAULT 'pending', -- pending, processing, failed, completed
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    last_attempt_at TEXT
);

-- 本機設定
CREATE TABLE local_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 機台狀態快取
CREATE TABLE machine_status (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
```

### 3.3 索引設計

```sql
-- 交易查詢優化
CREATE INDEX idx_transactions_player ON transactions(player_id);
CREATE INDEX idx_transactions_machine ON transactions(machine_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_provider ON transactions(provider_id);

-- 機台查詢優化
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_machines_location ON machines(location);

-- 稽核日誌查詢
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

---

## 4. API 設計

### 4.1 集中式後台 API

#### 認證

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| POST | /api/auth/login | 登入 | 公開 |
| POST | /api/auth/logout | 登出 | 已登入 |
| GET | /api/auth/verify | 驗證 Token | 已登入 |
| POST | /api/auth/refresh | 刷新 Token | 已登入 |

#### 機台管理

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/machines | 機台列表 | operator |
| GET | /api/machines/:id | 機台詳情 | operator |
| POST | /api/machines | 新增機台 | admin |
| PUT | /api/machines/:id | 更新機台 | admin |
| DELETE | /api/machines/:id | 刪除機台 | admin |
| POST | /api/machines/:id/command | 遠端指令 | operator |
| GET | /api/machines/:id/heartbeat | 心跳歷史 | operator |

#### 遊戲商管理 (v6/3)

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/providers | 遊戲商列表 | operator |
| GET | /api/providers/:id | 遊戲商詳情 | operator |
| POST | /api/providers | 新增遊戲商 | admin |
| PUT | /api/providers/:id | 更新遊戲商 | admin |
| GET | /api/providers/:id/balance | 餘額查詢 | operator |
| POST | /api/providers/:id/sync | 強制同步 | operator |

#### 遊戲管理

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/games | 遊戲列表 | operator |
| POST | /api/games | 新增遊戲 | admin |
| PUT | /api/games/:id | 更新遊戲 | admin |
| POST | /api/games/:id/test | 測試連線 | admin |

#### 玩家管理

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/players | 玩家列表 | operator |
| GET | /api/players/:id | 玩家詳情 | operator |
| PUT | /api/players/:id/balance | 調整餘額 | admin |
| PUT | /api/players/:id/status | 調整狀態 | admin |
| POST | /api/players/:id/login-history | 登入歷史 | operator |

#### 代理商管理 (v6/3)

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/agents | 代理商列表 | agent |
| POST | /api/agents | 新增代理商 | admin |
| PUT | /api/agents/:id | 更新代理商 | admin |
| GET | /api/agents/:id/players | 下屬玩家 | agent |
| GET | /api/agents/:id/commissions | 傭金紀錄 | agent |

#### 交易管理

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/transactions | 交易列表 | operator |
| GET | /api/transactions/:id | 交易詳情 | operator |
| POST | /api/transactions | 建立交易 | operator |
| POST | /api/transactions/:id/reverse | 沖銷交易 | admin |

#### 第三方錢包轉帳 (v6/3)

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| POST | /api/wallet/deposit | 儲值轉入 | operator |
| POST | /api/wallet/withdraw | 兌換轉出 | operator |
| GET | /api/wallet/balance | 錢包餘額 | operator |
| GET | /api/wallet/history | 轉帳紀錄 | operator |

#### OTA 遠端更新 (v6/4)

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/ota/versions | 版本列表 | operator |
| POST | /api/ota/versions | 上傳新版本 | admin |
| POST | /api/ota/deploy | 派發版本 | admin |
| GET | /api/ota/status | 派發進度 | operator |

#### 錯帳管理 (v6/4)

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| GET | /api/discrepancies | 錯帳列表 | operator |
| GET | /api/discrepancies/:id | 錯帳詳情 | operator |
| POST | /api/discrepancies/:id/resolve | 處理錯帳 | admin |
| POST | /api/discrepancies/:id/void | 沖銷錯帳 | admin |

#### 同步

| Method | Endpoint | 說明 | 權限 |
|--------|----------|------|------|
| POST | /api/sync/upload | 上傳本地資料 | 機台 |
| GET | /api/sync/download | 下載中央資料 | 機台 |
| GET | /api/sync/status | 同步狀態 | operator |
| POST | /api/sync/force | 強制同步 | admin |

### 4.2 本地後台 API

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | /api/local/login | PIN 登入 |
| GET | /api/local/machine | 機台資訊 |
| POST | /api/local/cash-in | 開分 |
| POST | /api/local/cash-out | 洗分 |
| GET | /api/local/transactions | 本地交易 |
| POST | /api/local/sync | 觸發同步 |
| GET | /api/local/settings | 取得設定 |
| PUT | /api/local/settings | 更新設定 |

### 4.3 API 錯誤碼定義

| 錯誤碼 | 說明 | HTTP 狀態 |
|--------|------|------------|
| AUTH_001 | 登入失敗 | 401 |
| AUTH_002 | Token 過期 | 401 |
| AUTH_003 | 權限不足 | 403 |
| AUTH_004 | 帳號已停用 | 403 |
| RES_001 | 資源不存在 | 404 |
| RES_002 | 資源已存在 | 409 |
| VAL_001 | 參數驗證失敗 | 400 |
| VAL_002 | 餘額不足 | 400 |
| TXN_001 | 交易失敗 | 500 |
| TXN_002 | 交易處理中 | 202 |
| TXN_003 | 交易已沖銷 | 400 |
| SYNC_001 | 同步失敗 | 500 |
| SYNC_002 | 資料衝突 | 409 |
| EXT_001 | 第三方 API 錯誤 | 502 |
| EXT_002 | 第三方逾時 | 504 |

---

## 5. 離線同步機制

### 5.1 斷線重試佇列

```
1. 本地交易產生
2. 寫入 SQLite + sync_queue
3. 背景 Worker 每 3 分鐘檢查
4. 嘗試上傳到中央
5. 成功 → 刪除 queue + 更新狀態
6. 失敗 → retry_count++
7. retry_count > 5 → 標記失敗 + 告警
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
    │                          │
    │──── 確認完成 ────────────>│
    │<─── 同步完成 ────────────│
```

### 5.3 衝突解決策略

| 衝突類型 | 解決方式 |
|----------|----------|
| 餘額衝突 | 以中央為準，本地重置 |
| 重複交易 | 中央檢查 UUID 去重 |
| 版本衝突 | 中央優先，覆蓋本地 |

---

## 6. 安全性設計

### 6.1 認證與授權

- JWT Token 認證 (Access Token + Refresh Token)
- RBAC 角色權限（Super Admin / Admin / Agent / Operator）
- PIN 碼保護本地操作 (6 位數字)
- API Key 保護遊戲商串接

### 6.2 角色權限矩陣

| 功能 | Super Admin | Admin | Agent | Operator |
|------|-------------|-------|-------|----------|
| 系統設定 | ✅ | ❌ | ❌ | ❌ |
| 新增機台 | ✅ | ✅ | ❌ | ❌ |
| 調整餘額 | ✅ | ✅ | ❌ | ❌ |
| 新增遊戲商 | ✅ | ✅ | ❌ | ❌ |
| 查看交易 | ✅ | ✅ | ✅ | ✅ |
| 開分/洗分 | ✅ | ✅ | ✅ | ✅ |
| 查看報表 | ✅ | ✅ | ✅ | ✅ |
| 管理代理商 | ✅ | ✅ | ❌ | ❌ |

### 6.3 資料加密

- 敏感資料：AES-256-GCM 加密儲存
- 傳輸：TLS 1.3
- 交易：HMAC-SHA256 驗證
- 密碼：bcrypt 雜湊

### 6.4 稽核日誌

記錄所有重要操作：
- 登入/登出
- 餘額調整
- 權限變更
- 交易沖銷
- 系統設定變更

---

## 7. 第三方遊戲商串接 (v6/3)

### 7.1 支援遊戲商

| 遊戲商 | 代碼 | 遊戲類型 |
|--------|------|----------|
| RG 電子 | rg | 老虎機、捕魚 |
| JDB 電子 | jdb | 老虎機、棋牌 |
| RT 電子 | rt | 老虎機 |
| DG 電子 | dg | 真人視訊 |

### 7.2 串接流程

```
1. 新增遊戲商設定
   ├── API Endpoint
   ├── API Key
   └── 商戶 ID

2. 測試連線
   ├── API /health
   └── 餘額查詢

3. 正式上線
   ├── 遊戲開通
   ├── 錢包建立
   └── 交易對接
```

### 7.3 錢包轉帳流程

```
玩家 ──▶ 中央錢包
          │
          ▼
    ── 第三方 API ──
    │   (轉入遊戲)
    │
    ▼
遊戲商錢包 ──▶ 遊戲中
              │
              ▼
         ── 第三方 API ──
         │   (轉出中央)
         │
         ▼
    中央錢包 ──▶ 玩家
```

---

## 8. OTA 遠端更新 (v6/4)

### 8.1 更新流程

```
1. 上傳新版本
   ├── 檔案上傳
   ├── MD5 驗證
   └── 版本資訊

2. 測試派發
   ├── 選擇 2-3 台機台
   ├── 觀察 24 小時
   └── 確認無問題

3. 正式派發
   ├── 全部派發 / 分批派發
   ├── 即時 / 預約
   └── 強制更新 / 選擇更新

4. 監控進度
   ├── 即時進度
   ├── 失敗重試
   └── 異常告警
```

### 8.2 版本相容性

- 只支援從舊版本升級
- 重大版本需強制更新
- 支援差異更新 (Delta)

---

## 9. 硬體監控 (v6/4)

### 9.1 監控項目

| 項目 | 閾值 | 告警 |
|------|------|------|
| CPU 負載 | > 80% | 警告 |
| 記憶體 | > 90% | 警告 |
| 硬碟空間 | < 10% | 警告 |
| 網路延遲 | > 100ms | 警告 |
| 溫度 | > 70°C | 嚴重 |

### 9.2 心跳機制

- 機台每分鐘發送心跳
- 超過 3 分鐘無心跳 → 離線
- 離線告警通知管理員

---

## 10. 錯帳對帳管理 (v6/4)

### 10.1 錯帳類型

| 類型 | 說明 |
|------|------|
| missing_deposit | 轉帳未到帳 |
| missing_withdrawal | 轉出未確認 |
| payout_error | 派彩錯誤 |
| system_error | 系統錯誤 |

### 10.2 處理流程

```
1. 偵測錯帳
   ├── 自動偵測
   └── 人工回報

2. 調查原因
   ├── 檢查日誌
   └── 聯繫遊戲商

3. 處理方式
   ├── 補發點數
   ├── 退款
   └── 沖銷

4. 產生憑證
   ├── PDF 憑證
   └── 寄送財務
```

### 10.3 錢包對帳

- 每日自動對帳
- 發現差異立即告警
- 支援人工對帳

---

## 11. 部署架構

### 11.1 集中式後台

```
                    ┌─────────────┐
                    │    CDN     │
                    │ (靜態資源) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx    │
                    │  (Reverse  │
                    │   Proxy)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │  Node.js │  │  Node.js │  │  Node.js │
       │ Backend 1│  │ Backend 2│  │ Backend N│
       └────┬─────┘  └────┬─────┘  └────┬─────┘
            │             │             │
            └─────────────┼─────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
  ┌────────────┐   ┌────────────┐   ┌────────────┐
  │ PostgreSQL │   │   Redis    │   │  Game APIs │
  │  Primary   │   │   Cache    │   │  (RG/JDB)  │
  └────────────┘   └────────────┘   └────────────┘
         │
         ▼
  ┌────────────┐
  │ PostgreSQL │
  │   Replica  │
  └────────────┘
```

### 11.2 本地後台

```
┌────────────────────────────────────────┐
│            單機設備 (X86/ARM)           │
│  ┌──────────┐   ┌──────────┐          │
│  │  React   │   │ Express  │          │
│  │  Frontend│   │  Backend │          │
│  └──────────┘   └────┬─────┘          │
│                       │                 │
│                 ┌─────▼─────┐           │
│                 │  SQLite   │           │
│                 │   資料庫  │           │
│                 └───────────┘           │
└────────────────────────────────────────┘
```

### 11.3 容器化部署 (可選)

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    image: game-platform/backend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

---

## 12. 效能設計

### 12.1 效能目標

| 項目 | 目標 |
|------|------|
| API 響應時間 (P95) | < 200ms |
| 資料庫查詢 (P95) | < 500ms |
| WebSocket 延遲 | < 100ms |
| 系統可用性 | ≥ 99.5% |
| 支援機台數 | 1000+ |
| 支援同時在線玩家 | 500+ |

### 12.2 優化策略

| 策略 | 實作 |
|------|------|
| 資料庫索引 | 針對常用查詢建立複合索引 |
| Redis 快取 | 熱門資料快取 5 分鐘 |
| CDN | 靜態資源快取 |
| 非同步處理 | 交易紀錄寫入隊列 |
| 連線池 | 資料庫連線池管理 |

---

## 13. 監控設計

### 13.1 監控項目

| 類別 | 項目 |
|------|------|
| 機台監控 | 心跳、狀態、連線 |
| API 監控 | 響應時間、錯誤率 |
| 資料庫 | 連線池、查詢效能 |
| 同步 | 成功率、延遲 |
| 資源 | CPU、記憶體、磁碟 |

### 13.2 告警規則

| 條件 | 嚴重度 | 動作 |
|------|--------|------|
| 機台離線 > 15 分鐘 | 警告 | Telegram |
| 機台離線 > 60 分鐘 | 嚴重 | Telegram + SMS |
| API 錯誤率 > 5% | 警告 | Telegram |
| API 錯誤率 > 20% | 嚴重 | Telegram + 電話 |
| 同步失敗 > 3 次 | 警告 | Telegram |
| 硬碟空間 < 10% | 警告 | Telegram |
| 錯帳金額 > $1000 | 警告 | Telegram + Email |

---

## 14. 錯誤處理機制

### 14.1 全域錯誤處理

```javascript
// 錯誤分類
class AppError extends Error {
  constructor(code, message, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 錯誤處理中介軟體
app.use((err, req, res, next) => {
  logger.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message
    });
  }
  
  // 未預期錯誤
  return res.status(500).json({
    code: 'SYS_001',
    message: '系統錯誤'
  });
});
```

### 14.2 交易錯誤處理

```
交易請求
    │
    ▼
驗證參數 ──▶ 錯誤 ──▶ 返回錯誤碼
    │
    ▼
檢查餘額 ──▶ 不足 ──▶ VAL_002
    │
    ▼
開啟交易 ──▶ 失敗 ──▶ 重試 3 次
    │
    ▼
記錄結果 ──▶ 錯誤 ──▶ 標記pending + 告警
    │
    ▼
返回結果
```

---

## 15. 資料遷移策略

### 15.1 升級遷移

```sql
-- v6/2 → v6/3 遷移腳本
ALTER TABLE system_users ADD COLUMN agent_id UUID;
ALTER TABLE system_users ADD COLUMN permissions JSONB;
ALTER TABLE machines ADD COLUMN provider_id UUID;
CREATE TABLE providers (...);
CREATE TABLE agents (...);
```

### 15.2 資料備份

| 類型 | 頻率 | 保留期 |
|------|------|--------|
| 完整備份 | 每日 | 30 天 |
| 增量備份 | 每小時 | 7 天 |
| 交易備份 | 即時 | 1 年 |
| 設定備份 | 每週 | 90 天 |

---

## 16. 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0 | 2026-02-25 | 初版系統設計 |
| v1.1 | 2026-02-26 | 新增版本差異、API 錯誤碼、第三方串接、OTA、硬體監控、錯帳管理章節 |

---

*文件維護：docs agent (PM/SA 文秘專員)*
*審查狀態：待 code agent 技術審查*
