import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserData, processReferralReward, updateTaskStatus } from '../utils/cloudflareAPI';
import { useWallet } from '../hooks/useWallet';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { address, isConnected } = useWallet();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralList, setReferralList] = useState([]);
  
  // 生成推广码（简单使用钱包地址的最后8位）
  useEffect(() => {
    if (address) {
      setReferralCode(address.slice(-8));
    }
  }, [address]);

  // 定期刷新用户数据以获取最新的推荐人数
  useEffect(() => {
    if (!address) return;

    const refreshInterval = setInterval(async () => {
      try {
        const userData = await getUserData(address);
        setTokenBalance(userData.tokenBalance);
        setReferralCount(userData.referralCount);
        setReferralList(userData.referrals || []);
      } catch (error) {
        console.error('定期刷新用户数据失败:', error);
      }
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(refreshInterval);
  }, [address]);

  // 获取用户数据
  const fetchUserData = async (walletAddress) => {
    const targetAddress = walletAddress || address;
    if (!targetAddress) return;
    
    try {
      const userData = await getUserData(targetAddress);
      setTokenBalance(userData.tokenBalance);
      setReferralCode(userData.referralCode);
      setReferralCount(userData.referralCount);
      setReferralList(userData.referrals || []);
      
      // 检查是否有待处理的推荐码
      const pendingReferral = localStorage.getItem('pendingReferral');
      if (pendingReferral) {
        try {
          const success = await processReferral(pendingReferral);
          if (success) {
            // 推荐码处理成功，重新获取用户数据
            const updatedUserData = await getUserData(targetAddress);
            setTokenBalance(updatedUserData.tokenBalance);
            setReferralCount(updatedUserData.referralCount);
            setReferralList(updatedUserData.referrals || []);
          }
        } catch (error) {
          console.error('处理待处理推荐码失败:', error);
        } finally {
          // 无论成功还是失败，都清除待处理的推荐码
          localStorage.removeItem('pendingReferral');
        }
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    }
  };

  // 处理推荐奖励
  const processReferral = async (referralCode) => {
    if (!address || !referralCode) return false;
    
    try {
      const result = await processReferralReward(address, referralCode);
      if (result.success) {
        setTokenBalance(result.userData.tokenBalance);
        setReferralCount(result.userData.referralCount);
        setReferralList(result.userData.referrals || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error('处理推荐奖励失败:', error);
      return false;
    }
  };

  // 完成任务并获得奖励
  const completeTask = async (taskType) => {
    if (!address) return false;
    
    try {
      const result = await updateTaskStatus(address, taskType, true);
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
    if (!address) return;
    
    try {
      const userData = await getUserData(address);
      setTokenBalance(userData.tokenBalance);
      setReferralCount(userData.referralCount);
      setReferralList(userData.referrals || []);
    } catch (error) {
      console.error('更新代币余额失败:', error);
    }
  };

  // 监听钱包连接状态变化
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address]);

  return (
    <UserContext.Provider
      value={{
        walletAddress: address,
        isConnected,
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