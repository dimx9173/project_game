# Mockup 頁面導航檢查報告

## 📋 側邊欄現有導航結構

```
✅ 儀表板 (mockup_dashboard.html)

✅ 機台管理
   ├── 機台列表 (mockup_mvp_machine_list.html)
   └── 遠端控制 (mockup_machine_remote_control.html)

✅ 遊戲管理
   ├── 遊戲列表 (mockup_mvp_data_list.html)
   ├── 遊戲詳情 (mockup_game_detail.html) ← 應從列表進入？
   ├── 遊戲同步 (mockup_game_sync.html)
   └── 遊戲測試 (mockup_game_test.html)

✅ 交易紀錄管理
   ├── 錢包交易 (mockup_std_wallet.html)
   ├── 交易詳情 (mockup_std_transaction_detail.html) ← 應從列表進入？
   ├── 交易匯出 (mockup_transaction_export.html)
   └── 營收報表 (mockup_revenue_report.html)

✅ 串接遊戲
   ├── 遊戲商列表 (mockup_std_provider_list.html)
   └── API 日誌 (mockup_api_log.html)

✅ 多人遊戲 (mockup_std_multiplayer.html)

✅ 使用者權限
   ├── 帳號管理 (mockup_user_permission.html)
   └── 安全設定 (mockup_security_settings.html)

✅ 版本更新
   └── OTA 版本管理 (mockup_flg_ota.html)

✅ 介面設定
   ├── 公告管理 (mockup_announcement.html)
   ├── 遊戲大廳設定 (mockup_lobby_settings.html)
   └── 遊戲分類排序 (mockup_std_game_category.html)

✅ 監控中心
   ├── 系統監控 (mockup_flg_monitor.html)
   ├── API 狀態 (mockup_api_status_monitor.html)
   ├── 告警設定 (mockup_alert_threshold.html)
   └── 審計日誌 (mockup_audit_log.html)

✅ 系統設定
   └── 基本設定 (mockup_std_system_settings.html)
```

---

## 🔴 缺失側邊欄入口的頁面

### 需要新增到側邊欄的頁面：

| 頁面 | 建議位置 | 說明 |
|------|---------|------|
| mockup_agent_tree.html | 使用者權限 > 代理商樹狀結構 | 代理商層級管理 |
| mockup_broadcast_management.html | 介面設定 > 廣播管理 | 即時廣播訊息 |
| mockup_flg_dispute.html | 交易紀錄管理 > 爭議處理 | 錯帳爭議 |
| mockup_flg_reconciliation.html | 交易紀錄管理 > 對帳專區 | 對帳管理 |
| mockup_game_category_management.html | 介面設定 > 遊戲分類管理 | 分類管理 |
| mockup_game_ranking.html | 報表 > 遊戲排行榜 | 遊戲排行 |
| mockup_permission_matrix.html | 使用者權限 > 權限矩陣 | 角色權限對照 |
| mockup_recommended_games.html | 介面設定 > 推薦遊戲 | 精選遊戲設定 |
| mockup_role_management.html | 使用者權限 > 角色管理 | 角色設定 |
| mockup_std_backup.html | 系統設定 > 備份還原 | 系統備份 |
| mockup_std_reports.html | 報表 > 統計報表 | 另一個報表頁 |
| mockup_sync_conflict.html | 系統設定 > 同步衝突 | 衝突處理 |
| mockup_transaction_exception.html | 交易紀錄管理 > 異常交易 | 異常處理 |
| mockup_transaction_stats.html | 報表 > 交易統計 | 交易分析 |
| mockup_mvp_player_list.html | 新增主選單「玩家管理」 | 玩家列表 |

---

## 🟡 應從其他頁面進入的頁面（不需要側邊欄入口）

這些是「新增/編輯/詳情」頁面，應該從列表頁的按鈕進入：

### 機台管理相關
- mockup_mvp_machine_add.html ← 從「機台列表」的「新增機台」按鈕進入

### 遊戲管理相關
- mockup_mvp_game_add.html ← 從「遊戲列表」的「新增遊戲」按鈕進入
- mockup_std_category_add.html ← 從「遊戲分類」的「新增分類」按鈕進入

### 玩家管理相關
- mockup_mvp_player_add.html ← 從「玩家列表」的「新增玩家」按鈕進入
- mockup_player_detail.html ← 從「玩家列表」點擊玩家進入
- mockup_mvp_player_adjust.html ← 從「玩家詳情」的「調整餘額」按鈕進入

### 遊戲商相關
- mockup_std_provider_add.html ← 從「遊戲商列表」的「新增遊戲商」按鈕進入

### 多人遊戲相關
- mockup_std_multiplayer_add.html ← 從「多人遊戲」的「新增牌桌」按鈕進入
- mockup_multiplayer_config.html ← 從「多人遊戲」點擊牌桌進入配置
- mockup_multiplayer_history.html ← 從「多人遊戲」的「歷史記錄」進入
- mockup_multiplayer_shoe.html ← 從「多人遊戲」的「牌靴管理」進入
- mockup_multiplayer_dealer.html ← 從「多人遊戲」的「荷官管理」進入
- mockup_multiplayer_bet.html ← 從「多人遊戲」的「投注設定」進入
- mockup_multiplayer_alerts.html ← 從「多人遊戲」的「異常告警」進入

### 登入相關
- mockup_login.html ← 獨立登入頁，不需要側邊欄
- mockup_password_reset.html ← 從登入頁的「忘記密碼」進入

---

## 📝 建議修改

### 1. 新增「玩家管理」主選單（目前缺失）
```javascript
nav.appendChild(group('users', '玩家管理', [
  { href: 'mockup_mvp_player_list.html', text: '玩家列表' }
]));
```

### 2. 擴充現有選單群組

**使用者權限群組擴充：**
```javascript
nav.appendChild(group('shield-user', '使用者權限', [
  { href: 'mockup_user_permission.html', text: '帳號管理' },
  { href: 'mockup_role_management.html', text: '角色管理' },
  { href: 'mockup_permission_matrix.html', text: '權限矩陣' },
  { href: 'mockup_agent_tree.html', text: '代理商樹狀結構' },
  { href: 'mockup_security_settings.html', text: '安全設定' }
]));
```

**交易紀錄管理群組擴充：**
```javascript
nav.appendChild(group('wallet', '交易紀錄管理', [
  { href: 'mockup_std_wallet.html', text: '錢包交易' },
  { href: 'mockup_transaction_stats.html', text: '交易統計' },
  { href: 'mockup_transaction_exception.html', text: '異常交易' },
  { href: 'mockup_flg_reconciliation.html', text: '對帳專區' },
  { href: 'mockup_flg_dispute.html', text: '爭議處理' },
  { href: 'mockup_transaction_export.html', text: '交易匯出' },
  { href: 'mockup_revenue_report.html', text: '營收報表' }
]));
```

**介面設定群組擴充：**
```javascript
nav.appendChild(group('layout', '介面設定', [
  { href: 'mockup_announcement.html', text: '公告管理' },
  { href: 'mockup_broadcast_management.html', text: '廣播管理' },
  { href: 'mockup_recommended_games.html', text: '推薦遊戲' },
  { href: 'mockup_lobby_settings.html', text: '遊戲大廳設定' },
  { href: 'mockup_game_category_management.html', text: '遊戲分類管理' },
  { href: 'mockup_std_game_category.html', text: '遊戲分類排序' }
]));
```

**報表群組（新增）：**
```javascript
nav.appendChild(group('bar-chart-2', '報表中心', [
  { href: 'mockup_revenue_report.html', text: '營收報表' },
  { href: 'mockup_transaction_stats.html', text: '交易統計' },
  { href: 'mockup_std_reports.html', text: '統計報表' },
  { href: 'mockup_game_ranking.html', text: '遊戲排行榜' }
]));
```

**系統設定群組擴充：**
```javascript
nav.appendChild(group('settings', '系統設定', [
  { href: 'mockup_std_system_settings.html', text: '基本設定' },
  { href: 'mockup_sync_conflict.html', text: '同步衝突' },
  { href: 'mockup_std_backup.html', text: '備份還原' }
]));
```

---

## ✅ 驗證清單

執行以下命令檢查頁面是否有進入點：

```bash
# 檢查哪些頁面沒有側邊欄引用
cd ~/project/game/md/v8/mockup/central
grep -L "MockupSidebar.render" *.html

# 檢查哪些頁面是獨立頁面（不需要側邊欄）
grep -L "sidebar-container" *.html
```
