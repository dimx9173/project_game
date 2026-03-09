# Agent Onboarding: Game Platform Management System (V8 Flagship Edition)

As a newly joined AI Agent, please read this guide first to quickly get up to speed with the development environment. This guide contains reading paths for essential documents and "iron rules" you must follow during development.

---

## 🗺️ Reading Guide (Core Documents)

To quickly grasp the system, please read the following documents in order:

### 1. System Overview & Function Matrix
- **[Functional Matrix & Flowcharts](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E5%8A%9F%E8%83%BD%E7%9F%A9%E9%99%A3%E8%88%87%E6%B5%81%E7%A8%8B%E5%9C%96_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **Purpose**: Defines all function codes (e.g., `[L45]`, `[C12]`). Before modifying any code or document, ALWAYS confirm the functional scope and latest definitions mapped by these codes.
  - **Focus**: Pay attention to the Mermaid flowcharts revealing the interaction logic between Central and Local systems.

### 2. Architecture & Technical Specifications
- **[Technical Architecture & Design Specs](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E6%8A%80%E8%A1%93%E6%9E%B6%E6%A7%8B%E8%88%87%E8%A8%AD%E8%A8%88%E8%A6%8F%E7%AF%84_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **Purpose**: Establishes the core technical foundation, technology stacks, security protocols, API conventions, and database standards. This was formerly the SD document.

### 3. Data Structures & API Contracts
- **[Database Design Document](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E8%B3%87%E6%96%99%E5%BA%AB%E8%A8%AD%E8%A8%88%E6%96%87%E4%BB%B6_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **Purpose**: Defines database table structures.
  - **Focus**: Notice the `instanceId` indexing and identification mechanisms.
- **[API OpenAPI Specification](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/API_openapi.yaml)**
  - **Purpose**: The single source of truth for interface development. All RESTful calls MUST adhere to this specification.

### 4. Detailed Feature Logic & UI
- **[feature_docs/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/feature_docs/)**
  - **Purpose**: The primary source for specific business logic. Dive into specific modules (e.g., `[L34] 同步對帳`) for detailed logic flows, error handling, and API/DB mappings.
- **[mockup/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/mockup/)**
  - **Purpose**: UI implementation reference, logically separated into `central/` and `local/` interfaces.

---

## ⚖️ Iron Rules for Development

Any Agent developing within this project MUST adhere to the following strict guidelines:

### 1. Separation of Concerns (Central vs. Local)
- **Central Determinism**: For anything involving "System Configurations", "Access Control & Permissions", or "Game Catalog", the Central system is the absolute authority and Single Source of Truth.
- **No Local Tampering**: The Local endpoint treats data originating from Central (e.g., machine configurations, game libraries) as a "Read-Only Cache". Direct modification of the local database for these items is strictly prohibited. All changes MUST be managed via Cloud API synchronization.
- **Local Operational Independence**: For field operation tasks (e.g., `[L45]` Add/Deduct Funds, machine reboots), the Local system operates independently to ensure on-site efficiency and fault tolerance. These actions **do not** require prior authorization from the Central backend.

### 2. Communication & Sync Protocol (Push-Pull-Status Flow)
- **SignalR First**: Real-time notifications rely exclusively on WebSocket (SignalR). Do not introduce new communication protocols (like MQTT).
- **Standard 3-Step Flow**: The configuration flow is always: `CONFIG_UPDATE` (Push notification) -> `GET /configs/{id}` (Pull data) -> `POST /config/status` (Report status).

### 3. Machine Identification (Hardware Anchor)
- **MAC Binding**: Upon a machine's initial registration, Central assigns a unique `instanceId` bound to its MAC address.
- **Offline Protection**: The system must continuously monitor connection status. If a machine goes offline, initiating new games is disabled; users can only view cached historical records.

### 4. Interfaces & Security
- **Versioned APIs**: All endpoints MUST use the `/api/v1/...` prefix.
- **Data Integrity**: Critical configuration transfers MUST include HMAC-SHA256 signature verification.
- **Sensitive Information**: All API keys and passwords MUST be encrypted using AES-256-GCM for both storage and transmission.

### 5. Documentation Consistency
- **No Redundant Docs**: Do not indiscriminately create standalone technical documents. All protocol and feature details should be integrated into the corresponding feature document inside `feature_docs/` (e.g., `[C113]`).
- **Code Mapping**: Code comments or PR descriptions MUST explicitly reference their corresponding function codes (e.g., `Refactored sync logic for [L07]`).

---
*Violating these iron rules will lead to the collapse of the system architecture. Think twice before proceeding with architectural modifications.*
