import { BrowserRouter as Routers, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/Layout';
import Middleware from './components/Middleware';

import Login from './pages/Login';

import Home from './pages/Home';
import Employees from './pages/Employees';
import Gates from './pages/Gates';
import TimeTrack from './pages/TimeTracking';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import Error from './pages/Error';

import robots from './utils/robots';

const routers = [
  {
    layout: true,
    authenticated: true,
    path: robots.home,
    component: <Home />
  },
  {
    layout: true,
    authenticated: true,
    path: robots.employees,
    component: <Employees />
  },
  {
    layout: true,
    authenticated: true,
    path: robots.gates,
    component: <Gates />
  },
  {
    layout: true,
    authenticated: true,
    path: robots.time_tracking,
    component: <TimeTrack />
  },
  {
    layout: true,
    authenticated: true,
    path: robots.profile,
    component: <Profile />
  },
  {
    layout: true,
    authenticated: true,
    path: robots.settings,
    component: <Settings />
  },
  {
    layout: false,
    authenticated: false,
    path: robots.login,
    component: <Login />
  },
  {
    layout: false,
    authenticated: true,
    path: robots.logout,
    component: <Logout />
  }
];

function App() {
  return (
    <AuthProvider>
      <Routers>
        <Routes>
          {routers.map((router, index) => (
            <Route key={index} path={router.path} element={
              <Middleware needAuthenticate={router.authenticated}>
                <Layout enabled={router.layout}>{router.component}</Layout>
              </Middleware>
            } />
          ))}
          <Route path="*" element={<Error />} />
        </Routes>
      </Routers>
    </AuthProvider>
  )
}

export default App
