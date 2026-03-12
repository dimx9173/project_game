# 遊戲平台管理系統 V8 - 中央管理端 User Story 文件 (Centralized Platform)

> **文件說明**：本文件依據「旗艦版 SA/SRS」與「中央端 Mockup (共 88 個檔案)」分析撰寫，側重於 **Centralized Management (中央集權管理)** 的功能實現與商用場景，確保所有的 UI Mockup 皆有對應的商業邏輯描述。

---

## CM01 [M01] 戰情室儀表板與營收分析

### US-CENTRAL-01：全平台即時 KPI 與儀表板
**角色**：平台管理員
**描述**：我想要在儀表板查看即時的營收、連線數與系統狀態，並能操作快捷功能，以便快速掌握全局。
**驗收標準 (AC)**：
1. 顯示即時 KPI（總下注、總派彩、線上機台數）。
2. 提供自定義快捷操作區，並顯示系統資源與 API 狀態監控摘要。
*   **對應 Mockup**：`mockup_dashboard.html`, `mockup_system_monitor.html`, `mockup_quick_actions.html`

### US-CENTRAL-02：多維度營收報表與交易統計
**角色**：財務主管
**描述**：我想要透過不同的維度（門市、遊戲、時間）查看營收報表與排行榜，以進行營運分析。
**驗收標準 (AC)**：
1. 支援依據時間區間、門市、遊戲等條件篩選。
2. 顯示熱門遊戲排行與獲利數據。
*   **對應 Mockup**：`mockup_revenue_report.html`, `mockup_transaction_stats.html`, `mockup_game_ranking.html`

---

## CM02 [M02] 機台與設備管理

### US-CENTRAL-03：機台註冊、配置與審核
**角色**：系統管理員
**描述**：我想要管理機台的註冊申請，並進行部署與基礎設定，以確保機台合法且正確地接入。
**驗收標準 (AC)**：
1. 支援審核新機台的註冊申請（包含 MAC 綁定）。
2. 提供 MVP 或標準流程新增與部署機台資訊。
*   **對應 Mockup**：`mockup_machine_registration.html`, `mockup_machine_approval.html`, `mockup_machine_deploy.html`, `mockup_mvp_machine_add.html`

### US-CENTRAL-04：機台列表與標籤管理
**角色**：平台管理員
**描述**：我想要查看所有機台的列表，為機台設定標籤與參數，以便於分類搜尋與後續分組派發更新。
**驗收標準 (AC)**：
1. 顯示所有機台及當前狀態（線上/離線）。
2. 支援新增、刪除自定義標籤（例如 VIP、大門口），並通過標籤檢索機台。
*   **對應 Mockup**：`mockup_mvp_machine_list.html`, `mockup_machine_tag_list.html`, `mockup_machine_settings.html`

### US-CENTRAL-05：機台遠端遙控、測試與安全轉移
**角色**：現場維運主管
**描述**：我想要遠端遙控機台（如鎖定/解鎖）並進行金鑰更新與配置無縫移轉，以便進行遠端維護。
**驗收標準 (AC)**：
1. 支援發送遠端控制指令，並追蹤執行結果回報。
2. 支援機台設定轉移（換機不掉檔）與通訊金鑰（API Key）重新生成。
3. 提供專屬「測試模式」供工程師模擬訊號。
*   **對應 Mockup**：`mockup_machine_remote_control.html`, `mockup_machine_test.html`, `mockup_machine_config_transfer.html`, `mockup_machine_key_generate.html`

### US-CENTRAL-06：設備健康度與心跳監控
**角色**：技術支持工程師
**描述**：我想要監控各機台的硬體狀態、網路心跳以及旗艦級監控指標，以便提早預防當機。
**驗收標準 (AC)**：
1. 視覺化顯示硬體 CPU、記憶體佔用與心跳延遲。
2. 支援旗艦版深層實時指標（如散熱/硬碟碎片等進階選項）。
*   **對應 Mockup**：`mockup_device_health.html`, `mockup_hardware_monitor.html`, `mockup_hardware_status.html`, `mockup_heartbeat_monitor.html`, `mockup_flg_monitor.html`

### US-CENTRAL-07：機台網路狀態設定與監控
**角色**：技術支持工程師
**描述**：我想要設定與監控機台的網路連線品質（IP/DNS），以便確保與中央的通訊無阻礙。
**驗收標準 (AC)**：
1. 提供網路連線品質的圖表呈現。
2. 支援遠端調整機台網卡層級的參數設定。
*   **對應 Mockup**：`mockup_network_monitor.html`, `mockup_network_settings.html`

---

## CM03 [M03] 遊戲庫與供應商管理

### US-CENTRAL-08：遊戲目錄與上架維護
**角色**：運營經理
**描述**：我想要管理遊戲目錄分類、手動新增遊戲並建立推薦清單，以便提供玩家豐富的遊戲選擇。
**驗收標準 (AC)**：
1. 支援建立自定義遊戲過濾分類。
2. 支援上架新遊戲並編輯遊戲詳情。
3. 可以自由排列推薦遊戲或人氣清單。
*   **對應 Mockup**：`mockup_game_config.html`, `mockup_game_detail.html`, `mockup_mvp_game_add.html`, `mockup_std_game_category.html`, `mockup_std_category_add.html`, `mockup_game_type_filter.html`, `mockup_recommended_games.html`

### US-CENTRAL-09：遊戲供應商與 API 對接狀態
**角色**：運營經理
**描述**：我想要管理第三方遊戲供應商，並查詢供應商的點數餘額，確保串接狀態健康不中斷。
**驗收標準 (AC)**：
1. 提供新增或編輯供應商資料卡，並監控串接 API 狀態。
2. 支援手動觸發遊戲庫更新 (Game Sync)。
3. 提供實境化查詢供應商餘額機制。
*   **對應 Mockup**：`mockup_game_supplier.html`, `mockup_game_sync.html`, `mockup_std_provider_list.html`, `mockup_std_provider_add.html`, `mockup_provider_balance.html`

### US-CENTRAL-10：遊戲運營開關與版本測試
**角色**：系統管理員
**描述**：我想要為指定門市做特定遊戲的上/下架控制（Toggle），並對即將上線的版本進行虛擬測試。
**驗收標準 (AC)**：
1. 提供視覺化的 Switch 控制台一鍵隱藏或開放指定遊戲。
2. 針對未公開遊戲提供沙盒測試介面，審查版號是否匹配。
*   **對應 Mockup**：`mockup_game_toggle.html`, `mockup_game_version.html`, `mockup_game_test.html`

---

## CM04 [M04] 錢包交易與財務會計

### US-CENTRAL-11：全平台金流與人工開洗分
**角色**：財務主管 / 店端主管
**描述**：我想要管理公司及下線錢包餘額、計算代理抽水，並在客訴狀況下進行遠端人工開/洗分。
**驗收標準 (AC)**：
1. 提供全局 Wallet 及個別帳戶的餘額異動看板。
2. 計算並結算代理商/營運商佣金，或針對機台直接操作 Cash-in/Cash-out。
*   **對應 Mockup**：`mockup_central_cash.html`, `mockup_std_wallet.html`, `mockup_commission.html`

### US-CENTRAL-12：交易明細查詢與異常除錯
**角色**：財務稽核員
**描述**：我想要查詢每一筆實體或虛擬交易明細，快速篩選出異常單據並匯出以供對帳作業。
**驗收標準 (AC)**：
1. 提供完整且防竄改的交易流水明細。
2. 獨立展示「交易失敗或掛起」的異常特區（Exception Handling）。
3. 支援匯出大批量交易為 CSV/Excel 以供離線分析。
*   **對應 Mockup**：`mockup_std_transaction_detail.html`, `mockup_transaction_exception.html`, `mockup_history_export.html`, `mockup_transaction_export.html`

---

## CM06 [M06] 多人遊戲與牌桌管理 (Multiplayer)

### US-CENTRAL-13：多人牌桌房間監控
**角色**：牌桌管理員
**描述**：我想要新增並監控各種多人遊戲（如百家樂）房間，掌握即時開放進度與線上人數。
**驗收標準 (AC)**：
1. 提供新增牌桌，並設定開桌參數功能。
2. 即時匯報牌房當前遊戲輪次與活耀狀態。
*   **對應 Mockup**：`mockup_std_multiplayer.html`, `mockup_std_multiplayer_add.html`, `mockup_multiplayer_status.html`

### US-CENTRAL-14：牌靴、下注金與荷官紀錄
**角色**：牌桌管理員
**描述**：我想要查看與記錄每局的牌靴 (Shoe) 消耗狀況、該局派發的下注總額，與每一名荷官的登錄行為。
**驗收標準 (AC)**：
1. 追蹤每場百家樂的開牌/洗牌狀態。
2. 分出派彩與玩家押注清單。
3. 紀錄荷官的上下班或換桌交接資訊。
*   **對應 Mockup**：`mockup_multiplayer_shoe.html`, `mockup_multiplayer_bet.html`, `mockup_multiplayer_dealer.html`

### US-CENTRAL-15：多人遊戲歷史及異常告警
**角色**：稽核員
**描述**：我想要管理牌桌的防作弊設定（警示上限），並擁有隨時調閱開牌路線與派單紀錄的能力。
**驗收標準 (AC)**：
1. 設定下注過高/開票異常警示條件。
2. 具備完整的逐局牌路歷史查詢介面。
3. 支援多人遊戲環境全域參數設置。
*   **對應 Mockup**：`mockup_multiplayer_history.html`, `mockup_multiplayer_config.html`, `mockup_multiplayer_alerts.html`

---

## CM07 [M07] 同步機制與爭議對帳

### US-CENTRAL-16：雙向佇列狀態與強制同步
**角色**：系統管理員
**描述**：我想要監控機台與中央的斷線佇列同步狀態，並在需要時觸發強制同步或處理普通同步衝突。
**驗收標準 (AC)**：
1. 視覺化監視本地 Queue 與雲端連入端點是否擁塞。
2. 提供日誌檢視上傳錯誤與資料鎖死（Conflict）排解介面。
3. 提供手動促發「Force Upload/Download」按鈕。
*   **對應 Mockup**：`mockup_sync_status.html`, `mockup_sync_logs.html`, `mockup_manual_sync.html`, `mockup_sync_conflict.html`

### US-CENTRAL-17：會計對帳與旗艦級爭議核銷特區
**角色**：會計稽核員
**描述**：我想要進行每日餘額的會計對帳，當發現本地快取與中央主庫不一時，能在爭議特區進行「人工核銷承認」。
**驗收標準 (AC)**：
1. 自動產製對帳結果（Reconciliation Check）並列出不平的差異票。
2. 在爭議處理專區，會計能單擊「同意採用本地數據」或「抹平為中央數據」。
*   **對應 Mockup**：`mockup_reconciliation_check.html`, `mockup_flg_reconciliation.html`, `mockup_flg_dispute.html`

---

## CM08 [M08] 無感熱更新與大廳廣播

### US-CENTRAL-18：OTA 更新包上傳與無感派發
**角色**：發布管理員
**描述**：我想要上傳經過加密驗證的新版軟體，並下發給全台，能即時看見機台背景下載進度（不影響營運）。
**驗收標準 (AC)**：
1. 支援更新包上傳與歷史版本清單（含有 MD5 碼）。
2. 提供一鍵派發介面（排程更新或立刻更新）。
3. 圖表顯示「派發成功、下載中、失敗退回」的進度狀態。
*   **對應 Mockup**：`mockup_version_upload.html`, `mockup_version_list.html`, `mockup_flg_ota.html`, `mockup_ota_task_deploy.html`, `mockup_update_progress.html`

### US-CENTRAL-19：行銷跑馬燈與前台大廳廣播
**角色**：運營經理
**描述**：我想要為各門市遠端設定輪播公告、大廳介面主題，或發送緊急系統訊息，以提升品牌活動推廣。
**驗收標準 (AC)**：
1. 佈局機台首頁的大廳設定（圖案、順序）。
2. 新增或管理公告訊息，包含全局廣播（跑馬燈）。
*   **對應 Mockup**：`mockup_announcement.html`, `mockup_broadcast_management.html`, `mockup_lobby_config.html`, `mockup_lobby_settings.html`

---

## CM09 [M09] API 監控與日誌查詢

### US-CENTRAL-20：系統日誌與 API 狀態防護
**角色**：系統工程師
**描述**：我想要深度探究 API Error、尋找稽核軌跡（Audit Log），藉此排查任何不法操作與連線異常。
**驗收標準 (AC)**：
1. 具備即時 API 回應碼統計視圖。
2. 稽核日誌必須不可竄改，能查詢包含時間、IP、操作員的關鍵變更行為。
3. 支援複合條件深度檢索文字日誌檔。
*   **對應 Mockup**：`mockup_api_log.html`, `mockup_api_status_monitor.html`, `mockup_audit_log.html`, `mockup_log_query.html`

---

## CM10 [M10] 全域告警與系統管理

### US-CENTRAL-21：告警閾值與主動通知
**角色**：系統管理員
**描述**：我想要自訂異常的告警閾值（如 CPU > 95% 或 斷線 3 次），並綁定特定的通知管道（如行事曆/站內信）。
**驗收標準 (AC)**：
1. 表單支援設定 CPU、RAM、Ping 及營業額異常參數。
2. 設定觸發警報後的通知對象與接收方式，站內留存所有被觸發的系統通知史。
*   **對應 Mockup**：`mockup_alert_threshold.html`, `mockup_alert_notifications.html`, `mockup_system_notifications.html`

### US-CENTRAL-22：全站設定、備份與測試環境切換
**角色**：超級管理員
**描述**：我想要隨時切測試/正式模式避免干擾真實帳本，並能設定每日定期的資料庫備份任務。
**驗收標準 (AC)**：
1. 全域的標準系統配置表單。
2. 設定資料庫與設定檔的週期性匯出/備份。
3. 特別標明「測試模式」狀態列，確保測試金流不寫入正式庫。
*   **對應 Mockup**：`mockup_std_system_settings.html`, `mockup_test_mode.html`, `mockup_std_backup.html`

---

## CM11 [M11] 無限級限 RBAC 管理

### US-CENTRAL-23：管理員登入與安全基礎設定
**角色**：所有中央使用者 / 資安官
**描述**：我想要確保後台登入安全（含忘記密碼），並讓資安官能設置密碼複雜度或 IP 白名單。
**驗收標準 (AC)**：
1. 標準登入與信箱重設密碼流程介面。
2. 提供防護罩設定（如阻擋跳板 IP、MFA、複雜度設定）。
*   **對應 Mockup**：`mockup_login.html`, `mockup_password_reset.html`, `mockup_security_settings.html`

### US-CENTRAL-24：動態角色分配與顆粒度權限
**角色**：超級管理員
**描述**：我想要將所有系統（含單機操作）切細成極小的操作單元（網格權限），再將其賦予不同的管理員/財務角色。
**驗收標準 (AC)**：
1. 提供視覺化的打勾網格矩陣（Permission Matrix），橫向為功能，縱向為增刪改查。
2. 角色表管理（例如自建立「北區經銷商」角色）。
3. 使用者列表編輯，將單一員工派發至自定義角色下。
*   **對應 Mockup**：`mockup_role_management.html`, `mockup_permission_matrix.html`, `mockup_user_edit.html`, `mockup_user_permission.html`
