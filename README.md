# Beacon Pages — 静态前端页面

Beacon CM 的 Pages 前端，托管注册/登录页、管理后台、用户仪表盘。

---

## 📁 目录结构

```
├── index.html                 # 首页 — 注册/登录 SPA（使用须知弹窗）
├── register/index.html        # 同上副本（/register 路径）
├── login/index.html           # 管理员登录页
├── user/index.html            # 用户仪表盘（网络信息 + 流量用量 + 订阅链接）
├── admin/
│   ├── index.html             # 管理后台主页面
│   └── security/
│       ├── index.html         # 安全管理独立 SPA
│       └── integration.js     # 管理后台注入脚本（安全模块卡片）
├── noADMIN/index.html         # 未设置管理员密码提示
├── noKV/index.html            # 未绑定 KV 提示
└── cdn-cgi/trace              # CF 网络诊断
```

---

## 🚀 部署

1. Fork 本仓库
2. Cloudflare Pages → 连接 Git → 部署
3. 无需构建命令，直接部署静态文件
4. 在 `beacon-cm` Worker 中设置 `Pages静态页面` 指向本仓库域名

---

## 🔗 与 Worker 的协作

所有页面通过 Worker 代理访问，Worker 负责：

- Cookie 认证校验
- API 请求转发（`/admin/system/*`、`/register/*`）
- 注入安全模块卡片（`integration.js`）

静态文件本身不包含敏感逻辑，认证由 Worker 层统一处理。
