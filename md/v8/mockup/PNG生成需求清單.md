# PNG Mockup 生成需求清單

**建立日期**: 2026-03-07

## 需求說明

從 HTML Mockup 生成對應的 PNG 預覽圖。

## Central 缺失 PNG (20個)

| 功能代碼 | 功能名稱 | 對應HTML |
|---------|---------|----------|
| C02 | 硬體網路狀態 | mockup_hardware_network.html |
| C05 | 系統通知 | mockup_notifications.html |
| C14 | 機台設定 | mockup_machine_settings.html |
| C15 | 測試模式 | mockup_test_mode.html |
| C21 | 遊戲啟用停用 | mockup_game_toggle.html |
| C25 | 遊戲配置 | mockup_game_config.html |
| C45 | 交易對帳 | mockup_reconciliation.html |
| C48 | 遊戲排行 | mockup_game_ranking.html |
| C55 | 遊戲同步管理 | mockup_game_sync.html |
| C58 | 牌桌狀態監控 | mockup_table_status.html |
| C61 | 遊戲類型篩選 | mockup_game_filter.html |
| C64 | 莊家抽水設定 | mockup_commission.html |
| C67 | 牌局歷史匯出 | mockup_history_export.html |
| C73 | 版本列表管理 | mockup_version_list.html |
| C75 | 更新進度監控 | mockup_update_progress.html |
| C81 | 前端版面廣播 | mockup_broadcast.html |
| C82 | 告警通知 | mockup_alert_notify.html |
| C86 | 日誌查詢 | mockup_log_query.html |
| C93 | 手動同步 | mockup_manual_sync.html |
| C94 | 對帳檢查 | mockup_check.html |
| C95 | 同步日誌 | mockup_sync_log.html |

## Local 缺失 PNG (31個)

| 功能代碼 | 功能名稱 | 對應HTML |
|---------|---------|----------|
| L01 | 營收趨勢圖 | mockup_local_dashboard.html |
| L02 | 機台狀態圖 | mockup_local_dashboard.html |
| L03 | 熱門遊戲排行 | mockup_local_dashboard.html |
| L04 | 今日營收 | mockup_local_dashboard.html |
| L05 | 機台列表檢視 | mockup_local_machine.html |
| L06 | 機台狀態監控 | mockup_local_machine.html |
| L07 | 機台配置接收 | mockup_local_machine.html |
| L08 | 快速操作按鈕 | mockup_local_dashboard.html |
 | L47 | 基本設定 | mockup_local_system_settings.html |
| L09-L46 | 其他功能 | 需從對應頁面截圖 |

## 生成方式

### 方式1: 瀏覽器截圖
使用瀏覽器開啟每個 HTML 文件並截圖。

### 方式2: 命令列工具
```bash
# wkhtmltopdf
wkhtmltoimage mockup.html [功能代碼]名稱.png

# puppeteer
node screenshot.js mockup.html

# playwright
playwright screenshot mockup.html
```

### 方式3: 截圖工具
從瀏覽器手動截圖並命名為 [功能代碼]名稱.png
