import React, { useState, useEffect } from 'react';
import { Menu, Layout, Typography, Button, Drawer } from 'antd';
import { MenuOutlined, TranslationOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const { Header } = Layout;
const { Title } = Typography;

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { language, switchLanguage } = useLanguage();
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const menuItems = [
    { key: 'problem', label: 'The Problem', href: '#problem' },
    { key: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { key: 'tokenomics', label: 'Tokenomics', href: '#tokenomics' },
    { key: 'community', label: 'Community', href: '#community' },
  ];
  
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuVisible(false);
  };

  return (
    <>
      <Header 
        style={{ 
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem',
          background: isScrolled 
            ? 'rgba(15, 23, 42, 0.8)' 
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled 
            ? '1px solid rgba(56, 189, 248, 0.1)' 
            : 'none',
          transition: 'all 0.3s ease',
          height: '80px'
        }}
      >
        {/* Logo */}
        <Title 
          level={2} 
          style={{ 
            color: '#FFFFFF', 
            margin: 0, 
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.5rem'
          }}
        >
          VeriCred
        </Title>
        
        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {menuItems.map(item => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                style={{
                  color: '#E2E8F0',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.target.style.color = '#38BDF8'}
                onMouseLeave={(e) => e.target.style.color = '#E2E8F0'}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Switcher */}
            <Button
              icon={<TranslationOutlined />}
              onClick={switchLanguage}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                height: '36px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {language === 'zh-CN' ? '简中' : language === 'zh-TW' ? '繁中' : 'EN'}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          className="mobile-menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
          style={{
            color: '#FFFFFF',
            fontSize: '1.25rem',
            display: 'none'
          }}
        />
      </Header>
      
      {/* Mobile Drawer */}
      <Drawer
        title="VeriCred"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        style={{
          background: '#0F172A'
        }}
        styles={{
          header: {
            background: '#0F172A',
            borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
            color: '#FFFFFF'
          },
          body: {
            background: '#0F172A',
            padding: '2rem 1rem'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {menuItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.href);
              }}
              style={{
                color: '#E2E8F0',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {item.label}
            </a>
          ))}
          
          {/* Mobile Language Switcher */}
            <div style={{ marginBottom: '1rem' }}>
              <Button
                icon={<TranslationOutlined />}
                onClick={switchLanguage}
                block
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  height: '40px',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {language === 'zh-CN' ? '简中' : language === 'zh-TW' ? '繁中' : 'EN'}
              </Button>
            </div>
        </div>
      </Drawer>
      
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;