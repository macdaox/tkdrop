// Cloudflare Worker 代码
// 部署到 Cloudflare Workers 来处理 R2 存储操作

// 环境变量配置（在 Cloudflare Workers 中设置）
// R2_BUCKET: R2 存储桶绑定名称
// CORS_ORIGIN: 允许的跨域来源

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 在生产环境中应该设置为具体域名
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// 处理 CORS 预检请求
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  return null;
}

// 生成用户数据文件路径
function getUserPath(walletAddress) {
  return `users/${walletAddress.toLowerCase()}.json`;
}

// 获取用户数据（带自动迁移）
async function getUserData(env, walletAddress) {
  try {
    const userPath = getUserPath(walletAddress);
    const object = await env.R2_BUCKET.get(userPath);
    
    if (object === null) {
      return null; // 用户不存在
    }
    
    const userData = await object.json();
    
    // 自动数据迁移
    const { data: migratedData, migrated } = migrateUserData(userData);
    
    // 如果数据被迁移，自动保存更新后的数据
    if (migrated) {
      await saveUserData(env, walletAddress, migratedData);
      console.log(`自动保存迁移后的数据: ${walletAddress}`);
    }
    
    return migratedData;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
}

// 保存用户数据
async function saveUserData(env, walletAddress, userData) {
  try {
    const userPath = getUserPath(walletAddress);
    userData.lastUpdated = new Date().toISOString();
    
    await env.R2_BUCKET.put(userPath, JSON.stringify(userData), {
      httpMetadata: {
        contentType: 'application/json',
      },
      customMetadata: {
        walletAddress: walletAddress.toLowerCase(),
        lastUpdated: userData.lastUpdated,
      },
    });
    
    return userData;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    throw error;
  }
}

// 数据结构版本管理
const DATA_SCHEMA_VERSION = '1.1.0';

// 默认数据结构模板
function getDefaultUserDataSchema() {
  return {
    walletAddress: '',
    tokenBalance: 2000,
    referralCode: '',
    referralCount: 0,
    referrals: [],
    tasks: {
      twitter: false,
      discord: false,
      telegram: false,
      share: false,
      retweet: false,
      like: false,
      reply: false
    },
    schemaVersion: DATA_SCHEMA_VERSION,
    createdAt: '',
    lastUpdated: ''
  };
}

// 创建新用户数据
function createUserData(walletAddress) {
  const defaultSchema = getDefaultUserDataSchema();
  return {
    ...defaultSchema,
    walletAddress: walletAddress.toLowerCase(),
    referralCode: walletAddress.slice(-8).toLowerCase(),
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

// 数据迁移和字段自动添加函数
function migrateUserData(userData) {
  const defaultSchema = getDefaultUserDataSchema();
  let migrated = false;
  
  // 深度合并函数
  function deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else if (!(key in target)) {
        result[key] = source[key];
        migrated = true;
      }
    }
    
    return result;
  }
  
  // 合并默认结构和现有数据
  const migratedData = deepMerge(userData, defaultSchema);
  
  // 更新版本号和时间戳
  if (!userData.schemaVersion || userData.schemaVersion !== DATA_SCHEMA_VERSION) {
    migratedData.schemaVersion = DATA_SCHEMA_VERSION;
    migrated = true;
  }
  
  if (migrated) {
    migratedData.lastUpdated = new Date().toISOString();
    console.log(`数据迁移完成: ${userData.walletAddress}, 版本: ${userData.schemaVersion || '未知'} -> ${DATA_SCHEMA_VERSION}`);
  }
  
  return { data: migratedData, migrated };
}

// 查找推荐人
async function findReferrer(env, referrerCode) {
  try {
    // 列出所有用户文件
    const objects = await env.R2_BUCKET.list({ prefix: 'users/' });
    
    for (const object of objects.objects) {
      try {
        const userData = await env.R2_BUCKET.get(object.key);
        if (userData) {
          const user = await userData.json();
          if (user.referralCode === referrerCode.toLowerCase()) {
            return user;
          }
        }
      } catch (error) {
        console.error(`读取用户文件 ${object.key} 失败:`, error);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('查找推荐人失败:', error);
    throw error;
  }
}

// 处理推荐奖励
async function processReferral(env, referrerCode, newUserAddress, rewardAmount = 200) {
  try {
    // 查找推荐人
    const referrer = await findReferrer(env, referrerCode);
    
    if (!referrer) {
      return {
        success: false,
        message: '推荐码无效'
      };
    }
    
    // 防止自我推荐
    if (referrer.walletAddress === newUserAddress.toLowerCase()) {
      return {
        success: false,
        message: '不能推荐自己'
      };
    }
    
    // 检查是否已经被推荐过
    if (referrer.referrals && referrer.referrals.includes(newUserAddress.toLowerCase())) {
      return {
        success: false,
        message: '已经被推荐过'
      };
    }
    
    // 获取或创建被推荐人数据
    let newUser = await getUserData(env, newUserAddress);
    if (!newUser) {
      newUser = createUserData(newUserAddress);
    }
    
    // 给被推荐人增加奖励
    newUser.tokenBalance += rewardAmount;
    
    // 更新推荐人数据
    referrer.tokenBalance += rewardAmount;
    referrer.referralCount += 1;
    
    if (!referrer.referrals) {
      referrer.referrals = [];
    }
    
    referrer.referrals.push(newUserAddress.toLowerCase());
    
    // 保存更新后的推荐人数据
    await saveUserData(env, referrer.walletAddress, referrer);
    
    // 保存更新后的被推荐人数据
    await saveUserData(env, newUserAddress, newUser);
    
    return {
      success: true,
      referrerData: referrer,
      newUserData: newUser,
      message: '推荐奖励发放成功'
    };
  } catch (error) {
    console.error('处理推荐奖励失败:', error);
    return {
      success: false,
      message: '处理推荐奖励失败'
    };
  }
}

// 主要的请求处理函数
export default {
  async fetch(request, env, ctx) {
    // 处理 CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // 路由处理
      if (path.startsWith('/api/user/')) {
        const walletAddress = path.split('/api/user/')[1];
        
        if (method === 'GET') {
          // 获取用户数据
          const userData = await getUserData(env, walletAddress);
          
          if (userData === null) {
            return new Response(JSON.stringify({ error: '用户不存在' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          return new Response(JSON.stringify(userData), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (method === 'PUT') {
          // 保存/更新用户数据
          const userData = await request.json();
          const savedData = await saveUserData(env, walletAddress, userData);
          
          return new Response(JSON.stringify(savedData), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      
      if (path === '/api/referral' && method === 'POST') {
        // 处理推荐奖励
        const { referrerCode, newUserAddress, rewardAmount } = await request.json();
        const result = await processReferral(env, referrerCode, newUserAddress, rewardAmount);
        
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (path === '/api/migrate' && method === 'POST') {
        // 手动触发数据迁移
        const { walletAddress } = await request.json();
        
        if (!walletAddress) {
          return new Response(JSON.stringify({ error: '缺少钱包地址' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const userData = await getUserData(env, walletAddress);
        
        if (userData === null) {
          return new Response(JSON.stringify({ error: '用户不存在' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: '数据迁移检查完成',
          currentVersion: userData.schemaVersion,
          latestVersion: DATA_SCHEMA_VERSION
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (path === '/api/schema' && method === 'GET') {
        // 获取当前数据结构版本信息
        return new Response(JSON.stringify({
          currentVersion: DATA_SCHEMA_VERSION,
          schema: getDefaultUserDataSchema(),
          description: '当前数据结构模板和版本信息'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (path === '/api/users' && method === 'GET') {
        // 获取所有用户数据（管理用途）
        const objects = await env.R2_BUCKET.list({ prefix: 'users/' });
        const users = {};
        
        for (const object of objects.objects) {
          try {
            const userData = await env.R2_BUCKET.get(object.key);
            if (userData) {
              const user = await userData.json();
              users[user.walletAddress] = user;
            }
          } catch (error) {
            console.error(`读取用户文件 ${object.key} 失败:`, error);
          }
        }
        
        return new Response(JSON.stringify(users), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (path === '/api/health' && method === 'GET') {
        // 健康检查
        return new Response(JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // 404 处理
      return new Response(JSON.stringify({ error: '接口不存在' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error('请求处理失败:', error);
      return new Response(JSON.stringify({ 
        error: '服务器内部错误',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

// Cloudflare Workers 部署说明：
// 1. 在 Cloudflare Dashboard 中创建新的 Worker
// 2. 将此代码复制到 Worker 编辑器中
// 3. 在 Worker 设置中绑定 R2 存储桶：
//    - 变量名: R2_BUCKET
//    - R2 存储桶: 你创建的存储桶名称
// 4. 设置环境变量（可选）：
//    - CORS_ORIGIN: 你的前端域名
// 5. 部署 Worker
// 6. 更新前端代码中的 WORKER_URL 为你的 Worker URL