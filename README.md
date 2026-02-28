# 遊戲平台管理系統 (Game Platform)

[![GitHub Stars](https://img.shields.io/github/stars/dimx9173/project_game)](https://github.com/dimx9173/project_game/stargazers)
[![License](https://img.shields.io/github/license/dimx9173/project_game)](LICENSE)

## 📋 專案概述

遊戲平台管理系統 V6 是一個穩定可靠的遊戲平台管理解決方案，支援三個版本：

| 版本 | 工時 | 說明 |
|------|------|------|
| MVP 版 | 55 MD | 基礎功能，含 3 家遊戲串接 |
| 標準版 | 70 MD | 擴充功能，含代理商管理 |
| 旗艦版 | 90 MD | 完整功能，含 OTA、監控、錯帳管理 |

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────┐
│                    玩家端應用程式                      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                 單機本地後台 (Local)                   │
│   React + Express + SQLite                         │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS / WebSocket
                      ▼
┌─────────────────────────────────────────────────────┐
│                 中央後台 (Central)                    │
│   React + Express + PostgreSQL                      │
└─────────────────────┬───────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ RG 電子 │  │ JDB 電子│  │其他遊戲商│
    └─────────┘  └─────────┘  └─────────┘
```

## 🛠️ 技術堆疊

### 前端
- **框架**: React 18.x
- **UI**: Tailwind CSS 4.x + shadcn/ui
- **路由**: Wouter
- **狀態**: Zustand
- **圖表**: Recharts

### 後端
- **執行環境**: Node.js 20.11.x LTS
- **框架**: Express.js 4.x
- **資料庫**: PostgreSQL 15.x (中央) / SQLite 3.x (本地)
- **快取**: Redis 7.x
- **認證**: JWT (jose)

## 🚀 快速開始

### 前置需求

- Node.js 20.11+
- PostgreSQL 15+
- Redis 7+ (可選)
- Docker & Docker Compose (可選)

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/dimx9173/project_game.git
cd project_game

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 檔案

# 4. 啟動開發伺服器
npm run dev
```

### 使用 Docker 啟動

```bash
# 啟動所有服務
docker-compose up -d

# 查看日誌
docker-compose logs -f
```

## 📁 目錄結構

```
project_game/
├── src/
│   ├── backend/          # 中央後端 API
│   ├── frontend/         # React 前端
│   ├── local-backend/    # 本地後端 (單機)
│   └── shared/           # 共用類型定義
├── docs/                 # 技術文件
├── md/                   # Markdown 文件
│   └── v6/               # V6 版本文件
├── tests/                # 測試文件
└── docker-compose.yml    # Docker 組態
```

## 📚 文件導覽

| 文件 | 說明 |
|------|------|
| [系統設計文件 (SD)](md/v6/系統設計文件_SD.md) | 完整技術規格 |
| [API 文件](md/v6/API_v1_openapi.yaml) | OpenAPI 格式 |
| [版本差異對照表](md/v6/版本差異對照表.md) | 版本功能比較 |

## 🔌 API 端點

- **認證**: /api/v1/auth/*
- **機台管理**: /api/v1/machines/*
- **玩家管理**: /api/v1/players/*
- **交易管理**: /api/v1/transactions/*
- **遊戲商管理**: /api/v1/providers/* (標準版/旗艦版)
- **代理商管理**: /api/v1/agents/* (標準版/旗艦版)
- **OTA 更新**: /api/v1/ota/* (旗艦版)
- **監控中心**: /api/v1/monitor/* (旗艦版)

## 🌍 環境變數

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/gamedb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=3000
```

## 👤 作者

- **作者**: Brian Tseng
- **GitHub**: @dimx9173
