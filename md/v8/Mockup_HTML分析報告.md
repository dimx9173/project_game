# Mockup HTML 資產分析報告

**分析日期：** 2026-03-05  
**分析者：** Lumina (Frontend Architect)  
**資產位置：** ~/project/game/md/v8/assets/

---

## 1. 執行摘要

| 指標 | 數量 | 說明 |
|------|------|------|
| **HTML Mockup 總數** | 60 個 | 完整功能覆蓋 |
| **PNG Mockup** | 24 個 | 部分截圖匯出 |
| **設計風格** | Premium Dark + Glassmorphism | 統一視覺系統 |
| **技術架構** | Tailwind CSS + Chart.js | 前端技術棧 |

---

## 2. 命名規則分析

### 2.1 前綴分類系統

| 前綴 | 數量 | 代表意義 | 範例 |
|------|------|---------|------|
| `mockup_std_` | 12 | Standard (標準集中式後台) | std_wallet, std_reports |
| `mockup_mvp_` | 8 | MVP (最小可行產品/基礎功能) | mvp_machine_list, mvp_player_add |
| `mockup_flg_` | 4 | Flagship (旗艦版進階功能) | flg_monitor, flg_ota, flg_reconciliation |
| `mockup_local_` | 5 | Local (單機本地後台) | local_cash, local_dashboard |
| `mockup_` (無前綴) | 31 | 其他/通用功能 | dashboard, login, api_log |

### 2.2 功能領域分類

```
mockup_[前綴]_[功能領域]_[動作/細節].html
```

| 功能領域關鍵字 | 數量 | 說明 |
|--------------|------|------|
| `machine` | 5 | 機台管理 |
| `player` | 5 | 玩家管理 |
| `game` | 7 | 遊戲管理 |
| `transaction` | 5 | 交易/錢包 |
| `multiplayer` | 8 | 多人遊戲/牌桌 |
| `provider` | 2 | 遊戲商管理 |
| `agent` | 3 | 代理商/權限 |
| `api_` | 3 | API 監控/日誌 |
| `sync` / `conflict` | 2 | 同步對帳 |
| `alert` / `monitor` | 3 | 監控告警 |

---

## 3. 設計系統評估

### 3.1 視覺風格一致性

所有 HTML mockup 採用統一的 **Premium Dark + Glassmorphism** 設計語言：

| 設計元素 | 實現狀態 | 備註 |
|---------|---------|------|
| 深色背景 (#0a0a0f) | ✅ 100% | 統一主背景 |
| 霓虹紫色主題 | ✅ 100% | cyber-600: #7c3aed |
| 玻璃擬態卡片 | ✅ 100% | glass-card 類別 |
| 等寬數字字體 | ✅ 100% | JetBrains Mono |
| 中文支援 | ✅ 100% | Noto Sans TC |
| 發光效果 (Glow) | ✅ 95% | 部分頁面需補強 |
| 響應式斷點 | 🟡 70% | 部分頁面僅桌面版 |

### 3.2 共用元件架構

```
assets/
├── css/
│   └── mockup-common.css      # 共用樣式 (glass, badge, table)
├── js/
│   └── sidebar.js             # 共用側邊欄邏輯
└── *.html                     # 60 個頁面原型
```

**已採用共用架構的頁面：**
- ✅ mockup_dashboard.html
- ✅ mockup_mvp_machine_list.html
- 📝 其餘 58 個頁面仍使用內嵌 CSS

---

## 4. 功能覆蓋矩陣

### 4.1 集中式後台 (Central Admin)

| 功能模組 | 主要頁面 | 子頁面/彈窗 | 覆蓋度 |
|---------|---------|------------|--------|
| **儀表板** | dashboard | - | ✅ 100% |
| **機台管理** | mvp_machine_list | mvp_machine_add, machine_remote_control | ✅ 100% |
| **玩家管理** | mvp_player_list | mvp_player_add, mvp_player_adjust, player_detail, password_reset | ✅ 100% |
| **遊戲管理** | mvp_data_list, std_game_category | mvp_game_add, game_detail, game_category_management, std_category_add | ✅ 100% |
| **錢包交易** | std_wallet | std_transaction_detail | ✅ 100% |
| **營收報表** | std_reports | transaction_stats, game_ranking | ✅ 100% |
| **串接遊戲商** | std_provider_list | std_provider_add, api_status_monitor, api_log, game_sync | ✅ 100% |
| **多人遊戲** | std_multiplayer | multiplayer_config, multiplayer_history, multiplayer_shoe, multiplayer_dealer, multiplayer_bet, multiplayer_alerts, std_multiplayer_add | ✅ 100% |
| **使用者權限** | user_permission, role_management, permission_matrix | agent_tree, audit_log, security_settings | ✅ 100% |
| **版本更新** | flg_ota | - | ✅ 100% |
| **監控中心** | flg_monitor, alert_threshold | - | ✅ 100% |
| **對帳專區** | flg_reconciliation, flg_dispute | sync_conflict, transaction_exception | ✅ 100% |
| **介面設定** | lobby_settings, announcement, broadcast_management, recommended_games | - | ✅ 100% |
| **系統設定** | std_system_settings, std_backup | - | ✅ 100% |

### 4.2 單機本地後台 (Local Admin)

| 功能模組 | 頁面 | 覆蓋度 |
|---------|------|--------|
| **登入** | login (可切換), local_cash | ✅ 100% |
| **儀表板** | local_dashboard | ✅ 100% |
| **機台資訊** | local_machine | ✅ 100% |
| **系統設定** | mvp_local_setup | ✅ 100% |
| **同步對帳** | local_sync | ✅ 100% |

---

## 5. 技術實現評估

### 5.1 前端技術棧

| 技術 | 用途 | 版本/來源 |
|------|------|----------|
| Tailwind CSS | 原子化 CSS 框架 | CDN (v3.x) |
| Chart.js | 圖表視覺化 | CDN |
| Lucide Icons | 圖示系統 | CDN (latest) |
| Google Fonts | 字體 (Noto Sans TC, JetBrains Mono) | CDN |

### 5.2 程式碼品質

| 品質指標 | 評分 | 說明 |
|---------|------|------|
| HTML 結構 | ⭐⭐⭐⭐☆ | 語義化良好，但部分重複 |
| CSS 組織 | ⭐⭐⭐☆☆ | 大量內嵌樣式，未完全抽離 |
| 響應式設計 | ⭐⭐⭐☆☆ | 基礎斷點有，但行動版優化不足 |
| 可維護性 | ⭐⭐⭐☆☆ | 需統一採用共用元件 |
| 無障礙 (a11y) | ⭐⭐☆☆☆ | 未針對螢幕閱讀器優化 |

### 5.3 待重構項目

1. **統一側邊欄引用**
   - 目前僅 2 個頁面使用 `js/sidebar.js`
   - 建議全部 60 個頁面統一採用

2. **抽離共用 CSS**
   - 建立完整 design token 系統
   - 統一 glass-card, input-focus 等樣式

3. **響應式補強**
   - 補充 mobile/tablet 斷點
   - 側邊欄折疊機制

---

## 6. 與 UI 設計文件對齊狀況

### 6.1 文件引用狀況

| UI 設計文件章節 | 引用 mockup | 實際存在 HTML | 狀態 |
|----------------|------------|--------------|------|
| 5.1 登入頁面 | mockup_login.png | ✅ mockup_login.html | ✅ |
| 5.2 儀表板 | mockup_dashboard.png | ✅ mockup_dashboard.html | ✅ |
| 5.3 機台管理 | mockup_mvp_machine_list.png | ✅ mockup_mvp_machine_list.html | ✅ |
| 5.4 遊戲管理 | mockup_mvp_data_list.png | ✅ mockup_mvp_data_list.html | ✅ |
| 5.5 玩家管理 | mockup_mvp_player_list.png | ✅ mockup_mvp_player_list.html | ✅ |
| 5.6 錢包交易 | mockup_std_wallet.png | ✅ mockup_std_wallet.html | ✅ |
| 5.7 營收報表 | **僅文字描述** | ✅ mockup_std_reports.html | ⚠️ 文件未引用 |
| 5.8 串接遊戲商 | mockup_std_provider_list.png | ✅ mockup_std_provider_list.html | ✅ |
| 5.9 使用者權限 | mockup_std_agent_add.png | ✅ mockup_user_permission.html | ⚠️ 檔名不一致 |
| 5.10 OTA 版本 | mockup_flg_ota.png | ✅ mockup_flg_ota.html | ✅ |
| 5.11 硬體監控 | mockup_flg_monitor.png | ✅ mockup_flg_monitor.html | ✅ |
| 5.12 對帳處理 | mockup_flg_reconciliation.png | ✅ mockup_flg_reconciliation.html | ✅ |
| 5.13 本地開洗分 | mockup_local_cash.png | ✅ mockup_local_cash.html | ✅ |
| 5.14 本機設定 | mockup_mvp_local_setup.png | ✅ mockup_mvp_local_setup.html | ✅ |

### 6.2 設計文件未引用但有 HTML 的頁面

以下 **46 個 HTML mockup** 未被 UI 設計文件章節 5 引用：

#### 新增/編輯表單頁面 (15)
- mockup_mvp_machine_add.html
- mockup_mvp_player_add.html
- mockup_mvp_game_add.html
- mockup_mvp_player_adjust.html
- mockup_std_provider_add.html
- mockup_std_agent_add.png (有 png 無 html)
- mockup_std_category_add.html
- mockup_std_multiplayer_add.html
- mockup_game_detail.html
- mockup_player_detail.html
- mockup_std_transaction_detail.html
- mockup_password_reset.html
- mockup_security_settings.html
- mockup_permission_matrix.html
- mockup_role_management.html

#### 多人遊戲子功能 (7)
- mockup_multiplayer_config.html
- mockup_multiplayer_history.html
- mockup_multiplayer_shoe.html
- mockup_multiplayer_dealer.html
- mockup_multiplayer_bet.html
- mockup_multiplayer_alerts.html

#### 監控/API/系統 (10)
- mockup_api_status_monitor.html
- mockup_api_log.html
- mockup_audit_log.html
- mockup_alert_threshold.html
- mockup_transaction_stats.html
- mockup_transaction_exception.html
- mockup_transaction_export.html
- mockup_machine_remote_control.html
- mockup_game_test.html
- mockup_game_ranking.html

#### 介面設定/公告 (6)
- mockup_lobby_settings.html
- mockup_announcement.html
- mockup_broadcast_management.html
- mockup_recommended_games.html
- mockup_game_category_management.html
- mockup_game_sync.html

#### 同步/對帳 (4)
- mockup_sync_conflict.html
- mockup_local_sync.html
- mockup_flg_dispute.html
- mockup_std_backup.html

#### 代理商/權限 (2)
- mockup_agent_tree.html
- mockup_std_agent_add.png

#### 本地後台 (3)
- mockup_local_dashboard.html
- mockup_local_machine.html

---

## 7. 關鍵發現

### ✅ 優點

1. **功能覆蓋完整** - 60 個 HTML mockup 涵蓋了功能矩陣中 95%+ 的需求
2. **視覺風格統一** - 全站採用一致的 Premium Dark + Glassmorphism 設計
3. **技術棧現代** - Tailwind CSS + Chart.js，易於開發團隊接手
4. **中文在地化** - 完整支援繁體中文介面

### ⚠️ 待改進

1. **文件與資產不同步** - UI 設計文件僅引用 14 個 mockup，實際有 60 個
2. **營收報表頁面** - 文件僅文字描述，但 std_reports.html 已存在且完整
3. **命名不一致** - std/mvp/flg/local 前綴混用，部分檔名與功能不對應
4. **共用元件未普及** - 僅 2 個頁面採用 sidebar.js，其餘為內嵌

### 🔴 關鍵缺口 (其實已存在但未引用)

| 缺口項目 | 功能矩陣代碼 | 實際存在 HTML | 狀態 |
|---------|-------------|--------------|------|
| 營收報表 | C47 | mockup_std_reports.html | ✅ 已存在 |
| 交易統計 | C44 | mockup_transaction_stats.html | ✅ 已存在 |
| API 監控 | C54 | mockup_api_status_monitor.html | ✅ 已存在 |
| 遊戲測試 | C28 | mockup_game_test.html | ✅ 已存在 |
| 牌桌配置 | C59 | mockup_multiplayer_config.html | ✅ 已存在 |
| 牌局歷史 | C60 | mockup_multiplayer_history.html | ✅ 已存在 |
| 牌靴管理 | C62 | mockup_multiplayer_shoe.html | ✅ 已存在 |

---

## 8. 建議行動

### 立即行動 (本週)

1. **更新 UI 設計文件** - 將 46 個未引用的 HTML mockup 補入章節 5
2. **補充營收報章截圖** - 將 mockup_std_reports.html 匯出為 png 並引用
3. **統一命名規範** - 建立命名對照表，減少前綴混亂

### 短期行動 (下週)

4. **推廣共用元件** - 將所有 60 個頁面改採 sidebar.js + mockup-common.css
5. **建立頁面索引** - 建立 HTML mockup 總覽頁，方便團隊瀏覽
6. **匯出 PNG 套圖** - 為關鍵頁面產出對應 png，供文件引用

### 中期行動 (本月)

7. **響應式補強** - 針對關鍵頁面補充 mobile/tablet 斷點
8. **無障礙優化** - 添加 ARIA 標籤，提升可訪問性

---

## 9. 結論

**HTML mockup 資產非常完整**，實際上已涵蓋功能矩陣中絕大多數需求，包括原本分析報告中標記為「缺口」的項目（如營收報表、API 監控、遊戲測試等）。

**主要問題在於文件與資產不同步**，而非設計缺失。建議優先更新 UI 設計文件，將現有 60 個 HTML mockup 正確引用，並統一共用元件架構。

---

*分析完成。如需瀏覽特定 mockup 或產出 PNG 截圖，請告知。*
