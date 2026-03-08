const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const mockups = [
  { name: '[L01]儀表板-營收趨勢', url: 'http://localhost:8080/mockup/local/mockup_local_dashboard.html' },
  { name: '[L02]儀表板-機台狀態', url: 'http://localhost:8080/mockup/local/mockup_local_machine.html' },
  { name: '[L03]遊戲管理-遊戲列表', url: 'http://localhost:8080/mockup/local/mockup_local_game.html' },
  { name: '[L04]同步與系統', url: 'http://localhost:8080/mockup/local/mockup_local_sync.html' }
];

const OUTPUT_DIR = '/home/brian/project/game/md/v8/mockup/local';

async function captureScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  for (const mockup of mockups) {
    console.log(`Capturing ${mockup.name}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    try {
      await page.goto(mockup.url, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const screenshotPath = `${OUTPUT_DIR}/${mockup.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ Saved: ${screenshotPath}`);
    } catch (err) {
      console.error(`✗ Failed ${mockup.name}: ${err.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('All screenshots captured!');
}

captureScreenshots().catch(console.error);
