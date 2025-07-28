import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Row, Col, Statistic, message } from 'antd';
import { WalletOutlined, ShareAltOutlined, GiftOutlined } from '@ant-design/icons';
import { useUser } from '../context/UserContext';
import { useWallet } from '../hooks/useWallet';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  const { 
    walletAddress, 
    isConnected, 
    tokenBalance, 
    referralCount,
    fetchUserData,
    processReferral 
  } = useUser();
  const { connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

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
        message.success('钱包连接成功！');
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      message.error('连接钱包失败');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={16}>
          <Card>
            <Title level={2}>TraeToken - 未来的数字资产</Title>
            <Paragraph>
              TraeToken是一种创新的数字代币，旨在为用户提供更多的价值和机会。通过我们的推广计划，您可以轻松获得更多代币奖励。
            </Paragraph>
            
            <Title level={3}>代币特点</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <GiftOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
                  <Title level={4}>免费获取</Title>
                  <Paragraph>连接您的EVM钱包，立即获得2000个TraeToken</Paragraph>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <ShareAltOutlined style={{ fontSize: '2rem', color: '#52c41a' }} />
                  <Title level={4}>推广奖励</Title>
                  <Paragraph>每推广一位新用户，获得200个TraeToken奖励</Paragraph>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <WalletOutlined style={{ fontSize: '2rem', color: '#fa8c16' }} />
                  <Title level={4}>价值增长</Title>
                  <Paragraph>随着用户增加，代币价值将持续增长</Paragraph>
                </Card>
              </Col>
            </Row>
            
            {!isConnected ? (
              <Button 
                type="primary" 
                size="large" 
                icon={<WalletOutlined />} 
                onClick={handleConnectWallet}
                loading={isConnecting}
                style={{ marginTop: '2rem' }}
              >
                连接钱包获取2000个代币
              </Button>
            ) : (
              <Card style={{ marginTop: '2rem', backgroundColor: '#f6ffed' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic 
                      title="钱包地址" 
                      value={`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`} 
                      prefix={<WalletOutlined />} 
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="代币余额" 
                      value={tokenBalance} 
                      suffix="TraeToken" 
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="已推广人数" 
                      value={referralCount} 
                      prefix={<ShareAltOutlined />} 
                    />
                  </Col>
                </Row>
                <Button 
                  type="primary" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => navigate('/referral')}
                >
                  获取我的推广链接
                </Button>
              </Card>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;