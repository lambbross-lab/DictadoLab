import React, { useEffect, useState } from 'react';
import { getCookieConsent, setCookieConsent } from '../lib/cookieConsent';

export default function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());

    const syncConsent = () => setConsent(getCookieConsent());
    window.addEventListener('cookie-consent-updated', syncConsent);

    return () => {
      window.removeEventListener('cookie-consent-updated', syncConsent);
    };
  }, []);

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[200] max-w-4xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-2xl p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-slate-900 font-bold text-base">Uso de cookies</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Utilizamos cookies técnicas necesarias para el funcionamiento de la web y, solo si lo aceptas,
            cookies de análisis para medir uso y mejorar DictadoLab.
          </p>
          <a
            href="/cookies"
            className="inline-block mt-2 text-sm font-semibold text-brand hover:underline"
          >
            Ver política de cookies
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:min-w-fit">
          <button
            onClick={() => setCookieConsent('rejected')}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
          >
            Rechazar
          </button>

          <button
            onClick={() => setCookieConsent('accepted')}
            className="px-4 py-3 rounded-xl bg-brand text-white font-semibold hover:brightness-110"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}