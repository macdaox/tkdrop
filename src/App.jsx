import { BrowserRouter as Router } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import CombinedPage from './pages/CombinedPage';
import Footer from './components/Footer';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#38BDF8',
          colorBgBase: '#0F172A',
          colorTextBase: '#E2E8F0',
          colorBorder: 'rgba(56, 189, 248, 0.2)',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <LanguageProvider>
        <UserProvider>
          <Router>
            <Layout className="layout" style={{ minHeight: '100vh', background: '#0F172A' }}>
              <Content style={{ padding: '0' }}>
                <div className="site-layout-content">
                  <CombinedPage />
                </div>
              </Content>
              <Footer />
            </Layout>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ConfigProvider>
  )
}

export default App
