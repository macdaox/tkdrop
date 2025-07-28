import React, { useState } from 'react';
import { Typography, Card, Input, Button, message, Row, Col, Statistic } from 'antd';
import { CopyOutlined, ShareAltOutlined, UserAddOutlined } from '@ant-design/icons';
import { useUser } from '../context/UserContext';
import copy from 'copy-to-clipboard';

const { Title, Paragraph } = Typography;

const Referral = () => {
  const { walletAddress, tokenBalance, referralCode, referralCount } = useUser();
  const [copied, setCopied] = useState(false);

  // 生成完整的推广链接
  const getReferralLink = () => {
    return `${window.location.origin}?ref=${referralCode}`;
  };

  // 复制推广链接
  const copyReferralLink = () => {
    const link = getReferralLink();
    copy(link);
    setCopied(true);
    message.success('推广链接已复制到剪贴板！');
    
    // 3秒后重置复制状态
    setTimeout(() => setCopied(false), 3000);
  };

  // 分享到社交媒体
  const shareToSocial = (platform) => {
    const link = getReferralLink();
    const text = '加入TraeToken，连接钱包即可获得2000个代币！使用我的推广链接注册，我们都能获得额外奖励！';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (!walletAddress) {
    return (
      <div style={{ padding: '2rem' }}>
        <Card>
          <Title level={3}>请先连接钱包</Title>
          <Paragraph>您需要先连接钱包才能访问推广功能。</Paragraph>
          <Button type="primary" onClick={() => window.location.href = '/'}>
            返回首页连接钱包
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={16}>
          <Card>
            <Title level={2}>推广赚取代币</Title>
            <Paragraph>
              分享您的专属推广链接，每当有新用户通过您的链接连接钱包，您将获得200个TraeToken奖励！
            </Paragraph>
            
            <Row gutter={16} style={{ marginBottom: '2rem' }}>
              <Col span={8}>
                <Statistic 
                  title="代币余额" 
                  value={tokenBalance} 
                  suffix="TraeToken" 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="推广码" 
                  value={referralCode} 
                  prefix={<ShareAltOutlined />} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="已推广人数" 
                  value={referralCount} 
                  prefix={<UserAddOutlined />} 
                />
              </Col>
            </Row>
            
            <Card title="您的专属推广链接" style={{ marginBottom: '1rem' }}>
              <Input.Group compact>
                <Input 
                  style={{ width: 'calc(100% - 200px)' }} 
                  value={getReferralLink()} 
                  readOnly 
                />
                <Button 
                  type="primary" 
                  icon={<CopyOutlined />} 
                  onClick={copyReferralLink}
                  style={{ width: '200px' }}
                >
                  {copied ? '已复制' : '复制推广链接'}
                </Button>
              </Input.Group>
            </Card>
            
            <Title level={4}>分享到社交媒体</Title>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#1DA1F2' }}
                onClick={() => shareToSocial('twitter')}
              >
                分享到Twitter
              </Button>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#4267B2' }}
                onClick={() => shareToSocial('facebook')}
              >
                分享到Facebook
              </Button>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#0088cc' }}
                onClick={() => shareToSocial('telegram')}
              >
                分享到Telegram
              </Button>
            </div>
            
            <Card style={{ marginTop: '2rem', backgroundColor: '#f9f0ff' }}>
              <Title level={4}>推广技巧</Title>
              <ul>
                <li>在社交媒体上分享您的推广链接</li>
                <li>向对加密货币感兴趣的朋友介绍</li>
                <li>在相关论坛和社区中分享</li>
                <li>创建教程视频，展示如何获取代币</li>
              </ul>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Referral;