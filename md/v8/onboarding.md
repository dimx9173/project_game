# Agent 入職指南：遊戲平台管理系統（V8 旗艦版）

作為新加入的 AI Agent，請先閱讀本指南以快速熟悉開發環境。此指南包含核心文件的閱讀路徑以及開發過程中必須遵守的「鐵則」。

---

## 🗺️ 閱讀指南（核心文件）

為了快速掌握系統，請依序閱讀以下文件：

### 1. 系統總覽與功能矩陣
- **[功能矩陣與流程圖](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E5%8A%9F%E8%83%BD%E7%9F%A9%E9%99%A3%E8%88%87%E6%B5%81%E7%A8%8B%E5%9C%96_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **目的**：定義所有功能代碼（例如 `[L45]`、`[C12]`）。在修改任何程式碼或文件之前，**必須**先確認這些代碼所對應的功能範圍與最新定義。
  - **重點**：請留意揭示 Central 與 Local 系統互動邏輯的 Mermaid 流程圖。

### 2. 架構與技術規範
- **[技術架構與設計規範](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E6%8A%80%E8%A1%93%E6%9E%B6%E6%A7%8B%E8%88%87%E8%A8%AD%E8%A8%88%E8%A6%8F%E7%AF%84_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **目的**：建立核心技術基礎、技術堆疊、安全協議、API 規範以及資料庫標準。此文檔前身為 SD 文件。

### 3. 資料結構與 API 規格
- **[資料庫設計文件](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E8%B3%87%E6%96%99%E5%BA%AB%E8%A8%AD%E8%A8%88%E6%96%87%E4%BB%B6_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **目的**：定義資料庫表結構。
  - **重點**：請特別注意 `instanceId` 的索引與識別機制。
- **[API OpenAPI 規格](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/API_openapi.yaml)**
  - **目的**：介面開發的單一真實來源 (Single Source of Truth)。所有的 RESTful 呼叫**必須**遵循此規格。

### 4. 詳細功能邏輯與 UI
- **[feature_docs/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/feature_docs/)**
  - **目的**：具體業務邏輯的主要來源。請深入特定模組（例如 `[L34] 同步對帳`）以了解詳細的邏輯流程、錯誤處理以及 API/DB 對應。
- **[mockup/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/mockup/)**
  - **目的**：UI 實作參考，在邏輯上劃分為 `central/` 與 `local/` 介面。

---

## ⚖️ 開發鐵則

參與此專案開發的所有 Agent **必須**嚴格遵守以下準則：

### 1. 關注點分離（Central 與 Local）
- **Central 決定權**：涉及「系統設定」、「存取控制與權限」或「遊戲庫」等相關事務時，Central 系統擁有絕對權威，為單一真實來源。
- **Local 不得篡改**：Local 端應將來自 Central 的資料（例如機台配置、遊戲庫）視為「唯讀快取」。**嚴禁**直接修改與這些項目相關的本地資料庫。所有的變更都**必須**透過 Cloud API 同步來管理。
- **Local 營運獨立**：對於現場營運任務（例如 `[L45]` 開洗分、機台重啟），Local 系統會獨立運作以確保現場效率與容錯能力。這些操作**不需要**事先取得 Central 後台的授權。

### 2. 通訊與同步協議（推-拉-狀態 流程）
- **SignalR 優先**：即時通知完全依賴 WebSocket (SignalR)。請勿引入新的通訊協定（如 MQTT）。
- **標準三步流程**：設定下發的流程始終為：`CONFIG_UPDATE`（Push 通知） -> `GET /configs/{id}`（Pull 資料） -> `POST /config/status`（狀態回報）。

### 3. 機台識別（硬體綁定）
- **MAC 綁定**：機台首次註冊時，Central 會分配一組綁定其 MAC 位址的唯一 `instanceId`。
- **離線保護**：系統必須持續監控連線狀態。機台若斷線，將停用啟動新遊戲的功能；使用者僅能檢視快取的歷史紀錄。

### 4. 介面與安全性
- **API 版本控制**：所有端點都**必須**使用 `/api/v1/...` 前綴。
- **資料完整性**：關鍵的設定傳輸**必須**包含 HMAC-SHA256 簽名驗證。
- **敏感資訊**：所有 API 金鑰與密碼無論在儲存或傳輸階段，都**必須**使用 AES-256-GCM 加密。

### 5. 文件一致性
- **禁止建立冗餘文件**：不要隨意建立獨立的技術文件。所有協議與功能細節都應整合到 `feature_docs/` 內對應的功能文件中（例如 `[C113]`）。
- **程式碼對應**：程式碼註解或 PR 描述中**必須**明確引用相對應的功能代碼（例如 `Refactored sync logic for [L07]`）。

---
*違反這些鐵則將導致系統架構崩壞。在進行架構修改前請三思。*
