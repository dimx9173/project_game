/**
 * Shared sidebar for mockup HTML pages. Works with file:// (no server required).
 * Usage: add <div id="sidebar-container"></div> in body, then MockupSidebar.render('mockup_dashboard.html');
 */
(function () {
  'use strict';

  function link(href, baseClass, icon, text) {
    var a = document.createElement('a');
    a.href = href;
    a.className = (baseClass || 'sidebar-link') + ' flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg';
    if (icon) {
      var i = document.createElement('i');
      i.setAttribute('data-lucide', icon);
      i.className = 'w-4 h-4 flex-shrink-0';
      a.appendChild(i);
    }
    var span = document.createElement('span');
    span.className = 'ml-2';
    span.textContent = text;
    a.appendChild(span);
    return a;
  }

  function subLink(href, text) {
    var a = document.createElement('a');
    a.href = href;
    a.className = 'sidebar-link flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg';
    var span = document.createElement('span');
    span.textContent = text;
    a.appendChild(span);
    return a;
  }

  function group(iconName, title, items) {
    var div = document.createElement('div');
    div.className = 'sidebar-group';
    var header = document.createElement('div');
    header.className = 'sidebar-group-header sidebar-has-submenu';
    header.setAttribute('onclick', 'toggleSidebarGroup(this)');
    var leftWrap = document.createElement('div');
    leftWrap.className = 'sidebar-group-left flex items-center';
    var icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconName);
    icon.className = 'w-4 h-4 flex-shrink-0';
    leftWrap.appendChild(icon);
    var headerSpan = document.createElement('span');
    headerSpan.className = 'ml-2';
    headerSpan.textContent = title;
    leftWrap.appendChild(headerSpan);
    header.appendChild(leftWrap);
    var sub = document.createElement('div');
    sub.className = 'sidebar-submenu';
    items.forEach(function (item) {
      sub.appendChild(subLink(item.href, item.text));
    });
    div.appendChild(header);
    div.appendChild(sub);
    return div;
  }

  function buildNav() {
    var nav = document.createElement('nav');
    nav.className = 'flex-1 py-4 px-3 space-y-1 overflow-y-auto';

    nav.appendChild(link('mockup_dashboard.html', 'sidebar-link', 'layout-dashboard', '儀表板'));

    nav.appendChild(group('monitor', '機台管理', [
      { href: 'mockup_mvp_machine_list.html', text: '機台列表' },
      { href: 'mockup_machine_remote_control.html', text: '遠端控制' }
    ]));
    nav.appendChild(group('gamepad-2', '遊戲管理', [
      { href: 'mockup_mvp_data_list.html', text: '遊戲列表' },
      { href: 'mockup_game_detail.html', text: '遊戲詳情' },
      { href: 'mockup_game_sync.html', text: '遊戲同步' },
      { href: 'mockup_game_test.html', text: '遊戲測試' }
    ]));
    nav.appendChild(group('users', '玩家管理', [
      { href: 'mockup_mvp_player_list.html', text: '玩家列表' },
      { href: 'mockup_player_detail.html', text: '玩家詳情' }
    ]));
    nav.appendChild(group('wallet', '交易紀錄管理', [
      { href: 'mockup_std_wallet.html', text: '錢包交易' },
      { href: 'mockup_std_transaction_detail.html', text: '交易詳情' },
      { href: 'mockup_transaction_export.html', text: '交易匯出' }
    ]));
    nav.appendChild(group('plug', '串接遊戲', [
      { href: 'mockup_std_provider_list.html', text: '遊戲商列表' },
      { href: 'mockup_api_log.html', text: 'API 日誌' }
    ]));
    nav.appendChild(link('mockup_std_multiplayer.html', 'sidebar-link', 'users', '多人遊戲'));
    nav.appendChild(group('shield-user', '使用者權限', [
      { href: 'mockup_user_permission.html', text: '帳號管理' },
      { href: 'mockup_security_settings.html', text: '安全設定' }
    ]));
    nav.appendChild(group('download', '版本更新', [
      { href: 'mockup_flg_ota.html', text: 'OTA 版本管理' }
    ]));
    nav.appendChild(group('layout', '介面設定', [
      { href: 'mockup_announcement.html', text: '公告管理' },
      { href: 'mockup_lobby_settings.html', text: '遊戲大廳設定' },
      { href: 'mockup_std_game_category.html', text: '遊戲分類排序' }
    ]));
    nav.appendChild(group('activity', '監控中心', [
      { href: 'mockup_flg_monitor.html', text: '系統監控' },
      { href: 'mockup_api_status_monitor.html', text: 'API 狀態' },
      { href: 'mockup_alert_threshold.html', text: '告警設定' },
      { href: 'mockup_audit_log.html', text: '審計日誌' }
    ]));
    nav.appendChild(group('settings', '系統設定', [
      { href: 'mockup_std_system_settings.html', text: '基本設定' }
    ]));

    return nav;
  }

  function getCurrentPageHref() {
    var path = typeof window !== 'undefined' && window.location && window.location.pathname;
    if (!path) return '';
    var parts = path.split('/');
    return parts[parts.length - 1] || '';
  }

  function toggleSidebarGroup(header) {
    var group = header.parentElement;
    var submenu = group.querySelector('.sidebar-submenu');
    if (!group || !submenu) return;
    group.classList.toggle('open');
    submenu.classList.toggle('open');
  }

  function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var btn = document.querySelector('.sidebar-toggle-btn');
    if (!sidebar || !btn) return;
    sidebar.classList.toggle('sidebar-collapsed');
    btn.classList.toggle('collapsed');
    var icon = btn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', sidebar.classList.contains('sidebar-collapsed') ? 'panel-left-open' : 'panel-left-close');
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  }

  function render(activeHref) {
    var container = document.getElementById('sidebar-container');
    if (!container) return;
    var current = activeHref != null && activeHref !== '' ? activeHref : getCurrentPageHref();

    container.innerHTML = '';
    var aside = document.createElement('aside');
    aside.id = 'sidebar';
    aside.className = 'w-64 bg-dark-sidebar border-r border-dark-border flex flex-col transition-all duration-300';

    var top = document.createElement('div');
    top.className = 'h-16 flex items-center px-4 border-b border-dark-border justify-between';
    var topLeft = document.createElement('div');
    topLeft.className = 'sidebar-logo-area flex items-center';
    var logo = document.createElement('div');
    logo.className = 'w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shadow-glow-sm mr-3 flex-shrink-0';
    var logoIcon = document.createElement('i');
    logoIcon.setAttribute('data-lucide', 'gamepad-2');
    logoIcon.className = 'w-5 h-5 text-white';
    logo.appendChild(logoIcon);
    var logoText = document.createElement('div');
    logoText.className = 'sidebar-text';
    var s1 = document.createElement('span');
    s1.className = 'font-bold text-white';
    s1.textContent = '遊戲平台';
    var s2 = document.createElement('span');
    s2.className = 'text-xs text-gray-500 block';
    s2.textContent = '管理中心';
    logoText.appendChild(s1);
    logoText.appendChild(s2);
    topLeft.appendChild(logo);
    topLeft.appendChild(logoText);
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('onclick', 'toggleSidebar()');
    toggleBtn.className = 'sidebar-toggle-btn p-1.5 rounded-lg hover:bg-dark-hover text-gray-400 hover:text-white';
    var toggleIcon = document.createElement('i');
    toggleIcon.setAttribute('data-lucide', 'panel-left-close');
    toggleIcon.className = 'w-4 h-4';
    toggleBtn.appendChild(toggleIcon);
    top.appendChild(topLeft);
    top.appendChild(toggleBtn);
    aside.appendChild(top);
    aside.appendChild(buildNav());

    var footer = document.createElement('div');
    footer.className = 'p-4 border-t border-dark-border';
    var footerInner = document.createElement('div');
    footerInner.className = 'flex items-center justify-between';
    var footerLeft = document.createElement('div');
    footerLeft.className = 'flex items-center';
    var avatar = document.createElement('div');
    avatar.className = 'w-8 h-8 rounded-full gradient-purple flex items-center justify-center';
    var avatarSpan = document.createElement('span');
    avatarSpan.className = 'text-sm font-bold text-white';
    avatarSpan.textContent = 'A';
    avatar.appendChild(avatarSpan);
    var userInfo = document.createElement('div');
    userInfo.className = 'ml-3 sidebar-text';
    var p1 = document.createElement('p');
    p1.className = 'text-sm font-medium text-white';
    p1.textContent = 'admin';
    var p2 = document.createElement('p');
    p2.className = 'text-xs text-gray-500';
    p2.textContent = '系統管理員';
    userInfo.appendChild(p1);
    userInfo.appendChild(p2);
    footerLeft.appendChild(avatar);
    footerLeft.appendChild(userInfo);
    var logoutLink = document.createElement('a');
    logoutLink.href = 'mockup_login.html';
    logoutLink.className = 'text-gray-400 hover:text-white';
    var logoutIcon = document.createElement('i');
    logoutIcon.setAttribute('data-lucide', 'log-out');
    logoutIcon.className = 'w-5 h-5';
    logoutLink.appendChild(logoutIcon);
    footerInner.appendChild(footerLeft);
    footerInner.appendChild(logoutLink);
    footer.appendChild(footerInner);
    aside.appendChild(footer);

    container.appendChild(aside);

    var links = container.querySelectorAll('.sidebar-link[href]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      if (href === current || current.indexOf(href) !== -1) {
        links[i].classList.add('active');
        var groupEl = links[i].closest('.sidebar-group');
        if (groupEl) {
          groupEl.classList.add('open');
          var sub = groupEl.querySelector('.sidebar-submenu');
          if (sub) sub.classList.add('open');
        }
        break;
      }
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  window.toggleSidebarGroup = toggleSidebarGroup;
  window.toggleSidebar = toggleSidebar;
  window.MockupSidebar = { render: render };
})();
