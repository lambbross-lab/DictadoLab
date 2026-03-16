import React from 'react';
import LegalLayout from '../../components/LegalLayout';

export default function AvisoLegal() {
  return (
    <LegalLayout title="Aviso Legal">
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Nombre del servicio</h2>
          <p>DictadoLab</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Descripción</h2>
          <p>
            DictadoLab es una herramienta digital diseñada específicamente para docentes. Nuestra plataforma genera dictados y material educativo personalizado mediante el uso de inteligencia artificial, facilitando la labor pedagógica en el aula.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Uso del sitio</h2>
          <p>
            Al acceder y utilizar DictadoLab, el usuario acepta de forma expresa utilizar la plataforma de manera responsable, ética y conforme a la legalidad vigente. Queda prohibido cualquier uso que pueda dañar, inutilizar o sobrecargar el servicio.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Propiedad intelectual</h2>
          <p>
            Todos los contenidos, el diseño visual, los logotipos, el código fuente y el software que componen DictadoLab están protegidos por derechos de autor y otras leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización previa.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Limitación de responsabilidad</h2>
          <p className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-900 italic">
            DictadoLab genera contenido automáticamente mediante modelos de lenguaje. El docente es el único responsable de revisar, validar y adaptar el material generado antes de su utilización efectiva en el aula con alumnos. DictadoLab no se hace responsable de posibles errores ortográficos o gramaticales en los textos generados.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
