#!/bin/bash
# 從 HTML Mockup 產生 PNG 截圖
# 使用 playwright 或 puppeteer 進行批次截圖

cd /home/brian/project/game/md/v8/mockup

echo "=== PNG 產生腳本 ==="
echo ""
echo "此腳本用於從 HTML Mockup 產生 PNG 截圖"
echo "需要安裝 playwright: npm install -g playwright"
echo ""

# 建立輸出目錄
mkdir -p png/central
mkdir -p png/local

# 產生 PNG 的清單
echo "=== 需要產生 PNG 的檔案清單 ==="
echo ""

echo "Central Mockups (74 個):"
for file in central/*.html; do
    basename=$(basename "$file" .html)
    echo "  - $file -> png/${basename}.png"
done

echo ""
echo "Local Mockups (9 個):"
for file in local/*.html; do
    basename=$(basename "$file" .html)
    echo "  - $file -> png/${basename}.png"
done

echo ""
echo "總計: 83 個 PNG 需要產生"
echo ""

# 檢查 playwright 是否安裝
if ! command -v npx &> /dev/null; then
    echo "⚠️  未找到 npx，請安裝 Node.js 和 playwright:"
    echo "    npm install -g playwright"
    echo "    npx playwright install chromium"
    exit 1
fi

echo "=== 手動執行命令 ==="
echo ""
echo "1. 安裝 playwright:"
echo "   npm install -g playwright"
echo "   npx playwright install chromium"
echo ""
echo "2. 使用 playwright 截圖:"
echo "   npx playwright screenshot --viewport-size=1920,1080 central/\[C01\]儀表板.html png/\[C01\]儀表板.png"
echo ""
echo "3. 或使用批次腳本 (需要 Node.js):"
echo "   node screenshot-batch.js"
echo ""

# 建立批次截圖腳本
cat > screenshot-batch.js << 'EOF'
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshot(inputFile, outputFile) {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
    });
    
    await page.goto('file://' + path.resolve(inputFile));
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
        path: outputFile,
        fullPage: true 
    });
    
    await browser.close();
    console.log(`✓ ${inputFile} -> ${outputFile}`);
}

async function main() {
    const centralDir = 'central';
    const localDir = 'local';
    const pngDir = 'png';
    
    // 確保輸出目錄存在
    if (!fs.existsSync(`${pngDir}/central`)) {
        fs.mkdirSync(`${pngDir}/central`, { recursive: true });
    }
    if (!fs.existsSync(`${pngDir}/local`)) {
        fs.mkdirSync(`${pngDir}/local`, { recursive: true });
    }
    
    // 處理 Central mockups
    const centralFiles = fs.readdirSync(centralDir).filter(f => f.endsWith('.html'));
    console.log(`處理 ${centralFiles.length} 個 Central mockups...`);
    for (const file of centralFiles) {
        const inputFile = path.join(centralDir, file);
        const outputFile = path.join(pngDir, 'central', file.replace('.html', '.png'));
        await captureScreenshot(inputFile, outputFile);
    }
    
    // 處理 Local mockups
    const localFiles = fs.readdirSync(localDir).filter(f => f.endsWith('.html'));
    console.log(`處理 ${localFiles.length} 個 Local mockups...`);
    for (const file of localFiles) {
        const inputFile = path.join(localDir, file);
        const outputFile = path.join(pngDir, 'local', file.replace('.html', '.png'));
        await captureScreenshot(inputFile, outputFile);
    }
    
    console.log('\n✅ 所有截圖完成！');
}

main().catch(console.error);
EOF

echo "已建立批次截圖腳本: screenshot-batch.js"
echo ""
echo "執行方式: node screenshot-batch.js"
