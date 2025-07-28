// Cloudflare R2 存储 API 工具
import { CLOUDFLARE_CONFIG, ENV_CONFIG } from '../config/cloudflare';

// 使用配置文件中的设置
const CF_CONFIG = CLOUDFLARE_CONFIG;

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
    share: false
  },
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
});

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
  
  // 查找推荐人
  const referrer = Object.keys(storedUsers).find(addr => {
    const userData = storedUsers[addr];
    const userReferralCode = userData.referralCode || addr.slice(-8);
    return userReferralCode === referrerCode;
  });
  
  if (referrer && storedUsers[referrer]) {
    // 检查是否已经被推荐过
    if (storedUsers[referrer].referrals && storedUsers[referrer].referrals.includes(newUserAddress)) {
      return { success: false, message: '已经被推荐过' };
    }
    
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
        share: 25
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

export default {
  getUserData,
  saveUserData,
  processReferralReward,
  getAllUsersData,
  updateTaskStatus
};