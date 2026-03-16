import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenTool, FlaskConical, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPro, user, signOut } = useAuth();

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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e6e6e6] shadow-sm">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white">
              <PenTool size={20} />
            </div>
            <span className="font-heading font-bold text-xl text-brand">DictadoLab</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex space-x-6 text-sm font-medium">
              <button onClick={() => scrollToSection('como-funciona')} className="hover:text-brand transition-colors">Cómo funciona</button>
              <button onClick={() => scrollToSection('ejemplo')} className="hover:text-brand transition-colors">Ejemplo</button>
              <button onClick={() => scrollToSection('planes')} className="hover:text-brand transition-colors">Planes</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/cuenta"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <User size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                    {user.email?.split('@')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/auth"
                  state={{ backgroundLocation: location }}
                  className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
