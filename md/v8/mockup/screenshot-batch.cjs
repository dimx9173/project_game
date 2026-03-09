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
    console.log(`✓ ${path.basename(inputFile)} -> ${path.basename(outputFile)}`);
}

async function main() {
    const pngDir = 'png';
    
    // 確保輸出目錄存在
    if (!fs.existsSync(`${pngDir}/central`)) {
        fs.mkdirSync(`${pngDir}/central`, { recursive: true });
    }
    if (!fs.existsSync(`${pngDir}/local`)) {
        fs.mkdirSync(`${pngDir}/local`, { recursive: true });
    }
    
    // 處理 Central mockups
    const centralFiles = fs.readdirSync('central').filter(f => f.endsWith('.html'));
    console.log(`處理 ${centralFiles.length} 個 Central mockups...`);
    for (const file of centralFiles) {
        const inputFile = path.join('central', file);
        const outputFile = path.join(pngDir, 'central', file.replace('.html', '.png'));
        try {
            await captureScreenshot(inputFile, outputFile);
        } catch (err) {
            console.error(`✗ Failed: ${file} - ${err.message}`);
        }
    }
    
    // 處理 Local mockups
    const localFiles = fs.readdirSync('local').filter(f => f.endsWith('.html'));
    console.log(`\n處理 ${localFiles.length} 個 Local mockups...`);
    for (const file of localFiles) {
        const inputFile = path.join('local', file);
        const outputFile = path.join(pngDir, 'local', file.replace('.html', '.png'));
        try {
            await captureScreenshot(inputFile, outputFile);
        } catch (err) {
            console.error(`✗ Failed: ${file} - ${err.message}`);
        }
    }
    
    console.log('\n✅ 所有截圖完成！');
}

main().catch(console.error);
