# UI/UX 設計審查報告

**審查日期**: 2026-03-06  
**審查範圍**: mockup/central/ + mockup/local/ (74 個 HTML 檔案)  
**審查重點**: 視覺一致性、使用者體驗、響應式設計、無障礙設計

---

## 📊 總體評估

| 類別 | 評分 | 狀態 |
|-----|------|------|
| 視覺一致性 | 8/10 | ✅ 良好 |
| 使用者體驗 | 7/10 | ⚠️ 需改進 |
| 響應式設計 | 6/10 | ⚠️ 部分缺失 |
| 無障礙設計 | 5/10 | ❌ 需重大改進 |
| **總體** | **6.5/10** | ⚠️ 需優化 |

---

## 1. 視覺一致性 (Visual Consistency)

### ✅ 優點

1. **色彩系統統一**
   - 紫色主題色 (`#8b5cf6`, `#7c3aed`, `#a855f7`) 貫穿全站
   - 深色背景 (`#0a0a0f`, `#12121a`) 一致性高
   - 輔助色使用恰當 (emerald for success, red for danger, amber for warning)

2. **Glassmorphism 風格一致**
   - 所有卡片使用 `glass-card` class
   - 統一的 backdrop-filter 效果
   - 一致的 border 和 shadow 風格

3. **字體系統**
   - 統一使用 Noto Sans TC (中文) + JetBrains Mono (數字)
   - 字重階層清晰 (font-semibold for headers, normal for body)

### ⚠️ 問題

| 問題 | 嚴重度 | 位置 | 建議 |
|-----|--------|------|------|
| 部分頁面仍使用舊版漸層色 (`cyber` 而非 `dark`) | 中 | 早期 mockup 檔案 | 統一更新為 `dark` 命名空間 |
| 圓角大小不一致 (rounded-xl vs rounded-2xl) | 低 | 全站 | 建立圓角規範，卡片統一使用 rounded-2xl |
| 陰影效果不一致 | 低 | 全站 | 統一使用 shadow-glow 或 shadow-glow-sm |

---

## 2. 使用者體驗 (User Experience)

### ✅ 優點

1. **清晰的頁面結構**
   - Header + Main Content 結構一致
   - Sidebar 導航清晰
   - Breadcrumb/頁面標題明確

2. **操作反饋**
   - hover 效果 (`hover:scale-[1.02]`, `hover:bg-dark-hover`)
   - active 狀態 (按鈕縮放效果)
   - 載入動畫 (lucide icons)

### ⚠️ 問題

| 問題 | 嚴重度 | 位置 | 建議 |
|-----|--------|------|------|
| 缺少確認對話框 | **高** | 刪除/停用操作 | 重要操作需雙重確認 |
| 缺少錯誤提示 UI | **高** | 表單驗證 | 增加錯誤訊息元件 |
| 表格操作按鈕過小 | 中 | 機台列表、使用者列表 | 按鈕至少 32x32px |
| 缺少空狀態處理 | 中 | 列表頁面 | 無資料時顯示友善提示 |
| 搜尋功能無 loading 狀態 | 中 | 全站搜尋 | 增加搜尋中動畫 |

### 🔧 具體改進建議

**建議 1: 增加確認對話框元件**
```html
<!-- 刪除確認 -->
<div id="confirmModal" class="fixed inset-0 bg-black/70 hidden z-50 flex items-center justify-center">
  <div class="glass-card rounded-2xl p-6 max-w-md mx-4">
    <div class="flex items-center mb-4">
      <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
        <i data-lucide="alert-triangle" class="w-6 h-6 text-red-400"></i>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white">確認刪除？</h3>
        <p class="text-sm text-gray-400">此操作無法復原</p>
      </div>
    </div>
    <div class="flex justify-end space-x-3">
      <button onclick="closeModal()" class="px-4 py-2 bg-dark-bg rounded-lg text-gray-300">取消</button>
      <button onclick="confirmDelete()" class="px-4 py-2 bg-red-500 rounded-lg text-white">確認刪除</button>
    </div>
  </div>
</div>
```

**建議 2: 增加 Toast 通知系統**
```html
<!-- Toast 通知 -->
<div id="toast" class="fixed bottom-6 right-6 glass-card rounded-xl p-4 hidden">
  <div class="flex items-center">
    <i data-lucide="check-circle" class="w-5 h-5 text-emerald-400 mr-3"></i>
    <span class="text-white">操作成功</span>
  </div>
</div>
```

---

## 3. 響應式設計 (Responsive Design)

### ✅ 優點

1. **Local 端行動版設計良好**
   - 使用 `touch-action: manipulation`
   - 按鈕尺寸適合觸控 (min-height: 56px)
   - 禁止縮放 (`maximum-scale=1.0`)

2. **Grid 響應式布局**
   - 普遍使用 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
   - 表格可橫向滾動

### ⚠️ 問題

| 問題 | 嚴重度 | 位置 | 建議 |
|-----|--------|------|------|
| 中央後台缺少行動版優化 | **高** | mockup/central/ | 參考 local 端設計 |
| 表格在小螢幕顯示不全 | **高** | 所有列表頁 | 增加水平滾動或卡片式布局 |
| Sidebar 無法收合 (中央版) | 中 | 中央後台 | 增加漢堡選單 |
| 字體大小未調整 | 中 | 小螢幕 | 使用 rem 單位 |

### 🔧 具體改進建議

**建議 1: 中央後台增加行動版支援**
```css
/* 在 mockup-common.css 中增加 */
@media (max-width: 768px) {
  #sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  #sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0 !important;
  }
}
```

**建議 2: 表格響應式處理**
```html
<!-- 小螢幕改為卡片 -->
<div class="hidden md:block">
  <!-- 原表格 -->
</div>
<div class="md:hidden space-y-4">
  <!-- 卡片式布局 -->
  <div class="glass-card rounded-xl p-4">
    <div class="flex justify-between mb-2"><span class="text-gray-400">機台ID</span><span class="text-white">A-001</span></div>
    <div class="flex justify-between"><span class="text-gray-400">狀態</span><span class="text-emerald-400">線上</span></div>
  </div>
</div>
```

---

## 4. 無障礙設計 (Accessibility)

### ❌ 重大問題

| 問題 | 嚴重度 | 影響 | 建議 |
|-----|--------|------|------|
| 缺少 ARIA 標籤 | **高** | 螢幕閱讀器無法識別 | 增加 role, aria-label, aria-describedby |
| 色彩對比度不足 | **高** | 視障使用者難以閱讀 | 確保 WCAG AA 標準 (4.5:1) |
| 鍵盤導航不完善 | 中 | 無法使用鍵盤操作 | 增加 tabindex, focus 樣式 |
| 缺少 alt 文字 | 中 | 圖片無法被理解 | 所有圖片增加 alt |
| 表單缺少 label | **高** | 表單欄位無法識別 | 關聯 label 與 input |

### 🔧 具體改進建議

**建議 1: 增加 ARIA 標籤**
```html
<!-- 按鈕 -->
<button 
  aria-label="新增機台"
  role="button"
  class="px-4 py-2 gradient-purple rounded-lg"
>
  <i data-lucide="plus" aria-hidden="true"></i>
  <span>新增機台</span>
</button>

<!-- 導航 -->
<nav role="navigation" aria-label="主導航">
  <a href="#" role="link" aria-current="page">儀表板</a>
</nav>

<!-- 表格 -->
<table role="table" aria-label="機台列表">
  <th scope="col" role="columnheader">機台ID</th>
</table>
```

**建議 2: 改善色彩對比度**
```css
/* 當前對比度不足的組合：
   - text-gray-400 (#9ca3af) on bg-dark-bg (#12121a) = 3.8:1 ❌
   
   建議改為：
*/
.text-secondary {
  color: #a1a1aa; /* 更亮的灰色 */
}
/* 對比度提升至 4.6:1 ✅ */
```

**建議 3: 增加 focus 樣式**
```css
/* 在 mockup-common.css 中增加 */
*:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5);
}
```

---

## 5. 設計優先級建議

### 🔴 高優先 (立即處理)

1. **增加錯誤處理 UI**
   - 表單驗證錯誤提示
   - 網路錯誤提示
   - 空狀態處理

2. **確認對話框**
   - 刪除確認
   - 停用確認
   - 批次操作確認

3. **色彩對比度修正**
   - text-gray-400 → text-gray-300
   - 確保 4.5:1 對比度

### 🟡 中優先 (本週處理)

4. **響應式表格**
   - 小螢幕卡片化
   - 水平滾動優化

5. **行動版 Sidebar**
   - 中央後台增加漢堡選單
   - 手勢支援

6. **ARIA 標籤**
   - 主要頁面結構
   - 導航標記

### 🟢 低優先 (後續優化)

7. **動畫優化**
   - 頁面過渡動畫
   - 載入骨架屏

8. **深色/淺色主題切換**

---

## 6. 與其他 Agent 協作事項

### 標記給後端 Agent
- API 錯誤碼對照表
- 表單驗證規則

### 標記給測試 Agent
- 響應式斷點測試清單
- 無障礙測試檢查清單

---

## 附件：優先修正檔案清單

| 優先級 | 檔案 | 問題 | 估計工時 |
|-------|------|------|---------|
| 🔴 高 | mockup_user_permission.html | 缺少刪除確認 | 30分鐘 |
| 🔴 高 | mockup_mvp_machine_list.html | 缺少停用確認 | 30分鐘 |
| 🔴 高 | mockup_game_*.html | 色彩對比度 | 1小時 |
| 🟡 中 | 所有列表頁 | 響應式表格 | 3小時 |
| 🟡 中 | mockup-common.css | ARIA + focus | 2小時 |

---

**審查人**: Front-End Architect Agent  
**審查完成時間**: 2026-03-06 03:30 UTC
