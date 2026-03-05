# Mockup 共用左側選單 (Shared Sidebar)

左邊選單已抽成共用元件，local 開 `file://` 即可使用，無需 server。

## 使用方式

1. **HTML 結構**：在 `<body>` 內、`<main>` 前放一個容器：
   ```html
   <body class="gradient-bg min-h-screen flex">
     <div id="sidebar-container"></div>
     <main class="flex-1 flex flex-col overflow-hidden">
       <!-- 頁面內容 -->
     </main>
   </body>
   ```

2. **引入共用 CSS**（在 `<head>` 內）：
   ```html
   <link href="css/mockup-common.css" rel="stylesheet">
   ```

3. **引入 sidebar 腳本並指定當前頁**（在 `</body>` 前）：
   ```html
   <script src="js/sidebar.js"></script>
   <script>
     MockupSidebar.render('mockup_dashboard.html');  <!-- 改成當前頁檔名 -->
     lucide.createIcons();
   </script>
   ```

4. **依需求保留**：Tailwind config、Lucide、頁面專用 `<style>` 可保留；與 sidebar 重複的 CSS 可刪除，改由 `mockup-common.css` 提供。

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `js/sidebar.js` | 共用選單邏輯與結構，以 DOM 建立，不依賴 server |
| `css/mockup-common.css` | 共用樣式（sidebar、glass、badge、table 等） |

## 已改用共用選單的頁面

- `mockup_dashboard.html`
- `mockup_mvp_machine_list.html`

其餘 mockup 頁面可依上述三步驟改為使用共用選單；`MockupSidebar.render('當前檔名.html')` 會自動標示當前頁並展開所屬選單群組。
