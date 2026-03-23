import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import EarlyAccess from '../components/EarlyAccess';
import { motion } from 'motion/react';
import { 
  Search, 
  BarChart3, 
  CheckCircle2, 
  RefreshCcw, 
  BookOpen,
  Settings2,
  Zap,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.state && (location.state as any).scrollTo) {
        const id = (location.state as any).scrollTo;
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, document.title);
      } 
      else if (location.hash) {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const timer = setTimeout(handleScroll, 100);
    return () => clearTimeout(timer);
  }, [location]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-in fade-in duration-700">

      {/* HERO */}
      <section id="hero" className="py-20 md:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

          <div className="space-y-8">
            <div className="space-y-4">

              <motion.h1
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                className="text-5xl font-bold text-brand"
              >
                Dictados listos para usar en clase
              </motion.h1>

              <motion.p
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1 }}
                className="text-xl text-slate-800 font-semibold"
              >
                Crea dictados por regla ortográfica en segundos.
              </motion.p>

              <motion.p
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.2 }}
                className="text-slate-600"
              >
                DictadoLab genera dictados claros y variados para trabajar ortografía sin perder tiempo preparando material.
              </motion.p>

            </div>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3 }}
              className="flex gap-4"
            >

              <Link
                to="/generador"
                className="bg-brand-accent text-white px-8 py-4 rounded-xl font-bold shadow-xl"
              >
                Crear dictado
              </Link>

              <a
                href="/ejemplo-dictado.pdf"
                download
                className="bg-white border border-slate-200 px-8 py-4 rounded-xl flex items-center gap-2 font-bold"
              >
                <FileText size={20} />
                Descargar ejemplo
              </a>

            </motion.div>

          </div>

          {/* MOCKUP */}

          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.4 }}
          >

            <div className="bg-white p-10 rounded-xl shadow border border-[#e6e6e6]">

              <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-xl">
                Regla B / V
              </span>

              <h3 className="text-2xl font-bold mt-4">El viejo barco</h3>

              <p className="mt-6 text-slate-700 italic">
                "El viejo barco avanzaba lentamente por la bahía..."
              </p>

            </div>

          </motion.div>

        </div>
      </section>


      {/* PLANES */}

      <section id="planes" className="py-20 bg-[#f3f5f4]">

        <div className="max-w-[1100px] mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold">Planes para docentes</h2>

            <p className="text-slate-600">
              Elige el plan que mejor se adapte a tu forma de trabajar.
            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">


            {/* PLAN FREE */}

            <div className="bg-white p-8 rounded-xl border shadow flex flex-col">

              <h3 className="text-xl font-bold mb-2">Plan Gratuito</h3>

              <p className="text-slate-500 mb-6">
                Para probar la herramienta.
              </p>

              <ul className="space-y-3 mb-8">

                {[
                  "10 dictados al mes",
                  "Todas las reglas ortográficas",
                  "Nivel de dificultad",
                  "Copiar dictado"
                ].map((feature,i)=>(
                  <li key={i} className="flex gap-2 text-slate-600">
                    <CheckCircle2 size={18}/>
                    {feature}
                  </li>
                ))}

              </ul>

              <Link
                to="/generador"
                className="border border-slate-200 py-4 rounded-xl text-center font-bold"
              >
                Empieza gratis
              </Link>

            </div>


            {/* PLAN PRO */}

            <div className="bg-white p-8 rounded-xl border-4 border-brand relative flex flex-col shadow">

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white px-6 py-1 rounded-xl text-[10px] font-bold uppercase">
                Próximamente
              </div>

              <h3 className="text-xl font-bold mb-2">
                Plan Pro Docente
              </h3>

              <p className="text-slate-500 mb-6">
                Para profesores que usan dictados habitualmente.
              </p>


              <div className="mb-6 p-6 bg-brand/5 rounded-xl text-center">

                <span className="text-[40px] font-black text-brand">
                  29€
                </span>

                <p className="text-slate-500">
                  al año
                </p>

              </div>


              <ul className="space-y-3 mb-8">

                {[
                  "Dictados ilimitados",
                  "5 dictados a la vez",
                  "Historial",
                  "Exportar PDF",
                  "Modo proyección",
                  "Adaptaciones PT y AL"
                ].map((feature,i)=>(
                  <li key={i} className="flex gap-2 font-semibold">
                    <CheckCircle2 size={18}/>
                    {feature}
                  </li>
                ))}

              </ul>


              <div className="mt-auto">

                <div className="bg-slate-50 border p-4 rounded-xl text-center mb-4">

                  <p className="font-bold">
                    Apúntate y te avisaremos cuando esté disponible
                  </p>

                </div>

                <EarlyAccess/>

              </div>

            </div>


          </div>

        </div>

      </section>


      {/* CTA FINAL */}

      <section className="py-20 bg-white">

        <div className="max-w-[1100px] mx-auto px-6">

          <div className="bg-brand text-white p-16 rounded-xl text-center">

            <h2 className="text-3xl font-bold mb-4">
              Empieza a crear dictados en minutos
            </h2>

            <p className="mb-8">
              Ahorra tiempo preparando material.
            </p>

            <Link
              to="/generador"
              className="bg-white text-brand px-10 py-4 rounded-xl font-bold"
            >
              Probar generador
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
