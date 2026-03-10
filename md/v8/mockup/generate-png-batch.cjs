const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshot(inputFile, outputFile) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
    });

    try {
        await page.goto('file://' + path.resolve(inputFile), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000); // 等待動畫完成

        await page.screenshot({
            path: outputFile,
            fullPage: true
        });

        await browser.close();
        console.log(`✓ ${path.basename(inputFile)} -> ${path.basename(outputFile)}`);
        return true;
    } catch (err) {
        await browser.close();
        console.error(`✗ Failed ${path.basename(inputFile)}: ${err.message}`);
        return false;
    }
}

async function main() {
    const pngDir = 'png';
    const results = {
        success: [],
        failed: []
    };

    // 確保輸出目錄存在
    if (!fs.existsSync(`${pngDir}/central`)) {
        fs.mkdirSync(`${pngDir}/central`, { recursive: true });
    }
    if (!fs.existsSync(`${pngDir}/local`)) {
        fs.mkdirSync(`${pngDir}/local`, { recursive: true });
    }

    // 處理 Central mockups
    const centralDir = 'central';
    const centralFiles = fs.readdirSync(centralDir).filter(f => f.endsWith('.html'));
    console.log(`\n📸 處理 ${centralFiles.length} 個 Central mockups...`);

    for (const file of centralFiles) {
        const inputFile = path.join(centralDir, file);
        const outputFile = path.join(pngDir, 'central', file.replace('.html', '.png'));

        // 如果已存在則跳過
        if (fs.existsSync(outputFile)) {
            console.log(`⏭ Skipped (exists): ${file}`);
            continue;
        }

        const success = await captureScreenshot(inputFile, outputFile);
        if (success) {
            results.success.push(file);
        } else {
            results.failed.push(file);
        }
    }

    // 處理 Local mockups
    const localDir = 'local';
    const localFiles = fs.readdirSync(localDir).filter(f => f.endsWith('.html'));
    console.log(`\n📸 處理 ${localFiles.length} 個 Local mockups...`);

    for (const file of localFiles) {
        const inputFile = path.join(localDir, file);
        const outputFile = path.join(pngDir, 'local', file.replace('.html', '.png'));

        // 如果已存在則跳過
        if (fs.existsSync(outputFile)) {
            console.log(`⏭ Skipped (exists): ${file}`);
            continue;
        }

        const success = await captureScreenshot(inputFile, outputFile);
        if (success) {
            results.success.push(file);
        } else {
            results.failed.push(file);
        }
    }

    // 輸出統計
    console.log('\n' + '='.repeat(50));
    console.log('✅ 批次截圖完成！');
    console.log(`成功: ${results.success.length} 個`);
    console.log(`失敗: ${results.failed.length} 個`);

    if (results.failed.length > 0) {
        console.log('\n失敗列表:');
        results.failed.forEach(f => console.log(`  - ${f}`));
    }

    // 保存結果到 JSON
    fs.writeFileSync('png-generation-result.json', JSON.stringify(results, null, 2));
    console.log('\n結果已保存至: png-generation-result.json');
}

main().catch(err => {
    console.error('執行錯誤:', err);
    process.exit(1);
});
