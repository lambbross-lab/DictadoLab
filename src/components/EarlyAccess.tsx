import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('early_access').insert({ email });

    if (error) {
      if (error.message.toLowerCase().includes('duplicate')) {
        setError('Ese correo ya está apuntado.');
      } else {
        setError('No se pudo guardar el correo.');
      }
      setLoading(false);
      return;
    }

    setDone(true);
    setEmail('');
    setLoading(false);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        Gracias. Te avisaremos cuando DictadoLab Pro esté disponible.
      </div>
    );
  }

  return (
    <form onSubmit={handleJoin} className="space-y-3">
      <input
        type="email"
        required
        placeholder="Tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Quiero acceso a Pro'}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}