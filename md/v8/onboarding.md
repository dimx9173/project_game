# Agent Onboarding: 遊戲平台管理系統 (V8 旗艦版)

作為新加入的 AI Agent，請先行閱讀此指引以快速進入開發狀態。本指南包含文件的閱讀路徑與開發必須遵守的「鐵律」。

---

## 🗺️ 核心文件導讀 (Reading Guide)

為了快速理解系統，請依序閱讀以下文件：

### 1. 系統全貌與流程碼
- **[功能矩陣與流程圖](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E5%8A%9F%E8%83%BD%E7%9F%A9%E9%99%A3%E8%88%87%E6%B5%81%E7%A8%8B%E5%9C%96_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **用途**：定義了所有功能代碼（如 `[C11]`, `[L07]`）。在修改任何代碼或文件前，務必確認代碼對應的功能範圍。
  - **重點**：Mermaid 流程圖揭示了 Central 與 Local 的交互邏輯。

### 2. 資料結構與介面契約
- **[資料庫設計文件](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E8%B3%87%E6%96%99%E5%BA%AB%E8%A8%AD%E8%A8%88%E6%96%87%E4%BB%B6_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **用途**：定義表結構。
  - **重點**：注意 `instanceId` 的識別機制。
- **[API OpenAPI 規範](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/API_openapi.yaml)**
  - **用途**：介面開發的唯一真相。所有 RESTful 調用必須符合此規範。

### 3. 功能細部邏輯與 UI
- **[feature_docs/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/feature_docs)**
  - **用途**：深入了解具體模組（如 [L34] 同步對帳）的詳細商務邏輯與異常處理。
- **[mockup/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/mockup)**
  - **用途**：UI 開發的參考。分為 `central/` 與 `local/` 兩端。

---

## ⚖️ 開發鐵律 (Iron Rules)

任何 Agent 進行開發時，必須遵守以下不可逾越的準則：

### 1. 中央集權原則 (Single Source of Truth)
- **Central 決定論**：凡涉及「配置」、「權限」、「遊戲列表」，Central 擁有絕對權威。
- **禁止本地篡改**：Local 端對於來自 Central 的資料（如機台設定）採取「唯讀快取」原則，嚴禁直接修改本地資料庫，所有變更必須透過 Cloud API。

### 2. 通訊同步協定 (Push-Pull-Status Flow)
- **SignalR 為主**：實時通知使用 WebSocket (SignalR)，嚴禁引入新的通訊組件（如 MQTT）。
- **標準三步驟**：`CONFIG_UPDATE` (推送) -> `GET /configs/{id}` (抓取) -> `POST /config/status` (回報)。

### 3. 機台識別與註冊 (Hardware Anchor)
- **MAC 綁定**：機台首次註冊時，Central 根據 MAC 位址分配唯一的 `instanceId`。
- **離線保護**：系統必須偵測連線狀態。機台離線時禁止開始新遊戲，僅能查看快取的歷史紀錄。

### 4. 介面與安全性 (Security & API)
- **版本化 API**：一律使用 `/api/v1/...` 前綴。
- **資料完整性**：關鍵配置傳輸必須包含 HMAC-SHA256 簽名校驗。
- **敏感資訊**：所有 API Key 或密碼必須使用 AES-256-GCM 進行加密存儲/傳輸。

### 5. 文件一致性
- **禁止冗餘**：不隨意新增獨立技術文件，所有協議細節應整合進對應的 `feature_docs` (如 [C113])。
- **代碼映射**：代碼註釋或 PR 說明必須提及對應的功能代碼（如 `[L07]`）。

---
*違反上述鐵律將導致系統架構崩塌，修改前請三思。*
