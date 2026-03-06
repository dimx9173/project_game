# 機台 Tag 管理系統設計

## 📋 概述

本文檔說明機台 Tag 管理系統的設計，用於分類與管理機台。

---

## 🏷️ 系統設計

### 資料表結構

#### 1. Tag 資料表（tags）

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,      -- Tag 名稱
    color VARCHAR(7) DEFAULT '#10b981',     -- Tag 顏色（Hex）
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_tags_name ON tags(name);
```

#### 2. 機台-Tag 關聯表（machine_tags）

```sql
CREATE TABLE machine_tags (
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (machine_id, tag_id)
);

-- 索引
CREATE INDEX idx_machine_tags_machine ON machine_tags(machine_id);
CREATE INDEX idx_machine_tags_tag ON machine_tags(tag_id);
```

#### 3. 機台表更新（machines）

```sql
-- 機台表已存在，透過關聯表維護 tag 關係
-- 前端顯示時 join 取得 tag 列表
```

---

## 📊 ERD 關係圖

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    tags     │       │  machine_tags   │       │   machines  │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◀──────┤ tag_id (FK)     │       │ id (PK)     │
│ name        │       │ machine_id (FK) │──────▶│ name        │
│ color       │       │ assigned_at     │       │ instanceId  │
│ created_at  │       └─────────────────┘       │ ...         │
└─────────────┘                                 └─────────────┘
```

---

## 🔄 業務邏輯

### 1. 新增 Tag 到機台

```
管理員選擇機台
    ↓
點擊「編輯 Tag」
    ↓
輸入 Tag 名稱（或從現有 Tag 選擇）
    ↓
    ├─ Tag 已存在 → 直接關聯
    └─ Tag 不存在 → 新增到 tags 表，再關聯
    ↓
檢查機台 Tag 數量（最多 5 個）
    ↓
寫入 machine_tags 關聯表
    ↓
同步至機台顯示
```

### 2. 從機台移除 Tag

```
管理員選擇機台
    ↓
點擊「編輯 Tag」
    ↓
移除指定 Tag
    ↓
刪除 machine_tags 關聯記錄
    ↓
檢查該 Tag 是否還有其他機台使用
    ↓
    ├─ 有其他機台使用 → 保留 Tag
    └─ 無機台使用 → 從 tags 表刪除
```

### 3. 自動清理機制

```sql
-- 定期執行（或由應用程式處理）
-- 刪除沒有任何機台使用的 Tag
DELETE FROM tags 
WHERE id NOT IN (
    SELECT DISTINCT tag_id FROM machine_tags
);
```

---

## 📱 機台顯示效果

### 機台列表顯示

```
┌─────────────────────────────────────────────────────────────┐
│  機台列表                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 旗艦店 A-01                                          │   │
│  │ MAC: AA:BB:CC:DD:EE:FF                              │   │
│  │ 🏷️ 旗艦店 🔥 熱門 🎯 VIP 客戶 📍 一樓大廳           │   │
│  │                                                     │   │
│  │ 版本: v2.5.1    狀態: ✅ 線上                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 標準店 B-03                                          │   │
│  │ MAC: BB:CC:DD:EE:FF:11                              │   │
│  │ 🏷️ 標準店 📍 地下室                                │   │
│  │                                                     │   │
│  │ 版本: v2.5.0 ⚠️ 可更新    狀態: ✅ 線上              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 本地機台顯示（機台端）

```
┌─────────────────────────────────────────────────────────────┐
│                    本地後台                                  │
│                                                             │
│  旗艦店 A-01                                                │
│  🏷️ 旗艦店 🔥 熱門 🎯 VIP 客戶 📍 一樓大廳                 │
│                                                             │
│  [儀表板] [遊戲] [開分] [同步] [設定]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Tag 樣式規範

### 顏色配置

| Tag 類型 | 預設顏色 | 用途 |
|---------|---------|------|
| 門店類型 | `#8b5cf6` (紫) | 旗艦店、標準店 |
| 營運狀態 | `#10b981` (綠) | 熱門、新機台 |
| 客戶類型 | `#f59e0b` (橙) | VIP 客戶、新手區 |
| 位置區域 | `#3b82f6` (藍) | 一樓大廳、地下室 |
| 維護標記 | `#ef4444` (紅) | 待維護、測試中 |

### Tag UI 元件

```html
<!-- Tag 顯示 -->
<span class="px-2 py-1 rounded-full text-xs font-medium" 
      style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.3);">
    旗艦店
</span>
```

---

## 📡 API 設計

### 1. 取得所有 Tags

```http
GET /tags
Authorization: Bearer {token}

Response:
{
  "tags": [
    { "id": "tag-001", "name": "旗艦店", "color": "#8b5cf6", "machineCount": 5 },
    { "id": "tag-002", "name": "熱門", "color": "#10b981", "machineCount": 12 },
    { "id": "tag-003", "name": "VIP 客戶", "color": "#f59e0b", "machineCount": 3 }
  ]
}
```

### 2. 取得機台的 Tags

```http
GET /machines/{id}/tags
Authorization: Bearer {token}

Response:
{
  "machineId": "550e8400-...",
  "tags": [
    { "id": "tag-001", "name": "旗艦店", "color": "#8b5cf6" },
    { "id": "tag-002", "name": "熱門", "color": "#10b981" }
  ],
  "total": 2,
  "maxAllowed": 5
}
```

### 3. 設定機台的 Tags

```http
PUT /machines/{id}/tags
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "tagNames": ["旗艦店", "熱門", "VIP 客戶"]  // 最多 5 個
}

Response:
{
  "success": true,
  "machineId": "550e8400-...",
  "tags": [
    { "id": "tag-001", "name": "旗艦店", "color": "#8b5cf6" },
    { "id": "tag-002", "name": "熱門", "color": "#10b981" },
    { "id": "tag-003", "name": "VIP 客戶", "color": "#f59e0b" }
  ]
}
```

**業務邏輯**:
- 若 Tag 名稱不存在，自動建立新 Tag
- 若 Tag 數量超過 5 個，回傳錯誤
- 同步更新機台顯示

### 4. 移除機台的 Tag

```http
DELETE /machines/{id}/tags/{tagId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Tag 已移除"
}
```

**業務邏輯**:
- 刪除 machine_tags 關聯
- 檢查該 Tag 是否還有其他機台使用
- 若無機台使用，自動刪除 tags 表記錄

### 5. 建立新 Tag

```http
POST /tags
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "新區域",
  "color": "#3b82f6"  // 可選，預設隨機或指定
}

Response:
{
  "id": "tag-004",
  "name": "新區域",
  "color": "#3b82f6",
  "machineCount": 0
}
```

---

## 📊 資料庫 Triggers（選用）

### 自動清理無用 Tag

```sql
-- 建立 Trigger：當 machine_tags 記錄被刪除時
CREATE OR REPLACE FUNCTION cleanup_unused_tags()
RETURNS TRIGGER AS $$
BEGIN
    -- 刪除沒有任何機台使用的 Tag
    DELETE FROM tags 
    WHERE id = OLD.tag_id 
    AND NOT EXISTS (
        SELECT 1 FROM machine_tags WHERE tag_id = OLD.tag_id
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_unused_tags
AFTER DELETE ON machine_tags
FOR EACH ROW
EXECUTE FUNCTION cleanup_unused_tags();
```

---

## 🖥️ UI 設計

### Tag 編輯介面

```
┌─────────────────────────────────────────────────────────────┐
│  編輯機台 Tag                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  機台：旗艦店 A-01                                          │
│                                                             │
│  目前 Tag (2/5)：                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏷️ 旗艦店  [x]  │  🏷️ 熱門  [x]  │  [+ 新增 Tag]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  可選 Tag：                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  VIP 客戶  │  一樓大廳  │  地下室  │  待維護      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  或輸入新 Tag：                                             │
│  [ _________________ ] [選擇顏色 ▼]                         │
│                                                             │
│                    [ 儲存 ]  [ 取消 ]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 相關文件

- `API_openapi.yaml` - API 規格
- `mockup_machine_tags.html` - Tag 管理頁面（新增）

---

*文件建立時間：2026-03-06*  
*適用版本：遊戲平台 V8 旗艦版*
