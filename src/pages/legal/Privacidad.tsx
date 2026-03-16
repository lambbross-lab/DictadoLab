import React from 'react';
import LegalLayout from '../../components/LegalLayout';

export default function Privacidad() {
  return (
    <LegalLayout title="Política de Privacidad">
      <section className="space-y-6">
        <p>
          En DictadoLab nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo tratamos la información personal recopilada a través de nuestro servicio.
        </p>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Datos que se recogen</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Email:</strong> Recopilamos su dirección de correo electrónico para la gestión de su cuenta y comunicaciones del servicio.</li>
            <li><strong>Uso del servicio:</strong> Recogemos datos técnicos anónimos sobre cómo interactúa con la plataforma para mejorar la experiencia de usuario.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Finalidad del tratamiento</h2>
          <p>Los datos recopilados se utilizan exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Gestionar y mantener su cuenta de usuario.</li>
            <li>Proporcionar soporte técnico y atención al cliente.</li>
            <li>Analizar el uso de la herramienta para implementar mejoras y nuevas funcionalidades.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Derechos del usuario</h2>
          <p>Usted tiene derecho en cualquier momento a:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Acceso:</strong> Saber qué datos tenemos sobre usted.</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos.</li>
            <li><strong>Eliminación:</strong> Solicitar el borrado total de sus datos de nuestros sistemas.</li>
          </ul>
          <p className="mt-4">
            Para ejercer estos derechos, puede ponerse en contacto con nosotros a través de hola@dictadolab.com.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
