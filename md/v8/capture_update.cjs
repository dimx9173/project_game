const puppeteer = require('puppeteer');
const path = require('path');

const mockups = [
  { name: '[M02]機台管理(含監控中心)', file: 'mockup_local_machine.html', dir: '[M02]機台管理' },
  { name: '[M04]開洗分與交易', file: 'mockup_local_cash.html', dir: '[M04]交易紀錄管理' }
];

const OUTPUT_DIR = '/home/brian/project/game/md/v8/feature_docs/local';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  for (const mockup of mockups) {
    console.log('Capturing ' + mockup.name + '...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    try {
      await page.goto('http://localhost:8080/' + mockup.file, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const screenshotPath = OUTPUT_DIR + '/' + mockup.dir + '/' + mockup.name + '.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('Saved: ' + screenshotPath);
    } catch (err) {
      console.error('Failed ' + mockup.name + ': ' + err.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('Done!');
})();
