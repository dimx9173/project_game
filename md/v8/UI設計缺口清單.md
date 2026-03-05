# UI 設計缺口清單 - game-v8 專案

**分析日期：** 2026-03-05  
**分析者：** Lumina (Frontend Architect)  
**工作目錄：** ~/project/game/md/v8

---

## 1. 執行摘要

經全面比對 UI 設計文件、功能矩陣與現有 mockup 資產，發現以下狀況：

| 指標 | 數量 |
|------|------|
| UI 設計文件規劃頁面 (主要) | 14 頁 |
| 現有 mockup 圖檔 (.png) | 24 個 |
| 現有 mockup HTML 原型 | 48 個 |
| **有圖檔但文件未引用** | 6 個 |
| **文件引用但無對應圖檔** | 1 個 |
| **功能矩陣有但無 mockup** | 12+ 項 |

---

## 2. 設計文件 vs Mockup 對照表

### 2.1 ✅ 已對應完成 (有文件引用 + 有 mockup)

| 頁面名稱 | 文件引用 | Mockup 圖檔 | 狀態 |
|---------|---------|------------|------|
| 登入頁面 | 5.1 | mockup_login.png | ✅ |
| 儀表板 (集中式) | 5.2 | mockup_dashboard.png | ✅ |
| 機台管理列表 | 5.3 | mockup_mvp_machine_list.png | ✅ |
| 遊戲管理列表 | 5.4 | mockup_mvp_data_list.png | ✅ |
| 玩家管理列表 | 5.5 | mockup_mvp_player_list.png | ✅ |
| 錢包交易 | 5.6 | mockup_std_wallet.png | ✅ |
| 串接遊戲商 | 5.8 | mockup_std_provider_list.png | ✅ |
| 使用者權限 | 5.9 | mockup_std_agent_add.png | ✅ |
| OTA 版本管理 | 5.10 | mockup_flg_ota.png | ✅ |
| 硬體監控中心 | 5.11 | mockup_flg_monitor.png | ✅ |
| 對帳與爭議處理 | 5.12 | mockup_flg_reconciliation.png | ✅ |
| 開洗分介面 (本地) | 5.13 | mockup_local_cash.png | ✅ |
| 本機設定 (本地) | 5.14 | mockup_mvp_local_setup.png | ✅ |

### 2.2 ⚠️ 文件引用但 mockup 缺失/不明確

| 頁面名稱 | 文件引用 | 問題描述 | 建議 |
|---------|---------|---------|------|
| **營收報表** | 5.7 | 文件僅文字描述，**無引用 mockup 圖檔** | 🔴 **高優先補充** |

### 2.3 📝 有 mockup 但設計文件未引用

以下 mockup 存在但 UI 設計文件 **未在章節 5 中引用**，需確認是否納入規格：

| Mockup 檔案 | 功能推測 | 建議 |
|------------|---------|------|
| mockup_std_game_category.png | 遊戲分類管理 | 補充到 5.4 遊戲管理 |
| mockup_std_backup.png | 系統備份 | 補充到 4.1 單機本地後台 |
| mockup_std_multiplayer.png | 多人遊戲牌桌 | 補充到 3.1 頁面清單 |
| mockup_std_transaction_detail.png | 交易詳情 | 補充到 5.6 錢包交易 |
| mockup_local_dashboard.png | 本地儀表板 | 補充到 4.1 頁面清單 |
| mockup_local_machine.png | 本地機台管理 | 補充到 4.1 頁面清單 |
| mockup_local_sync.png | 同步對帳 | 補充到 4.1 頁面清單 |
| mockup_mvp_machine_add.png | 機台新增 | 補充到 5.3 機台管理 |
| mockup_mvp_player_add.png | 玩家新增 | 補充到 5.5 玩家管理 |
| mockup_mvp_game_add.png | 遊戲新增 | 補充到 5.4 遊戲管理 |
| mockup_mvp_player_adjust.png | 玩家餘額調整 | 補充到 5.5 玩家管理 |
| mockup_std_agent_add.png | 代理商新增 | 補充到 5.9 使用者權限 |
| mockup_std_provider_add.png | 遊戲商新增 | 補充到 5.8 串接遊戲商 |
| mockup_std_category_add.png | 分類新增 | 補充到 5.4 遊戲管理 |
| mockup_std_system_settings.png | 系統設定 | 補充到 3.1 頁面清單 |

---

## 3. 功能矩陣缺口分析

根據功能矩陣檢查，以下 **重要功能模組缺乏對應 mockup**：

### 3.1 🔴 高優先缺口 (核心功能)

| 功能代碼 | 功能項目 | 所屬模組 | 缺口說明 |
|---------|---------|---------|---------|
| C47 | **營收報表** | 交易紀錄管理 | 設計文件僅文字描述，無 mockup |
| C102 | 玩家新增/編輯/刪除 | 玩家管理 | 僅有列表 mockup，無表單頁面 |
| C103 | 遊戲商新增/編輯/刪除 | 串接遊戲 | 僅有列表 mockup，無表單頁面 |
| C104 | 遊戲商餘額歸集與轉帳 | 串接遊戲 | 完全無 mockup |
| C105 | 版本包上傳/控制 | 版本更新 | OTA 頁面可能涵蓋，需確認 |
| C106 | 代理錢包管理 | 交易紀錄管理 | 完全無 mockup |

### 3.2 🟡 中優先缺口 (子功能頁面)

| 功能代碼 | 功能項目 | 所屬模組 | 缺口說明 |
|---------|---------|---------|---------|
| L12-L14 | 遊戲篩選/搜尋/詳情 | 遊戲管理 | 僅有列表 mockup |
| C25, L31-L32 | 遊戲配置/參數設定 | 遊戲管理 | 完全無 mockup |
| L43-L46 | 虛擬下注/餘額查詢/開洗分/派彩 | 遊戲測試 | 完全無 mockup |
| C40 | 密碼重設 | 玩家管理 | 完全無 mockup |
| C44 | 交易統計 | 交易紀錄管理 | 完全無 mockup |
| C48-C49 | 遊戲排行/玩家排行 | 交易紀錄管理 | 完全無 mockup |
| C54-C56 | API 連線監控/遊戲同步/API 日誌 | 串接遊戲 | 完全無 mockup |
| C57-C67 | 牌桌列表/監控/配置/歷史等 | 多人遊戲 | 僅有一張總覽 mockup |
| C70-C72 | 帳號管理/角色權限/審計日誌 | 使用者權限 | 權限設定細節頁面不足 |
| C75 | 更新進度監控 | 版本更新 | 完全無 mockup |
| C76-C81 | 公告/推薦遊戲/大廳配置等 | 介面設定 | 完全無 mockup |
| C82-C86 | 告警通知/閾值設定/日誌查詢 | 監控中心 | 完全無 mockup |
| C87-C90 | 基本/網路/安全設定 | 系統設定 | 設定頁面細節不足 |

### 3.3 🟢 低優先缺口 (次要/延伸功能)

| 功能項目 | 說明 |
|---------|------|
| 交易導出介面 | 匯出進度/格式選擇 |
| 同步衝突解決介面 | 雙向佇列衝突處理 |
| 多語系切換介面 | 語言選擇 |
| 行動裝置適配版 | 響應式斷點設計 |

---

## 4. 多人遊戲模組詳細缺口

根據功能矩陣 C57-C67，多人遊戲模組需要以下 mockup：

| 需求代碼 | 功能項目 | 現有 mockup | 缺口 |
|---------|---------|------------|------|
| C57 | 牌桌列表檢視 | mockup_std_multiplayer.png | ✅ 可能涵蓋 |
| C58 | 牌桌狀態監控 | - | 🔴 需補充 |
| C59 | 牌桌配置管理 | - | 🔴 需補充 |
| C60 | 牌局歷史查詢 | - | 🔴 需補充 |
| C61 | 遊戲類型篩選 | - | 🟡 可用通用列表 |
| C62 | 牌靴管理 | - | 🔴 需補充 |
| C63 | 投注額設定 | - | 🔴 需補充 |
| C64 | 莊家抽水設定 | - | 🔴 需補充 |
| C65 | 異常狀態告警 | - | 🔴 需補充 |
| C66 | 荷官操作紀錄 | - | 🔴 需補充 |
| C67 | 牌局歷史匯出 | - | 🟡 可用通用匯出 |

**結論：** 多人遊戲模組僅有 1 張總覽 mockup，**缺口 10 項子功能頁面**。

---

## 5. 建議優先順序

### 第一優先 (阻擋開發)
1. **營收報表 (C47)** - 文件僅文字描述，需完整 mockup
2. **遊戲商餘額歸集與轉帳 (C104)** - 核心金流功能
3. **代理錢包管理 (C106)** - 多帳號體系核心

### 第二優先 (重要子功能)
4. 玩家詳情/編輯頁面 (C102)
5. 遊戲商詳情/編輯頁面 (C103)
6. 遊戲測試介面 (虛擬下注等 C28)
7. 牌桌配置管理 (C59)
8. 牌局歷史查詢 (C60)

### 第三優先 (監控/設定)
9. API 連線監控 (C54)
10. 告警閾值設定 (C83)
11. 介面設定群組 (C76-C81)

---

## 6. HTML 原型資產清單

發現 48 個 HTML 原型檔案，部分可能已涵蓋上述缺口：

**值得檢查的 HTML 原型：**
- mockup_agent_tree.html - 代理商樹狀結構
- mockup_alert_threshold.html - 告警閾值
- mockup_announcement.html - 公告管理
- mockup_api_log.html - API 日誌
- mockup_api_status_monitor.html - API 監控
- mockup_audit_log.html - 審計日誌
- mockup_broadcast_management.html - 廣播管理
- mockup_game_ranking.html - 遊戲排行
- mockup_game_test.html - 遊戲測試
- mockup_lobby_settings.html - 大廳設定
- mockup_machine_remote_control.html - 機台遙控
- mockup_multiplayer_*.html - 多人遊戲系列 (8 個)
- mockup_player_detail.html - 玩家詳情
- mockup_recommended_games.html - 推薦遊戲
- mockup_role_management.html - 角色管理
- mockup_security_settings.html - 安全設定
- mockup_transaction_*.html - 交易系列 (3 個)

**建議：** 將相關 HTML 原型轉換為 PNG mockup 並納入設計文件。

---

## 7. 結論與建議

### 主要發現

1. **營收報表頁面完全缺失** - 設計文件僅有文字描述，這是核心功能缺口
2. **多人遊戲模組覆蓋率僅 9%** (1/11 項) - 需要大量補充
3. **有 48 個 HTML 原型但僅 24 個 PNG mockup** - 資產格式不統一
4. **15+ 個 mockup 圖檔未被設計文件引用** - 文件與資產不同步

### 行動建議

1. **立即補充營收報表 mockup** (高優先)
2. **審查所有 HTML 原型**，將完成品轉為 PNG 並更新設計文件
3. **建立 mockup 清單追蹤表**，對齊功能矩陣 C01-C106
4. **統一 mockup 命名規則**，目前命名混亂 (std/mvp/flg/local 混用)

---

*分析完成。如需深入分析特定模組或協助產出缺失 mockup，請告知。*
