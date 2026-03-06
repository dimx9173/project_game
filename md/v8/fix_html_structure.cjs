#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 統計
const stats = {
  total: 0,
  fixed: 0,
  skipped: 0,
  errors: [],
};

// 修正 HTML 結構
function fixHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let modified = false;
    
    // 1. 檢查並加入 DOCTYPE
    if (!content.trim().toLowerCase().startsWith('<!doctype')) {
      content = '<!DOCTYPE html>\n' + content;
      modified = true;
    }
    
    // 2. 檢查並加入 viewport meta
    if (!content.includes('viewport')) {
      // 找到 <head> 標籤後插入
      const headMatch = content.match(/<head[^>]*>/i);
      if (headMatch) {
        const headEnd = content.indexOf(headMatch[0]) + headMatch[0].length;
        const viewportMeta = '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">';
        content = content.slice(0, headEnd) + viewportMeta + content.slice(headEnd);
        modified = true;
      } else if (content.includes('<html')) {
        // 如果沒有 <head>，在 <html> 後加入
        const htmlMatch = content.match(/<html[^>]*>/i);
        if (htmlMatch) {
          const htmlEnd = content.indexOf(htmlMatch[0]) + htmlMatch[0].length;
          const headSection = '\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>';
          content = content.slice(0, htmlEnd) + headSection + content.slice(htmlEnd);
          modified = true;
        }
      }
    }
    
    // 3. 檢查並加入 charset meta
    if (!content.includes('charset')) {
      const headMatch = content.match(/<head[^>]*>/i);
      if (headMatch) {
        const headEnd = content.indexOf(headMatch[0]) + headMatch[0].length;
        const charsetMeta = '\n    <meta charset="UTF-8">';
        content = content.slice(0, headEnd) + charsetMeta + content.slice(headEnd);
        modified = true;
      }
    }
    
    // 4. 檢查 sidebar.js 引用
    const relativePath = path.dirname(filePath);
    const isLocal = relativePath.includes('/local/');
    const sidebarPath = isLocal ? '../js/sidebar.js' : '../js/sidebar.js';
    
    // 檢查現有的 sidebar 引用路徑
    const hasSidebar = content.includes('sidebar.js') || content.includes('sidebar');
    
    if (!hasSidebar) {
      // 在 </body> 前加入 sidebar.js
      const bodyEndMatch = content.lastIndexOf('</body>');
      if (bodyEndMatch !== -1) {
        const scriptTag = `\n    <script src="${sidebarPath}"></script>`;
        content = content.slice(0, bodyEndMatch) + scriptTag + content.slice(bodyEndMatch);
        modified = true;
      } else {
        // 如果沒有 </body>，在檔案結尾加入
        content += `\n    <script src="${sidebarPath}"></script>\n</html>`;
        modified = true;
      }
    }
    
    // 寫回檔案
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.fixed++;
      console.log(`✅ Fixed: ${path.basename(filePath)}`);
    } else {
      stats.skipped++;
      console.log(`⏭️ Skipped: ${path.basename(filePath)} (no changes needed)`);
    }
    
  } catch (err) {
    stats.errors.push({ file: filePath, error: err.message });
    console.error(`❌ Error: ${path.basename(filePath)} - ${err.message}`);
  }
}

// 掃描目錄
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith('.html')) {
      stats.total++;
      fixHtmlFile(fullPath);
    }
  });
}

// 主程式
const mockupDir = path.join(__dirname, 'mockup');

console.log('========================================');
console.log('  Mockup HTML 結構批次修正工具');
console.log('========================================\n');

scanDirectory(mockupDir);

console.log('\n========================================');
console.log('  執行結果');
console.log('========================================');
console.log(`總檔案數: ${stats.total}`);
console.log(`已修正: ${stats.fixed}`);
console.log(`跳過: ${stats.skipped}`);
console.log(`錯誤: ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log('\n錯誤詳情:');
  stats.errors.forEach(e => {
    console.log(`  - ${e.file}: ${e.error}`);
  });
}

console.log('\n完成！');