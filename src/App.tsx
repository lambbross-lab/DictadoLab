import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import AvisoLegal from './pages/legal/AvisoLegal';
import Privacidad from './pages/legal/Privacidad';
import Cookies from './pages/legal/Cookies';
import Terminos from './pages/legal/Terminos';
import Reembolsos from './pages/legal/Reembolsos';
import SupportPage from './pages/SupportPage';
import AccountPage from './pages/AccountPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import ScrollToTop from './components/ScrollToTop';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="animate-spin text-brand" size={48} />
      </div>
    );
  }

  if (!user) {
    if (window.location.pathname === '/auth') {
      return null;
    }
    return <Navigate to="/auth" state={{ from: location, backgroundLocation: location }} replace />;
  }

  return <>{children}</>;
}

function Layout() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const currentLocation = state?.backgroundLocation || location;
  
  const isApp = currentLocation.pathname.startsWith('/generador') || currentLocation.pathname.startsWith('/historial');
  const isAuth = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      {isApp ? <AppHeader /> : <Header />}
      <main className="flex-grow">
        <Routes location={currentLocation}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/generador" element={<GeneratorPage />} />
          <Route 
            path="/historial" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/reembolsos" element={<Reembolsos />} />
          <Route path="/soporte" element={<SupportPage />} />
          <Route 
            path="/cuenta" 
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } 
          />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        )}
      </main>
      {!isApp && <Footer />}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}
