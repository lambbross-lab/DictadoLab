import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenTool, User, LogOut, History, LayoutGrid, CreditCard, FlaskConical, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPro, user, profile, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
                <PenTool size={20} />
              </div>
              <span className="font-heading font-bold text-xl text-brand">DictadoLab</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link to="/generador" className={`flex items-center gap-2 transition-colors ${location.pathname === '/generador' ? 'text-brand' : 'hover:text-brand'}`}>
              <LayoutGrid size={18} />
              Crear dictado
            </Link>
            <Link 
              to={isPro ? "/historial" : "/generador"} 
              onClick={(e) => {
                if (!isPro) {
                  e.preventDefault();
                  navigate('/generador', { state: { openUpgrade: true } });
                }
              }}
              className={`flex items-center gap-2 transition-colors ${location.pathname === '/historial' ? 'text-brand' : 'hover:text-brand'}`}
            >
              <History size={18} />
              Historial
              {!isPro && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                  <Lock size={10} />
                  Pro
                </span>
              )}
            </Link>
            {!user && (
              <button 
                onClick={() => scrollToSection('planes')}
                className="flex items-center gap-2 hover:text-brand transition-colors"
              >
                <CreditCard size={18} />
                Planes
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <Link 
                to="/cuenta"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <User size={14} />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                  {user.email?.split('@')[0]}
                </span>
              </Link>
            )}
            <button 
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
