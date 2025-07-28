# Cloudflare R2 存储设置指南

本项目已经集成了 Cloudflare R2 存储功能，用于替代 localStorage 实现跨设备的数据同步和持久化存储。

## 🚀 快速开始

### 1. 创建 Cloudflare 账户

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 注册或登录你的账户
3. 确保账户已验证

### 2. 创建 R2 存储桶

1. 在 Cloudflare Dashboard 中，点击左侧菜单的 "R2 Object Storage"
2. 点击 "Create bucket" 创建新的存储桶
3. 输入存储桶名称（建议使用 `token-user-data`）
4. 选择合适的地区
5. 点击 "Create bucket" 完成创建

### 3. 部署 Cloudflare Worker

#### 方法一：使用 Wrangler CLI（推荐）

1. 安装 Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler auth login
```

3. 在项目根目录创建 `wrangler.toml` 文件：
```toml
name = "token-api-worker"
main = "cloudflare-worker.js"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "token-user-data"

[vars]
CORS_ORIGIN = "*"
```

4. 部署 Worker：
```bash
wrangler deploy
```

#### 方法二：使用 Cloudflare Dashboard

1. 在 Cloudflare Dashboard 中，点击 "Workers & Pages"
2. 点击 "Create application" → "Create Worker"
3. 输入 Worker 名称（如 `token-api-worker`）
4. 点击 "Deploy" 创建基础 Worker
5. 点击 "Edit code" 编辑代码
6. 将 `cloudflare-worker.js` 文件的内容复制粘贴到编辑器中
7. 点击 "Save and deploy"

### 4. 配置 R2 存储桶绑定

1. 在 Worker 详情页面，点击 "Settings" → "Variables"
2. 在 "R2 bucket bindings" 部分，点击 "Add binding"
3. 设置：
   - Variable name: `R2_BUCKET`
   - R2 bucket: 选择你创建的存储桶
4. 点击 "Save and deploy"

### 5. 更新前端配置

1. 打开 `src/config/cloudflare.js` 文件
2. 将 `WORKER_URL` 替换为你的 Worker URL：
```javascript
export const CLOUDFLARE_CONFIG = {
  WORKER_URL: 'https://token-api-worker.your-subdomain.workers.dev',
  // ... 其他配置
};
```

### 6. 测试部署

1. 启动本地开发服务器：
```bash
npm run dev
```

2. 连接钱包测试功能
3. 检查浏览器控制台是否有错误
4. 测试推荐码和任务完成功能

## 📊 功能特性

### ✅ 已实现的功能

- **用户数据存储**：钱包地址、代币余额、推荐码等
- **推荐系统**：推荐码验证、奖励发放、防重复推荐
- **任务系统**：任务完成状态跟踪、代币奖励
- **跨设备同步**：数据存储在云端，任何设备都可访问
- **本地存储回退**：当 Cloudflare API 不可用时自动使用 localStorage

### 🎯 代币奖励机制

- **新用户注册**：2000 $VRC
- **推荐奖励**：200 $VRC（推荐人获得）
- **Twitter 关注**：50 $VRC
- **Discord 加入**：100 $VRC
- **Telegram 加入**：75 $VRC
- **项目分享**：25 $VRC

## 🔧 高级配置

### 环境变量设置

在 Cloudflare Worker 中可以设置以下环境变量：

- `CORS_ORIGIN`：允许的跨域来源（生产环境建议设置为具体域名）
- `LOG_LEVEL`：日志级别（debug/info/warn/error）

### 自定义域名（可选）

1. 在 Worker 详情页面，点击 "Triggers" → "Custom Domains"
2. 点击 "Add Custom Domain"
3. 输入你的自定义域名
4. 按照提示完成 DNS 配置
5. 更新前端配置中的 `WORKER_URL`

## 💰 成本分析

### Cloudflare R2 免费额度

- **存储空间**：10 GB/月
- **Class A 操作**：100万次/月（PUT, COPY, POST, LIST）
- **Class B 操作**：1000万次/月（GET, HEAD）
- **出站流量**：10 GB/月

### 预估使用量

- **每个用户数据**：约 1KB
- **10GB 可存储用户数**：约 1000万用户
- **日常操作**：每用户每天约 10-20 次 API 调用

对于大多数项目来说，免费额度完全够用。

## 🛠️ 故障排除

### 常见问题

1. **Worker 部署失败**
   - 检查 `wrangler.toml` 配置是否正确
   - 确保已登录 Cloudflare 账户
   - 检查存储桶名称是否正确

2. **API 请求失败**
   - 检查 Worker URL 是否正确
   - 查看浏览器控制台的错误信息
   - 检查 CORS 设置

3. **数据不同步**
   - 确认 R2 存储桶绑定是否正确
   - 检查 Worker 日志（在 Dashboard 中查看）
   - 验证网络连接

### 调试模式

在开发环境中，系统会自动回退到 localStorage，你可以：

1. 打开浏览器开发者工具
2. 查看 Console 标签页的日志信息
3. 检查 Network 标签页的 API 请求

## 🔒 安全考虑

1. **CORS 设置**：生产环境中应设置具体的域名而不是 `*`
2. **数据验证**：Worker 中已包含基本的数据验证
3. **防重复推荐**：系统会自动防止重复推荐和自我推荐
4. **错误处理**：包含完整的错误处理和回退机制

## 📈 监控和分析

### Cloudflare Analytics

1. 在 Worker 详情页面查看请求统计
2. 监控错误率和响应时间
3. 查看 R2 存储使用情况

### 自定义监控

可以在 Worker 中添加自定义日志和指标收集。

## 🚀 生产环境部署

1. **域名配置**：使用自定义域名
2. **环境变量**：设置生产环境的 CORS_ORIGIN
3. **监控设置**：配置告警和监控
4. **备份策略**：定期备份 R2 数据

---

如果你在设置过程中遇到任何问题，请查看 Cloudflare 官方文档或提交 Issue。