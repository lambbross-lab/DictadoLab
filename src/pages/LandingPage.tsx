import React, { useEffect, useState } from 'react';
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
      // Check for state-based scroll first (from internal navigation)
      if (location.state && (location.state as any).scrollTo) {
        const id = (location.state as any).scrollTo;
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title);
      } 
      // Then check for hash-based scroll (from URL)
      else if (location.hash) {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(handleScroll, 100);
    return () => clearTimeout(timer);
  }, [location]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* 1. HERO */}
      <section id="hero" className="py-20 md:py-32 overflow-hidden scroll-mt-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-brand leading-tight tracking-tight"
              >
                Dictados listos para usar en clase.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-800 font-semibold leading-relaxed max-w-2xl"
              >
                Crea dictados por regla ortográfica y nivel de dificultad en segundos.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-slate-600 max-w-lg leading-relaxed"
              >
                DictadoLab genera dictados claros y variados para trabajar la ortografía sin perder tiempo preparando material.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/generador"
                  className="bg-brand-accent text-white px-8 py-4 rounded-xl text-center font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-brand-accent/20"
                >
                  Crear dictado
                </Link>
                <a 
                  href="/ejemplo-dictado.pdf"
                  download="ejemplo-dictado.pdf"
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-center font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={20} className="text-brand" />
                  Descargar ejemplo de dictado
                </a>
              </div>
              <p className="text-sm text-slate-400 font-medium pl-1">
                Pensado para docentes que quieren ahorrar tiempo preparando material de ortografía.
              </p>
            </motion.div>
          </div>
          
          {/* Mockup Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white p-10 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-[#e6e6e6] transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-xl">Regla B / V</span>
                  <h3 className="text-2xl font-heading font-bold mt-3">El viejo barco</h3>
                </div>
                <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl">Nivel: Medio</span>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-slate-700 leading-relaxed italic border-l-4 border-brand/20 pl-6 py-2">
                  "El viejo barco avanzaba lentamente por la bahía. Bruno observaba las olas mientras el viento movía las velas..."
                </p>
                <div className="pt-6 border-t border-dashed border-[#e6e6e6]">
                  <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Enfoque pedagógico</p>
                  <p className="text-base text-slate-600 font-medium">Palabras clave: barco, bahía, observaba, viento, velas.</p>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-full h-full bg-brand/5 rounded-xl"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. CARACTERÍSTICAS (PROBLEMA) */}
      <section id="caracteristicas" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-3xl font-heading font-bold text-slate-900">Preparar dictados lleva tiempo</h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Sabemos que la labor docente es exigente. Crear material útil, variado y ajustado al nivel del alumnado requiere tiempo que muchas veces no sobra.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Search, title: "Buscar ejemplos adecuados", desc: "Localizar textos que apliquen exactamente la regla que estás enseñando no es fácil." },
              { icon: BarChart3, title: "Ajustar dificultad", desc: "Adaptar el vocabulario y la estructura según la edad de tus alumnos requiere esfuerzo." },
              { icon: RefreshCcw, title: "Crear variedad", desc: "Evitar repetir los mismos textos año tras año para mantener el interés de la clase." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-[#e6e6e6] text-center space-y-4">
                <div className="w-14 h-14 bg-brand/10 text-brand rounded-xl flex items-center justify-center mx-auto transform rotate-3">
                  <item.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <span className="bg-brand text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-brand/20">
              DictadoLab lo resuelve en segundos.
            </span>
          </div>
        </div>
      </section>

      {/* 3. CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: BookOpen, title: "Elige la regla", desc: "Selecciona entre decenas de reglas ortográficas: tildes, uso de la H, G/J, B/V, etc." },
              { step: "02", icon: Settings2, title: "Selecciona dificultad y adaptaciones", desc: "Ajusta el nivel según el grado escolar o el conocimiento de tus alumnos y genera versiones adaptadas para alumnado PT o AL." },
              { step: "03", icon: Zap, title: "Genera el dictado", desc: "Obtén un texto original al instante, listo para copiar, imprimir o guardar en PDF." }
            ].map((item, idx) => (
              <div key={idx} className="relative group h-full">
                <div className="bg-slate-50 p-8 rounded-xl border border-[#e6e6e6] h-full min-h-[280px] transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] group-hover:-translate-y-1">
                  <span className="text-3xl font-black text-brand/10 mb-4 block leading-none">{item.step}</span>
                  <div className="mb-4 text-brand">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EJEMPLO DE DICTADOS */}
      <section id="ejemplo" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-6 text-slate-900">Ejemplos de dictados</h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Descubre la calidad y variedad de los textos que puedes generar para tus clases.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                regla: "b / v",
                nivel: "medio",
                texto: "El viejo barco avanzaba lentamente por la bahía. Bruno observaba las olas mientras el viento movía las velas..."
              },
              {
                regla: "g / j",
                nivel: "fácil",
                texto: "Jorge jugaba en el jardín mientras su hermana recogía hojas del suelo..."
              },
              {
                regla: "ll / y",
                nivel: "medio",
                texto: "La lluvia cayó durante toda la mañana sobre el valle. Al salir del colegio vimos cómo el arroyo bajaba lleno de agua..."
              }
            ].map((ejemplo, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl border border-[#e6e6e6] shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:brightness-95 transition-all flex flex-col h-full"
              >
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand/10 text-brand px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    Regla: {ejemplo.regla}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    Nivel: {ejemplo.nivel}
                  </span>
                </div>
                <p className="text-[15px] text-slate-700 leading-relaxed italic flex-grow font-medium">
                  "{ejemplo.texto}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PLANES */}
      <section id="planes" className="py-20 bg-[#f3f5f4] scroll-mt-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4 text-slate-900">Planes para Docentes</h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">Elige el plan que mejor se adapta a tu forma de trabajar en clase.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto items-stretch">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl border border-[#e6e6e6] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col h-full hover:border-brand/30 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Plan Gratuito</h3>
                <p className="text-slate-500 text-sm">Para probar la herramienta sin compromiso.</p>
              </div>
              <div className="mb-8 flex-grow">
                <ul className="space-y-3">
                  {[
                    "10 dictados al mes",
                    "Acceso a todas las reglas ortográficas",
                    "Selección de nivel de dificultad",
                    "Selección de tipo de texto",
                    "Copiar el dictado directamente",
                    "Sin tarjeta, solo email para acceder"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-[15px]">
                      <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                to="/generador"
                className="w-full py-4 px-6 rounded-xl border-2 border-[#e6e6e6] font-bold text-slate-700 hover:bg-slate-50 transition-all text-center text-base"
              >
                Empieza gratis
              </Link>
            </div>

            {/* Pro Plan */}
<div className="bg-white p-8 rounded-xl border-4 border-brand relative flex flex-col h-full shadow-[0_6px_20px_rgba(0,0,0,0.06)] z-10">
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white px-6 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap">
    Próximamente
  </div>

  <div className="mb-6">
    <h3 className="text-xl font-bold mb-2 text-slate-900">Plan Pro Docente</h3>
    <p className="text-slate-500 text-sm">Para profesores que usan dictados habitualmente.</p>
  </div>
  
  <div className="mb-6 p-6 bg-brand/5 rounded-xl border border-brand/10 text-center">
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-baseline gap-1">
        <span className="text-[40px] font-black text-brand tracking-tighter">29 €</span>
        <span className="text-slate-500 font-bold text-lg">/ año</span>
      </div>
      <p className="text-brand font-bold text-sm mt-1">
        equivalente a unos 2,4 € al mes
      </p>
    </div>
  </div>

  <div className="mb-8 flex-grow">
    <ul className="space-y-3">
      {[
        "Dictados ilimitados",
        "Generar hasta 5 dictados en una sola vez",
        "Historial de dictados",
        "Exportar a PDF",
        "Hoja de dictado para el alumnado",
        "Modo dictado para proyectar en clase",
        "Adaptaciones automáticas para alumnado PT y AL"
      ].map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-800 text-[15px] font-semibold">
          <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>
  </div>

  <div className="mt-auto space-y-4">
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
      <p className="text-sm font-bold text-slate-800">
        Apúntate y te avisaremos cuando activemos DictadoLab Pro.
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Sin compromiso. Solo te avisaremos cuando esté disponible.
      </p>
    </div>

    <EarlyAccess />
  </div>
</div>

          <div className="mt-16 max-w-2xl mx-auto text-center">
            <p className="text-slate-500 italic text-base leading-relaxed border-t border-slate-200 pt-8">
              "Preparar dictados de calidad puede llevar mucho tiempo. DictadoLab los genera en segundos para que puedas centrarte en enseñar."
            </p>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="bg-brand text-white p-10 md:p-16 rounded-xl text-center space-y-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-heading font-bold">Empieza a crear dictados en minutos</h2>
              <p className="text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                Ahorra tiempo, genera materiales útiles y lleva al aula dictados listos para usar.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/generador"
                className="bg-white text-brand px-10 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all shadow-xl"
              >
                Probar generador
              </Link>
              <button 
                onClick={() => scrollToSection('planes')}
                className="bg-brand-accent text-white px-10 py-4 rounded-xl font-bold text-base hover:brightness-110 transition-all border border-white/20"
              >
                Ver planes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}