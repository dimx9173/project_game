const puppeteer = require('puppeteer');
const path = require('path');

const mockups = [
  { name: 'dashboard', url: 'http://localhost:8080/mockup/central/mockup_dashboard.html' },
  { name: 'login', url: 'http://localhost:8080/mockup/central/mockup_login.html' },
  { name: 'local_dashboard', url: 'http://localhost:8080/mockup/local/mockup_local_dashboard.html' },
  { name: 'machine_list', url: 'http://localhost:8080/mockup/central/mockup_mvp_machine_list.html' },
  { name: 'player_list', url: 'http://localhost:8080/mockup/central/mockup_mvp_player_list.html' }
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const mockup of mockups) {
    console.log(`Capturing ${mockup.name}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    try {
      await page.goto(mockup.url, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
      
      const screenshotPath = `/home/brian/project/game/md/v8/verify_${mockup.name}.png`;
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
