// Cloudflare R2 存储 API 工具
import { CLOUDFLARE_CONFIG, ENV_CONFIG } from '../config/cloudflare';

// 使用配置文件中的设置
const CF_CONFIG = CLOUDFLARE_CONFIG;

// 数据结构版本（与后端保持一致）
const DATA_SCHEMA_VERSION = '1.1.0';

// 用户数据结构
const createUserData = (walletAddress) => ({
  walletAddress,
  tokenBalance: 2000, // 初始赠送2000代币
  referralCode: walletAddress.slice(-8),
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
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
});

// 导出版本信息供其他组件使用
export const getClientSchemaVersion = () => DATA_SCHEMA_VERSION;

// 获取用户数据
export const getUserData = async (walletAddress) => {
  try {
    // 首先尝试从 Cloudflare R2 获取数据
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/user/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else if (response.status === 404) {
      // 用户不存在，创建新用户
      const newUserData = createUserData(walletAddress);
      await saveUserData(walletAddress, newUserData);
      return newUserData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Cloudflare API 不可用，回退到本地存储:', error);
    // 回退到本地存储
    return getUserDataFromLocalStorage(walletAddress);
  }
};

// 保存用户数据到 Cloudflare R2
export const saveUserData = async (walletAddress, userData) => {
  try {
    userData.lastUpdated = new Date().toISOString();
    
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/user/${walletAddress}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 同时保存到本地存储作为备份
    saveUserDataToLocalStorage(walletAddress, userData);
    
    return await response.json();
  } catch (error) {
    console.warn('Cloudflare API 保存失败，使用本地存储:', error);
    // 回退到本地存储
    return saveUserDataToLocalStorage(walletAddress, userData);
  }
};

// 处理推荐奖励
export const processReferralReward = async (referrerCode, newUserAddress) => {
  try {
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/referral`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referrerCode,
        newUserAddress,
        rewardAmount: 200
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Cloudflare API 推荐处理失败，使用本地存储:', error);
    // 回退到本地存储逻辑
    return processReferralLocalStorage(referrerCode, newUserAddress);
  }
};

// 本地存储回退函数
const getUserDataFromLocalStorage = (walletAddress) => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (storedUsers[walletAddress]) {
    // 确保已存在用户也有完整的数据结构
    const userData = {
      ...createUserData(walletAddress),
      ...storedUsers[walletAddress],
      walletAddress,
    };
    
    // 更新本地存储以包含完整结构
    storedUsers[walletAddress] = userData;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    return userData;
  } else {
    // 新用户
    const newUserData = createUserData(walletAddress);
    storedUsers[walletAddress] = newUserData;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    return newUserData;
  }
};

const saveUserDataToLocalStorage = (walletAddress, userData) => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
  storedUsers[walletAddress] = userData;
  localStorage.setItem('users', JSON.stringify(storedUsers));
  return userData;
};

const processReferralLocalStorage = (referrerCode, newUserAddress) => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
  
  // 检查用户是否已经被任何人推荐过（全局检查）
  const isAlreadyReferred = Object.keys(storedUsers).some(addr => {
    const userData = storedUsers[addr];
    return userData.referrals && userData.referrals.includes(newUserAddress);
  });
  
  if (isAlreadyReferred) {
    return { success: false, message: '已经被推荐过' };
  }
  
  // 查找推荐人
  const referrer = Object.keys(storedUsers).find(addr => {
    const userData = storedUsers[addr];
    const userReferralCode = userData.referralCode || addr.slice(-8);
    return userReferralCode === referrerCode;
  });
  
  if (referrer && storedUsers[referrer]) {
    // 检查是否是自己推荐自己
    if (referrer === newUserAddress) {
      return { success: false, message: '不能使用自己的推荐码' };
    }
    
    // 获取或创建被推荐人数据
    if (!storedUsers[newUserAddress]) {
      storedUsers[newUserAddress] = createUserData(newUserAddress);
    }
    
    // 给被推荐人增加奖励
    storedUsers[newUserAddress].tokenBalance += 200;
    storedUsers[newUserAddress].lastUpdated = new Date().toISOString();
    
    // 更新推荐人数据
    storedUsers[referrer].tokenBalance += 200;
    storedUsers[referrer].referralCount += 1;
    
    if (!storedUsers[referrer].referrals) {
      storedUsers[referrer].referrals = [];
    }
    
    storedUsers[referrer].referrals.push(newUserAddress);
    storedUsers[referrer].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    return { 
      success: true, 
      referrerData: storedUsers[referrer],
      newUserData: storedUsers[newUserAddress],
      message: '推荐奖励发放成功'
    };
  }
  
  return { success: false, message: '推荐码无效' };
};

// 获取所有用户数据（管理用途）
export const getAllUsersData = async () => {
  try {
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.warn('无法获取所有用户数据:', error);
    // 回退到本地存储
    return JSON.parse(localStorage.getItem('users') || '{}');
  }
};

// 更新任务完成状态
export const updateTaskStatus = async (walletAddress, taskType, completed = true) => {
  try {
    const userData = await getUserData(walletAddress);
    
    if (userData.tasks[taskType] === completed) {
      return { success: false, message: '任务状态未改变' };
    }
    
    userData.tasks[taskType] = completed;
    
    // 如果任务完成，给予奖励
    if (completed) {
      const rewards = {
        twitter: 50,
        discord: 100,
        telegram: 75,
        share: 25,
        retweet: 30,
        like: 20,
        reply: 40
      };
      
      userData.tokenBalance += rewards[taskType] || 0;
    }
    
    await saveUserData(walletAddress, userData);
    
    return { 
      success: true, 
      userData,
      message: `任务 ${taskType} ${completed ? '完成' : '重置'}成功`
    };
  } catch (error) {
    console.error('更新任务状态失败:', error);
    return { success: false, message: '更新任务状态失败' };
  }
};

// 手动触发数据迁移
export const migrateUserData = async (walletAddress) => {
  try {
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/migrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message,
        currentVersion: result.currentVersion,
        latestVersion: result.latestVersion,
        needsUpdate: result.currentVersion !== result.latestVersion
      };
    } else {
      const error = await response.json();
      throw new Error(error.error || '数据迁移失败');
    }
  } catch (error) {
    console.error('数据迁移失败:', error);
    return {
      success: false,
      message: error.message || '数据迁移失败',
      error: error
    };
  }
};

// 获取数据结构版本信息
export const getSchemaInfo = async () => {
  try {
    const response = await fetch(`${CF_CONFIG.WORKER_URL}/api/schema`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        currentVersion: result.currentVersion,
        schema: result.schema,
        description: result.description
      };
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('获取数据结构信息失败:', error);
    return {
      success: false,
      message: error.message || '获取数据结构信息失败',
      error: error
    };
  }
};

// 检查用户数据是否需要迁移
export const checkDataMigration = async (walletAddress) => {
  try {
    const userData = await getUserData(walletAddress);
    const schemaInfo = await getSchemaInfo();
    
    if (!userData || !schemaInfo.success) {
      return { needsMigration: false, error: '无法检查数据版本' };
    }
    
    const userVersion = userData.schemaVersion || '1.0.0';
    const latestVersion = schemaInfo.currentVersion;
    
    return {
      needsMigration: userVersion !== latestVersion,
      userVersion,
      latestVersion,
      userData
    };
  } catch (error) {
    console.error('检查数据迁移状态失败:', error);
    return {
      needsMigration: false,
      error: error.message
    };
  }
};

export default {
  getUserData,
  saveUserData,
  processReferralReward,
  getAllUsersData,
  updateTaskStatus,
  migrateUserData,
  getSchemaInfo,
  checkDataMigration
};