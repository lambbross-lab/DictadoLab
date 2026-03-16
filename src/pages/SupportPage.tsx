import React from 'react';
import LegalLayout from '../components/LegalLayout';
import { Mail, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <LegalLayout title="Soporte">
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-lg">
            Si tienes algún problema con DictadoLab o necesitas ayuda, puedes escribirnos a:
          </p>
          
          <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-xl border border-brand/10 w-fit">
            <Mail className="text-brand" size={24} />
            <a 
              href="mailto:soporte@dictadolab.com" 
              className="text-xl font-bold text-brand hover:underline"
            >
              soporte@dictadolab.com
            </a>
          </div>
          
          <p className="text-slate-500 italic">
            Intentamos responder en menos de 48 horas.
          </p>
        </section>

        <section className="pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="text-slate-400" size={20} />
            <h2 className="text-xl font-bold text-slate-900 m-0">Problemas comunes</h2>
          </div>
          <ul className="space-y-2 list-none p-0">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
              No recibo el email de verificación
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
              No puedo generar dictados
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
              Problemas con el plan Pro
            </li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
