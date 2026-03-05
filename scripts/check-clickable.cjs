const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = '/home/brian/project/game/md/v8/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const clickableSelectors = [
  'a[href]',           // Links
  'button',            // Buttons
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  '[onclick]',         // Elements with onclick
  '[onclick]',         // Elements with onClick
  '.btn',              // Bootstrap buttons
  '.button',           // Generic button class
  '[role="button"]',   // ARIA buttons
  'li[data-click',     // Custom clickable li
  'li.clickable',      // Custom clickable class
  '.menu-item',
  '.nav-item',
  '.sidebar-item',
  '.tree-item',
  '.dropdown-item',
  '.tab',
  '[data-toggle]',
  '[data-target]',
  'span.clickable',
  'td.clickable'
];

const results = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  
  const clickableItems = [];
  
  // Find all clickable elements
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim().substring(0, 50);
    if (href && href !== '#' && href !== 'javascript:void(0)') {
      clickableItems.push({ type: 'a', text, href });
    }
  });
  
  $('button').each((i, el) => {
    const text = $(el).text().trim().substring(0, 50);
    const className = $(el).attr('class') || '';
    const onclick = $(el).attr('onclick') || '';
    clickableItems.push({ type: 'button', text, class: className, onclick: onclick.substring(0, 30) });
  });
  
  $('[onclick]').each((i, el) => {
    const tag = $(el).prop('tagName').toLowerCase();
    const text = $(el).text().trim().substring(0, 50);
    const onclick = $(el).attr('onclick') || '';
    const className = $(el).attr('class') || '';
    if (!clickableItems.find(item => item.onclick === onclick.substring(0, 30))) {
      clickableItems.push({ type: tag, text, class: className, onclick: onclick.substring(0, 50) });
    }
  });
  
  $('[data-toggle]').each((i, el) => {
    const tag = $(el).prop('tagName').toLowerCase();
    const text = $(el).text().trim().substring(0, 50);
    const dataToggle = $(el).attr('data-toggle');
    const dataTarget = $(el).attr('data-target') || '';
    clickableItems.push({ type: tag, text, 'data-toggle': dataToggle, 'data-target': dataTarget });
  });
  
  $('[role="button"]').each((i, el) => {
    const text = $(el).text().trim().substring(0, 50);
    const className = $(el).attr('class') || '';
    const tabindex = $(el).attr('tabindex') || '';
    clickableItems.push({ type: 'role:button', text, class: className, tabindex });
  });
  
  $('.btn, .button, .menu-item, .nav-item, .sidebar-item, .tree-item, .dropdown-item, .tab').each((i, el) => {
    const tag = $(el).prop('tagName').toLowerCase();
    const text = $(el).text().trim().substring(0, 50);
    const className = $(el).attr('class') || '';
    const id = $(el).attr('id') || '';
    if (!clickableItems.find(item => item.text === text && item.type === tag)) {
      clickableItems.push({ type: tag, text, class: className, id: id.substring(0, 20) });
    }
  });
  
  // Check for dead links (href="#") - these are non-functional
  const deadLinks = $('a[href="#"], a[href="javascript:void(0)"]').length;
  
  results.push({
    file,
    totalClickable: clickableItems.length,
    deadLinks,
    items: clickableItems
  });
});

// Summary
console.log('='.repeat(80));
console.log('V8 Mockup HTML - Clickable Elements Analysis');
console.log('='.repeat(80));
console.log('');

let totalFiles = results.length;
let totalClickable = 0;
let totalDeadLinks = 0;

results.forEach(r => {
  totalClickable += r.totalClickable;
  totalDeadLinks += r.deadLinks;
  
  console.log(`📄 ${r.file}`);
  console.log(`   可點擊元素: ${r.totalClickable} | 失效連結 (href="#"): ${r.deadLinks}`);
  
  // List main clickable items
  const items = r.items.slice(0, 10);
  items.forEach(item => {
    if (item.type === 'a') {
      console.log(`   🔗 [${item.type}] "${item.text}" → ${item.href}`);
    } else if (item.type === 'button') {
      console.log(`   🔘 [${item.type}] "${item.text}" (onclick: ${item.onclick || 'none'})`);
    } else if (item.onclick) {
      console.log(`   👆 [${item.type}] "${item.text}" onclick: ${item.onclick}`);
    } else {
      console.log(`   👆 [${item.type}] "${item.text}"`);
    }
  });
  
  if (r.items.length > 10) {
    console.log(`   ... 還有 ${r.items.length - 10} 個元素`);
  }
  console.log('');
});

console.log('='.repeat(80));
console.log('📊 總結:');
console.log(`   總檔案數: ${totalFiles}`);
console.log(`   總可點擊元素: ${totalClickable}`);
console.log(`   總失效連結: ${totalDeadLinks}`);
console.log('='.repeat(80));

// Check for potential issues
console.log('');
console.log('⚠️  檢查問題:');
results.forEach(r => {
  const buttonsWithNoOnclick = r.items.filter(i => i.type === 'button' && !i.onclick && !i.class.includes('dropdown'));
  if (buttonsWithNoOnclick.length > 0) {
    console.log(`   ⚡ ${r.file}: ${buttonsWithNoOnclick.length} 個按鈕沒有 onclick 事件`);
  }
});
