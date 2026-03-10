#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 功能矩陣定義
const FUNCTION_MATRIX = {
  // 儀表板
  C01: { name: 'KPI 監控', module: '儀表板', type: 'central' },
  L01: { name: '營收趨勢圖', module: '儀表板', type: 'both' },
  L02: { name: '機台狀態圖', module: '儀表板', type: 'both' },
  L03: { name: '熱門遊戲排行', module: '儀表板', type: 'both' },
  C05: { name: '系統通知', module: '儀表板', type: 'central' },
  L04: { name: '今日營收/下注/派彩', module: '儀表板', type: 'both' },
  C02: { name: '硬體/網路狀態', module: '儀表板', type: 'both' },
  L08: { name: '快速操作按鈕', module: '儀表板', type: 'both' },

  // 機台管理
  L05: { name: '機台列表檢視', module: '機台管理', type: 'both' },
  C101: { name: '機台編輯/刪除', module: '機台管理', type: 'central' },
  C107: { name: '機台標籤管理', module: '機台管理', type: 'central' },
  L06: { name: '機台狀態監控', module: '機台管理', type: 'both' },
  C11: { name: '開分/洗分', module: '機台管理', type: 'central' },
  C12: { name: '遠端指令', module: '機台管理', type: 'central' },
  L07: { name: '機台配置接收', module: '系統', type: 'central' },
  C14: { name: '機台設定', module: '機台管理', type: 'both' },
  C15: { name: '測試模式', module: '機台管理', type: 'central' },

  // 遊戲管理
  L11: { name: '遊戲列表檢視', module: '遊戲管理', type: 'both' },
  L12: { name: '遊戲篩選', module: '遊戲管理', type: 'both' },
  L13: { name: '遊戲搜尋', module: '遊戲管理', type: 'both' },
  L14: { name: '遊戲詳情', module: '遊戲管理', type: 'both' },
  C16: { name: '遊戲新增/編輯/刪除', module: '遊戲管理', type: 'central' },
  L09: { name: '遊戲啟用/停用', module: '遊戲管理', type: 'both' },
  L10: { name: '遊戲版本管理', module: '遊戲管理', type: 'both' },
  L29: { name: '遊戲供應商管理', module: '遊戲管理', type: 'central' },
  L30: { name: '遊戲大廳設定', module: '遊戲管理', type: 'central' },
  C25: { name: '遊戲配置', module: '遊戲管理', type: 'both' },
  C28: { name: '遊戲測試', module: '遊戲管理', type: 'both' },
  C106: { name: '代理錢包管理', module: '遊戲管理', type: 'central' },

  // 交易紀錄管理
  L16: { name: '交易詳情檢視', module: '交易紀錄管理', type: 'both' },
  C44: { name: '交易統計', module: '交易紀錄管理', type: 'both' },
  C45: { name: '交易對帳', module: '交易紀錄管理', type: 'central' },
  L19: { name: '異常交易處理', module: '交易紀錄管理', type: 'central' },
  C47: { name: '營收報表', module: '交易紀錄管理', type: 'central' },
  C48: { name: '遊戲排行', module: '交易紀錄管理', type: 'central' },
  L18: { name: '交易操作（回滾/確認）', module: '交易紀錄管理', type: 'central' },
  L45: { name: '遊戲開分/洗分', module: '交易紀錄管理', type: 'local' },
  L46: { name: '遊戲派彩', module: '交易紀錄管理', type: 'local' },
  C51: { name: '交易導出', module: '交易紀錄管理', type: 'central' },
  L20: { name: '爭議對帳處理專區', module: '交易紀錄管理', type: 'central' },

  // 串接遊戲
  C53: { name: '遊戲商列表檢視', module: '串接遊戲', type: 'central' },
  C103: { name: '遊戲商新增/編輯/刪除', module: '串接遊戲', type: 'central' },
  C104: { name: '遊戲商餘額歸集與轉帳', module: '串接遊戲', type: 'central' },
  C54: { name: 'API 連線狀態監控', module: '串接遊戲', type: 'central' },
  C55: { name: '遊戲同步管理', module: '串接遊戲', type: 'central' },
  C56: { name: 'API 日誌查詢', module: '串接遊戲', type: 'central' },

  // 多人遊戲
  C57: { name: '牌桌列表檢視', module: '多人遊戲', type: 'central' },
  C58: { name: '牌桌狀態監控', module: '多人遊戲', type: 'central' },
  C59: { name: '牌桌配置管理', module: '多人遊戲', type: 'central' },
  C60: { name: '牌局歷史查詢', module: '多人遊戲', type: 'central' },
  C62: { name: '牌靴管理', module: '多人遊戲', type: 'central' },
  C65: { name: '異常狀態告警', module: '多人遊戲', type: 'central' },
  C67: { name: '牌局歷史匯出', module: '多人遊戲', type: 'central' },

  // 使用者權限
  C70: { name: '帳號新增/編輯/刪除', module: '使用者權限', type: 'central' },
  C71: { name: '角色權限設定', module: '使用者權限', type: 'central' },
  C72: { name: '操作日誌審計', module: '使用者權限', type: 'central' },

  // 版本更新
  C73: { name: '版本列表管理', module: '版本更新', type: 'central' },
  C105: { name: '版本包上傳/控制', module: '版本更新', type: 'central' },

  // 介面設定
  C77: { name: '遊戲分類排序', module: '介面設定', type: 'central' },
  C80: { name: '推薦遊戲設定', module: '介面設定', type: 'central' },
  C76: { name: '公告管理', module: '介面設定', type: 'central' },
  C81: { name: '前端版面廣播模組', module: '介面設定', type: 'central' },
  C78: { name: '前端大廳配置', module: '介面設定', type: 'central' },

  // 監控中心
  C79: { name: '系統監控', module: '監控中心', type: 'both' },
  L38: { name: '心跳檢測與離線告警', module: '監控中心', type: 'both' },
  C83: { name: '告警閾值設定', module: '監控中心', type: 'central' },
  C82: { name: '告警通知', module: '監控中心', type: 'central' },
  L39: { name: '設備健康度儀表板', module: '監控中心', type: 'both' },
  L40: { name: '網路延遲監控', module: '監控中心', type: 'both' },
  L41: { name: '硬體/軟體監控', module: '監控中心', type: 'both' },
  C86: { name: '日誌查詢', module: '監控中心', type: 'central' },

  // 系統設定
  L47: { name: '基本設定', module: '系統設定', type: 'local' },
  C90: { name: '系統參數設定', module: '系統設定', type: 'central' },
  L28: { name: '備份與恢復', module: '系統設定', type: 'central' },

  // 同步與對帳
  L34: { name: '同步狀態檢視', module: '同步與對帳', type: 'both' },
  C93: { name: '手動同步', module: '同步與對帳', type: 'central' },
  C94: { name: '對帳檢查', module: '同步與對帳', type: 'central' },
  C95: { name: '同步日誌', module: '同步與對帳', type: 'central' },
  L37: { name: '衝突處理與人工審核', module: '同步與對帳', type: 'central' },

  // 玩家管理
  C102: { name: '玩家新增/編輯/刪除', module: '玩家管理', type: 'central' },
  C40: { name: '玩家密碼重設', module: '玩家管理', type: 'central' },

  // 登入
  LOGIN: { name: '登入頁面', module: '認證', type: 'both' },
  PWD_RESET: { name: '密碼重設', module: '認證', type: 'central' },

  // 旗艦功能
  FLG_DISPUTE: { name: '爭議對帳處理專區', module: '旗艦功能', type: 'central' },
  FLG_MONITOR: { name: '監控中心', module: '旗艦功能', type: 'central' },
  FLG_OTA: { name: 'OTA 更新', module: '旗艦功能', type: 'central' },
  FLG_RECONCILIATION: { name: '對帳中心', module: '旗艦功能', type: 'central' },
};

// Mockup 檔案與功能編號對應
const MOCKUP_MAPPING = {
  // 儀表板
  'mockup_dashboard.html': ['C01', 'L01', 'L02', 'L03', 'L04'],

  // 機台管理
  'mockup_mvp_machine_list.html': ['L05', 'L06'],
  'mockup_mvp_machine_add.html': ['C101'],
  'mockup_machine_settings.html': ['C14'],
  'mockup_machine_remote_control.html': ['C11', 'C12'],

  // 遊戲管理
  'mockup_mvp_game_add.html': ['C16'],
  'mockup_game_detail.html': ['L14'],
  'mockup_game_ranking.html': ['C48'],
  'mockup_game_test.html': ['C28'],
  'mockup_game_sync.html': ['C55'],
  'mockup_game_category_management.html': ['C77'],

  // 交易紀錄管理
  'mockup_revenue_report.html': ['C47'],
  'mockup_transaction_stats.html': ['C44'],
  'mockup_transaction_exception.html': ['L19'],
  'mockup_transaction_export.html': ['C51'],
  'mockup_std_transaction_detail.html': ['L16'],
  'mockup_std_wallet.html': ['C106'],

  // 串接遊戲
  'mockup_std_provider_list.html': ['C53'],
  'mockup_std_provider_add.html': ['C103', 'C104'],
  'mockup_api_status_monitor.html': ['C54'],
  'mockup_api_log.html': ['C56'],

  // 多人遊戲
  'mockup_std_multiplayer.html': ['C57'],
  'mockup_std_multiplayer_add.html': ['C59'],
  'mockup_multiplayer_history.html': ['C60', 'C67'],
  'mockup_multiplayer_config.html': ['C59'],
  'mockup_multiplayer_shoe.html': ['C62'],
  'mockup_multiplayer_alerts.html': ['C65'],
  'mockup_multiplayer_dealer.html': ['C66'],
  'mockup_multiplayer_bet.html': ['C63', 'C64'],

  // 使用者權限
  'mockup_user_edit.html': ['C70'],
  'mockup_role_management.html': ['C71'],
  'mockup_permission_matrix.html': ['C71'],
  'mockup_user_permission.html': ['C71'],
  'mockup_audit_log.html': ['C72'],

  // 版本更新
  'mockup_flg_ota.html': ['C73', 'C105'],

  // 介面設定
  'mockup_game_category_management.html': ['C77'],
  'mockup_recommended_games.html': ['C80'],
  'mockup_announcement.html': ['C76'],
  'mockup_broadcast_management.html': ['C81'],
  'mockup_lobby_settings.html': ['C78'],

  // 監控中心
  'mockup_heartbeat_monitor.html': ['L38'],
  'mockup_alert_threshold.html': ['C83'],
  'mockup_alert_notifications.html': ['C82'],
  'mockup_device_health.html': ['L39'],
  'mockup_network_monitor.html': ['L40'],
  'mockup_hardware_monitor.html': ['L41'],
  'mockup_log_query.html': ['C86'],

  // 系統設定
  'mockup_std_system_settings.html': ['C90'],
  'mockup_network_settings.html': ['C88'],
  'mockup_std_backup.html': ['L28'],
  'mockup_security_settings.html': ['C90'],

  // 同步與對帳
  'mockup_sync_status.html': ['L34'],
  'mockup_sync_conflict.html': ['L37'],

  // 玩家管理
  'mockup_mvp_player_list.html': ['L23'],
  'mockup_mvp_player_add.html': ['C102'],
  'mockup_player_detail.html': ['L24'],

  // 代理管理
  'mockup_agent_tree.html': ['C106'],

  // 認證
  'mockup_login.html': ['LOGIN'],
  'mockup_password_reset.html': ['PWD_RESET'],

  // 旗艦功能
  'mockup_flg_dispute.html': ['FLG_DISPUTE', 'L20'],
  'mockup_flg_monitor.html': ['FLG_MONITOR'],
  'mockup_flg_reconciliation.html': ['FLG_RECONCILIATION', 'C45', 'C94'],

  // 報表
  'mockup_std_reports.html': ['C47'],

  'mockup_std_category_add.html': ['C77'],

  // 本地端
  'mockup_local_dashboard.html': ['L01', 'L02', 'L03', 'L04', 'L08', 'L34'],
  'mockup_local_machine.html': ['L05', 'L06', 'L07', 'L09', 'L10', 'L11', 'L12', 'L13', 'L14', 'L38', 'L40', 'L41', 'L42', 'L43', 'L44', 'L45', 'L46'],
  'mockup_local_game.html': ['L09', 'L10', 'L11', 'L12', 'L13', 'L14', 'L43', 'L44', 'L45', 'L46'],
  'mockup_local_cash.html': ['L13', 'L14', 'L43', 'L44', 'L45', 'L46'],
  'mockup_local_sync.html': ['L28', 'L34', 'L35', 'L36', 'L37', 'L38', 'L39', 'L40', 'L41', 'L42', 'L51', 'L52'],
  'mockup_local_system_settings.html': ['L47', 'L48'],
  'mockup_mvp_local_setup.html': ['L47'],
  'mockup_local_login.html': ['L51', 'L52'],
  'mockup_local_register.html': ['L51'],
  'mockup_local_cash_ops.html': ['L45'],
  'mockup_local_login_alt.html': ['L51', 'L52'],
  'mockup_local_system_settings_basic.html': ['L47'],
  'mockup_local_system_settings_alt.html': ['L47'],
  'mockup_local_machine_initial_setup.html': ['L51'],
  'mockup_local_dashboard_machine_status.html': ['L02'],
  'mockup_local_machine_status_monitor.html': ['L06'],
  'mockup_local_game_list_view.html': ['L11'],
  'mockup_local_sync_status_view.html': ['L34'],


  // 數據管理
  'mockup_mvp_data_list.html': [],
};

// 掃描結果
const scanResults = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    missingFunctions: [],
    extraFiles: [],
    duplicateMappings: [],
  },
  files: [],
  functionCoverage: {},
  issues: [],
};

// 檢查 HTML 結構完整性
function checkHtmlStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  // 檢查基本 HTML 結構
  if (!content.toLowerCase().includes('<!doctype')) {
    issues.push('缺少 DOCTYPE 聲明');
  }
  if (!content.toLowerCase().includes('<html')) {
    issues.push('缺少 <html> 標籤');
  }
  if (!content.toLowerCase().includes('<head>')) {
    issues.push('缺少 <head> 標籤');
  }
  if (!content.toLowerCase().includes('<body')) {
    issues.push('缺少 <body> 標籤');
  }
  if (!content.toLowerCase().includes('</html>')) {
    issues.push('缺少 </html> 結束標籤');
  }

  // 檢查必要的 meta 標籤
  if (!content.toLowerCase().includes('viewport')) {
    issues.push('缺少 viewport meta 標籤');
  }
  if (!content.toLowerCase().includes('charset')) {
    issues.push('缺少 charset meta 標籤');
  }

  // 檢查 CSS 引用（Tailwind CDN 也算）
  const hasCssFiles = (content.match(/<link[^>]*\.css[^>]*>/gi) || []).length > 0;
  const hasTailwind = content.includes('tailwindcss');
  if (!hasCssFiles && !hasTailwind) {
    issues.push('未引用任何 CSS 檔案或 Tailwind CDN');
  }

  // 檢查 sidebar.js 引用（登入頁面除外）
  const fileName = path.basename(filePath);
  const isLoginPage = fileName.includes('login') || fileName.includes('password_reset');

  if (!isLoginPage && !content.includes('sidebar.js')) {
    issues.push('未引用 sidebar.js');
  }

  return issues;
}

// 檢查檔案命名規範
function checkNamingConvention(fileName) {
  const issues = [];

  // 應該以 mockup_ 開頭
  if (!fileName.startsWith('mockup_')) {
    issues.push('檔名應以 mockup_ 開頭');
  }

  // 應該使用小寫和底線
  if (!/^[a-z0-9_]+\.html$/.test(fileName)) {
    issues.push('檔名應使用小寫字母、數字和底線');
  }

  // 檢查是否為有效的命名模式
  const validPrefixes = ['mockup_mvp_', 'mockup_std_', 'mockup_flg_', 'mockup_local_', 'mockup_'];
  const hasValidPrefix = validPrefixes.some(prefix => fileName.startsWith(prefix));
  if (!hasValidPrefix) {
    issues.push('檔名前綴不符合規範 (應為 mvp_, std_, flg_, local_)');
  }

  return issues;
}

// 掃描單個檔案
function scanFile(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);
  const dirName = path.dirname(filePath).split('/').pop();

  const result = {
    path: relativePath,
    fileName,
    directory: dirName,
    type: dirName === 'local' ? 'local' : 'central',
    size: fs.statSync(filePath).size,
    structureIssues: [],
    namingIssues: [],
    mappedFunctions: [],
    isMapped: false,
    isValid: true,
  };

  // 檢查 HTML 結構
  result.structureIssues = checkHtmlStructure(filePath);

  // 檢查命名規範
  result.namingIssues = checkNamingConvention(fileName);

  // 檢查功能映射
  if (MOCKUP_MAPPING[fileName]) {
    result.mappedFunctions = MOCKUP_MAPPING[fileName];
    result.isMapped = true;

    // 更新功能覆蓋率
    MOCKUP_MAPPING[fileName].forEach(funcId => {
      if (!scanResults.functionCoverage[funcId]) {
        scanResults.functionCoverage[funcId] = [];
      }
      scanResults.functionCoverage[funcId].push(fileName);
    });
  }

  // 判斷是否有效
  if (result.structureIssues.length > 0 || result.namingIssues.length > 0) {
    result.isValid = false;
  }

  return result;
}

// 主掃描函數
function scanMockups() {
  const mockupDir = path.join(process.cwd(), 'md', 'v8', 'mockup');

  // 遞歸掃描所有 HTML 檔案
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.html')) {
        const result = scanFile(fullPath);
        scanResults.files.push(result);
        scanResults.summary.totalFiles++;

        if (result.isValid) {
          scanResults.summary.validFiles++;
        } else {
          scanResults.summary.invalidFiles++;
        }

        if (!result.isMapped) {
          scanResults.summary.extraFiles.push(result.fileName);
        }
      }
    });
  }

  scanDir(mockupDir);

  // 檢查功能覆蓋率 - 找出缺少 mockup 的功能
  Object.keys(FUNCTION_MATRIX).forEach(funcId => {
    if (!scanResults.functionCoverage[funcId]) {
      scanResults.summary.missingFunctions.push({
        id: funcId,
        name: FUNCTION_MATRIX[funcId].name,
        module: FUNCTION_MATRIX[funcId].module,
      });
    }
  });

  // 檢查重複映射
  Object.keys(scanResults.functionCoverage).forEach(funcId => {
    if (scanResults.functionCoverage[funcId].length > 1) {
      scanResults.summary.duplicateMappings.push({
        functionId: funcId,
        files: scanResults.functionCoverage[funcId],
      });
    }
  });

  // 收集所有問題
  scanResults.files.forEach(file => {
    if (file.structureIssues.length > 0) {
      scanResults.issues.push({
        file: file.fileName,
        type: 'structure',
        issues: file.structureIssues,
      });
    }
    if (file.namingIssues.length > 0) {
      scanResults.issues.push({
        file: file.fileName,
        type: 'naming',
        issues: file.namingIssues,
      });
    }
  });

  return scanResults;
}

// 執行掃描
const results = scanMockups();

// 輸出 JSON 報告
const outputPath = path.join(process.cwd(), 'mockup_scan_report.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log('掃描完成！');
console.log('================');
console.log(`總檔案數: ${results.summary.totalFiles}`);
console.log(`有效檔案: ${results.summary.validFiles}`);
console.log(`問題檔案: ${results.summary.invalidFiles}`);
console.log(`未映射檔案: ${results.summary.extraFiles.length}`);
console.log(`缺少 mockup 的功能: ${results.summary.missingFunctions.length}`);
console.log(`重複映射: ${results.summary.duplicateMappings.length}`);
console.log(`\n報告已輸出至: ${outputPath}`);