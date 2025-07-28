// Cloudflare 配置文件
// 请根据你的实际部署情况修改以下配置

export const CLOUDFLARE_CONFIG = {
  // Cloudflare Worker URL - 请替换为你的实际 Worker URL
  WORKER_URL: 'token-api-worker.wubs2005.workers.dev',
  
  // R2 存储桶名称
  BUCKET_NAME: 'token',
  
  // API 端点
  ENDPOINTS: {
    USER: '/api/user',
    REFERRAL: '/api/referral',
    USERS: '/api/users',
    HEALTH: '/api/health'
  },
  
  // 请求配置
  REQUEST_CONFIG: {
    timeout: 10000, // 10秒超时
    retries: 3, // 重试次数
  }
};

// 开发环境配置
export const DEV_CONFIG = {
  // 在开发环境中，如果 Cloudflare Worker 不可用，
  // 系统会自动回退到 localStorage
  USE_LOCAL_STORAGE_FALLBACK: true,
  
  // 开发环境日志级别
  LOG_LEVEL: 'debug'
};

// 生产环境配置
export const PROD_CONFIG = {
  USE_LOCAL_STORAGE_FALLBACK: false,
  LOG_LEVEL: 'error'
};

// 根据环境选择配置
export const ENV_CONFIG = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

export default {
  CLOUDFLARE_CONFIG,
  ENV_CONFIG
};