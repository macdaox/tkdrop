import { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, saveUserData, processReferralReward, updateTaskStatus } from '../utils/cloudflareAPI';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralList, setReferralList] = useState([]);
  
  // 生成推广码（简单使用钱包地址的最后8位）
  useEffect(() => {
    if (walletAddress) {
      setReferralCode(walletAddress.slice(-8));
    }
  }, [walletAddress]);

  // 定期刷新用户数据以获取最新的推荐人数
  useEffect(() => {
    if (!walletAddress) return;

    const refreshInterval = setInterval(async () => {
      try {
        const userData = await getUserData(walletAddress);
        setTokenBalance(userData.tokenBalance);
        setReferralCount(userData.referralCount);
        setReferralList(userData.referrals || []);
      } catch (error) {
        console.error('定期刷新用户数据失败:', error);
      }
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(refreshInterval);
  }, [walletAddress]);

  // 从Cloudflare R2获取用户数据
  const fetchUserData = async (address) => {
    if (address) {
      try {
        const userData = await getUserData(address);
        setTokenBalance(userData.tokenBalance);
        setReferralCount(userData.referralCount);
        setReferralList(userData.referrals || []);
        
        // 检查是否有待处理的推荐码
        const pendingReferral = localStorage.getItem('pendingReferral');
        if (pendingReferral) {
          // 自动处理推荐码
          const success = await processReferral(pendingReferral);
          if (success) {
            // 清除待处理的推荐码
            localStorage.removeItem('pendingReferral');
            // 重新获取用户数据以更新余额
            const updatedUserData = await getUserData(address);
            setTokenBalance(updatedUserData.tokenBalance);
            setReferralCount(updatedUserData.referralCount);
            setReferralList(updatedUserData.referrals || []);
          } else {
            // 如果推荐码无效，也清除它
            localStorage.removeItem('pendingReferral');
          }
        }
        
        return userData;
      } catch (error) {
        console.error('获取用户数据失败:', error);
        // 设置默认值
        setTokenBalance(0);
        setReferralCount(0);
        setReferralList([]);
      }
    }
  };

  // 处理推广奖励
  const processReferral = async (referrerCode) => {
    if (!walletAddress || !referrerCode) return false;
    
    // 防止自我推广
    if (referrerCode === referralCode) return false;
    
    try {
      const result = await processReferralReward(referrerCode, walletAddress);
      if (result.success) {
        // 推荐成功后，如果当前用户就是推荐人，更新本地状态
        if (result.referrerData && result.referrerData.walletAddress === walletAddress) {
          setTokenBalance(result.referrerData.tokenBalance);
          setReferralCount(result.referrerData.referralCount);
        }
      }
      return result.success;
    } catch (error) {
      console.error('处理推荐奖励失败:', error);
      return false;
    }
  };

  // 完成任务并获得奖励
  const completeTask = async (taskType) => {
    if (!walletAddress) return false;
    
    try {
      const result = await updateTaskStatus(walletAddress, taskType, true);
      if (result.success) {
        setTokenBalance(result.userData.tokenBalance);
        return true;
      }
      return false;
    } catch (error) {
      console.error('完成任务失败:', error);
      return false;
    }
  };

  // 更新代币余额（用于推荐奖励等）
  const updateTokenBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const userData = await getUserData(walletAddress);
      setTokenBalance(userData.tokenBalance);
      setReferralCount(userData.referralCount);
      setReferralList(userData.referrals || []);
    } catch (error) {
      console.error('更新代币余额失败:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        tokenBalance,
        setTokenBalance,
        referralCode,
        referralCount,
        referralList,
        fetchUserData,
        processReferral,
        completeTask,
        updateTokenBalance
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);