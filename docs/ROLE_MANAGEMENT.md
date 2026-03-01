# 三層權限管理系統設計

## 1. 角色定義

### 1.1 角色階層

```
┌─────────────────────────────────────────────┐
│            Super Admin (超級管理員)           │
│         最高權限 • 系統全局管理                 │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────────┐     ┌───────────────────┐
│   Admin (管理員)   │     │   Agent (代理商)   │
│  營運管理 • 多帳號 │     │  機台管理 • 報表   │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          └─────────────┬───────────┘
                        ▼
            ┌───────────────────┐
            │ Operator (操作員)   │
            │  開分洗分 • 查詢   │
            └───────────────────┘
```

### 1.2 角色說明

| 角色 | 簡稱 | 數量限制 | 適用場景 |
|------|------|----------|----------|
| Super Admin | SA | 無限制 | 系統管理者、老闆 |
| Admin | AD | 無限制 | 營運主管、門市經理 |
| Agent | AG | 每 Admin 最多 50 | 區域代理商、加盟主 |
| Operator | OP | 每 Agent 最多 100 | 門市人員、櫃檯 |

## 2. 權限矩陣

### 2.1 功能權限

| 功能模組 | Super Admin | Admin | Agent | Operator |
|----------|-------------|-------|-------|----------|
| **系統管理** | | | | |
| 系統設定 | ✅ | ❌ | ❌ | ❌ |
| 使用者管理 | ✅ | ✅ | ❌ | ❌ |
| 角色設定 | ✅ | ❌ | ❌ | ❌ |
| 系統日誌 | ✅ | ✅ | ❌ | ❌ |
| **機台管理** | | | | |
| 新增機台 | ✅ | ✅ | ❌ | ❌ |
| 編輯機台 | ✅ | ✅ | ✅ | ❌ |
| 刪除機台 | ✅ | ✅ | ❌ | ❌ |
| 機台監控 | ✅ | ✅ | ✅ | ✅ |
| 遠端指令 | ✅ | ✅ | ✅ | ✅ |
| **玩家管理** | | | | |
| 玩家列表 | ✅ | ✅ | ✅ | ✅ |
| 調整餘額 | ✅ | ✅ | ❌ | ❌ |
| 停權玩家 | ✅ | ✅ | ❌ | ❌ |
| **交易管理** | | | | |
| 交易查詢 | ✅ | ✅ | ✅ | ✅ |
| 沖銷交易 | ✅ | ✅ | ❌ | ❌ |
| 對帳报表 | ✅ | ✅ | ✅ | ❌ |
| **遊戲商管理** | | | | |
| 新增遊戲商 | ✅ | ❌ | ❌ | ❌ |
| 遊戲商設定 | ✅ | ✅ | ❌ | ❌ |
| 餘額查詢 | ✅ | ✅ | ❌ | ❌ |
| **代理商管理** | | | | |
| 新增代理商 | ✅ | ✅ | ❌ | ❌ |
| 代理商設定 | ✅ | ✅ | ❌ | ❌ |
| **OTA 更新** | | | | |
| 上傳版本 | ✅ | ✅ | ❌ | ❌ |
| 派發更新 | ✅ | ✅ | ❌ | ❌ |
| **錯帳管理** | | | | |
| 查看錯帳 | ✅ | ✅ | ✅ | ❌ |
| 處理錯帳 | ✅ | ✅ | ❌ | ❌ |

### 2.2 資料範圍權限

| 角色 | 資料範圍 |
|------|----------|
| Super Admin | 全系統所有資料 |
| Admin | 所屬組織全部資料 |
| Agent | 所屬代理商旗下機台資料 |
| Operator | 所屬機台相關資料 |

## 3. 認證機制

### 3.1 認證方式

| 認證類型 | 說明 | 應用場景 |
|----------|------|----------|
| JWT Access Token | 15 分鐘過期 | API 請求 |
| JWT Refresh Token | 7 天過期 | 刷新 Access Token |
| PIN 碼 | 6 位數字 | 本地後台操作 |
| 密碼 | bcrypt 加密 | 登入認證 |

### 3.2 登入流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  使用者   │────▶│  驗證    │────▶│  核發   │
│  登入    │     │  帳密    │     │  Token  │
└──────────┘     └──────────┘     └──────────┘
                                      │
                   ┌──────────────────┘
                   ▼
            ┌──────────────┐
            │  權限驗證    │
            │  資料過濾    │
            └──────────────┘
```

### 3.3 登入限制

| 限制類型 | 閾值 | 處置 |
|----------|------|------|
| 密碼錯誤 | 5 次 | 鎖定 30 分鐘 |
| PIN 錯誤 | 5 次 | 鎖定 30 分鐘 |
| JWT 過期 | - | 自動刷新 |
| 帳號停用 | - | 禁止登入 |

## 4. 資料庫設計

### 4.1 資料表結構

```sql
-- 角色資料表
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    level INTEGER NOT NULL DEFAULT 0,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 使用者資料表
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    parent_id UUID REFERENCES system_users(id),
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    pin_hash VARCHAR(255),
    last_login_at TIMESTAMP,
    login_fail_count INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 代理商資料表 (擴展 Agent)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES system_users(id),
    code VARCHAR(50) UNIQUE,
    company_name VARCHAR(200),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    commission_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 權限日誌
CREATE TABLE permission_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES system_users(id),
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    result BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 預設角色資料

```sql
-- 插入預設角色
INSERT INTO roles (name, code, level, permissions, is_system) VALUES
('超級管理員', 'super_admin', 1, 
 '["system:*", "machine:*", "player:*", "transaction:*", "provider:*", "agent:*", "ota:*", "discrepancy:*"]', 
 TRUE),
('管理員', 'admin', 2, 
 '["machine:*", "player:read", "transaction:read", "provider:read", "agent:*", "ota:*"]', 
 TRUE),
('代理商', 'agent', 3, 
 '["machine:read", "machine:command", "player:read", "transaction:read"]', 
 TRUE),
('操作員', 'operator', 4, 
 '["machine:read", "machine:command", "player:read", "transaction:read"]', 
 TRUE);
```

## 5. API 端點

### 5.1 使用者管理

| 方法 | 路徑 | 權限 | 說明 |
|------|------|------|------|
| GET | /api/v1/users | Admin | 使用者列表 |
| POST | /api/v1/users | Super Admin | 新增使用者 |
| GET | /api/v1/users/:id | - | 使用者詳情 |
| PUT | /api/v1/users/:id | Admin | 更新使用者 |
| DELETE | /api/v1/users/:id | Super Admin | 刪除使用者 |
| PUT | /api/v1/users/:id/reset-password | Super Admin | 重設密碼 |
| PUT | /api/v1/users/:id/lock | Super Admin | 鎖定帳號 |

### 5.2 角色管理

| 方法 | 路徑 | 權限 | 說明 |
|------|------|------|------|
| GET | /api/v1/roles | Super Admin | 角色列表 |
| POST | /api/v1/roles | Super Admin | 新增角色 |
| PUT | /api/v1/roles/:id | Super Admin | 更新角色 |
| DELETE | /api/v1/roles/:id | Super Admin | 刪除角色 |

### 5.3 權限驗證

```javascript
// 權限檢查 Middleware
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;
    const role = user.role;
    
    // 檢查權限
    const hasPermission = role.permissions.includes(`${resource}:${action}`) ||
                         role.permissions.includes(`${resource}:*`);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_003', message: '權限不足' }
      });
    }
    
    next();
  };
};
```

## 6. 版本差異

| 功能 | MVP | 標準版 | 旗艦版 |
|------|-----|--------|--------|
| 角色數量 | 2 | 4 | 4 |
| 權限粒度 | 功能級 | 功能+資料 | 功能+資料 |
| 多帳號 | ❌ | ✅ | ✅ |
| 組織階層 | ❌ | ✅ | ✅ |
| 權限日誌 | ❌ | ✅ | ✅ |
| API 權限 | ❌ | ✅ | ✅ |

## 7. 安全考量

### 7.1 密碼安全

- 密碼強度：至少 8 字元，包含大小寫、數字、特殊符號
- 加密：bcrypt (cost 12)
- 傳輸：TLS 1.3

### 7.2 PIN 安全

- 長度：6 位數字
- 加密：bcrypt
- 錯誤鎖定：5 次錯誤，鎖定 30 分鐘

### 7.3 稽核

- 記錄所有權限變更
- 記錄敏感操作
- 保留 90 天日誌
