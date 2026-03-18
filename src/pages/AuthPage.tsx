import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, AlertCircle, PenTool, Eye, EyeOff, X } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleClose = () => {
    if (location.state?.from) {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate(from, { replace: true });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {

      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
        setIsLogin(false);
        setIsForgotPassword(false);
      }

      if (event === 'SIGNED_IN') {
        navigate(from, { replace: true });
      }

    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account'
          },
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar sesión con Google.');
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      if (isResettingPassword) {

        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        alert('Contraseña actualizada correctamente.');
        setIsResettingPassword(false);
        setIsLogin(true);

      } else if (isForgotPassword) {

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) throw error;
        setResetSent(true);

      } else if (isLogin) {

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        navigate(from, { replace: true });

      } else {

        const { error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setShowSuccess(true);

      }

    } catch (err: any) {

      let message = err.message || 'Error inesperado';

      if (message.includes('Invalid login credentials')) {
        message = 'Correo o contraseña incorrectos.';
      }

      if (message.includes('Email not confirmed')) {
        message = 'Debes verificar tu correo antes de iniciar sesión.';
      }

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
    >

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <div className="bg-brand p-8 text-white text-center">

          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PenTool size={32} />
          </div>

          <h1 className="text-2xl font-bold">DictadoLab</h1>

          <p className="text-white/70 text-sm mt-1">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratuita'}
          </p>

        </div>

        <div className="p-8">

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          {!isForgotPassword && !isResettingPassword && (
            <>
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full py-3 mb-6 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-3"
              >

                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />

                {isLogin
                  ? 'Iniciar sesión con Google'
                  : 'Crear cuenta con Google'
                }

              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 uppercase">
                  o continuar con email
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </>
          )}

          <form onSubmit={handleAuth} className="space-y-4">

            <div>

              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Correo electrónico
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="tu@email.com"
                />

              </div>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Contraseña
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading
                ? <Loader2 className="animate-spin" size={20}/>
                : isLogin
                  ? 'Iniciar sesión'
                  : 'Registrarse'
              }
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">

            <p className="text-slate-500 text-sm">

              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-brand font-bold hover:underline"
              >
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>

            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
}