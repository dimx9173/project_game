/**
 * Shared bottom navigation for Local Backend mockup HTML pages.
 * Aligned with Functional Matrix [LM01] - [LM05].
 * Usage: add <div id="bottom-nav-container"></div> in body, then MockupBottomNav.render('mockup_local_dashboard.html');
 */
(function () {
    'use strict';

    function render(activeHref) {
        var container = document.getElementById('bottom-nav-container');
        if (!container) return;

        var current = activeHref || (typeof window !== 'undefined' && window.location.pathname.split('/').pop()) || '';

        var navItems = [
            { id: 'LM01', text: '儀表板', icon: 'layout-dashboard', href: 'mockup_local_dashboard.html' },
            { id: 'LM02', text: '機台', icon: 'monitor', href: 'mockup_local_machine.html' },
            { id: 'LM03', text: '遊戲', icon: 'gamepad-2', href: 'mockup_local_game.html' },
            { id: 'LM04', text: '交易', icon: 'plus-circle', href: 'mockup_local_cash.html' },
            { id: 'LM05', text: '設定', icon: 'settings', href: 'mockup_local_system_settings.html' }
        ];

        var nav = document.createElement('nav');
        nav.className = 'fixed bottom-0 left-0 right-0 glass border-t border-dark-border z-40 pb-safe';

        var navInner = document.createElement('div');
        navInner.className = 'flex justify-around items-center py-2 px-2';

        navItems.forEach(function (item) {
            var a = document.createElement('a');
            a.href = item.href;
            var isActive = (item.href === current || current.indexOf(item.href) !== -1);

            a.className = 'flex flex-col items-center px-4 py-2 touch-manipulation transition-colors duration-200 ' +
                (isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-white');

            var icon = document.createElement('i');
            icon.setAttribute('data-lucide', item.icon);
            icon.className = 'w-7 h-7';
            a.appendChild(icon);

            var span = document.createElement('span');
            span.className = 'text-xs mt-1';
            span.textContent = item.text;
            a.appendChild(span);

            navInner.appendChild(a);
        });

        nav.appendChild(navInner);
        container.innerHTML = '';
        container.appendChild(nav);

        // Add safe area padding style if not present
        if (!document.getElementById('bottom-nav-styles')) {
            var style = document.createElement('style');
            style.id = 'bottom-nav-styles';
            style.textContent = '.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0); }';
            document.head.appendChild(style);
        }

        // Ensure sidebar is removed if it exists
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.remove();
        document.body.style.paddingLeft = '0';
        document.body.classList.remove('has-sidebar');

        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    window.MockupBottomNav = { render: render };
})();
