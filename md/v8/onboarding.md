# Agent Onboarding: Game Platform Management System (V8 Flagship Edition)

As a newly onboarded AI Agent, please read this guide first to quickly get up to speed with the development process. This guide contains reading paths for documents and the "Iron Rules" that must be followed during development.

---

## 🗺️ Core Document Reading Guide

To quickly understand the system, please read the following documents in order:

### 1. System Overview and Feature Codes
- **[Functional Matrix and Flowcharts](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E5%8A%9F%E8%83%BD%E7%9F%A9%E9%99%A3%E8%88%87%E6%B5%81%E7%A8%8B%E5%9C%96_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **Purpose**: Defines all feature codes (e.g., `[L45]`, `[C12]`). Before modifying any code or document, make sure to confirm the feature scope and latest definitions corresponding to the code.
  - **Key Point**: Mermaid flowcharts reveal the interaction logic between Central and Local backends.

### 2. Data Structure and Interface Contracts
- **[Database Design Document](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%B5%B1_%E8%B3%87%E6%96%99%E5%BA%AB%E8%A8%AD%E8%A8%88%E6%96%87%E4%BB%B6_%E6%97%97%E8%89%A6%E7%89%88.md)**
  - **Purpose**: Defines database table structures.
  - **Key Point**: Pay attention to the identification mechanism of `instanceId`.
- **[API OpenAPI Specification](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/API_openapi.yaml)**
  - **Purpose**: The single source of truth for interface development. All RESTful calls must comply with this specification.

### 3. Detailed Feature Logic and UI
- **[feature_docs/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/feature_docs)**
  - **Purpose**: Deep dive into the detailed business logic and exception handling of specific modules (e.g., `[L34]` Synchronized Reconciliation).
- **[mockup/](file:///Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My%20Drive/%E8%80%81%E5%85%AC%E8%88%87%E8%80%81%E5%A9%86%E5%88%86%E4%BA%AB/%E5%B0%88%E6%A1%88/%E9%81%8A%E6%88%B2%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86/md/v8/mockup)**
  - **Purpose**: References for UI development. Separated into `central/` and `local/` sides.

---

## ⚖️ Iron Rules for Development

Any Agent conducting development must strictly adhere to the following inviolable principles:

### 1. Separation of Concerns
- **Central Determinism**: For anything involving "System Configuration," "Permission Control," or the "Game List," Central has absolute authority and acts as the Single Source of Truth.
- **No Local Tampering**: The Local end must treat data from Central (e.g., machine settings, game library) with a "Read-Only Cache" principle. Modifying the local database directly is strictly forbidden; all changes must be synchronized via Cloud APIs.
- **Local Operational Independence**: Operations related to on-site tasks (e.g., `[L45]` Cash in/out, machine restart) should rely primarily on standalone local operations to ensure on-site efficiency and fault tolerance. They **DO NOT** require real-time authorization from the centralized backend (Central).

### 2. Communication and Synchronization Protocol (Push-Pull-Status Flow)
- **SignalR First**: Use WebSocket (SignalR) for real-time notifications. Introducing new communication components (like MQTT) is strictly prohibited.
- **Standard 3-Step Flow**: `CONFIG_UPDATE` (Push) -> `GET /configs/{id}` (Pull) -> `POST /config/status` (Report).

### 3. Machine Identification and Registration (Hardware Anchor)
- **MAC Address Binding**: Upon initial machine registration, Central assigns a unique `instanceId` based on the MAC address.
- **Offline Protection**: The system must detect connection status. When a machine is offline, starting new games is prohibited, and only cached historical records can be viewed.

### 4. Interface and Security
- **Versioned API**: Always use the `/api/v1/...` prefix.
- **Data Integrity**: Transmission of critical configurations must include HMAC-SHA256 signature verification.
- **Sensitive Information**: All API Keys or passwords must be stored/transmitted with AES-256-GCM encryption.

### 5. Document Consistency
- **No Redundancy**: Do not arbitrarily create independent technical documents. All protocol details should be integrated into the corresponding `feature_docs` (e.g., `[C113]`).
- **Code Mapping**: Code comments or PR descriptions must explicitly mention the corresponding feature codes (e.g., `[L07]`).

---
*Violating the above iron rules will lead to the collapse of the system architecture. Please think twice before making changes.*
