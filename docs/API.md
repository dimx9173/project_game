# API 使用說明

## 基礎資訊

| 項目 | 值 |
|------|-----|
| Base URL | http://localhost:3000/api/v1 |
| 認證方式 | JWT Bearer Token |
| 格式 | JSON |

## 認證流程

### 1. 登入取得 Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### 2. 使用 Access Token

```bash
curl http://localhost:3000/api/v1/machines \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. 刷新 Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGc..."}'
```

## API 端點列表

### 認證 (Auth)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | /auth/login | 登入 |
| POST | /auth/logout | 登出 |
| GET | /auth/verify | 驗證 Token |
| POST | /auth/refresh | 刷新 Token |

### 機台管理 (Machines)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /machines | 取得機台列表 |
| POST | /machines | 新增機台 |
| GET | /machines/:id | 取得機台詳情 |
| PUT | /machines/:id | 更新機台 |
| DELETE | /machines/:id | 刪除機台 |
| POST | /machines/:id/command | 發送遠端指令 |

### 玩家管理 (Players)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /players | 取得玩家列表 |
| GET | /players/:id | 取得玩家詳情 |
| PUT | /players/:id/balance | 調整餘額 |

### 交易管理 (Transactions)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /transactions | 取得交易列表 |
| GET | /transactions/:id | 取得交易詳情 |
| POST | /transactions/:id/reverse | 沖銷交易 |

### 遊戲商管理 (Providers) - 標準版/旗艦版

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /providers | 取得遊戲商列表 |
| POST | /providers | 新增遊戲商 |
| GET | /providers/:id/balance | 取得餘額 |

### OTA 更新 (OTA) - 旗艦版

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /ota/versions | 取得版本列表 |
| POST | /ota/versions | 上傳新版本 |
| POST | /ota/versions/:id/publish | 發布版本 |

### 監控中心 (Monitor) - 旗艦版

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /monitor/system | 取得系統監控 |

### 錯帳管理 (Discrepancies) - 旗艦版

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /discrepancies | 取得錯帳列表 |
| POST | /discrepancies/:id/resolve | 處理錯帳 |

## 錯誤碼

| 錯誤碼 | 說明 | HTTP |
|--------|------|------|
| AUTH_001 | 登入失敗 | 401 |
| AUTH_002 | Token 過期 | 401 |
| AUTH_003 | 權限不足 | 403 |
| RES_001 | 資源不存在 | 404 |
| VAL_001 | 參數驗證失敗 | 400 |
| TXN_001 | 交易失敗 | 500 |

## 分頁參數

```bash
GET /api/v1/machines?page=1&pageSize=20
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
