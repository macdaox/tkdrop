import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Row, Col, Space, Divider, Statistic, Input, message, Select } from 'antd';
import { 
  FileExclamationOutlined, 
  DisconnectOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  LinkOutlined,
  RocketOutlined,
  FileTextOutlined,
  MessageOutlined,
  TwitterOutlined,
  GithubOutlined,
  SendOutlined,
  WalletOutlined,
  GiftOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CheckOutlined,
  UserAddOutlined,
  RetweetOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../hooks/useWallet';
import { useLocation } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const CombinedPage = () => {
  const { 
    walletAddress, 
    isConnected,
    tokenBalance, 
    referralCode,
    referralCount,
    referralList,
    taskStatus,
    fetchUserData,
    processReferral,
    completeTask,
    updateTokenBalance
  } = useUser();
  const { connectWallet, disconnectWallet, isConnecting } = useWallet();
  const location = useLocation();
  const [referralInput, setReferralInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { language } = useLanguage(); // 默认简体中文

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // 多语言文本
  const translations = {
    'en': {
      // Page Title
      pageTitle: 'VeriCred - Skill Verification Protocol',
      // Hero Section
      heroTitle: 'VeriCred - Skill Verification Protocol',
      heroSubtitle: 'The world\'s first blockchain-based personal skill and knowledge verification protocol. Connect your wallet to get 2000 $VRC tokens and start your skill verification journey.',
      connectWallet: 'Connect Wallet to Get 2000 $VRC',
      readWhitepaper: 'Read Whitepaper',
      walletAddress: 'Wallet Address',
      tokenBalance: 'Token Balance',
      referredUsers: 'Referred Users',
      disconnect: 'Disconnect',
      
      // Tasks Section
      tasksTitle: 'Complete Tasks to Earn Tokens',
      tasksSubtitle: 'Complete simple social tasks to earn additional $VRC token rewards',
      followTwitter: 'Follow Twitter',
      followTwitterDesc: 'Follow our official Twitter account to get the latest project updates',
      joinDiscord: 'Join Discord',
      joinDiscordDesc: 'Join our Discord community to communicate with other users',
      joinTelegram: 'Join Telegram',
      joinTelegramDesc: 'Join our Telegram group to get real-time project information',
      shareProject: 'Share Project',
      shareProjectDesc: 'Share VeriCred project on social media to help us grow',
      retweetTwitter: 'Retweet Twitter',
      retweetTwitterDesc: 'Retweet our latest Twitter post to spread the word',
      likeTwitter: 'Like Twitter',
      likeTwitterDesc: 'Like our Twitter posts to show your support',
      replyTwitter: 'Reply Twitter',
      replyTwitterDesc: 'Reply to our Twitter posts and join the conversation',
      completeTask: 'Complete Task',
      reward: 'Reward',
      
      // Referral Section
      referralLink: 'Referral Link',
      referralLinkDesc: 'Share your exclusive referral link and earn 200 $VRC tokens for each successful referral',
      yourReferralLink: 'Your Referral Link',
      copyReferralLink: 'Copy Referral Link',
      yourReferralCode: 'Your Referral Code',
      shareReferral: 'Share Referral Link',
      shareDescription: 'Share your referral link on social media to let more people know about VeriCred',
      share: 'More Share',
      referralCodeSystem: 'Referral Code System',
      referralCodeDesc: 'Use your friend\'s referral code to help them earn 200 $VRC tokens',
      useReferralCode: 'Use Referral Code',
      enterReferralCode: 'Enter referral code',
      use: 'Use',
      referrerReward: 'Referrer will receive 200 VRC tokens',
      recentInvitedUsers: 'Recent Invited Users',
      newUser: 'New User',
      noInvitedUsers: 'No users invited yet',
      shareToInvite: 'Share your referral link to start inviting friends!',
      
      // Community Section
      communityTitle: 'Join Our Community',
      communitySubtitle: 'Connect with developers, educators, and professionals building the future of skill verification',
      
      // Share Text
      shareTwitterText: '🚀 Discover VeriCred - The revolutionary blockchain-based skill verification protocol! Connect your wallet to get 2000 $VRC tokens instantly! Join the future of skill verification: ',
      shareTelegramText: '🎯 VeriCred is transforming how we verify skills and knowledge on blockchain! Get 2000 $VRC tokens just for connecting your wallet. Don\'t miss this opportunity: ',
      
      // Messages
      walletConnected: 'Wallet connected successfully! Received 2000 VRC tokens!',
      connectionRejected: 'Connection rejected',
      installMetaMask: 'Please install MetaMask wallet',
      walletDisconnected: 'Wallet disconnected',
      linkCopied: 'Referral link copied to clipboard!',
      copyFailed: 'Copy failed, please copy manually',
      copied: 'Copied',
      connectWalletFirst: 'Please connect wallet first',
      enterReferralCodeFirst: 'Please enter referral code',
      referralSuccess: 'Referral code used successfully! Referrer received 200 VRC tokens!',
      invalidReferralCode: 'Invalid referral code or already used',
      taskCompleted: 'task completed! Received',
      tokensReward: 'VRC tokens reward!',
      taskAlreadyCompleted: 'Task already completed or failed',
      completed: 'Completed'
    },
    'zh-CN': {
      // Page Title
      pageTitle: 'VeriCred - 技能确权协议',
      // Hero Section
      heroTitle: 'VeriCred - 技能确权协议',
      heroSubtitle: '全球首个基于区块链的个人技能与知识确权协议。连接钱包即可获得2000个$VRC代币，开启你的技能确权之旅。',
      connectWallet: '连接钱包获取2000个$VRC',
      readWhitepaper: '阅读白皮书',
      walletAddress: '钱包地址',
      tokenBalance: '代币余额',
      referredUsers: '推广人数',
      disconnect: '断开连接',
      
      // Tasks Section
      tasksTitle: '完成任务赚取代币',
      tasksSubtitle: '完成简单的社交任务，获得额外的$VRC代币奖励',
      followTwitter: '关注Twitter',
      followTwitterDesc: '关注我们的官方Twitter账号，获取项目最新动态',
      joinDiscord: '加入Discord',
      joinDiscordDesc: '加入我们的Discord社区，与其他用户交流',
      joinTelegram: '加入Telegram',
      joinTelegramDesc: '加入我们的Telegram群组，获取项目实时信息',
      shareProject: '分享项目',
      shareProjectDesc: '在社交媒体上分享VeriCred项目，帮助我们成长',
      retweetTwitter: '转发推特',
      retweetTwitterDesc: '转发我们最新的推特动态，传播项目信息',
      likeTwitter: '点赞推特',
      likeTwitterDesc: '为我们的推特点赞，表达你的支持',
      replyTwitter: '回复推特',
      replyTwitterDesc: '回复我们的推特动态，参与讨论互动',
      completeTask: '完成任务',
      reward: '奖励',
      
      // Referral Section
      referralLink: '推广链接',
      referralLinkDesc: '分享你的专属推广链接，每成功推荐一人即可获得200个$VRC代币奖励',
      yourReferralLink: '你的推广链接',
      copyReferralLink: '复制推广链接',
      yourReferralCode: '你的推荐码',
      shareReferral: '分享推广链接',
      shareDescription: '通过社交媒体分享你的推广链接，让更多人了解VeriCred',
      share: '更多分享',
      referralCodeSystem: '推荐码系统',
      referralCodeDesc: '使用朋友的推荐码，帮助他们获得200个$VRC代币奖励',
      useReferralCode: '使用推荐码',
      enterReferralCode: '输入推荐码',
      use: '使用',
      referrerReward: '推荐人将获得200个VRC代币奖励',
      recentInvitedUsers: '最近邀请的用户',
      newUser: '新用户',
      noInvitedUsers: '还没有邀请任何用户',
      shareToInvite: '分享你的推荐链接开始邀请朋友吧！',
      
      // Community Section
      communityTitle: '加入我们的社区',
      communitySubtitle: '与开发者、教育工作者和专业人士一起构建技能确权的未来',
      
      // Share Text
      shareTwitterText: '🚀 发现VeriCred - 革命性的区块链技能确权协议！连接钱包即可获得2000个$VRC代币！加入技能确权的未来：',
      shareTelegramText: '🎯 VeriCred正在改变我们在区块链上验证技能和知识的方式！仅需连接钱包即可获得2000个$VRC代币。不要错过这个机会：',
      
      // Messages
      walletConnected: '钱包连接成功！获得2000个VRC代币！',
      connectionRejected: '连接被拒绝',
      installMetaMask: '请安装MetaMask钱包',
      walletDisconnected: '钱包已断开连接',
      linkCopied: '推广链接已复制到剪贴板！',
      copyFailed: '复制失败，请手动复制',
      copied: '已复制',
      connectWalletFirst: '请先连接钱包',
      enterReferralCodeFirst: '请输入推荐码',
      referralSuccess: '推荐码使用成功！推荐人获得200个VRC代币奖励！',
      invalidReferralCode: '推荐码无效或已使用过',
      taskCompleted: '任务完成！获得',
      tokensReward: '个$VRC代币奖励！',
      taskAlreadyCompleted: '任务已完成或完成失败',
      completed: '已完成'
    },
    'zh-TW': {
      // Page Title
      pageTitle: 'VeriCred - 技能確權協議',
      // Hero Section
      heroTitle: 'VeriCred - 技能確權協議',
      heroSubtitle: '全球首個基於區塊鏈的個人技能與知識確權協議。連接錢包即可獲得2000個$VRC代幣，開啟你的技能確權之旅。',
      connectWallet: '連接錢包獲取2000個$VRC',
      readWhitepaper: '閱讀白皮書',
      walletAddress: '錢包地址',
      tokenBalance: '代幣餘額',
      referredUsers: '推廣人數',
      disconnect: '斷開連接',
      
      // Tasks Section
      tasksTitle: '完成任務賺取代幣',
      tasksSubtitle: '完成簡單的社交任務，獲得額外的$VRC代幣獎勵',
      followTwitter: '關注Twitter',
      followTwitterDesc: '關注我們的官方Twitter賬號，獲取項目最新動態',
      joinDiscord: '加入Discord',
      joinDiscordDesc: '加入我們的Discord社區，與其他用戶交流',
      joinTelegram: '加入Telegram',
      joinTelegramDesc: '加入我們的Telegram群組，獲取項目實時信息',
      shareProject: '分享項目',
      shareProjectDesc: '在社交媒體上分享VeriCred項目，幫助我們成長',
      retweetTwitter: '轉發推特',
      retweetTwitterDesc: '轉發我們最新的推特動態，傳播項目信息',
      likeTwitter: '點讚推特',
      likeTwitterDesc: '為我們的推特點讚，表達你的支持',
      replyTwitter: '回覆推特',
      replyTwitterDesc: '回覆我們的推特動態，參與討論互動',
      completeTask: '完成任務',
      reward: '獎勵',
      
      // Referral Section
      referralLink: '推廣連結',
      referralLinkDesc: '分享你的專屬推廣連結，每成功推薦一人即可獲得200個$VRC代幣獎勵',
      yourReferralLink: '你的推廣連結',
      copyReferralLink: '複製推廣連結',
      yourReferralCode: '你的推薦碼',
      shareReferral: '分享推廣連結',
      shareDescription: '通過社交媒體分享你的推廣連結，讓更多人了解VeriCred',
      share: '更多分享',
      referralCodeSystem: '推薦碼系統',
      referralCodeDesc: '使用朋友的推薦碼，幫助他們獲得200個$VRC代幣獎勵',
      useReferralCode: '使用推薦碼',
      enterReferralCode: '輸入推薦碼',
      use: '使用',
      referrerReward: '推薦人將獲得200個VRC代幣獎勵',
      recentInvitedUsers: '最近邀請的用戶',
      newUser: '新用戶',
      noInvitedUsers: '還沒有邀請任何用戶',
      shareToInvite: '分享你的推薦連結開始邀請朋友吧！',
      
      // Community Section
      communityTitle: '加入我們的社區',
      communitySubtitle: '與開發者、教育工作者和專業人士一起構建技能確權的未來',
      
      // Share Text
      shareTwitterText: '🚀 發現VeriCred - 革命性的區塊鏈技能確權協議！連接錢包即可獲得2000個$VRC代幣！加入技能確權的未來：',
      shareTelegramText: '🎯 VeriCred正在改變我們在區塊鏈上驗證技能和知識的方式！僅需連接錢包即可獲得2000個$VRC代幣。不要錯過這個機會：',
      
      // Messages
      walletConnected: '錢包連接成功！獲得2000個VRC代幣！',
      connectionRejected: '連接被拒絕',
      installMetaMask: '請安裝MetaMask錢包',
      walletDisconnected: '錢包已斷開連接',
      linkCopied: '推廣連結已複製到剪貼板！',
      copyFailed: '複製失敗，請手動複製',
      copied: '已複製',
      connectWalletFirst: '請先連接錢包',
      enterReferralCodeFirst: '請輸入推薦碼',
      referralSuccess: '推薦碼使用成功！推薦人獲得200個VRC代幣獎勵！',
      invalidReferralCode: '推薦碼無效或已使用過',
      taskCompleted: '任務完成！獲得',
      tokensReward: '個$VRC代幣獎勵！',
      taskAlreadyCompleted: '任務已完成或完成失敗',
      completed: '已完成'
    }
  };

  const t = translations[language];

  // 动态更新页面标题
  useEffect(() => {
    document.title = t.pageTitle;
  }, [language, t.pageTitle]);

  // 检查URL中是否有推荐码
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('pendingReferral', ref);
    }
  }, [location]);

  // 处理钱包连接
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      if (walletAddress) {
        message.success(t.walletConnected);
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      message.error(t.connectionRejected);
    }
  };

  // 处理钱包断开
  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  // 获取推广链接
  const getReferralLink = () => {
    return `${window.location.origin}?ref=${referralCode}`;
  };

  // 格式化钱包地址，脱敏显示
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}****${end}`;
  };

  // 获取最近的5个被邀请人
  const getRecentReferrals = () => {
    if (!referralList || referralList.length === 0) return [];
    return referralList.slice(-5).reverse(); // 获取最后5个并反转顺序（最新的在前）
  };

  // 复制推广链接
  const copyReferralLink = () => {
    const link = getReferralLink();
    navigator.clipboard.writeText(link).then(() => {
      message.success(t.linkCopied);
      setCopySuccess(true);
      // 3秒后重置状态
      setTimeout(() => setCopySuccess(false), 3000);
    }).catch(() => {
      message.error(t.copyFailed);
    });
  };

  // 打开白皮书
  const openWhitepaper = () => {
    window.open('https://www.vericred.app/whitepaper', '_blank');
  };

  // 处理推荐码输入
  const handleReferralSubmit = async () => {
    console.log('handleReferralSubmit called', { isConnected, referralInput });
    
    if (!isConnected) {
      message.error(t.connectWalletFirst);
      return;
    }
    
    if (!referralInput.trim()) {
      message.error(t.enterReferralCodeFirst);
      return;
    }
    
    message.info('正在处理推荐码...');
    
    try {
      const result = await processReferral(referralInput.trim());
      console.log('processReferral result:', result);
      console.log('result type:', typeof result);
      console.log('result.success:', result.success);
      console.log('result.message:', result.message);
      
      if (result && result.success) {
        message.success({
          content: result.message || t.referralSuccess,
          duration: 5,
          style: {
            marginTop: '20vh',
          },
        });
        setReferralInput('');
        // 刷新当前用户数据（虽然当前用户不是推荐人，但为了保持数据一致性）
        await fetchUserData(walletAddress);
      } else {
        console.log('进入错误处理分支');
        // 处理result为空或undefined的情况
        if (!result) {
          console.log('result is null or undefined');
          message.error({
            content: '❌ 处理推荐码时发生未知错误',
            duration: 5,
            style: {
              marginTop: '20vh',
            },
          });
          return;
        }
        
        // 根据具体错误信息显示不同的提醒
        if (result.message === '已经被推荐过') {
          message.warning({
            content: '⚠️ 您已经使用过推荐码了，每个账户只能使用一次推荐码！',
            duration: 6,
            style: {
              marginTop: '20vh',
            },
          });
        } else if (result.message === '不能使用自己的推荐码') {
          message.warning({
            content: '⚠️ 不能使用自己的推荐码，请使用其他人的推荐码！',
            duration: 6,
            style: {
              marginTop: '20vh',
            },
          });
        } else if (result.message === '推荐码无效') {
          message.error({
            content: '❌ 推荐码无效，请检查推荐码是否正确',
            duration: 5,
            style: {
              marginTop: '20vh',
            },
          });
        } else {
          message.error({
            content: result.message || t.invalidReferralCode,
            duration: 5,
            style: {
              marginTop: '20vh',
            },
          });
        }
      }
    } catch (error) {
      console.error('推荐码处理错误:', error);
      message.error('处理推荐码时发生错误，请稍后重试');
    }
  };

  // 处理任务完成
  const handleTaskComplete = async (taskType, taskUrl, taskName, reward) => {
    if (!isConnected) {
      message.error(t.connectWalletFirst);
      return;
    }

    // 先打开任务链接
    window.open(taskUrl, '_blank');
    
    // 延迟一段时间后自动完成任务（模拟用户完成任务的时间）
    setTimeout(async () => {
      const success = await completeTask(taskType);
      if (success) {
        message.success(`${taskName}${t.taskCompleted}${reward}${t.tokensReward}`);
      } else {
        message.error(t.taskAlreadyCompleted);
      }
    }, 3000); // 3秒后自动完成任务
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh' }}>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2rem',
          position: 'relative',
          background: `
            radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 70%),
            #0F172A
          `
        }}
      >
        <div style={{ maxWidth: '1400px', zIndex: 2, width: '100%' }}>
          
          <Title 
            level={1} 
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}
          >
            {t.heroTitle}
          </Title>
          
          <Paragraph 
            style={{ 
              fontSize: '1.25rem',
              color: '#94A3B8',
              marginBottom: '3rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 3rem auto'
            }}
          >
            {t.heroDescription}
          </Paragraph>
          
          {!isConnected ? (
            <Space size="large" wrap direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<WalletOutlined />}
                loading={isConnecting}
                onClick={handleConnectWallet}
                style={{
                  height: '56px',
                  padding: '0 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                  maxWidth: isMobile ? '300px' : 'none'
                }}
              >
                {t.connectWallet}
              </Button>
              
              <Button 
                size="large"
                icon={<FileTextOutlined />}
                onClick={openWhitepaper}
                style={{
                  height: '56px',
                  padding: '0 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'transparent',
                  border: '2px solid #38BDF8',
                  color: '#38BDF8',
                  width: isMobile ? '100%' : 'auto',
                  maxWidth: isMobile ? '300px' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#38BDF8';
                  e.target.style.color = '#0F172A';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#38BDF8';
                }}
              >
                {t.readWhitepaper}
              </Button>
            </Space>
          ) : (
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                padding: '3rem 4rem',
                width: '1200px',
                minHeight: '400px',
                margin: '0 auto',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Row gutter={[32, 32]} style={{ marginBottom: '3rem' }}>
                <Col xs={24} sm={8}>
                  <div style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <WalletOutlined style={{ 
                      fontSize: '2rem', 
                      color: '#38BDF8', 
                      marginBottom: '0.5rem',
                      display: 'block'
                    }} />
                    <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {t.walletAddress}
                    </div>
                    <div style={{ 
                      color: '#FFFFFF', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>
                      {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <GiftOutlined style={{ 
                      fontSize: '2rem', 
                      color: '#38BDF8', 
                      marginBottom: '0.5rem',
                      display: 'block'
                    }} />
                    <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {t.tokenBalance}
                    </div>
                    <div style={{ 
                      color: '#38BDF8', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold'
                    }}>
                      {tokenBalance.toLocaleString()} $VRC
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <UserAddOutlined style={{ 
                      fontSize: '2rem', 
                      color: '#38BDF8', 
                      marginBottom: '0.5rem',
                      display: 'block'
                    }} />
                    <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {t.referredUsers}
                    </div>
                    <div style={{ 
                      color: '#FFFFFF', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold'
                    }}>
                      {referralCount}
                    </div>
                  </div>
                </Col>
              </Row>
              
              {/* 推荐码输入区域 */}
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <Title level={5} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                  {t.useReferralCode}
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <Space.Compact style={{ maxWidth: '400px', width: '100%' }}>
                      <Input
                        placeholder={t.enterReferralCode}
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        style={{ height: '40px' }}
                        disabled={!isConnected}
                      />
                      <Button 
                        type="primary" 
                        onClick={handleReferralSubmit}
                        style={{ height: '40px', padding: '0 20px' }}
                        disabled={!isConnected}
                      >
                        {t.use}
                      </Button>
                    </Space.Compact>
                    <Text style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                      {t.referrerReward}
                    </Text>
                  </div>
                  <Button 
                    icon={<DisconnectOutlined />}
                    onClick={handleDisconnectWallet}
                    size="large"
                    style={{
                      background: 'transparent',
                      border: '2px solid #EF4444',
                      color: '#EF4444',
                      fontWeight: 600,
                      borderRadius: '8px',
                      padding: '0 2rem',
                      height: '44px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#EF4444';
                      e.target.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#EF4444';
                    }}
                  >
                    {t.disconnect}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* Tasks Section */}
      <section id="tasks" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {t.tasksTitle}
          </Title>
          <Paragraph style={{ fontSize: '1.125rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            {t.tasksDescription}
          </Paragraph>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <Card 
              className="feature-card"
              style={{ 
                height: '100%',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)'
              }}
              styles={{ body: { padding: '2rem' } }}
            >
              <TwitterOutlined 
                style={{ 
                  fontSize: '3rem', 
                  color: '#38BDF8', 
                  marginBottom: '1.5rem' 
                }} 
              />
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                {t.followTwitter}
              </Title>
              <Paragraph style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {t.followTwitterDesc}
              </Paragraph>
              <div style={{ marginBottom: '1rem' }}>
                <Text style={{ color: '#38BDF8', fontSize: '1.25rem', fontWeight: 'bold' }}>+50 $VRC</Text>
              </div>
              <Button 
                type={taskStatus.twitter ? "default" : "primary"}
                size="small"
                disabled={!isConnected || taskStatus.twitter}
                onClick={() => handleTaskComplete('twitter', 'https://twitter.com/VeriCred', t.followTwitter, 50)}
                style={taskStatus.twitter ? {
                  background: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF'
                } : {}}
              >
                {taskStatus.twitter ? t.completed : t.completeTask}
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <Card 
              className="feature-card"
              style={{ 
                height: '100%',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)'
              }}
              styles={{ body: { padding: '2rem' } }}
            >
              <MessageOutlined 
                style={{ 
                  fontSize: '3rem', 
                  color: '#38BDF8', 
                  marginBottom: '1.5rem' 
                }} 
              />
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                {t.joinDiscord}
              </Title>
              <Paragraph style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {t.joinDiscordDesc}
              </Paragraph>
              <div style={{ marginBottom: '1rem' }}>
                <Text style={{ color: '#38BDF8', fontSize: '1.25rem', fontWeight: 'bold' }}>+100 $VRC</Text>
              </div>
              <Button 
                type={taskStatus.discord ? "default" : "primary"}
                size="small"
                disabled={!isConnected || taskStatus.discord}
                onClick={() => handleTaskComplete('discord', 'https://discord.gg/uZAg6Sg39e', t.joinDiscord, 100)}
                style={taskStatus.discord ? {
                  background: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF'
                } : {}}
              >
                {taskStatus.discord ? t.completed : t.completeTask}
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <Card 
              className="feature-card"
              style={{ 
                height: '100%',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)'
              }}
              styles={{ body: { padding: '2rem' } }}
            >
              <SendOutlined 
                style={{ 
                  fontSize: '3rem', 
                  color: '#38BDF8', 
                  marginBottom: '1.5rem' 
                }} 
              />
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                {t.joinTelegram}
              </Title>
              <Paragraph style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {t.joinTelegramDesc}
              </Paragraph>
              <div style={{ marginBottom: '1rem' }}>
                <Text style={{ color: '#38BDF8', fontSize: '1.25rem', fontWeight: 'bold' }}>+75 $VRC</Text>
              </div>
              <Button 
                type={taskStatus.telegram ? "default" : "primary"}
                size="small"
                disabled={!isConnected || taskStatus.telegram}
                onClick={() => handleTaskComplete('telegram', 'https://t.me/VeriCred', t.joinTelegram, 75)}
                style={taskStatus.telegram ? {
                  background: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF'
                } : {}}
              >
                {taskStatus.telegram ? t.completed : t.completeTask}
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <Card 
              className="feature-card"
              style={{ 
                height: '100%',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)'
              }}
              styles={{ body: { padding: '2rem' } }}
            >
              <ShareAltOutlined 
                style={{ 
                  fontSize: '3rem', 
                  color: '#38BDF8', 
                  marginBottom: '1.5rem' 
                }} 
              />
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                {t.shareProject}
              </Title>
              <Paragraph style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {t.shareProjectDesc}
              </Paragraph>
              <div style={{ marginBottom: '1rem' }}>
                <Text style={{ color: '#38BDF8', fontSize: '1.25rem', fontWeight: 'bold' }}>+25 $VRC</Text>
              </div>
              <Button 
                type={taskStatus.share ? "default" : "primary"}
                size="small"
                disabled={!isConnected || taskStatus.share}
                onClick={() => {
                  const shareText = t.shareText;
                  const shareUrl = window.location.origin;
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                  handleTaskComplete('share', twitterUrl, t.shareProject, 25);
                }}
                style={taskStatus.share ? {
                  background: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF'
                } : {}}
              >
                {taskStatus.share ? t.completed : t.completeTask}
              </Button>
            </Card>
          </Col>
        </Row>
        
        {/* 新增的三个Twitter任务行 - 低调展示 */}
        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(56, 189, 248, 0.1)', paddingTop: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.3)',
            border: '1px solid rgba(56, 189, 248, 0.05)',
            borderRadius: '8px',
            marginBottom: '8px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RetweetOutlined style={{ fontSize: '1.2rem', color: '#64748B' }} />
              <div>
                <Text style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: '500' }}>{t.retweetTwitter}</Text>
                <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.retweetTwitterDesc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text style={{ color: '#38BDF8', fontSize: '0.85rem', fontWeight: '600' }}>+30 $VRC</Text>
              <Button 
                type={taskStatus.retweet ? "default" : "text"}
                size="small"
                disabled={!isConnected || taskStatus.retweet}
                onClick={() => handleTaskComplete('retweet', 'https://x.com/VeriCred/status/1950093809896902845', t.retweetTwitter, 30)}
                style={{
                  fontSize: '0.75rem',
                  height: '28px',
                  padding: '0 12px',
                  background: taskStatus.retweet ? '#10B981' : 'rgba(56, 189, 248, 0.1)',
                  borderColor: taskStatus.retweet ? '#10B981' : 'rgba(56, 189, 248, 0.2)',
                  color: taskStatus.retweet ? '#FFFFFF' : '#38BDF8'
                }}
              >
                {taskStatus.retweet ? t.completed : t.completeTask}
              </Button>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.3)',
            border: '1px solid rgba(56, 189, 248, 0.05)',
            borderRadius: '8px',
            marginBottom: '8px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LikeOutlined style={{ fontSize: '1.2rem', color: '#64748B' }} />
              <div>
                <Text style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: '500' }}>{t.likeTwitter}</Text>
                <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.likeTwitterDesc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text style={{ color: '#38BDF8', fontSize: '0.85rem', fontWeight: '600' }}>+20 $VRC</Text>
              <Button 
                type={taskStatus.like ? "default" : "text"}
                size="small"
                disabled={!isConnected || taskStatus.like}
                onClick={() => handleTaskComplete('like', 'https://x.com/VeriCred/status/1950093809896902845', t.likeTwitter, 20)}
                style={{
                  fontSize: '0.75rem',
                  height: '28px',
                  padding: '0 12px',
                  background: taskStatus.like ? '#10B981' : 'rgba(56, 189, 248, 0.1)',
                  borderColor: taskStatus.like ? '#10B981' : 'rgba(56, 189, 248, 0.2)',
                  color: taskStatus.like ? '#FFFFFF' : '#38BDF8'
                }}
              >
                {taskStatus.like ? t.completed : t.completeTask}
              </Button>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.3)',
            border: '1px solid rgba(56, 189, 248, 0.05)',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CommentOutlined style={{ fontSize: '1.2rem', color: '#64748B' }} />
              <div>
                <Text style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: '500' }}>{t.replyTwitter}</Text>
                <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.replyTwitterDesc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text style={{ color: '#38BDF8', fontSize: '0.85rem', fontWeight: '600' }}>+40 $VRC</Text>
              <Button 
                type={taskStatus.reply ? "default" : "text"}
                size="small"
                disabled={!isConnected || taskStatus.reply}
                onClick={() => handleTaskComplete('reply', 'https://x.com/VeriCred/status/1950093809896902845', t.replyTwitter, 40)}
                style={{
                  fontSize: '0.75rem',
                  height: '28px',
                  padding: '0 12px',
                  background: taskStatus.reply ? '#10B981' : 'rgba(56, 189, 248, 0.1)',
                  borderColor: taskStatus.reply ? '#10B981' : 'rgba(56, 189, 248, 0.2)',
                  color: taskStatus.reply ? '#FFFFFF' : '#38BDF8'
                }}
              >
                {taskStatus.reply ? t.completed : t.completeTask}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Link Section */}
      {isConnected && (
        <section id="referral-link" style={{ padding: '6rem 2rem', background: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                {t.referralLink}
              </Title>
              <Paragraph style={{ fontSize: '1.125rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
                {t.referralLinkDesc}
              </Paragraph>
            </div>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
            
                <Card 
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                  styles={{ body: { padding: '1.5rem' } }}
                >
                  <div style={{ marginBottom: '2rem' }}>
                    <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                      {t.yourReferralLink}
                    </Title>
                    <div style={{ 
                      background: 'rgba(56, 189, 248, 0.1)', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      marginBottom: '1rem'
                    }}>
                      <Text 
                        style={{ 
                          color: '#38BDF8', 
                          fontSize: '0.875rem',
                          wordBreak: 'break-all',
                          fontFamily: 'monospace'
                        }}
                      >
                        {getReferralLink()}
                      </Text>
                    </div>
                    <Button 
                      type={copySuccess ? "default" : "primary"}
                      size="large"
                      icon={copySuccess ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={copyReferralLink}
                      style={{
                        height: '48px',
                        padding: '0 32px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        width: '100%',
                        marginBottom: '1rem',
                        background: copySuccess ? '#10B981' : undefined,
                        borderColor: copySuccess ? '#10B981' : undefined,
                        color: copySuccess ? '#FFFFFF' : undefined
                      }}
                    >
                        {copySuccess ? t.copied : t.copyReferralLink}
                      </Button>
                    
                    {/* 分享按钮移到这里 */}
                    <div style={{ marginBottom: '1rem' }}>
                      <Title level={5} style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '1rem' }}>
                        <ShareAltOutlined style={{ marginRight: '0.5rem' }} />
                        {t.shareReferral}
                      </Title>
                      <Space size={4} wrap style={{ width: '100%' }}>
                        <Button
                          type="primary"
                          icon={<TwitterOutlined />}
                          size="small"
                          onClick={() => {
                            const text = encodeURIComponent(`${t.shareTwitterText}${getReferralLink()}`);
                            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                          }}
                          style={{
                            background: '#1DA1F2',
                            border: 'none',
                            height: '28px',
                            fontSize: '12px',
                            padding: '0 8px'
                          }}
                        >
                          Twitter
                        </Button>
                        
                        <Button
                          type="primary"
                          icon={<MessageOutlined />}
                          size="small"
                          onClick={() => {
                            const url = encodeURIComponent(getReferralLink());
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                          }}
                          style={{
                            background: '#1877F2',
                            border: 'none',
                            height: '28px',
                            fontSize: '12px',
                            padding: '0 8px'
                          }}
                        >
                          Facebook
                        </Button>
                        
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          size="small"
                          onClick={() => {
                            const text = encodeURIComponent(`${t.shareTelegramText}${getReferralLink()}`);
                            window.open(`https://t.me/share/url?url=${getReferralLink()}&text=${text}`, '_blank');
                          }}
                          style={{
                            background: '#0088CC',
                            border: 'none',
                            height: '28px',
                            fontSize: '12px',
                            padding: '0 8px'
                          }}
                        >
                          Telegram
                        </Button>
                        
                        <Button
                          type="default"
                          icon={<ShareAltOutlined />}
                          size="small"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'VeriCred',
                                text: t.shareText,
                                url: getReferralLink()
                              });
                            } else {
                              navigator.clipboard.writeText(getReferralLink());
                              message.success(t.linkCopied);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid #38BDF8',
                            color: '#38BDF8',
                            height: '28px',
                            fontSize: '12px',
                            padding: '0 8px'
                          }}
                        >
                          {t.share}
                        </Button>
                      </Space>
                    </div>
                  </div>
                  
                  <Divider style={{ borderColor: 'rgba(56, 189, 248, 0.2)' }} />
                  
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Statistic
                          title={<span style={{ color: '#94A3B8' }}>{t.yourReferralCode}</span>}
                          value={referralCode}
                          valueStyle={{ color: '#38BDF8', fontSize: '1.5rem', fontFamily: 'monospace' }}
                        />
                      </Col>
                      <Col xs={24}>
                        <Statistic
                          title={<span style={{ color: '#94A3B8' }}>{t.referredUsers}</span>}
                          value={referralCount}
                          valueStyle={{ color: '#38BDF8', fontSize: '1.5rem' }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card 
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                  styles={{ body: { padding: '1.5rem' } }}
                >
                  <Title level={4} style={{ color: '#FFFFFF', marginBottom: '1.5rem' }}>
                    <UserAddOutlined style={{ marginRight: '0.5rem' }} />
                    {t.recentInvitedUsers}
                  </Title>
                  
                  <div>
                    {getRecentReferrals().length > 0 ? (
                      <div>
                        {getRecentReferrals().map((address, index) => (
                          <div 
                            key={address}
                            style={{
                              background: 'rgba(56, 189, 248, 0.1)',
                              border: '1px solid rgba(56, 189, 248, 0.2)',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              marginBottom: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div 
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '0.75rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                  color: '#FFFFFF'
                                }}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <Text 
                                  style={{ 
                                    color: '#38BDF8', 
                                    fontSize: '0.875rem',
                                    fontFamily: 'monospace',
                                    fontWeight: '500'
                                  }}
                                >
                                  {formatWalletAddress(address)}
                                </Text>
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                                  {t.newUser}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Text style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                +200 $VRC
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <UserAddOutlined style={{ fontSize: '3rem', color: '#475569', marginBottom: '1rem' }} />
                        <Paragraph style={{ color: '#94A3B8', margin: 0 }}>
                          {t.noInvitedUsers}
                        </Paragraph>
                        <Paragraph style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                          {t.shareToInvite}
                        </Paragraph>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      )}


      {/* Community Section */}
      <section id="community" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {t.communityTitle}
          </Title>
          <Paragraph style={{ fontSize: '1.125rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            {t.communityDescription}
          </Paragraph>
          
          <Space size="large" wrap>
            <Button 
              size="large"
              icon={<TwitterOutlined />}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'transparent',
                border: '2px solid #38BDF8',
                color: '#38BDF8'
              }}
            >
              Twitter
            </Button>
            
            <Button 
              size="large"
              icon={<MessageOutlined />}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'transparent',
                border: '2px solid #38BDF8',
                color: '#38BDF8'
              }}
            >
              Discord
            </Button>
            
            <Button 
              size="large"
              icon={<SendOutlined />}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'transparent',
                border: '2px solid #38BDF8',
                color: '#38BDF8'
              }}
            >
              Telegram
            </Button>
            
            <Button 
              size="large"
              icon={<FileTextOutlined />}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'transparent',
                border: '2px solid #38BDF8',
                color: '#38BDF8'
              }}
            >
              Medium
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default CombinedPage;