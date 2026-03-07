# [C74] OTA 版本更新詳細流程

**功能代碼**: [C74]  
**所屬模組**: [M08]版本更新  
**最後更新**: 2026-03-07  
**優先級**: 🔴 高

---

## 📋 概述

OTA (Over-The-Air) 版本更新是集中式後台對本地機台進行遠端軟體更新的核心功能。本流程說明從版本比對到完成更新的完整流程。

---

## 🔄 完整流程圖

### 版本更新主流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 管理員上傳版本包                                        │
│     - 選擇版本類型 (正式版/測試版)                           │
│     - 上傳版本包 (.zip/.tar.gz)                             │
│     - 填寫版本說明                                           │
│     ↓                                                       │
│  2. 系統驗證版本包                                          │
│     - 檢查檔案完整性 (SHA256)                                │
│     - 檢查版本號格式 (SemVer)                                │
│     - 檢查版本衝突                                           │
│     ↓                                                       │
│  3. 建立版本記錄                                            │
│     - 記錄版本資訊到資料庫                                   │
│     - 狀態：待發布                                           │
│     ↓                                                       │
│  4. 管理員選擇目標機台                                      │
│     - 單台機台 / 多台機台 / 全部機台                         │
│     - 設定更新時間 (立即 / 定時)                             │
│     ↓                                                       │
│  5. 下發更新任務                                            │
│     - 建立更新任務記錄                                       │
│     - 狀態：待下載                                           │
│     - 推播通知目標機台                                       │
│     ↓                                                       │
│  6. 機台下載版本包                                          │
│     - GET /api/ota/packages/{version}                       │
│     - 支援斷點續傳                                           │
│     - 顯示下載進度                                           │
│     ↓                                                       │
│  7. 驗證版本包                                              │
│     - 檢查 SHA256 雜湊值                                       │
│     - 檢查簽章                                               │
│     - 驗證失敗則重新下載                                     │
│     ↓                                                       │
│  8. 安裝版本包                                              │
│     - 停止相關服務                                           │
│     - 備份當前版本                                           │
│     - 解壓縮新版本                                           │
│     - 執行遷移腳本 (如有)                                    │
│     - 啟動服務                                               │
│     ↓                                                       │
│  9. 驗證安裝結果                                            │
│     - 檢查服務狀態                                           │
│     - 執行健康檢查                                           │
│     - 回報安裝結果到中央                                     │
│     ↓                                                       │
│  10. 更新任務完成                                           │
│      - 更新任務狀態：已完成                                  │
│      - 記錄安裝時間                                          │
│      - 可選：刪除舊版本                                      │
└─────────────────────────────────────────────────────────────┘
```

### 版本比對邏輯

```
┌─────────────────────────────────────────────────────────────┐
│  機台連線到中央                                             │
│     ↓                                                       │
│  發送當前版本資訊                                           │
│  GET /api/ota/check-update                                  │
│  { "currentVersion": "2.5.1", "machineId": "M001" }         │
│     ↓                                                       │
│  中央比對版本                                               │
│  - 查詢最新正式版版本號                                      │
│  - 比對 SemVer (Major.Minor.Patch)                          │
│  - 檢查強制更新標誌                                          │
│     ↓                                                       │
│  回傳比對結果                                               │
│  {                                                          │
│    "updateAvailable": true,                                 │
│    "latestVersion": "2.6.0",                                │
│    "forceUpdate": false,                                    │
│    "releaseNotes": "...",                                   │
│    "packageSize": 52428800                                  │
│  }                                                          │
│     ↓                                                       │
│  機台判斷是否需要更新                                        │
│  - 如 forceUpdate = true: 強制更新                           │
│  - 如 Major 版本不同：建議更新                                │
│  - 如 Minor/Patch 版本不同：可選更新                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ 異常處理

### 1. 下載失敗

**情境**: 網路不穩定導致下載中斷

**處理流程**:
```
1. 下載中斷
   ↓
2. 檢查已下載部分
   ↓
3. 支援斷點續傳:
   - 記錄已下載位元組數
   - 發送 Range: bytes=已下載大小-
   - 繼續下載剩餘部分
   ↓
4. 重試機制:
   - 第 1 次重試：立即
   - 第 2 次重試：間隔 30 秒
   - 第 3 次重試：間隔 60 秒
   ↓
5. 3 次重試均失敗:
   - 任務狀態改為「下載失敗」
   - 通知管理員
   - 等待下次重試
```

### 2. 驗證失敗

**情境**: SHA256 雜湊值不匹配

**處理流程**:
```
1. 計算下載檔案的 SHA256
   ↓
2. 比對中央記錄的 SHA256
   ↓
3. 不匹配:
   - 刪除已下載檔案
   - 記錄驗證失敗事件
   - 重新下載
   ↓
4. 連續 3 次驗證失敗:
   - 暫停更新任務
   - 通知管理員檢查版本包
   - 可能為中央版本包損壞
```

### 3. 安裝失敗

**情境**: 安裝過程中發生錯誤

**處理流程**:
```
1. 安裝腳本執行失敗
   ↓
2. 自動回滾機制:
   - 恢復備份的舊版本
   - 重啟舊版本服務
   - 記錄失敗原因
   ↓
3. 回報安裝失敗:
   - POST /api/ota/report-failure
   - 包含錯誤訊息與日誌
   ↓
4. 任務狀態改為「安裝失敗」
   ↓
5. 通知管理員介入處理
```

### 4. 安裝後驗證失敗

**情境**: 新版本服務無法正常啟動

**處理流程**:
```
1. 健康檢查失敗
   ↓
2. 自動回滾:
   - 停止新版本服務
   - 恢復舊版本
   - 重啟舊版本服務
   ↓
3. 記錄驗證失敗:
   - 健康檢查日誌
   - 服務啟動日誌
   ↓
4. 通知管理員:
   - 新版本存在相容性問題
   - 需要進一步測試
```

### 5. 超時處理

**情境**: 下載或安裝超時

**處理流程**:
```
下載超時 (30 分鐘):
1. 取消當前下載
2. 記錄超時事件
3. 允許重新開始下載

安裝超時 (10 分鐘):
1. 終止安裝腳本
2. 執行回滾
3. 記錄超時事件
4. 通知管理員
```

---

## 🔌 API 調用

### API 清單

| 順序 | API | 方法 | 說明 |
|------|-----|------|------|
| 1 | `/api/ota/packages` | POST | 上傳版本包 |
| 2 | `/api/ota/packages/{version}` | GET | 下載版本包 |
| 3 | `/api/ota/check-update` | GET | 檢查更新 |
| 4 | `/api/ota/tasks` | POST | 建立更新任務 |
| 5 | `/api/ota/tasks/{id}` | GET | 查詢任務狀態 |
| 6 | `/api/ota/report-progress` | POST | 回報下載進度 |
| 7 | `/api/ota/report-result` | POST | 回報安裝結果 |

### API 詳細說明

#### 上傳版本包

```http
POST /api/ota/packages
Content-Type: multipart/form-data

FormData:
- file: [版本包檔案]
- version: "2.6.0"
- releaseType: "stable"  // stable, beta
- releaseNotes: "版本說明..."
- forceUpdate: false

Response:
{
  "success": true,
  "packageId": "PKG-20260307-001",
  "version": "2.6.0",
  "sha256": "abc123...",
  "size": 52428800
}
```

#### 檢查更新

```http
GET /api/ota/check-update?machineId=M001&currentVersion=2.5.1

Response:
{
  "updateAvailable": true,
  "latestVersion": "2.6.0",
  "forceUpdate": false,
  "releaseNotes": "新增功能...",
  "packageSize": 52428800,
  "downloadUrl": "/api/ota/packages/2.6.0"
}
```

#### 建立更新任務

```http
POST /api/ota/tasks
Content-Type: application/json

{
  "version": "2.6.0",
  "targetMachines": ["M001", "M002"],
  "scheduledTime": "2026-03-07T02:00:00Z",
  "forceUpdate": false
}

Response:
{
  "success": true,
  "taskId": "TASK-20260307-001",
  "status": "PENDING"
}
```

---

## 💾 資料庫操作

### 涉及的資料表

| 資料表 | 操作 | 說明 |
|--------|------|------|
| `ota_packages` | INSERT | 記錄版本包資訊 |
| `ota_tasks` | INSERT/UPDATE | 記錄更新任務 |
| `ota_task_machines` | INSERT/UPDATE | 記錄每台機器的更新狀態 |
| `operation_logs` | INSERT | 記錄操作日誌 |

### 資料表結構

#### ota_packages

```sql
CREATE TABLE ota_packages (
    id VARCHAR(50) PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE,
    release_type VARCHAR(20) NOT NULL, -- 'stable', 'beta'
    release_notes TEXT,
    package_path VARCHAR(500) NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    size BIGINT NOT NULL,
    force_update BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'PUBLISHED', 'ARCHIVED'
    created_at TIMESTAMP NOT NULL,
    published_at TIMESTAMP,
    created_by VARCHAR(50) NOT NULL
);
```

#### ota_tasks

```sql
CREATE TABLE ota_tasks (
    id VARCHAR(50) PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- 'SINGLE', 'MULTI', 'ALL'
    scheduled_time TIMESTAMP,
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    created_at TIMESTAMP NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by VARCHAR(50) NOT NULL
);
```

#### ota_task_machines

```sql
CREATE TABLE ota_task_machines (
    id VARCHAR(50) PRIMARY KEY,
    task_id VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'DOWNLOADING', 'INSTALLING', 'COMPLETED', 'FAILED'
    download_progress INT DEFAULT 0, -- 0-100
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES ota_tasks(id)
);
```

---

## 📊 版本號規範

### SemVer 格式

```
Major.Minor.Patch
  ↓     ↓      ↓
  │     │      └─ 修補版本 (Bug fixes)
  │     └─ 次要版本 (New features, backward compatible)
  └─ 主要版本 (Breaking changes)
```

### 版本範例

| 版本號 | 說明 |
|--------|------|
| 2.5.1 | 正式版，第 2 代第 5 版第 1 次修補 |
| 2.6.0 | 正式版，新增功能 |
| 3.0.0 | 重大更新，可能不相容 |
| 2.6.0-beta.1 | 測試版 |

### 版本比對規則

```
比對順序：Major → Minor → Patch

2.5.1 < 2.5.2  (Patch 不同)
2.5.2 < 2.6.0  (Minor 不同)
2.6.0 < 3.0.0  (Major 不同)
```

---

## 📝 相關文件

- `[C73]版本列表管理.md` - 版本管理
- `[C75]更新進度監控.md` - 進度監控
- `[L34]同步狀態檢視.md` - 同步機制

---

**文件版本**: 1.0  
**建立日期**: 2026-03-07  
**最後更新**: 2026-03-07
