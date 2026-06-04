(function(){
  'use strict';

  // ══════════════════════════════════════════
  //  Beacon 安全管理模块 — 注入到 /admin 页面
  //  作为可折叠卡片，匹配现有 .module 模式
  // ══════════════════════════════════════════

  // ── wait for DOM ──
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  // ── CSS: pure light theme matching admin card style ──
  const CSS = `
<style id="sec-module-style">
.sec-module .sec-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:20px;padding:6px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:14px}
.sec-module .sec-tab{background:transparent;border:none;color:#6b7280;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.sec-module .sec-tab:hover{color:#1f2937;background:rgba(250,171,65,.08)}
.sec-module .sec-tab.active{background:linear-gradient(135deg,#faab41,#f6821f);color:#fff}
.sec-module .sec-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.sec-module .sec-stat{background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px;text-align:center}
.sec-module .sec-stat-num{font-size:28px;font-weight:800;color:#1f2937;line-height:1.2}
.sec-module .sec-stat-label{font-size:12px;color:#6b7280;margin-top:4px}
.sec-module .sec-stat.sec-stat-warn .sec-stat-num{color:#f59e0b}
.sec-module .sec-stat.sec-stat-danger .sec-stat-num{color:#ef4444}
.sec-module .sec-stat.sec-stat-ok .sec-stat-num{color:#16a34a}
.sec-module .sec-filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center}
.sec-module .sec-filter input,.sec-module .sec-filter select{background:#fff;border:1px solid #d1d5db;border-radius:10px;padding:8px 12px;color:#1f2937;font-size:13px;outline:none}
.sec-module .sec-filter input:focus,.sec-module .sec-filter select:focus{border-color:#faab41;box-shadow:0 0 0 2px rgba(250,171,65,.15)}
.sec-module .sec-filter input{min-width:200px}
.sec-module .sec-btn{background:#fff;border:1px solid #d1d5db;color:#374151;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
.sec-module .sec-btn:hover:not(:disabled){background:#f3f4f6;border-color:#9ca3af}
.sec-module .sec-btn:disabled{opacity:.4;cursor:not-allowed}
.sec-module .sec-btn-primary{background:linear-gradient(135deg,#faab41,#f6821f);color:#fff;border-color:transparent;box-shadow:0 2px 8px rgba(250,171,65,.25)}
.sec-module .sec-btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 14px rgba(250,171,65,.35)}
.sec-module .sec-btn-danger{color:#dc2626;border-color:rgba(220,38,38,.25);background:#fff}
.sec-module .sec-btn-danger:hover:not(:disabled){background:#fef2f2;border-color:rgba(220,38,38,.4)}
.sec-module .sec-btn-sm{padding:5px 10px;font-size:12px}
.sec-module .sec-table-wrap{overflow-x:auto;border-radius:12px;border:1px solid #e5e7eb}
.sec-module .sec-table{width:100%;border-collapse:collapse;font-size:13px}
.sec-module .sec-table th{background:#f9fafb;color:#6b7280;padding:10px 12px;text-align:left;font-weight:600;font-size:12px;white-space:nowrap;border-bottom:1px solid #e5e7eb}
.sec-module .sec-table td{padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;white-space:nowrap}
.sec-module .sec-table tr:hover td{background:rgba(250,171,65,.04)}
.sec-module .sec-badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
.sec-module .sec-badge-active{background:#dcfce7;color:#16a34a}
.sec-module .sec-badge-banned{background:#fee2e2;color:#dc2626}
.sec-module .sec-badge-high{background:#fee2e2;color:#dc2626}
.sec-module .sec-badge-medium{background:#fef3c7;color:#d97706}
.sec-module .sec-badge-low{background:#f3f4f6;color:#6b7280}
.sec-module .sec-pagination{display:flex;gap:8px;align-items:center;justify-content:center;padding:12px}
.sec-module .sec-timeline{display:flex;flex-direction:column;gap:8px;max-height:500px;overflow-y:auto}
.sec-module .sec-timeline-item{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start}
.sec-module .sec-timeline-dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0}
.sec-module .sec-timeline-body{flex:1;min-width:0}
.sec-module .sec-timeline-type{font-weight:700;font-size:13px;margin-bottom:2px;color:#1f2937}
.sec-module .sec-timeline-detail{font-size:12px;color:#6b7280;word-break:break-all}
.sec-module .sec-timeline-time{font-size:11px;color:#9ca3af}
.sec-module .sec-config-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.sec-module .sec-config-group{background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px 18px}
.sec-module .sec-config-group h4{font-size:13px;color:#1f2937;margin:0 0 10px;padding-bottom:6px;border-bottom:1px solid #e5e7eb}
@media(max-width:900px){.sec-module .sec-config-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.sec-module .sec-config-grid{grid-template-columns:1fr}}
.sec-module .sec-config-row{display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
.sec-module .sec-config-row label{font-size:12px;color:#6b7280;min-width:80px}
.sec-module .sec-config-row input{background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:6px 8px;color:#1f2937;font-size:13px;width:80px;text-align:right}
.sec-module .sec-config-row select{background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:6px 10px;color:#1f2937;font-size:13px}
.sec-module .sec-config-row input:focus,.sec-module .sec-config-row select:focus{border-color:#faab41;outline:none;box-shadow:0 0 0 2px rgba(250,171,65,.15)}
.sec-module .sec-empty{padding:40px;text-align:center;color:#9ca3af;font-size:14px}
.sec-module .sec-loading{display:flex;align-items:center;justify-content:center;padding:40px;gap:10px;color:#9ca3af}
.sec-module .sec-spinner{width:18px;height:18px;border:2px solid #e5e7eb;border-top-color:#faab41;border-radius:50%;animation:sec-spin .6s linear infinite}
@keyframes sec-spin{to{transform:rotate(360deg)}}
.sec-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
.sec-drawer{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;max-width:560px;width:100%;max-height:75vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.1)}
.sec-drawer h3{font-size:16px;margin:0 0 12px;color:#1f2937}
.sec-drawer pre{background:#f9fafb;border-radius:10px;padding:12px;overflow-x:auto;font-size:12px;color:#1f2937;white-space:pre-wrap}
.sec-drawer-close{float:right;background:transparent;border:none;color:#9ca3af;font-size:20px;cursor:pointer}
.sec-drawer-close:hover{color:#1f2937}
.sec-modal-form{display:flex;flex-direction:column;gap:14px;margin-top:8px}
.sec-modal-group{display:flex;flex-direction:column;gap:8px}
.sec-modal-label{font-size:13px;font-weight:700;color:#1f2937}
.sec-modal-help{font-size:12px;color:#6b7280}
.sec-modal-radio{display:flex;gap:10px;flex-wrap:wrap}
.sec-modal-radio label,.sec-modal-check label{display:flex;align-items:center;gap:8px;font-size:13px;color:#374151}
.sec-modal-input{background:#fff;border:1px solid #d1d5db;border-radius:10px;padding:10px 12px;color:#1f2937;font-size:14px;outline:none}
.sec-modal-input:focus{border-color:#faab41;box-shadow:0 0 0 2px rgba(250,171,65,.15)}
.sec-modal-check{display:flex;flex-direction:column;gap:8px}
.sec-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:4px}
.sec-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:10px 24px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.15);animation:sec-fade .3s;pointer-events:none}
.sec-toast-ok{background:#16a34a;color:#fff}
.sec-toast-err{background:#dc2626;color:#fff}
@keyframes sec-fade{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@media(max-width:768px){.sec-module .sec-stats{grid-template-columns:repeat(2,1fr)}.sec-module .sec-filter input{min-width:120px}}
@media(max-width:480px){.sec-module .sec-stats{grid-template-columns:1fr 1fr}}
</style>`;

  // ── HTML template ──
  const HTML = `
<div class="module collapsed advanced-module" id="sec-module-root">
  <div class="module-title" onclick="toggleModule(this)">
    🛡️ 安全管理
    <svg class="collapse-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
  </div>
  <div class="module-content sec-module">
    <div class="sec-tabs" id="sec-tabs">
      <button class="sec-tab active" data-p="overview">📊 总览</button>
      <button class="sec-tab" data-p="users">👥 用户管理</button>
      <button class="sec-tab" data-p="audit">📋 审计日志</button>
      <button class="sec-tab" data-p="registration">📝 注册管控</button>
      <button class="sec-tab" data-p="config">⚙️ 策略配置</button>
    </div>
    <div id="sec-content"></div>
  </div>
</div>`;

  // ── API helper ──
  async function api(path, opts) {
    const resp = await fetch('/admin/system' + path, opts || {});
    if (resp.status === 302 || resp.status === 401) throw new Error('auth_redirect');
    const data = await resp.json();
    if (!data.success && data.error) throw new Error(data.error);
    return data;
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function escAttr(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;'); }
  function ts(ms) { if (!ms) return '-'; return new Date(ms).toLocaleString('zh-CN'); }
  function ago(ms) { if (!ms) return '-'; const s = Math.floor((Date.now() - ms)/1000); if (s<60) return s+'秒前'; if (s<3600) return Math.floor(s/60)+'分钟前'; if (s<86400) return Math.floor(s/3600)+'小时前'; return Math.floor(s/86400)+'天前'; }
  function fmtBytes(b) { if (!b||b<=0) return '-'; const k=1024,u=['B','KB','MB','GB','TB']; const i=Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(1))+' '+u[i]; }
  function fmtQuota(u) { return u && u.traffic > 0 ? fmtBytes(u.traffic) : '不限量'; }
  function toast(msg, type) {
    const t = document.createElement('div'); t.className = 'sec-toast sec-toast-'+(type==='error'?'err':'ok');
    t.textContent = msg; $('#sec-module-root').appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; }, 1800);
    setTimeout(() => t.remove(), 2200);
  }

  function closeTrafficLimitModal() {
    const modal = document.getElementById('sec-traffic-modal');
    if (modal) modal.remove();
  }

  function bindUserTableActions(scope) {
    if (!scope) return;
    scope.onclick = function(event) {
      const detailBtn = event.target.closest('[data-user-detail]');
      if (detailBtn) {
        const uuid = detailBtn.getAttribute('data-user-detail');
        if (uuid) userDetail(uuid);
        return;
      }
      const actionBtn = event.target.closest('[data-user-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-user-action');
        const uuid = actionBtn.getAttribute('data-user-uuid');
        if (action && uuid) userAction(action, uuid);
      }
    };
  }

  function openTrafficLimitModal(user) {
    if (!user || !user.uuid) {
      toast('未找到用户信息', 'error');
      return;
    }
    closeTrafficLimitModal();
    const gb = 1024 * 1024 * 1024;
    const currentTotal = user.traffic > 0 ? fmtBytes(user.traffic) : '不限量';
    const currentUsed = fmtBytes(user.used_traffic || 0);
    const fixedValue = user.traffic > 0 ? String(Math.max(0.01, Math.round((user.traffic / gb) * 100) / 100)) : '50';
    const html =
      '<div class="sec-drawer-overlay" id="sec-traffic-modal">' +
        '<div class="sec-drawer">' +
          '<button class="sec-drawer-close" type="button" id="sec-traffic-close">✕</button>' +
          '<h3>设置总限额</h3>' +
          '<div class="sec-modal-form">' +
            '<div class="sec-modal-group">' +
              '<div class="sec-modal-label">当前流量信息</div>' +
              '<div class="sec-modal-help">当前总限额：' + esc(currentTotal) + ' / 当前已用流量：' + esc(currentUsed) + '</div>' +
            '</div>' +
            '<div class="sec-modal-group">' +
              '<div class="sec-modal-label">限额模式</div>' +
              '<div class="sec-modal-radio">' +
                '<label><input type="radio" name="secTrafficMode" value="unlimited"' + (user.traffic > 0 ? '' : ' checked') + '> 不限量</label>' +
                '<label><input type="radio" name="secTrafficMode" value="fixed"' + (user.traffic > 0 ? ' checked' : '') + '> 固定限额</label>' +
              '</div>' +
            '</div>' +
            '<div class="sec-modal-group">' +
              '<label class="sec-modal-label" for="sec-traffic-value">固定限额</label>' +
              '<div style="display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:10px">' +
                '<input class="sec-modal-input" id="sec-traffic-value" type="number" min="0.01" step="0.01" value="' + escAttr(fixedValue) + '">' +
                '<select class="sec-modal-input" id="sec-traffic-unit"><option value="MB">MB</option><option value="GB" selected>GB</option><option value="TB">TB</option></select>' +
              '</div>' +
              '<div class="sec-modal-help">支持 MB / GB / TB，保存时会自动换算。</div>' +
            '</div>' +
            '<div class="sec-modal-check">' +
              '<label><input type="checkbox" id="sec-reset-used-traffic"> 同时清零已用流量</label>' +
              '<label><input type="checkbox" id="sec-show-apply-notice" checked> 保存后立即生效提示</label>' +
            '</div>' +
            '<div class="sec-modal-group">' +
              '<div class="sec-modal-label">剩余可用流量预估</div>' +
              '<div class="sec-modal-help" id="sec-traffic-preview">按当前已用流量计算，设置后剩余可用流量将在这里显示。</div>' +
            '</div>' +
            '<div class="sec-modal-actions">' +
              '<button class="sec-btn" type="button" id="sec-traffic-cancel">取消</button>' +
              '<button class="sec-btn sec-btn-primary" type="button" id="sec-traffic-save">保存设置</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('sec-traffic-modal');
    const valueInput = document.getElementById('sec-traffic-value');
    const unitInput = document.getElementById('sec-traffic-unit');
    const previewEl = document.getElementById('sec-traffic-preview');
    const resetUsedInput = document.getElementById('sec-reset-used-traffic');
    const modeInputs = modal.querySelectorAll('input[name="secTrafficMode"]');
    const formatByUnit = (value, unit) => {
      const units = { MB: 1024 * 1024, GB: 1024 * 1024 * 1024, TB: 1024 * 1024 * 1024 * 1024 };
      const base = units[unit] || units.GB;
      return (Math.round((value / base) * 100) / 100) + ' ' + unit;
    };
    const sync = () => {
      const mode = modal.querySelector('input[name="secTrafficMode"]:checked')?.value || 'fixed';
      const disabled = mode !== 'fixed';
      valueInput.disabled = disabled;
      unitInput.disabled = disabled;
      if (!previewEl) return;
      if (mode === 'unlimited') {
        previewEl.textContent = '设置为不限量后，剩余可用流量将不受总限额限制。';
        return;
      }
      const value = Number(valueInput.value);
      const unit = unitInput.value || 'GB';
      const factor = unit === 'TB' ? 1024 : unit === 'MB' ? 1 / 1024 : 1;
      const targetGB = value * factor;
      if (!Number.isFinite(targetGB) || targetGB <= 0) {
        previewEl.textContent = '请输入有效的固定限额数值后查看预估结果。';
        return;
      }
      const targetBytes = targetGB * gb;
      const usedBytes = resetUsedInput.checked ? 0 : Number(user.used_traffic || 0);
      const remainingBytes = targetBytes - usedBytes;
      if (remainingBytes >= 0) {
        previewEl.textContent = '按当前已用流量计算，设置后剩余约 ' + formatByUnit(remainingBytes, unit) + '。';
      } else {
        previewEl.textContent = '按当前已用流量计算，设置后将超额约 ' + formatByUnit(Math.abs(remainingBytes), unit) + '。';
      }
    };
    modeInputs.forEach(input => input.addEventListener('change', sync));
    valueInput.addEventListener('input', sync);
    unitInput.addEventListener('change', sync);
    resetUsedInput.addEventListener('change', sync);
    sync();
    document.getElementById('sec-traffic-close').onclick = closeTrafficLimitModal;
    document.getElementById('sec-traffic-cancel').onclick = closeTrafficLimitModal;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeTrafficLimitModal(); });
    document.getElementById('sec-traffic-save').onclick = async () => {
      const mode = modal.querySelector('input[name="secTrafficMode"]:checked')?.value || 'fixed';
      const resetUsedTraffic = !!document.getElementById('sec-reset-used-traffic')?.checked;
      const showNotice = !!document.getElementById('sec-show-apply-notice')?.checked;
      const body = {
        uuid: user.uuid,
        mode,
        resetUsedTraffic,
        reason: 'admin-ui-set-traffic',
      };
      if (mode === 'fixed') {
        const value = Number(valueInput.value);
        const unit = unitInput.value || 'GB';
        const factor = unit === 'TB' ? 1024 : unit === 'MB' ? 1 / 1024 : 1;
        body.trafficGB = value * factor;
        if (!Number.isFinite(body.trafficGB) || body.trafficGB <= 0) {
          toast('请输入有效的固定限额数值', 'error');
          valueInput.focus();
          return;
        }
      }
      const confirmMessage = mode === 'unlimited'
        ? ('确认将该用户的总限额设置为不限量吗？当前已用流量为 ' + currentUsed + '。')
        : ('确认将该用户的总限额设置为 ' + valueInput.value + ' ' + unitInput.value + ' 吗？当前已用流量为 ' + currentUsed + (resetUsedTraffic ? '，并会同时清零已用流量。' : '。'));
      if (!confirm(confirmMessage)) return;
      try {
        await api('/users/traffic', { method:'POST', body: JSON.stringify(body) });
        closeTrafficLimitModal();
        const msg = mode === 'unlimited' ? '总限额已设置为不限量' : ('总限额已设置为 ' + valueInput.value + ' ' + unitInput.value);
        toast(msg);
        if (showNotice) alert(msg + (resetUsedTraffic ? '，并已清零已用流量。' : '，已立即生效。'));
        loadUsers();
      } catch (e) {
        if (e.message !== 'auth_redirect') toast('设置总限额失败: ' + e.message, 'error');
      }
    };
  }

  // ══════════════════════════════════════════
  //  1. 总览
  // ══════════════════════════════════════════
  async function loadOverview() {
    const el = $('#sec-content');
    el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>';
    try {
      const data = await api('?limit=30');
      const s = data.summary || {};
      const bans = data.activeBans || [];
      const events = data.recentEvents || [];
      const risks = data.topSubscriptionRisks || [];

      let html = '<div class="sec-stats">';
      html += '<div class="sec-stat sec-stat-ok"><div class="sec-stat-num">'+(s.userCount||0)+'</div><div class="sec-stat-label">总用户</div></div>';
      html += '<div class="sec-stat sec-stat-danger"><div class="sec-stat-num">'+(s.activeBanCount||0)+'</div><div class="sec-stat-label">活跃封禁</div></div>';
      html += '<div class="sec-stat"><div class="sec-stat-num">'+(s.recentEventCount||0)+'</div><div class="sec-stat-label">近期事件</div></div>';
      html += '<div class="sec-stat sec-stat-warn"><div class="sec-stat-num">'+(s.highRiskSubscriptionCount||0)+'</div><div class="sec-stat-label">高风险订阅</div></div>';
      html += '</div>';

      // bans
      html += '<h4 style="margin:16px 0 8px;color:#93c5fd">🔒 活跃封禁</h4>';
      if (!bans.length) html += '<div class="sec-empty">暂无活跃封禁</div>';
      else {
        html += '<div class="sec-table-wrap"><table class="sec-table"><tr><th>原因</th><th>创建时间</th><th>过期时间</th></tr>';
        bans.forEach(b => {
          html += '<tr><td><span class="sec-badge sec-badge-banned">'+esc(b.reasonType||'-')+'</span></td><td>'+ts(b.createdAt)+'</td><td>'+ts(b.expiresAt)+'</td></tr>';
        });
        html += '</table></div>';
      }

      // risks
      html += '<h4 style="margin:16px 0 8px;color:#93c5fd">⚠️ 订阅风险排行</h4>';
      if (!risks.length) html += '<div class="sec-empty">暂无风险记录</div>';
      else {
        html += '<div class="sec-table-wrap"><table class="sec-table"><tr><th>UUID</th><th>风险等级</th><th>分数</th><th>最后活跃</th></tr>';
        risks.forEach(r => {
          const lvl = (r.subscription?.risk?.level||'low');
          const cls = lvl==='high'?'high':lvl==='medium'?'medium':'low';
          html += '<tr><td><code style="font-size:11px">'+esc((r.uuid||'').slice(0,12)+'...')+'</code></td><td><span class="sec-badge sec-badge-'+cls+'">'+esc(lvl)+'</span></td><td>'+(r.subscription?.risk?.score||0)+'</td><td>'+ago(r.lastSeenAt)+'</td></tr>';
        });
        html += '</table></div>';
      }

      // events
      html += '<h4 style="margin:16px 0 8px;color:#93c5fd">📋 最近事件</h4>';
      if (!events.length) html += '<div class="sec-empty">暂无事件</div>';
      else {
        html += '<div class="sec-timeline">';
        events.forEach(e => {
          html += '<div class="sec-timeline-item"><div class="sec-timeline-dot" style="background:#3b82f6"></div><div class="sec-timeline-body"><div class="sec-timeline-type">'+esc(e.eventType||e.type||'事件')+'</div><div class="sec-timeline-detail">'+esc(JSON.stringify(e.detail||e).slice(0,200))+'</div><div class="sec-timeline-time">'+ago(e.createdAt||e.time)+'</div></div></div>';
        });
        html += '</div>';
      }

      el.innerHTML = html;
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  // ══════════════════════════════════════════
  //  2. 用户管理
  // ══════════════════════════════════════════
  let usersState = { selected: new Set(), cursor: null, hasMore: false };

  async function loadUsers(cursor) {
    const el = $('#sec-content');
    if (!cursor) { el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>'; usersState.selected.clear(); }

    const q = ($('#sec-user-search')?.value||'').trim();
    const st = ($('#sec-user-status')?.value||'');
    const ma = ($('#sec-user-multiaccount')?.value||'');
    const mat = ($('#sec-user-multiaccount-type')?.value||'');
    let url = '?limit=60';
    if (q) url += '&q=' + encodeURIComponent(q);
    if (st) url += '&status=' + encodeURIComponent(st);
    if (ma) { url += '&multiAccount=' + encodeURIComponent(ma); if (mat) url += '&multiAccountType=' + encodeURIComponent(mat); }
    if (cursor) url += '&cursor=' + encodeURIComponent(cursor);

    try {
      let data;
      // if cursor, append to existing
      if (cursor) {
        data = await api('/users' + url);
        usersState.cursor = data.cursor;
        usersState.hasMore = data.hasMore;
        appendUsers(data.users||[]);
      } else {
        // render filter bar
        el.innerHTML =
          '<div class="sec-filter">' +
          '<input type="text" id="sec-user-search" placeholder="搜索 UUID / 用户名 / 邮箱 / IP ..." value="'+escAttr(q)+'">' +
          '<select id="sec-user-status"><option value="">全部状态</option><option value="active"'+(st==='active'?' selected':'')+'>活跃</option><option value="banned"'+(st==='banned'?' selected':'')+'>已封禁</option></select>' +
          '<select id="sec-user-multiaccount"><option value="">全部用户</option><option value="only"'+(ma==='only'?' selected':'')+'>多账号用户</option></select>' +
          '<select id="sec-user-multiaccount-type" style="display:'+(ma==='only'?'inline':'none')+';max-width:140px"><option value="">全部类型</option><option value="account">同名用户</option><option value="email">同邮箱</option><option value="lastIp">同IP</option><option value="userKey">同身份</option></select>' +
          '<button class="sec-btn sec-btn-primary" onclick="window._secLoadUsers()">🔍 搜索</button>' +
          '<button class="sec-btn sec-btn-danger sec-btn-sm" id="sec-batch-ban" disabled>批量封禁</button>' +
          '<button class="sec-btn sec-btn-sm" id="sec-batch-restore" disabled>批量解禁</button>' +
          '<button class="sec-btn sec-btn-sm" id="sec-batch-reset" disabled>批量重置</button>' +
          '<button class="sec-btn sec-btn-danger sec-btn-sm" id="sec-batch-delete" disabled>批量删除</button>' +
          '</div>' +
          '<div style="margin-bottom:10px;font-size:13px;color:#374151;font-weight:500" id="sec-users-summary"></div>' +
          '<div id="sec-users-table"></div>' +
          '<div id="sec-users-pager" class="sec-pagination"></div>';

        data = await api('/users' + url);
        usersState.cursor = data.cursor;
        usersState.hasMore = data.hasMore;
        renderUsers(data.users||[], data.summary);
        // 再查一次确认 summary 已渲染（防御性）
        var sumCheck = $('#sec-users-summary');
        if (!sumCheck || !sumCheck.textContent) {
          renderUsers(data.users||[], data.summary);
        }

        // sync multi-account type visibility
        setTimeout(() => {
          const maSel = $('#sec-user-multiaccount');
          const matSel = $('#sec-user-multiaccount-type');
          if (maSel && matSel) {
            maSel.addEventListener('change', () => { matSel.style.display = maSel.value === 'only' ? 'inline' : 'none'; });
          }
        }, 50);
      }
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  function renderUsers(users, summary) {
    // store user map for detail lookup
    usersState.userMap = usersState.userMap || {};
    users.forEach(u => { if (u.uuid) usersState.userMap[u.uuid] = u; });

    const s = summary || {};
    const sumEl = $('#sec-users-summary');
    if (sumEl) {
      try {
        const typeLabels = { account:'同名账户', email:'同邮箱', lastIp:'同IP', userKey:'同身份' };
        const mb = (s && s.multiByType) || {};
        const maParts = [];
        for (var mk in mb) {
          if (mb.hasOwnProperty(mk)) {
            var mv = mb[mk];
            maParts.push('<span style="color:#ef4444;font-weight:600">'+esc(typeLabels[mk]||mk)+' '+mv.groups+'组/'+mv.users+'人</span>');
          }
        }
        var maTag = maParts.length ? ' · ' + maParts.join(' · ') : '';
        sumEl.innerHTML = '共 '+(s.total||users.length)+' 用户'+(s.active!=null?' · 活跃 '+s.active:'')+(s.banned!=null?' · 封禁 '+s.banned:'') + maTag;
      } catch(e) { sumEl.textContent = '共 '+(users.length)+' 用户'; }
    }

    const multiAccountBadge = (u) => {
      if (!u.multiAccount?.isMulti) return '-';
      const types = (u.multiAccount.types||[]);
      const labels = { account:'同名', email:'同邮箱', lastIp:'同IP', userKey:'同身份' };
      const badges = types.map(t => '<span class="sec-badge sec-badge-high">'+esc(labels[t]||t)+'</span>').join(' ');
      const count = u.multiAccount.maxCount > 2 ? (' ×'+u.multiAccount.maxCount) : '';
      return '<span style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">'+badges+'<span style="font-size:10px;color:#ef4444">'+count+'</span></span>';
    };

    const rows = users.map(u => [
      '<input type="checkbox" class="sec-user-cb" data-uuid="'+escAttr(u.uuid||'')+'">',
      '<code style="font-size:11px">'+esc((u.uuid||'').slice(0,12)+'...')+'</code>',
      esc(u.profile?.account||'-'),
      esc(u.profile?.email||'-'),
      '<span class="sec-badge sec-badge-'+(u.status==='banned'?'banned':'active')+'">'+esc(u.status||'-')+'</span>',
      (u.subscription?.risk?.level ? '<span class="sec-badge sec-badge-'+(u.subscription.risk.level==='high'?'high':u.subscription.risk.level==='medium'?'medium':'low')+'">'+esc(u.subscription.risk.level)+(u.subscription.risk.score?' '+u.subscription.risk.score:'')+'</span>' : '-'),
      '<span style="font-size:11px">'+fmtBytes(u.used_traffic||0)+' / '+fmtQuota(u)+'</span>',
      esc(u.lastIp||u.profile?.lastIp||'-'),
      ago(u.lastSeenAt||u.lifecycle?.lastSeenAt),
      multiAccountBadge(u),
      '<button class="sec-btn sec-btn-sm" data-user-detail="'+escAttr(u.uuid)+'">详情</button>' +
      (u.status==='banned'
        ? ' <button class="sec-btn sec-btn-sm" data-user-action="restore" data-user-uuid="'+escAttr(u.uuid)+'">解禁</button>'
        : ' <button class="sec-btn sec-btn-sm sec-btn-danger" data-user-action="ban" data-user-uuid="'+escAttr(u.uuid)+'">封禁</button>') +
      ' <button class="sec-btn sec-btn-sm" data-user-action="set-traffic" data-user-uuid="'+escAttr(u.uuid)+'">总限额</button>' +
      ' <button class="sec-btn sec-btn-sm" data-user-action="reset-subscription" data-user-uuid="'+escAttr(u.uuid)+'">重置</button>' +
      ' <button class="sec-btn sec-btn-sm sec-btn-danger" data-user-action="delete" data-user-uuid="'+escAttr(u.uuid)+'">删除</button>',
    ]);

    const tblEl = $('#sec-users-table');
    if (tblEl) {
      tblEl.innerHTML = '<div class="sec-table-wrap"><table class="sec-table"><tr><th></th><th>UUID</th><th>账户</th><th>邮箱</th><th>状态</th><th>风险</th><th>用量</th><th>最后IP</th><th>最后活跃</th><th>多账号</th><th>操作</th></tr>' +
        rows.map(r => '<tr>'+r.map(c => '<td>'+c+'</td>').join('')+'</tr>').join('') +
        '</table></div>';
      bindUserTableActions(tblEl);

      // checkbox events
      tblEl.querySelectorAll('.sec-user-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          const uuid = cb.dataset.uuid;
          if (cb.checked) usersState.selected.add(uuid);
          else usersState.selected.delete(uuid);
          updateBatchBtns();
        });
      });
      updateBatchBtns();
    }

    // pagination
    const pagerEl = $('#sec-users-pager');
    if (pagerEl && usersState.hasMore) {
      pagerEl.innerHTML = '<button class="sec-btn sec-btn-primary" onclick="window._secLoadMore()">加载更多</button>';
    } else if (pagerEl) {
      pagerEl.innerHTML = users.length ? '<span style="color:#64748b;font-size:12px">已显示全部</span>' : '';
    }
  }

  function appendUsers(users) {
    // remove pager, append rows to existing table
    const tbl = $('#sec-users-table .sec-table');
    if (!tbl) return;
    const multiAccountBadge = (u) => {
      if (!u.multiAccount?.isMulti) return '-';
      const types = (u.multiAccount.types||[]);
      const labels = { account:'同名', email:'同邮箱', lastIp:'同IP', userKey:'同身份' };
      const badges = types.map(t => '<span class="sec-badge sec-badge-high">'+esc(labels[t]||t)+'</span>').join(' ');
      const count = u.multiAccount.maxCount > 2 ? (' ×'+u.multiAccount.maxCount) : '';
      return '<span style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">'+badges+'<span style="font-size:10px;color:#ef4444">'+count+'</span></span>';
    };
    const rows = users.map(u => [
      '<input type="checkbox" class="sec-user-cb" data-uuid="'+escAttr(u.uuid||'')+'">',
      '<code style="font-size:11px">'+esc((u.uuid||'').slice(0,12)+'...')+'</code>',
      esc(u.profile?.account||'-'),
      esc(u.profile?.email||'-'),
      '<span class="sec-badge sec-badge-'+(u.status==='banned'?'banned':'active')+'">'+esc(u.status||'-')+'</span>',
      (u.subscription?.risk?.level ? '<span class="sec-badge sec-badge-'+(u.subscription.risk.level==='high'?'high':u.subscription.risk.level==='medium'?'medium':'low')+'">'+esc(u.subscription.risk.level)+'</span>' : '-'),
      '<span style="font-size:11px">'+fmtBytes(u.used_traffic||0)+' / '+fmtQuota(u)+'</span>',
      esc(u.lastIp||'-'),
      ago(u.lastSeenAt),
      multiAccountBadge(u),
      '<button class="sec-btn sec-btn-sm" data-user-detail="'+escAttr(u.uuid)+'">详情</button>' +
      (u.status==='banned'
        ? ' <button class="sec-btn sec-btn-sm" data-user-action="restore" data-user-uuid="'+escAttr(u.uuid)+'">解禁</button>'
        : ' <button class="sec-btn sec-btn-sm sec-btn-danger" data-user-action="ban" data-user-uuid="'+escAttr(u.uuid)+'">封禁</button>') +
      ' <button class="sec-btn sec-btn-sm" data-user-action="set-traffic" data-user-uuid="'+escAttr(u.uuid)+'">总限额</button>' +
      ' <button class="sec-btn sec-btn-sm" data-user-action="reset-subscription" data-user-uuid="'+escAttr(u.uuid)+'">重置</button>' +
      ' <button class="sec-btn sec-btn-sm sec-btn-danger" data-user-action="delete" data-user-uuid="'+escAttr(u.uuid)+'">删除</button>',
    ]);
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = r.map(c => '<td>'+c+'</td>').join('');
      tbl.appendChild(tr);
    });
    bindUserTableActions($('#sec-users-table'));
    // re-attach checkbox events
    tbl.querySelectorAll('.sec-user-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) usersState.selected.add(cb.dataset.uuid);
        else usersState.selected.delete(cb.dataset.uuid);
        updateBatchBtns();
      });
    });

    // update pager
    const pagerEl = $('#sec-users-pager');
    if (pagerEl) {
      if (usersState.hasMore) pagerEl.innerHTML = '<button class="sec-btn sec-btn-primary" onclick="window._secLoadMore()">加载更多</button>';
      else pagerEl.innerHTML = '<span style="color:#64748b;font-size:12px">已显示全部</span>';
    }
  }

  function updateBatchBtns() {
    const n = usersState.selected.size;
    ['sec-batch-ban','sec-batch-restore','sec-batch-reset','sec-batch-delete'].forEach(id => {
      const btn = $('#'+id); if (btn) btn.disabled = n === 0;
    });
  }

  async function batchAction(action) {
    const uuids = [...usersState.selected];
    if (!uuids.length) return;
    const labels = { ban:'封禁', restore:'解禁', 'reset-subscription':'重置订阅', delete:'删除' };
    const confirmText = action === 'delete'
      ? ('确认彻底删除这 '+uuids.length+' 个用户？此操作不可恢复。')
      : ('确认批量'+labels[action]+'这 '+uuids.length+' 个用户？');
    if (!confirm(confirmText)) return;
    try {
      await api('/users/batch', { method:'POST', body: JSON.stringify({ action, uuids, reason:'admin-ui-batch' }) });
      toast('批量操作完成');
      usersState.selected.clear();
      loadUsers();
    } catch(e) {
      if (e.message !== 'auth_redirect') toast('批量操作失败: '+e.message, 'error');
    }
  }

  async function userAction(action, uuid) {
    if (action === 'set-traffic') {
      openTrafficLimitModal((usersState.userMap||{})[uuid] || { uuid });
      return;
    }
    const labels = { ban:'封禁', restore:'解禁', 'reset-subscription':'重置订阅', delete:'删除' };
    const confirmText = action === 'delete'
      ? '确认彻底删除该用户？此操作不可恢复。'
      : ('确认'+labels[action]+'该用户？');
    if (!confirm(confirmText)) return;
    try {
      const endpoint = action === 'restore'
        ? '/users/restore'
        : action === 'reset-subscription'
          ? '/users/reset-subscription'
          : action === 'delete'
            ? '/users/delete'
            : '/users/ban';
      await api(endpoint, { method:'POST', body: JSON.stringify({ uuid, reason:'admin-ui' }) });
      toast(labels[action]+'成功');
      loadUsers();
    } catch(e) {
      if (e.message !== 'auth_redirect') toast(labels[action]+'失败: '+e.message, 'error');
    }
  }

  async function userDetail(uuid) {
    try {
      // fetch audit events + look up user from cache
      const [data, user] = await Promise.all([
        api('/users/audit?limit=12&uuid='+encodeURIComponent(uuid)),
        Promise.resolve((usersState.userMap||{})[uuid] || null),
      ]);
      const events = data.events || [];
      const profile = user?.profile || {};
      const sub = user?.subscription || {};
      const ban = user?.activeBan;
      const totalTraffic = user?.traffic > 0 ? fmtBytes(user.traffic) : '不限量';

      let html = '<div class="sec-drawer-overlay" id="sec-drawer"><div class="sec-drawer">';
      html += '<button class="sec-drawer-close" id="sec-drawer-close" type="button">✕</button>';
      html += '<h3>用户详情</h3>';

      // user info
      html += '<div class="sec-drawer-section"><h4>基本信息</h4>';
      html += '<pre>UUID:   '+esc(uuid||'-')+'\n账户:   '+esc(profile.account||'-')+'\n邮箱:   '+esc(profile.email||'-')+'\n状态:   '+esc(user?.status||'-')+'\n风险:   '+esc(sub.risk?.level||'-')+(sub.risk.score!=null?' ('+sub.risk.score+')':'')+'\n已用:   '+fmtBytes(user?.used_traffic||0)+'\n总限额: '+esc(totalTraffic)+'\n最后IP: '+esc(user?.lastIp||'-')+'\n最后活跃: '+ago(user?.lastSeenAt||user?.lifecycle?.lastSeenAt)+'</pre></div>';
      html += '<div class="sec-drawer-section"><button class="sec-btn sec-btn-primary" id="sec-drawer-set-traffic" data-user-uuid="'+escAttr(uuid)+'">设置总限额</button></div>';

      // ban info
      if (ban) {
        html += '<div class="sec-drawer-section"><h4>封禁信息</h4>';
        html += '<pre>类型: '+esc(ban.reasonType||'-')+'\n详情: '+esc(ban.reasonDetail||'-')+'\n过期: '+ts(ban.expiresAt)+'</pre></div>';
      }

      // subscription
      if (sub.monitor) {
        html += '<div class="sec-drawer-section"><h4>订阅监控</h4>';
        html += '<pre>每小时: '+esc(String(sub.monitor.hourlyCount||0))+'/'+esc(String(sub.monitor.hourlyLimit||'-'))+'\n无效Token: '+esc(String(sub.monitor.hourlyInvalidTokenCount||0))+'\n唯一IP: '+esc(String(sub.monitor.uniqueIpCount||0))+'\n最后请求: '+ts(sub.monitor.lastRequestAt)+'</pre></div>';
      }

      // audit events
      html += '<h4 style="margin-top:16px">审计事件 ('+events.length+')</h4>';
      if (!events.length) html += '<div class="sec-empty">暂无事件</div>';
      else {
        html += '<div class="sec-timeline" style="max-height:300px">';
        events.forEach(e => {
          html += '<div class="sec-timeline-item"><div class="sec-timeline-dot" style="background:#3b82f6"></div><div class="sec-timeline-body"><div class="sec-timeline-type">'+esc(e.eventType||e.type||'事件')+'</div><div class="sec-timeline-detail">'+esc(JSON.stringify(e).slice(0,200))+'</div><div class="sec-timeline-time">'+ts(e.createdAt||e.time)+'</div></div></div>';
        });
        html += '</div>';
      }
      html += '</div></div>';
      document.body.insertAdjacentHTML('beforeend', html);
      const drawer = $('#sec-drawer');
      if (drawer) {
        drawer.addEventListener('click', function(e){ if (e.target === this) this.remove(); });
        const closeBtn = document.getElementById('sec-drawer-close');
        if (closeBtn) closeBtn.addEventListener('click', () => { const d = document.getElementById('sec-drawer'); if (d) d.remove(); });
        const setTrafficBtn = document.getElementById('sec-drawer-set-traffic');
        if (setTrafficBtn) {
          setTrafficBtn.addEventListener('click', () => {
            const targetUuid = setTrafficBtn.getAttribute('data-user-uuid');
            if (targetUuid) userAction('set-traffic', targetUuid);
          });
        }
      }
    } catch(e) {
      if (e.message !== 'auth_redirect') toast('加载详情失败: '+e.message, 'error');
    }
  }

  // ══════════════════════════════════════════
  //  3. 审计日志
  // ══════════════════════════════════════════
  async function loadAudit() {
    const el = $('#sec-content');
    el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>';
    try {
      const typeFilter = ($('#sec-audit-type')?.value||'');
      const data = await api('/events?limit=80');
      let events = data.events || [];
      if (typeFilter) events = events.filter(e => (e.eventType||e.type||'').toLowerCase().includes(typeFilter.toLowerCase()));

      let html = '<div class="sec-filter">' +
        '<select id="sec-audit-type"><option value="">全部事件类型</option><option value="subscription">订阅请求</option><option value="limit">限流触发</option><option value="ban">封禁操作</option><option value="restore">解禁操作</option><option value="config">配置变更</option><option value="registration">注册相关</option></select>' +
        '<button class="sec-btn sec-btn-primary" onclick="window._secLoadAudit()">🔍 筛选</button>' +
        '</div>';
      html += '<div class="sec-timeline">';
      if (!events.length) html += '<div class="sec-empty">暂无匹配事件</div>';
      events.forEach(e => {
        html += '<div class="sec-timeline-item"><div class="sec-timeline-dot" style="background:#3b82f6"></div><div class="sec-timeline-body"><div class="sec-timeline-type">'+esc(e.eventType||e.type||'事件')+'</div><div class="sec-timeline-detail">'+esc(JSON.stringify(e).slice(0,250))+'</div><div class="sec-timeline-time">'+ts(e.createdAt||e.time)+'</div></div></div>';
      });
      html += '</div>';
      el.innerHTML = html;
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  // ══════════════════════════════════════════
  //  4. 注册管控
  // ══════════════════════════════════════════
  const DURATION_OPTIONS = [
    { label:'5 分钟',  ms: 5*60*1000 },
    { label:'10 分钟', ms: 10*60*1000 },
    { label:'15 分钟', ms: 15*60*1000 },
    { label:'30 分钟', ms: 30*60*1000 },
    { label:'1 小时',  ms: 60*60*1000 },
    { label:'2 小时',  ms: 2*60*60*1000 },
    { label:'6 小时',  ms: 6*60*60*1000 },
    { label:'12 小时', ms: 12*60*60*1000 },
    { label:'24 小时', ms: 24*60*60*1000 },
  ];

  async function loadRegistration() {
    const el = $('#sec-content');
    el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>';
    try {
      const data = await api('/registration');
      const status = data.status || {};
      const config = data.config || {};

      let html = '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px">';
      html += '<span style="font-size:14px;font-weight:600">状态:</span>';
      html += '<span class="sec-badge '+(status.open?'sec-badge-active':'sec-badge-banned')+'">'+(status.open?'已开放':'已关闭')+'</span>';
      html += '<span style="font-size:13px;color:#6b7280">'+esc(status.message||'')+'</span>';
      html += '</div>';

      html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">';
      html += '<button class="sec-btn '+(status.enabled?'sec-btn-danger':'sec-btn-primary')+'" onclick="window._secToggleReg()">'+(status.enabled?'关闭注册':'开启注册')+'</button>';
      html += '<button class="sec-btn" onclick="window._secShowSchedule()">📅 定时设置</button>';
      html += '</div>';

      // schedule form (hidden)
      html += '<div id="sec-sched-form" style="display:none;margin-bottom:16px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px">';
      html += '<h4 style="margin:0 0 12px;color:#1f2937">定时注册窗口</h4>';
      html += '<div class="sec-config-row"><label>开始时间</label><input type="datetime-local" id="sec-sched-start" style="width:auto;flex:1;max-width:240px"></div>';
      html += '<div class="sec-config-row"><label>开放时长</label><select id="sec-sched-dur">';
      DURATION_OPTIONS.forEach(o => {
        html += '<option value="'+o.ms+'">'+o.label+'</option>';
      });
      html += '</select></div>';
      html += '<div style="margin-top:10px;display:flex;gap:8px">';
      html += '<button class="sec-btn sec-btn-primary" onclick="window._secSaveSchedule()">保存</button>';
      html += '<button class="sec-btn sec-btn-danger sec-btn-sm" onclick="window._secClearSchedule()">清除定时</button>';
      html += '<button class="sec-btn sec-btn-sm" onclick="document.getElementById(\'sec-sched-form\').style.display=\'none\'">取消</button>';
      html += '</div></div>';

      // reg logs
      html += '<h4 style="margin:16px 0 8px;color:#1f2937">📜 注册日志 <button class="sec-btn sec-btn-sm" onclick="window._secLoadRegLogs()" style="margin-left:8px">加载</button></h4>';
      html += '<div id="sec-reg-logs"><div class="sec-empty">点击"加载"查看</div></div>';

      el.innerHTML = html;

      // pre-fill schedule
      if (config.startAt) {
        const inp = $('#sec-sched-start'); if (inp) inp.value = new Date(config.startAt).toISOString().slice(0,16);
      }
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  async function toggleReg() {
    try {
      const data = await api('/registration/toggle', { method:'POST', body: JSON.stringify({ enabled: true }) });
      toast(data.message||'操作完成');
      loadRegistration();
    } catch(e) {
      // try the other way
      try {
        const data = await api('/registration/toggle', { method:'POST', body: JSON.stringify({ enabled: false }) });
        toast(data.message||'操作完成');
        loadRegistration();
      } catch(e2) {
        if (e.message !== 'auth_redirect') toast('操作失败: '+e.message, 'error');
      }
    }
  }

  function showSchedule() {
    const el = $('#sec-sched-form');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }

  async function saveSchedule() {
    const startAt = $('#sec-sched-start')?.value ? new Date($('#sec-sched-start').value).getTime() : null;
    if (!startAt) { toast('请选择开始时间', 'error'); return; }
    const durMs = parseInt($('#sec-sched-dur')?.value) || DURATION_OPTIONS[0].ms;
    const endAt = startAt + durMs;
    try {
      const data = await api('/registration/schedule', { method:'POST', body: JSON.stringify({ scheduleEnabled: true, startAt, endAt }) });
      toast(data.message||'定时设置已保存');
      $('#sec-sched-form').style.display = 'none';
      loadRegistration();
    } catch(e) {
      if (e.message !== 'auth_redirect') toast('保存失败: '+e.message, 'error');
    }
  }

  async function clearSchedule() {
    try {
      const data = await api('/registration/schedule', { method:'POST', body: JSON.stringify({ scheduleEnabled: false, startAt: null, endAt: null }) });
      toast(data.message||'定时已清除');
      $('#sec-sched-form').style.display = 'none';
      loadRegistration();
    } catch(e) {
      if (e.message !== 'auth_redirect') toast('清除失败: '+e.message, 'error');
    }
  }

  async function loadRegLogs() {
    const el = $('#sec-reg-logs');
    if (!el) return;
    el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>';
    try {
      const data = await api('/registration/logs?limit=50');
      const logs = data.logs || [];
      if (!logs.length) { el.innerHTML = '<div class="sec-empty">暂无注册日志</div>'; return; }
      let html = '<div class="sec-table-wrap"><table class="sec-table"><tr><th>时间</th><th>结果</th><th>IP</th><th>详情</th></tr>';
      logs.forEach(l => {
        const r = l.结果||l.result||'-';
        const bCls = r==='success'?'active':r==='rejected'?'banned':r==='validation_failed'?'medium':'low';
        html += '<tr><td>'+ts(l.createdAt)+'</td><td><span class="sec-badge sec-badge-'+bCls+'">'+esc(r)+'</span></td><td>'+esc(l.ip||'-')+'</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">'+esc(JSON.stringify(l.详情||l.detail||''))+'</td></tr>';
      });
      html += '</table></div>';
      if (data.summary) {
        const s = data.summary;
        html += '<div style="margin-top:8px;font-size:12px;color:#64748b">总计:'+s.total+' · 成功:'+s.success+' · 拒绝:'+s.rejected+' · 校验失败:'+s.validation_failed+' · 重复:'+s.duplicate+'</div>';
      }
      el.innerHTML = html;
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  // ══════════════════════════════════════════
  //  5. 策略配置
  // ══════════════════════════════════════════
  async function loadConfig() {
    const el = $('#sec-content');
    el.innerHTML = '<div class="sec-loading"><span class="sec-spinner"></span>加载中...</div>';
    try {
      const cfg = await api('/config.json');

      function input(label, idSuffix, val, min, max, step) {
        return '<div class="sec-config-row"><label>'+label+'</label><input type="number" id="cfg-'+idSuffix+'" value="'+(val||0)+'" min="'+min+'" max="'+max+'" step="'+(step||1)+'"></div>';
      }

      let html = '<div class="sec-config-grid">';

      // thresholds - uuid
      html += '<div class="sec-config-group"><h4>UUID 速率阈值</h4>';
      const ut = cfg.thresholds?.uuid || {};
      html += input('每秒','uts', ut.second, 10, 10000);
      html += input('每分钟','utm', ut.minute, 100, 100000);
      html += input('每小时','uth', ut.hour, 1000, 500000);
      html += '</div>';

      // thresholds - ip
      html += '<div class="sec-config-group"><h4>IP 速率阈值</h4>';
      const it = cfg.thresholds?.ip || {};
      html += input('每秒','its', it.second, 5, 10000);
      html += input('每分钟','itm', it.minute, 50, 100000);
      html += input('每小时','ith', it.hour, 500, 500000);
      html += '</div>';

      // thresholds - endpoint
      html += '<div class="sec-config-group"><h4>端点 UUID 阈值</h4>';
      const eu = cfg.thresholds?.endpoint?.uuid || {};
      html += input('每秒','eus', eu.second, 5, 10000);
      html += input('每分钟','eum', eu.minute, 50, 100000);
      html += input('每小时','euh', eu.hour, 500, 500000);
      html += '</div>';

      html += '<div class="sec-config-group"><h4>端点 IP 阈值</h4>';
      const ei = cfg.thresholds?.endpoint?.ip || {};
      html += input('每秒','eis', ei.second, 3, 10000);
      html += input('每分钟','eim', ei.minute, 30, 100000);
      html += input('每小时','eih', ei.hour, 300, 500000);
      html += '</div>';

      // ban
      html += '<div class="sec-config-group"><h4>封禁策略</h4>';
      const ban = cfg.ban || {};
      html += input('基础秒数','banb', ban.baseSeconds, 60, 86400);
      html += input('倍率','banm', ban.multiplier, 1, 10, 0.5);
      html += input('最大秒数','banmax', ban.maxSeconds, 3600, 604800);
      html += input('回溯秒数','banlb', ban.lookbackSeconds, 3600, 2592000);
      html += '</div>';

      // subscription
      html += '<div class="sec-config-group"><h4>订阅限流</h4>';
      const sub = cfg.subscription || {};
      html += input('每小时限制','subhl', sub.hourlyLimit, 1, 100);
      html += input('无效Token每小时','subihl', sub.invalidTokenHourlyLimit, 1, 50);
      html += input('唯一IP告警数','subuia', sub.uniqueIpAlertLimit, 1, 50);
      html += '</div>';

      // register
      html += '<div class="sec-config-group"><h4>注册设置</h4>';
      const reg = cfg.register || {};
      html += '<div class="sec-config-row"><label>启用</label><select id="cfg-regenabled"><option value="1"'+(reg.enabled?' selected':'')+'>是</option><option value="0"'+(reg.enabled?'':' selected')+'>否</option></select></div>';
      html += '<div class="sec-config-row"><label>使用须知弹窗</label><select id="cfg-regrules"><option value="always"'+(reg.rulesFrequency!=='once'?' selected':'')+'>每次都弹窗</option><option value="once"'+(reg.rulesFrequency==='once'?' selected':'')+'>仅首次弹窗</option></select></div>';
      html += '</div>';

      // TG notification (fetched separately)
      let tgCfg = { botToken:'', chatId:'', panelId:'A', securityNotifyEnabled:false };
      try {
        tgCfg = await api('/tg-config');
      } catch(e) { /* use defaults */ }
      window._secTgCfg = tgCfg;

      html += '<div class="sec-config-group"><h4>TG 通知</h4>';
      html += '<div class="sec-config-row"><label>面板选择</label><select id="cfg-tgpanel"><option value="A"'+(tgCfg.panelId==='B'?'':' selected')+'>面板 A</option><option value="B"'+(tgCfg.panelId==='B'?' selected':'')+'>面板 B</option></select></div>';
      html += '<div class="sec-config-row"><label>安全事件通知</label><select id="cfg-tgsecurity"><option value="1"'+(tgCfg.securityNotifyEnabled?' selected':'')+'>开启</option><option value="0"'+(tgCfg.securityNotifyEnabled?'':' selected')+'>关闭</option></select></div>';
      html += '</div>';

      // adminApi
      html += '<div class="sec-config-group"><h4>管理API</h4>';
      html += input('列表限制','apill', cfg.adminApi?.listLimit, 10, 200);
      html += '</div>';

      html += '</div>';

      html += '<div style="margin-top:20px;display:flex;gap:8px">';
      html += '<button class="sec-btn sec-btn-primary" onclick="window._secSaveConfig()">💾 保存配置</button>';
      html += '<button class="sec-btn" onclick="window._secResetConfig()">🔄 重置推荐值</button>';
      html += '</div>';

      el.innerHTML = html;
      window._secCfgData = cfg;
    } catch(e) {
      if (e.message !== 'auth_redirect') el.innerHTML = '<div class="sec-empty">加载失败: '+esc(e.message)+'</div>';
    }
  }

  async function saveConfig() {
    const cfg = JSON.parse(JSON.stringify(window._secCfgData || {}));

    function v(id, fallback) { const el = $('#'+id); return el ? Number(el.value) : fallback; }

    // read all values back
    cfg.thresholds = cfg.thresholds || {};
    cfg.thresholds.uuid = cfg.thresholds.uuid || {};
    cfg.thresholds.uuid.second = v('cfg-uts', cfg.thresholds.uuid.second);
    cfg.thresholds.uuid.minute = v('cfg-utm', cfg.thresholds.uuid.minute);
    cfg.thresholds.uuid.hour = v('cfg-uth', cfg.thresholds.uuid.hour);

    cfg.thresholds.ip = cfg.thresholds.ip || {};
    cfg.thresholds.ip.second = v('cfg-its', cfg.thresholds.ip.second);
    cfg.thresholds.ip.minute = v('cfg-itm', cfg.thresholds.ip.minute);
    cfg.thresholds.ip.hour = v('cfg-ith', cfg.thresholds.ip.hour);

    cfg.thresholds.endpoint = cfg.thresholds.endpoint || {};
    cfg.thresholds.endpoint.uuid = cfg.thresholds.endpoint.uuid || {};
    cfg.thresholds.endpoint.uuid.second = v('cfg-eus', cfg.thresholds.endpoint.uuid.second);
    cfg.thresholds.endpoint.uuid.minute = v('cfg-eum', cfg.thresholds.endpoint.uuid.minute);
    cfg.thresholds.endpoint.uuid.hour = v('cfg-euh', cfg.thresholds.endpoint.uuid.hour);

    cfg.thresholds.endpoint.ip = cfg.thresholds.endpoint.ip || {};
    cfg.thresholds.endpoint.ip.second = v('cfg-eis', cfg.thresholds.endpoint.ip.second);
    cfg.thresholds.endpoint.ip.minute = v('cfg-eim', cfg.thresholds.endpoint.ip.minute);
    cfg.thresholds.endpoint.ip.hour = v('cfg-eih', cfg.thresholds.endpoint.ip.hour);

    cfg.ban = cfg.ban || {};
    cfg.ban.baseSeconds = v('cfg-banb', cfg.ban.baseSeconds);
    cfg.ban.multiplier = v('cfg-banm', cfg.ban.multiplier);
    cfg.ban.maxSeconds = v('cfg-banmax', cfg.ban.maxSeconds);
    cfg.ban.lookbackSeconds = v('cfg-banlb', cfg.ban.lookbackSeconds);

    cfg.subscription = cfg.subscription || {};
    cfg.subscription.hourlyLimit = v('cfg-subhl', cfg.subscription.hourlyLimit);
    cfg.subscription.invalidTokenHourlyLimit = v('cfg-subihl', cfg.subscription.invalidTokenHourlyLimit);
    cfg.subscription.uniqueIpAlertLimit = v('cfg-subuia', cfg.subscription.uniqueIpAlertLimit);

    cfg.register = cfg.register || {};
    cfg.register.enabled = ($('#cfg-regenabled')?.value === '1');
    cfg.register.rulesFrequency = $('#cfg-regrules')?.value || 'always';

    cfg.adminApi = cfg.adminApi || {};
    cfg.adminApi.listLimit = v('cfg-apill', cfg.adminApi.listLimit);

    try {
      await api('/config.json', { method:'POST', body: JSON.stringify(cfg) });
      window._secCfgData = cfg;

      // also save TG settings
      const tgCfg = window._secTgCfg || {};
      const tgPanel = $('#cfg-tgpanel')?.value || 'A';
      const tgSecurity = ($('#cfg-tgsecurity')?.value === '1');
      await api('/tg-config', {
        method: 'POST',
        body: JSON.stringify({
          BotToken: tgCfg.botToken || '',
          ChatID: tgCfg.chatId || '',
          PanelID: tgPanel,
          securityNotifyEnabled: tgSecurity,
        }),
      });

      toast('配置已保存');
    } catch(e) {
      if (e.message !== 'auth_redirect') toast('保存失败: '+e.message, 'error');
    }
  }

  function resetConfig() {
    if (!confirm('确认重置为推荐值？当前修改将丢失。')) return;

    // recommended defaults from the backend
    const defaults = {
      thresholds: {
        uuid: { second: 240, minute: 6000, hour: 50000 },
        ip: { second: 120, minute: 3000, hour: 30000 },
        endpoint: {
          uuid: { second: 120, minute: 3000, hour: 20000 },
          ip: { second: 60, minute: 1500, hour: 12000 },
        },
      },
      ban: { baseSeconds: 900, multiplier: 2, maxSeconds: 86400, lookbackSeconds: 604800 },
      subscription: { enabled: true, hourlyLimit: 6, invalidTokenHourlyLimit: 4, uniqueIpAlertLimit: 6 },
      register: { enabled: false, scheduleEnabled: false, startAt: null, endAt: null },
      adminApi: { listLimit: 50 },
    };

    // set all inputs
    function setVal(id, val) { const el = $('#'+id); if (el) el.value = val; }
    setVal('cfg-uts', 240); setVal('cfg-utm', 6000); setVal('cfg-uth', 50000);
    setVal('cfg-its', 120); setVal('cfg-itm', 3000); setVal('cfg-ith', 30000);
    setVal('cfg-eus', 120); setVal('cfg-eum', 3000); setVal('cfg-euh', 20000);
    setVal('cfg-eis', 60); setVal('cfg-eim', 1500); setVal('cfg-eih', 12000);
    setVal('cfg-banb', 900); setVal('cfg-banm', 2); setVal('cfg-banmax', 86400); setVal('cfg-banlb', 604800);
    setVal('cfg-subhl', 6); setVal('cfg-subihl', 4); setVal('cfg-subuia', 6);
    setVal('cfg-apill', 50);
    const regSel = $('#cfg-regenabled'); if (regSel) regSel.value = '0';
    const rulesSel = $('#cfg-regrules'); if (rulesSel) rulesSel.value = 'always';
    window._secCfgData = defaults;
    toast('已重置为推荐值，点击"保存配置"生效');
  }

  // ══════════════════════════════════════════
  //  Tab routing
  // ══════════════════════════════════════════
  function switchTab(name) {
    const tabs = $$('#sec-tabs .sec-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.p === name));
    const fn = {
      overview: loadOverview,
      users: () => loadUsers(),
      audit: loadAudit,
      registration: loadRegistration,
      config: loadConfig,
    }[name];
    if (fn) fn();
  }

  // ══════════════════════════════════════════
  //  Global function exports (for onclick)
  // ══════════════════════════════════════════
  const EXPORTS = {
    _secLoadOverview: loadOverview,
    _secLoadUsers: () => loadUsers(),
    _secLoadMore: () => loadUsers(usersState.cursor),
    _secBatchBan: () => batchAction('ban'),
    _secBatchRestore: () => batchAction('restore'),
    _secBatchReset: () => batchAction('reset-subscription'),
    _secBatchDelete: () => batchAction('delete'),
    _secUserAction: userAction,
    _secUserDetail: userDetail,
    _secLoadAudit: loadAudit,
    _secLoadReg: loadRegistration,
    _secToggleReg: toggleReg,
    _secShowSchedule: showSchedule,
    _secSaveSchedule: saveSchedule,
    _secClearSchedule: clearSchedule,
    _secLoadRegLogs: loadRegLogs,
    _secLoadConfig: loadConfig,
    _secSaveConfig: saveConfig,
    _secResetConfig: resetConfig,
  };
  Object.assign(window, EXPORTS);

  // ══════════════════════════════════════════
  //  Inject into /admin page
  // ══════════════════════════════════════════
  onReady(function() {
    setTimeout(function() {
      // inject style
      document.head.insertAdjacentHTML('beforeend', CSS);

      // inject module HTML before social-links
      const socialLinks = document.querySelector('.social-links');
      if (socialLinks) {
        socialLinks.insertAdjacentHTML('beforebegin', HTML);
      } else {
        // fallback: append to card-container
        const card = document.querySelector('.card-container');
        if (card) card.insertAdjacentHTML('beforeend', HTML);
      }

      // attach tab click handlers
      setTimeout(() => {
        const tabs = $$('#sec-tabs .sec-tab');
        tabs.forEach(tab => {
          tab.addEventListener('click', () => switchTab(tab.dataset.p));
        });

        // batch buttons
        const bb = $('#sec-batch-ban');
        const br = $('#sec-batch-restore');
        const bz = $('#sec-batch-reset');
        const bd = $('#sec-batch-delete');
        if (bb) bb.addEventListener('click', () => batchAction('ban'));
        if (br) br.addEventListener('click', () => batchAction('restore'));
        if (bz) bz.addEventListener('click', () => batchAction('reset-subscription'));
        if (bd) bd.addEventListener('click', () => batchAction('delete'));
      }, 100);

    }, 600);
  });

})();
