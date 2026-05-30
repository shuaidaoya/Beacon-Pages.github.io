(function(){
  'use strict';

  const SECURITY_URL = '/admin/security';
  const LINK_TEXT = '🛡️ 安全管理';
  const TOOLTIP = '安全管理：总览 / 用户 / 审计 / 注册管控 / 策略配置';

  // ── style injection ──────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .security-float-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: linear-gradient(135deg, #1e40af, #7c3aed);
      color: #fff;
      border: 1px solid rgba(99,102,241,.4);
      border-radius: 16px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(30,64,175,.35);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform .2s, box-shadow .2s;
      text-decoration: none;
    }
    .security-float-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(124,58,237,.45);
    }
    .security-float-btn:active { transform: scale(.96); }
    .security-header-btn {
      background: transparent;
      border: 1px solid rgba(99,102,241,.3);
      color: #a5b4fc;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all .2s;
    }
    .security-header-btn:hover {
      background: rgba(99,102,241,.12);
      border-color: rgba(99,102,241,.5);
      color: #c7d2fe;
    }
    .security-nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #cbd5e1;
      cursor: pointer;
      text-decoration: none;
      transition: all .2s;
    }
    .security-nav-item:hover {
      background: rgba(99,102,241,.1);
      color: #e2e8f0;
    }
    @media (max-width: 768px) {
      .security-float-btn {
        bottom: 16px;
        right: 16px;
        padding: 10px 16px;
        font-size: 13px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── detect admin panel readiness ──────────────────────────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // ── try injecting into header buttons ─────────────────────────
  function injectIntoHeader() {
    const headerBtns = document.querySelector('.header-buttons');
    if (headerBtns) {
      const btn = document.createElement('a');
      btn.href = SECURITY_URL;
      btn.className = 'security-header-btn';
      btn.textContent = LINK_TEXT;
      btn.title = TOOLTIP;
      // insert as first button
      headerBtns.insertBefore(btn, headerBtns.firstChild);
      return true;
    }
    return false;
  }

  // ── try injecting into sidebar / navigation ──────────────────
  function injectIntoSidebar() {
    // Look for common sidebar/nav patterns
    const sidebarSelectors = [
      '.sidebar', '.side-nav', '.nav-menu', '.navigation',
      'nav.sidebar', 'nav.menu', 'aside.sidebar',
      '.menu-list', '.nav-list', '.nav-items',
      '[class*="sidebar"]', '[class*="Sidebar"]',
      '[class*="side-nav"]', '[class*="nav-menu"]',
    ];

    for (const sel of sidebarSelectors) {
      const sidebar = document.querySelector(sel);
      if (sidebar) {
        const link = document.createElement('a');
        link.href = SECURITY_URL;
        link.className = 'security-nav-item';
        link.innerHTML = '<span style="font-size:16px">🛡️</span> 安全管理';
        link.title = TOOLTIP;

        // try to match existing nav item structure
        const existingItem = sidebar.querySelector('a, button, .nav-item, li');
        if (existingItem) {
          // wrap in same container type
          const parent = existingItem.parentElement;
          const clone = parent.cloneNode(false);
          clone.appendChild(link);
          parent.parentElement.appendChild(clone);
        } else {
          sidebar.appendChild(link);
        }
        return true;
      }
    }
    return false;
  }

  // ── floating button fallback ──────────────────────────────────
  function createFloatingButton() {
    const btn = document.createElement('a');
    btn.href = SECURITY_URL;
    btn.className = 'security-float-btn';
    btn.innerHTML = '<span style="font-size:16px">🛡️</span> 安全管理';
    btn.title = TOOLTIP;
    document.body.appendChild(btn);
  }

  // ── main ──────────────────────────────────────────────────────
  onReady(function() {
    // give the admin panel a moment to render its DOM
    setTimeout(function() {
      let injected = injectIntoHeader();
      if (!injected) injected = injectIntoSidebar();
      if (!injected) createFloatingButton();
    }, 800);
  });

})();
