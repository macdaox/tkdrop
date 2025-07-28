# 部署指南

## GitHub Pages 部署

### 问题诊断
如果GitHub Pages部署后网页不展示，可能的原因：

1. **路径问题**：GitHub Pages使用子路径 `/tkdrop/`，需要正确配置base路径
2. **SPA路由问题**：React Router需要特殊处理
3. **构建配置问题**：确保正确的构建输出

### 解决方案

1. **自动部署**：已配置GitHub Actions自动部署workflow
2. **路径配置**：vite.config.js已配置正确的base路径
3. **启用GitHub Pages**：
   - 进入仓库Settings > Pages
   - Source选择"GitHub Actions"
   - 推送代码后自动部署

## Cloudflare Pages 部署

### 优势
- 与Cloudflare Workers完美集成
- 免费且性能优秀
- 全球CDN加速
- 简单的环境变量配置

### 部署步骤
1. 连接GitHub仓库到Cloudflare Pages
2. 构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 环境变量：不设置`DEPLOY_TARGET`（默认为根路径）
3. 一键部署

### 解决空白页问题
如果Cloudflare Pages部署后显示空白页：
1. 确保没有设置`DEPLOY_TARGET=github`环境变量
2. Cloudflare Pages使用根路径`/`，不需要子路径
3. 检查构建日志确保构建成功

## Vercel 部署

### 优势
- 更好的SPA支持
- 自动HTTPS
- 更快的全球CDN
- 更简单的环境变量配置

### 部署步骤
1. 连接GitHub仓库到Vercel
2. 自动检测Vite项目
3. 一键部署

### 配置文件
- `vercel.json`：已配置SPA重写规则和CORS头

## 数据库连接

### Cloudflare Workers
当前项目使用Cloudflare Workers作为后端API：

**GitHub Pages + Cloudflare Workers**：
- ✅ 完全兼容
- 前端：GitHub Pages托管
- 后端：Cloudflare Workers
- 数据库：Cloudflare D1

**Vercel + Cloudflare Workers**：
- ✅ 完全兼容
- 前端：Vercel托管
- 后端：Cloudflare Workers
- 数据库：Cloudflare D1

### 环境变量配置

**GitHub Pages**：
- 在仓库Settings > Secrets添加环境变量
- 在GitHub Actions中使用
- 设置`DEPLOY_TARGET=github`以使用正确的base路径

**Cloudflare Pages**：
- 在Cloudflare Dashboard > Pages > Project Settings > Environment Variables
- 添加CLOUDFLARE_API_TOKEN等变量
- **重要**：不要设置`DEPLOY_TARGET`变量（保持默认根路径）

**Vercel**：
- 在Vercel Dashboard > Project Settings > Environment Variables
- 添加CLOUDFLARE_API_TOKEN等变量
- 不需要设置`DEPLOY_TARGET`（默认根路径）

## 推荐部署方案

### 方案1：Cloudflare Pages（强烈推荐）
- 与Cloudflare Workers完美集成
- 免费且性能优秀
- 全球CDN加速
- 简单的配置和部署
- 与后端API在同一平台

### 方案2：Vercel
- 更稳定的SPA支持
- 更好的开发体验
- 自动预览部署
- 简单的环境变量管理

### 方案3：GitHub Pages
- 免费且与代码仓库集成
- 适合开源项目
- 需要额外配置SPA路由

## 故障排除

### GitHub Pages常见问题
1. **404错误**：检查base路径配置
2. **白屏**：检查控制台错误，通常是路径问题
3. **路由不工作**：确保GitHub Actions正确部署

### Vercel常见问题
1. **API调用失败**：检查CORS配置
2. **环境变量**：确保在Vercel中正确设置

## 数据库迁移

如果需要从Cloudflare D1迁移到其他数据库：

### Vercel + PostgreSQL
```javascript
// 可以使用Vercel的PostgreSQL集成
// 或者Supabase、PlanetScale等
```

### Vercel + MongoDB
```javascript
// 可以使用MongoDB Atlas
// 或者Vercel的MongoDB集成
```

当前的Cloudflare Workers架构已经很好地解耦了前端和后端，可以轻松切换前端部署平台而不影响后端服务。