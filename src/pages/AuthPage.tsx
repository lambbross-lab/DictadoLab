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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
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
        alert('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
        setIsResettingPassword(false);
        setIsLogin(true);
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        setResetSent(true);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setShowSuccess(true);
      }
    } catch (err: any) {
      let message = err.message || 'Ocurrió un error inesperado';

      if (
        message.includes('Invalid login credentials') ||
        message.toLowerCase().includes('invalid user') ||
        message.toLowerCase().includes('invalid password')
      ) {
        message = 'Correo o contraseña incorrectos.';
      } else if (
        message.includes('Email not confirmed') ||
        message.includes('Email not verified')
      ) {
        message = 'Tu cuenta aún no está verificada. Revisa tu correo electrónico y activa tu cuenta antes de iniciar sesión.';
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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <div className="bg-brand p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <PenTool size={32} />
          </div>

          <h1 className="text-2xl font-heading font-bold">DictadoLab</h1>

          <p className="text-white/70 text-sm mt-1">
            {isResettingPassword
              ? 'Establecer nueva contraseña'
              : isForgotPassword
                ? 'Recuperar contraseña'
                : isLogin
                  ? 'Bienvenido de nuevo'
                  : 'Crea tu cuenta gratuita'}
          </p>
        </div>

        <div className="p-8">
          {resetSent ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Correo enviado</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu correo electrónico.
                </p>
              </div>
              <button
                onClick={() => {
                  setResetSent(false);
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
                className="w-full py-4 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : showSuccess ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Cuenta creada correctamente</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Antes de iniciar sesión debes verificar tu correo electrónico.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed text-left border border-slate-100">
                <p className="mb-2">
                  Te hemos enviado un enlace de verificación. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                <p className="text-xs text-slate-400">Si no encuentras el correo revisa la carpeta de spam.</p>
              </div>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsLogin(true);
                }}
                className="w-full py-4 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md"
              >
                Iniciar sesión
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p>{error}</p>
                </div>
              )}

              {!isForgotPassword && !isResettingPassword && (
                <>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full py-3 mb-6 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar con Google
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-xs text-slate-400">o</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>
                </>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isResettingPassword && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Correo electrónico
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-700"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                )}

                {!isForgotPassword && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {isResettingPassword ? 'Nueva contraseña' : 'Contraseña'}
                      </label>

                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setIsLogin(false);
                            setError(null);
                          }}
                          className="text-xs font-bold text-brand hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-700"
                        placeholder="••••••••"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : isResettingPassword ? (
                    'Actualizar contraseña'
                  ) : isForgotPassword ? (
                    'Enviar enlace de recuperación'
                  ) : isLogin ? (
                    'Iniciar sesión'
                  ) : (
                    'Registrarse'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                  {isForgotPassword || isResettingPassword ? (
                    <button
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsResettingPassword(false);
                        setIsLogin(true);
                        setError(null);
                      }}
                      className="text-brand font-bold hover:underline"
                    >
                      Volver al inicio de sesión
                    </button>
                  ) : (
                    <>
                      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-brand font-bold hover:underline"
                      >
                        {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}