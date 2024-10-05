import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import io from 'socket.io-client';
import Login from './components/Login';
import PostList from './components/PostList';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import ErrorMessage from './components/ErrorMessage';
import BottomNavigation from './components/BottomNavigation';
import CreatePost from './components/CreatePost';
import Chat from './components/Chat';
import FollowList from './components/FollowList';
import FollowingPosts from './components/FollowingPosts';
import Notifications from './components/Notifications';
import AvatarFrameShop from './components/AvatarFrameShop';
import './styles/responsive.css';
import Advertisement from './components/Advertisement';
import ErrorBoundary from './components/ErrorBoundary';
import AuthSuccess from './components/AuthSuccess';
import AnnouncementModal from './components/AnnouncementModal';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme();

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [locale, setLocale] = useState('en');
  const [showAd, setShowAd] = useState(true);
  const [userIsPremium, setUserIsPremium] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      checkUserStatus();
    }
  }, [token]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await axios.get('/api/csrf-token');
      axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:5000');
      newSocket.emit('authenticate', token);
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        // 处理新通知，例如更新通知列表或显示通知提示
        console.log('New notification:', notification);
        // 这里可以调用一个函数来更新通知状态
        // updateNotifications(notification);
      });
    }
  }, [socket]);

  const checkUserStatus = async () => {
    try {
      const res = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': token }
      });
      setIsAdmin(['admin', 'super'].includes(res.data.role));
      setUserRole(res.data.role);
      setUserIsPremium(res.data.membershipLevel !== 'basic');
    } catch (err) {
      setError(err.response?.data?.msg || '获取用户信息失败');
      handleLogout();
    }
  };

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
    setUserRole('user');
    setCurrentPage('home');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <PostList setError={setError} />;
      case 'followingPosts':
        return <FollowingPosts token={token} setError={setError} />;
      case 'createPost':
        return <CreatePost 
          token={token} 
          onPostCreated={() => {
            setCurrentPage('home');
            // 可以在这里添加一个函数来刷新帖子列表
          }} 
          setError={setError} 
        />;
      case 'chat':
        return <Chat token={token} setError={setError} />;
      case 'profile':
        return <Profile token={token} setToken={handleSetToken} setError={setError} setCurrentPage={setCurrentPage} />;
      case 'admin':
        return isAdmin ? <AdminPanel token={token} setError={setError} userRole={userRole} /> : null;
      case 'following':
        return <FollowList token={token} setError={setError} type="following" />;
      case 'followers':
        return <FollowList token={token} setError={setError} type="followers" />;
      case 'notifications':
        return <Notifications token={token} setError={setError} />;
      case 'avatarFrameShop':
        return <AvatarFrameShop token={token} setError={setError} />;
      default:
        return <PostList setError={setError} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AnnouncementModal />
        <ErrorBoundary>
          <div className="App" style={{ paddingBottom: '60px' }}>
            <h1>社区软件</h1>
            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
            {token && (
              <>
                <button onClick={handleLogout}>登出</button>
                {isAdmin && (
                  <button onClick={() => setCurrentPage('admin')}>
                    管理员面板
                  </button>
                )}
              </>
            )}
            {renderContent()}
            {token && <BottomNavigation setCurrentPage={setCurrentPage} />}
            <IntlProvider messages={messages[locale]} locale={locale}>
              <button onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}>
                切换语言
              </button>
            </IntlProvider>
            {showAd && <Advertisement onClose={() => setShowAd(false)} userIsPremium={userIsPremium} />}
          </div>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

const messages = {
  'en': en,
  'zh': zh
};

export default App;