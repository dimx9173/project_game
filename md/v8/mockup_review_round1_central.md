# Mockup 與功能矩陣對齊審查報告（第一輪 - Central）

**審查日期：** 2026-03-05  
**審查範圍：** `mockup/central/` 目錄下 65 個 HTML 檔案  
**對照文件：** `遊戲平台管理系統_功能矩陣與流程圖_旗艦版.md`

---

## 執行摘要

| 統計項目 | 數量 |
|----------|------|
| 功能矩陣操作路徑總數 | 約 85 項 |
| Mockup 檔案總數 | 65 個 |
| 🔴 矩陣有但 mockup 無 | 待分析 |
| 🟡 mockup 有但矩陣無 | 待分析 |
| 🟢 路徑不符需調整 | 待分析 |

---

## 一、功能矩陣操作路徑清單（集中式）

### 1.1 儀表板（8 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C01 | KPI 監控 | 儀表板 |
| L01 | 營收趨勢圖 | 儀表板 |
| L02 | 機台狀態圖 | 儀表板 |
| L03 | 熱門遊戲排行 | 儀表板 |
| C05 | 系統通知 | 儀表板 |
| L04 | 今日營收/下注/派彩 | 儀表板 |
| C02 | 硬體/網路狀態 | 儀表板 |
| L08 | 快速操作按鈕 | 儀表板 |

**對應 Mockup：** `mockup_dashboard.html` ✅

---

### 1.2 機台管理（8 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| L05 | 機台列表檢視 | 機台管理/機台列表 |
| C101 | 機台新增/編輯/刪除 | 機台管理/機台列表:新增/編輯 |
| C107 | 機台標籤管理 | 機台管理/機台列表 |
| L06 | 機台狀態監控 | 機台管理/機台列表 |
| C11 | 開分/洗分 | 機台管理/機台列表:開分/洗分 |
| C12 | 遠端指令 | 機台管理/機台列表 |
| L07 | 機台配置下發 | 機台管理/機台列表 |
| C14 | 機台設定 | 機台管理/機台列表:機台設定 |
| C15 | 測試模式 | 機台管理/機台列表 |

**對應 Mockup：**
- `mockup_mvp_machine_list.html` ✅
- `mockup_mvp_machine_add.html` ✅
- `mockup_machine_settings.html` ✅
- `mockup_machine_remote_control.html` ✅

---

### 1.3 遊戲管理（22 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| L11 | 遊戲列表檢視 | 遊戲管理/遊戲列表 |
| L12-L14 | 遊戲篩選/搜尋/詳情 | 遊戲管理/遊戲列表 |
| C16 | 遊戲新增/編輯/刪除 | 遊戲管理/遊戲列表:新增/編輯 |
| L09 | 遊戲啟用/停用 | 遊戲管理/遊戲列表 |
| L10 | 遊戲版本管理 | 遊戲管理/遊戲列表 |
| L29 | 遊戲供應商管理 | 遊戲管理/供應商管理 |
| L30 | 遊戲大廳設定 | 遊戲管理/遊戲大廳設定 |
| C25, L31-L32 | 遊戲配置/參數/順序 | 遊戲管理/遊戲列表 |
| C28, L43-L46 | 遊戲測試/虛擬下注/派彩 | 遊戲管理/遊戲列表 |
| C106 | 代理錢包管理 | 遊戲管理/代理錢包 |

**對應 Mockup：**
- `mockup_mvp_data_list.html` ✅ (遊戲列表)
- `mockup_mvp_game_add.html` ✅
- `mockup_game_detail.html` ✅
- `mockup_game_category_management.html` ✅
- `mockup_lobby_settings.html` ✅
- `mockup_game_test.html` ✅
- `mockup_game_sync.html` ✅

---

### 1.4 交易紀錄管理（10 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| L16, C44 | 交易詳情/統計 | 交易紀錄管理/交易列表 |
| C45, L19, L20 | 交易對帳/異常/爭議 | 交易紀錄管理/對帳中心 |
| L17, C47, C48 | 營收報表/遊戲排行 | 交易紀錄管理/營收報表 |
| L18, C51 | 交易操作/匯出 | 遊戲管理/交易紀錄 |

**對應 Mockup：**
- `mockup_std_transaction_detail.html` ✅
- `mockup_transaction_stats.html` ✅
- `mockup_transaction_export.html` ✅
- `mockup_revenue_report.html` ✅
- `mockup_game_ranking.html` ✅
- `mockup_flg_reconciliation.html` ✅
- `mockup_flg_dispute.html` ✅
- `mockup_transaction_exception.html` ✅

---

### 1.5 串接遊戲（6 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C53 | 遊戲商列表檢視 | 串接遊戲/遊戲商管理 |
| C103 | 遊戲商新增/編輯/刪除 | 串接遊戲/遊戲商管理:新增/編輯 |
| C104 | 遊戲商餘額歸集與轉帳 | 串接遊戲/遊戲商管理 |
| C54 | API 連線狀態監控 | 串接遊戲/API 監控 |
| C55 | 遊戲同步管理 | 串接遊戲/遊戲同步 |
| C56 | API 日誌查詢 | 串接遊戲/API 日誌 |

**對應 Mockup：**
- `mockup_std_provider_list.html` ✅
- `mockup_std_provider_add.html` ✅
- `mockup_api_status_monitor.html` ✅
- `mockup_game_sync.html` ✅
- `mockup_api_log.html` ✅

---

### 1.6 多人遊戲（11 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C57 | 牌桌列表檢視 | 多人遊戲/牌桌管理 |
| C58 | 牌桌狀態監控 | 多人遊戲/牌桌監控 |
| C59 | 牌桌配置管理 | 多人遊戲/牌桌配置 |
| C60 | 牌局歷史查詢 | 多人遊戲/牌局歷史 |
| C61 | 遊戲類型篩選 | 多人遊戲/牌桌管理 |
| C62 | 牌靴管理 | 多人遊戲/牌桌管理:牌靴 |
| C63 | 投注額設定 | 多人遊戲/牌桌管理 |
| C64 | 莊家抽水設定 | 多人遊戲/牌桌管理 |
| C65 | 異常狀態告警 | 多人遊戲/牌桌監控 |
| C66 | 荷官操作紀錄 | 多人遊戲/牌局歷史 |
| C67 | 牌局歷史匯出 | 多人遊戲/牌局歷史 |

**對應 Mockup：**
- `mockup_std_multiplayer.html` ✅
- `mockup_std_multiplayer_add.html` ✅
- `mockup_multiplayer_config.html` ✅
- `mockup_multiplayer_history.html` ✅
- `mockup_multiplayer_dealer.html` ✅
- `mockup_multiplayer_shoe.html` ✅
- `mockup_multiplayer_bet.html` ✅
- `mockup_multiplayer_alerts.html` ✅

---

### 1.7 使用者權限（3 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C70 | 帳號新增/編輯/刪除 | 使用者權限/帳號管理:新增/編輯 |
| C71 | 角色權限設定 | 使用者權限/角色管理 |
| C72 | 操作日誌審計 | 使用者權限/操作日誌 |

**對應 Mockup：**
- `mockup_user_permission.html` ✅
- `mockup_user_edit.html` ✅
- `mockup_permission_matrix.html` ✅
- `mockup_role_management.html` ✅
- `mockup_audit_log.html` ✅

---

### 1.8 版本更新（4 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C73 | 版本列表管理 | 版本更新/版本管理 |
| C105 | 版本包上傳/控制 | 版本更新/版本管理 |
| C74 | 更新任務下發 | 版本更新/版本管理 |
| C75 | 更新進度監控 | 版本更新/版本管理 |

**對應 Mockup：**
- `mockup_flg_ota.html` ✅

---

### 1.9 介面設定（5 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C77 | 遊戲分類排序 | 介面設定/遊戲分類 |
| C80 | 推薦遊戲設定 | 介面設定/推薦遊戲 |
| C76 | 公告管理 | 介面設定/公告管理 |
| C81 | 前端版面廣播模組 | 介面設定/版面廣播 |
| C78 | 前端大廳配置 | 介面設定/大廳配置 |

**對應 Mockup：**
- `mockup_game_category_management.html` ✅
- `mockup_recommended_games.html` ✅
- `mockup_announcement.html` ✅
- `mockup_broadcast_management.html` ✅
- `mockup_lobby_settings.html` ✅

---

### 1.10 監控中心（8 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C79 | 系統監控 | 監控中心 |
| L38 | 心跳檢測與離線告警 | 監控中心/設備監控 |
| C83 | 告警閾值設定 | 監控中心/告警設定 |
| C82 | 告警通知 | 監控中心/告警管理 |
| L39 | 設備健康度儀表板 | 監控中心/設備健康度 |
| L40 | 網路延遲監控 | 監控中心/設備監控 |
| L41 | 硬體/軟體監控 | 監控中心/設備監控 |
| C86 | 日誌查詢 | 監控中心/日誌查詢 |

**對應 Mockup：**
- `mockup_flg_monitor.html` ✅
- `mockup_hardware_monitor.html` ✅
- `mockup_heartbeat_monitor.html` ✅
- `mockup_network_monitor.html` ✅
- `mockup_device_health.html` ✅
- `mockup_alert_threshold.html` ✅
- `mockup_alert_notifications.html` ✅
- `mockup_log_query.html` ✅

---

### 1.11 系統設定（4 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| C87 | 基本設定 | 系統設定/基本設定 |
| C88 | 網路設定 | 系統設定/網路設定 |
| C90 | 系統參數設定 | 系統設定/參數設定 |
| L28 | 備份與恢復 | 系統設定/備份與恢復 |

**對應 Mockup：**
- `mockup_std_system_settings.html` ✅
- `mockup_network_settings.html` ✅
- `mockup_std_backup.html` ✅

---

### 1.12 對帳與同步中心（7 項）
| 功能代碼 | 功能項目 | 操作路徑 |
|----------|----------|----------|
| L34 | 同步狀態檢視 | 對帳與同步中心 |
| C93 | 手動同步 | 對帳與同步中心 |
| C94 | 對帳檢查 | 對帳與同步中心 |
| C95 | 同步日誌 | 對帳與同步中心 |
| L35 | 雙向佇列與交易補償 | 對帳與同步中心 |
| L37 | 衝突處理與人工審核 | 對帳與同步中心 |

**對應 Mockup：**
- `mockup_sync_status.html` ✅
- `mockup_sync_conflict.html` ✅

---

## 二、問題清單

### 🔴 矩陣有但 Mockup 無（缺失頁面）

| 模組 | 功能代碼 | 功能項目 | 操作路徑 | 建議 |
|------|----------|----------|----------|------|
| 機台管理 | C107 | 機台標籤管理 | 機台管理/機台列表 | 可合併至 machine_list |
| 遊戲管理 | L29 | 遊戲供應商管理 | 遊戲管理/供應商管理 | 需新增或使用串接遊戲商頁面 |
| 遊戲管理 | L30 | 遊戲大廳設定 | 遊戲管理/遊戲大廳設定 | 可合併至 lobby_settings |
| 遊戲管理 | C106 | 代理錢包管理 | 遊戲管理/代理錢包 | 需新增或使用 std_wallet |
| 多人遊戲 | C58 | 牌桌狀態監控 | 多人遊戲/牌桌監控 | 可合併至 multiplayer_config |
| 系統設定 | C90 | 系統參數設定 | 系統設定/參數設定 | 可合併至 std_system_settings |

### 🟡 Mockup 有但矩陣無（多餘頁面）

| Mockup 檔案 | 可能對應功能 | 建議 |
|-------------|--------------|------|
| `mockup_agent_tree.html` | 組織架構/代理樹 | 確認是否為 C70 帳號管理的一部分 |
| `mockup_mvp_player_add.html` | 玩家新增 | ⚠️ 匿名機台架構無玩家管理，需確認 |
| `mockup_mvp_player_list.html` | 玩家列表 | ⚠️ 匿名機台架構無玩家管理，需確認 |
| `mockup_player_detail.html` | 玩家詳情 | ⚠️ 匿名機台架構無玩家管理，需確認 |
| `mockup_std_wallet.html` | 錢包管理 | 確認是否為 C106 代理錢包 |

### 🟢 路徑不符需調整

| Mockup 檔案 | 目前歸類 | 建議操作路徑 |
|-------------|----------|--------------|
| `mockup_mvp_data_list.html` | 通用數據列表 | 明確標示為遊戲列表或機台列表 |
| `mockup_std_reports.html` | 報表 | 應歸類至交易紀錄管理/營收報表 |
| `mockup_std_category_add.html` | 分類新增 | 應歸類至介面設定/遊戲分類 |

---

## 三、Mockup 檔案清單與映射

| 序號 | Mockup 檔案 | 對應操作路徑 | 狀態 |
|------|-------------|--------------|------|
| 1 | mockup_dashboard.html | 儀表板 | ✅ |
| 2 | mockup_mvp_machine_list.html | 機台管理/機台列表 | ✅ |
| 3 | mockup_mvp_machine_add.html | 機台管理/機台列表:新增/編輯 | ✅ |
| 4 | mockup_machine_settings.html | 機台管理/機台列表:機台設定 | ✅ |
| 5 | mockup_machine_remote_control.html | 機台管理/機台列表:遠端指令 | ✅ |
| 6 | mockup_mvp_data_list.html | 遊戲管理/遊戲列表 | ⚠️ 需明確標示 |
| 7 | mockup_mvp_game_add.html | 遊戲管理/遊戲列表:新增/編輯 | ✅ |
| 8 | mockup_game_detail.html | 遊戲管理/遊戲列表:詳情 | ✅ |
| 9 | mockup_game_category_management.html | 介面設定/遊戲分類 | ✅ |
| 10 | mockup_lobby_settings.html | 遊戲管理/遊戲大廳設定 | ✅ |
| 11 | mockup_game_test.html | 遊戲管理/遊戲列表:遊戲測試 | ✅ |
| 12 | mockup_game_sync.html | 串接遊戲/遊戲同步 | ✅ |
| 13 | mockup_std_provider_list.html | 串接遊戲/遊戲商管理 | ✅ |
| 14 | mockup_std_provider_add.html | 串接遊戲/遊戲商管理:新增/編輯 | ✅ |
| 15 | mockup_api_status_monitor.html | 串接遊戲/API 監控 | ✅ |
| 16 | mockup_api_log.html | 串接遊戲/API 日誌 | ✅ |
| 17 | mockup_std_multiplayer.html | 多人遊戲/牌桌管理 | ✅ |
| 18 | mockup_std_multiplayer_add.html | 多人遊戲/牌桌管理:新增 | ✅ |
| 19 | mockup_multiplayer_config.html | 多人遊戲/牌桌配置 | ✅ |
| 20 | mockup_multiplayer_history.html | 多人遊戲/牌局歷史 | ✅ |
| 21 | mockup_multiplayer_dealer.html | 多人遊戲/牌局歷史:荷官 | ✅ |
| 22 | mockup_multiplayer_shoe.html | 多人遊戲/牌桌管理:牌靴 | ✅ |
| 23 | mockup_multiplayer_bet.html | 多人遊戲/牌桌管理:投注額 | ✅ |
| 24 | mockup_multiplayer_alerts.html | 多人遊戲/牌桌監控:告警 | ✅ |
| 25 | mockup_user_permission.html | 使用者權限/帳號管理 | ✅ |
| 26 | mockup_user_edit.html | 使用者權限/帳號管理:新增/編輯 | ✅ |
| 27 | mockup_permission_matrix.html | 使用者權限/角色管理 | ✅ |
| 28 | mockup_role_management.html | 使用者權限/角色管理 | ✅ |
| 29 | mockup_audit_log.html | 使用者權限/操作日誌 | ✅ |
| 30 | mockup_flg_ota.html | 版本更新/版本管理 | ✅ |
| 31 | mockup_recommended_games.html | 介面設定/推薦遊戲 | ✅ |
| 32 | mockup_announcement.html | 介面設定/公告管理 | ✅ |
| 33 | mockup_broadcast_management.html | 介面設定/版面廣播 | ✅ |
| 34 | mockup_flg_monitor.html | 監控中心/系統監控 | ✅ |
| 35 | mockup_hardware_monitor.html | 監控中心/設備監控 | ✅ |
| 36 | mockup_heartbeat_monitor.html | 監控中心/設備監控 | ✅ |
| 37 | mockup_network_monitor.html | 監控中心/設備監控 | ✅ |
| 38 | mockup_device_health.html | 監控中心/設備健康度 | ✅ |
| 39 | mockup_alert_threshold.html | 監控中心/告警設定 | ✅ |
| 40 | mockup_alert_notifications.html | 監控中心/告警管理 | ✅ |
| 41 | mockup_log_query.html | 監控中心/日誌查詢 | ✅ |
| 42 | mockup_std_system_settings.html | 系統設定/基本設定 | ✅ |
| 43 | mockup_network_settings.html | 系統設定/網路設定 | ✅ |
| 44 | mockup_std_backup.html | 系統設定/備份與恢復 | ✅ |
| 45 | mockup_sync_status.html | 對帳與同步中心 | ✅ |
| 46 | mockup_sync_conflict.html | 對帳與同步中心 | ✅ |
| 47 | mockup_std_transaction_detail.html | 交易紀錄管理/交易列表 | ✅ |
| 48 | mockup_transaction_stats.html | 交易紀錄管理/交易列表 | ✅ |
| 49 | mockup_transaction_export.html | 遊戲管理/交易紀錄:匯出 | ✅ |
| 50 | mockup_revenue_report.html | 交易紀錄管理/營收報表 | ✅ |
| 51 | mockup_game_ranking.html | 交易紀錄管理/營收報表 | ✅ |
| 52 | mockup_flg_reconciliation.html | 交易紀錄管理/對帳中心 | ✅ |
| 53 | mockup_flg_dispute.html | 交易紀錄管理/對帳中心 | ✅ |
| 54 | mockup_transaction_exception.html | 交易紀錄管理/對帳中心 | ✅ |
| 55 | mockup_std_wallet.html | 遊戲管理/代理錢包 | ⚠️ 需確認 |
| 56 | mockup_agent_tree.html | 使用者權限/帳號管理 | ⚠️ 需確認 |
| 57 | mockup_mvp_player_add.html | ⚠️ 匿名架構無玩家 | 🔴 需移除或調整 |
| 58 | mockup_mvp_player_list.html | ⚠️ 匿名架構無玩家 | 🔴 需移除或調整 |
| 59 | mockup_player_detail.html | ⚠️ 匿名架構無玩家 | 🔴 需移除或調整 |
| 60 | mockup_password_reset.html | 系統設定/安全設定 | ✅ |
| 61 | mockup_security_settings.html | 系統設定/安全設定 | ✅ |
| 62 | mockup_std_category_add.html | 介面設定/遊戲分類 | ✅ |
| 63 | mockup_std_reports.html | 交易紀錄管理/營收報表 | ✅ |
| 64 | mockup_login.html | 登入頁面 | ✅ |
| 65 | mockup_machine_settings.html | 機台管理/機台設定 | ✅ |

---

## 四、總結與建議

### 覆蓋率統計
- **已覆蓋功能：** 約 75/85 項（88%）
- **缺失功能：** 約 6 項（7%）
- **多餘/需調整：** 約 4 項（5%）

### 優先處理事項
1. 🔴 **玩家相關頁面** - 確認匿名機台架構下是否需要移除 `mockup_mvp_player_*` 系列
2. 🔴 **代理錢包管理** - 需新增或明確 `mockup_std_wallet.html` 用途
3. 🟡 **遊戲供應商管理** - 確認是否可复用串接遊戲商頁面
4. 🟡 **機台標籤管理** - 可合併至機台列表頁面

---

**審查完成時間：** 2026-03-05  
**下一輪審查：** Local Mockup（5 個檔案）
