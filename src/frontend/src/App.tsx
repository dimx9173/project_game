import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Machines } from './pages/machines/Machines';
import { Players } from './pages/players/Players';
import { Transactions } from './pages/transactions/Transactions';
import { Games } from './pages/games/Games';
import { Providers } from './pages/providers/Providers';
import { Agents } from './pages/agents/Agents';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>載入中...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/machines" element={<Machines />} />
              <Route path="/players" element={<Players />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/games" element={<Games />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/agents" element={<Agents />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
