import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, CreditCard, BarChart3, Calendar, ArrowRight, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AccountPage() {
  const { user, profile, isPro } = useAuth();
  const navigate = useNavigate();

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400 font-medium">Cargando datos de la cuenta...</div>
      </div>
    );
  }

  const LIMIT = 10;
  const usageCount = profile.dictados_usados || 0;
  const usagePercentage = Math.min((usageCount / LIMIT) * 100, 100);

  // Renewal date based on subscription/account start date
const subscriptionStartDate = profile.created_at
  ? new Date(profile.created_at)
  : new Date(user.created_at);

const renewalDate = new Date(subscriptionStartDate);
renewalDate.setFullYear(subscriptionStartDate.getFullYear() + 1);

const formattedRenewalDate = renewalDate.toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link 
          to="/generador" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold transition-colors mb-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver al generador
        </Link>

        <header>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Mi cuenta</h1>
          <p className="text-slate-500 mt-1 text-sm">Gestiona tu información personal y suscripción.</p>
        </header>

        <div className="grid gap-6">
          {/* SECCIÓN 1 — Usuario */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Usuario</h2>
            </div>
            <div className="pl-14">
              <p className="text-lg font-semibold text-slate-900">{user.email}</p>
              <p className="text-sm text-slate-500">Identificador: {user.id.substring(0, 8)}...</p>
            </div>
          </section>

          {/* SECCIÓN 2 — Plan */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center text-brand">
                <CreditCard size={20} />
              </div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Plan</h2>
            </div>
            <div className="pl-14">
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-slate-900">
                  {isPro ? 'Plan Pro docente' : 'Plan gratuito'}
                </p>
                {isPro && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {isPro 
                  ? 'Acceso ilimitado a todas las funciones de DictadoLab.' 
                  : 'Funciones básicas con límite de generación mensual.'}
              </p>
            </div>
          </section>

          {/* SECCIÓN 3 — Uso (Solo si es Free) */}
          {!isPro && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Uso</h2>
              </div>
              <div className="pl-14 space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-lg font-semibold text-slate-900">
                    {usageCount} de {LIMIT} dictados usados este mes
                  </p>
                  <span className="text-xs font-bold text-slate-400">
                    {Math.round(usagePercentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      usageCount >= LIMIT ? 'bg-red-500' : usageCount >= 8 ? 'bg-orange-500' : 'bg-brand'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 italic">
                  El contador se reinicia automáticamente el primer día de cada mes.
                </p>
              </div>
            </section>
          )}

          {/* SECCIÓN 4 — Suscripción */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <Calendar size={20} />
              </div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Suscripción</h2>
            </div>
            <div className="pl-14">
              {isPro ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-slate-700">Próxima renovación</p>
                    <p className="text-lg font-semibold text-slate-900">{formattedRenewalDate}</p>
                    <p className="text-xs text-slate-500 mt-1">Se cargará automáticamente a tu método de pago.</p>
                  </div>
                  <button className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-600 transition-colors group">
                    <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                    Cancelar suscripción
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Desbloquea dictados ilimitados, exportación a PDF, historial completo y más.
                  </p>
                  <button 
                    onClick={() => navigate("/generador", { state: { openUpgrade: true } })}
                    className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-md group"
                  >
                    Pasar a Pro
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="text-center pt-8">
          <p className="text-xs text-slate-400">
            ¿Necesitas ayuda con tu cuenta? <Link to="/soporte" className="text-brand hover:underline">Contacta con soporte</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
