import React from 'react';
import LegalLayout from '../../components/LegalLayout';

export default function Reembolsos() {
  return (
    <LegalLayout title="Política de Reembolsos">
      <section className="space-y-6">
        <p>
          En DictadoLab queremos que esté satisfecho con nuestro servicio. Esta política describe las condiciones de cancelación y reembolso de nuestras suscripciones.
        </p>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Cancelación de suscripciones</h2>
          <p>
            Las suscripciones a DictadoLab pueden cancelarse en cualquier momento a través del panel de usuario o enviando un correo a hola@dictadolab.com.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Efectos de la cancelación</h2>
          <p>
            La cancelación detiene futuras renovaciones automáticas de su suscripción. Usted seguirá teniendo acceso a las funciones premium de DictadoLab hasta el final del periodo de facturación actual.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Reembolsos</h2>
          <p className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 italic">
            La cancelación de la suscripción no implica la devolución automática de los pagos ya realizados por periodos de facturación en curso o pasados.
          </p>
          <p className="mt-4">
            En casos excepcionales, como errores técnicos graves o cargos duplicados, nuestro equipo de soporte evaluará la posibilidad de realizar un reembolso parcial o total.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Incidencias y soporte</h2>
          <p>
            Para cualquier incidencia relacionada con los pagos o su suscripción, por favor contacte con nuestro equipo de soporte en hola@dictadolab.com.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
