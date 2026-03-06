# Mockup 測試檢查清單

**測試人員：** 🧪 測試員  
**日期：** 2026-03-06

---

## 快速檢查表

### ✅ 結構檢查 (Structural)

- [ ] `<!DOCTYPE html>` 存在
- [ ] `<meta name="viewport">` 存在
- [ ] `<title>` 正確
- [ ] `sidebar.js` 引用正確 (登入頁除外)

### ✅ 功能檢查 (Functional)

- [ ] 按鈕可點擊
- [ ] 連結正確
- [ ] 表單有 required 欄位
- [ ] 狀態切換有樣式

### ✅ 互動回饋 (Interaction)

- [ ] 有 hover 效果
- [ ] 有 active 效果
- [ ] 有確認對話框 (刪除/停用)
- [ ] 有錯誤提示 UI

### ✅ 響應式 (Responsive)

- [ ] 1440px 正常
- [ ] 768px 正常
- [ ] 375px 無溢版
- [ ] 表格可滾動

### ✅ 無障礙 (Accessibility)

- [ ] 對比度 ≥ 4.5:1
- [ ] 有 ARIA 標籤
- [ ] focus 樣式存在
- [ ] label 與 input 關聯

---

## 高風險問題速查

| 優先 | 問題 | 檔案 |
|------|------|------|
| 🔴 | 缺少確認對話框 | `mockup_user_permission.html` |
| 🔴 | 缺少確認對話框 | `mockup_mvp_machine_list.html` |
| 🔴 | 色彩對比度不足 | `mockup_game_*.html` |
| 🟡 | 功能重複 | `mockup_lobby_config/settings.html` |
| 🟡 | 命名不統一 | `mockup_mvp_*.html` |

---

## 通過標準速記

```
Critical = 0  →  ✅ 通過
Minor ≤ 5    →  ⚠️ 有條件通過
Critical ≥ 1 →  ❌ 需修正
```

---

**版本：** 1.0
