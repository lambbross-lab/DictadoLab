import React from 'react';
import LegalLayout from '../../components/LegalLayout';

export default function Terminos() {
  return (
    <LegalLayout title="Términos de Uso">
      <section className="space-y-6">
        <p>
          Bienvenido a DictadoLab. Al utilizar nuestro servicio, usted acepta cumplir con los siguientes términos y condiciones de uso.
        </p>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Descripción del servicio</h2>
          <p>
            DictadoLab es una plataforma de software como servicio (SaaS) que proporciona herramientas de generación de dictados y material educativo mediante inteligencia artificial para docentes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Condiciones de uso</h2>
          <p>
            El usuario se compromete a utilizar el servicio de forma lícita y ética. El acceso a las funciones avanzadas del servicio requiere una suscripción activa y el pago de las tarifas correspondientes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Prohibición de uso indebido</h2>
          <p>Queda estrictamente prohibido:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Intentar acceder a cuentas de otros usuarios sin autorización.</li>
            <li>Utilizar el servicio de forma automatizada (bots, scrapers) sin permiso previo.</li>
            <li>Realizar cualquier acción que pueda comprometer la seguridad o integridad de la plataforma.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Limitación de responsabilidad</h2>
          <p>
            DictadoLab no garantiza que el servicio sea ininterrumpido o libre de errores. El contenido generado por la IA es una sugerencia y debe ser validado por el docente antes de su uso. DictadoLab no se responsabiliza de los resultados académicos derivados del uso de la herramienta.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
