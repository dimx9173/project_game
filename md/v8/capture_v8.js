const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  const mockups = [
    { name: 'dashboard', url: 'http://localhost:8080/mockup/central/mockup_dashboard.html' },
    { name: 'login', url: 'http://localhost:8080/mockup/central/mockup_login.html' },
    { name: 'local_dashboard', url: 'http://localhost:8080/mockup/local/mockup_local_dashboard.html' },
  ];
  
  for (const mockup of mockups) {
    console.log(`Capturing ${mockup.name}...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    try {
      await page.goto(mockup.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const screenshotPath = path.join(__dirname, `v8_${mockup.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ Saved: ${screenshotPath}`);
      
      // 複製到 workspace
      const workspacePath = '/home/brian/.openclaw/workspace-front-end/';
      fs.copyFileSync(screenshotPath, path.join(workspacePath, `v8_${mockup.name}.png`));
      console.log(`✓ Copied to workspace: v8_${mockup.name}.png`);
    } catch (err) {
      console.error(`✗ Failed ${mockup.name}: ${err.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('Done!');
}

captureScreenshots().catch(console.error);
