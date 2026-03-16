import React, { useState } from 'react';
import LegalLayout from '../../components/LegalLayout';

export default function Cookies() {
  const [accepted, setAccepted] = useState(false);

  return (
    <LegalLayout title="Política de Cookies">
      <section className="space-y-6">
        <p>
          DictadoLab utiliza cookies propias y de terceros para garantizar el correcto funcionamiento de la web y mejorar su experiencia de usuario.
        </p>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Finalidad de las cookies</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Funcionamiento de la web:</strong> Cookies esenciales para que pueda navegar y utilizar todas las funciones del sitio.</li>
            <li><strong>Análisis básico de uso:</strong> Recopilamos datos anónimos para entender cómo se utiliza DictadoLab y poder mejorarlo continuamente.</li>
          </ul>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Gestión de cookies</h2>
          <p className="text-sm text-slate-600 mb-6">
            Puede elegir aceptar o rechazar el uso de cookies no esenciales en este sitio web.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setAccepted(true)}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${accepted ? 'bg-emerald-500 text-white' : 'bg-brand text-white hover:brightness-110'}`}
            >
              {accepted ? 'Cookies aceptadas' : 'Aceptar todas las cookies'}
            </button>
            <button 
              onClick={() => setAccepted(false)}
              className="px-6 py-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
            >
              Rechazar cookies no esenciales
            </button>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
