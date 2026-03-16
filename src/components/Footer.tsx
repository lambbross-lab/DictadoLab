import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenTool } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-6 mt-20">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Columna Marca */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white">
              <PenTool size={20} />
            </div>
            <span className="font-heading font-bold text-xl text-white">DictadoLab</span>
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Herramienta para docentes que crea dictados por regla ortográfica y nivel de dificultad.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diseñado para ahorrar tiempo y generar material listo para usar en clase.
            </p>
          </div>
        </div>

        {/* Columna Producto */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Producto</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/generador" className="hover:text-brand transition-colors">Generador</Link></li>
            <li><button onClick={() => scrollToSection('como-funciona')} className="hover:text-brand transition-colors">Cómo funciona</button></li>
            <li><button onClick={() => scrollToSection('caracteristicas')} className="hover:text-brand transition-colors">Características</button></li>
            <li><button onClick={() => scrollToSection('ejemplo')} className="hover:text-brand transition-colors">Ejemplo</button></li>
            <li><button onClick={() => scrollToSection('planes')} className="hover:text-brand transition-colors">Planes</button></li>
          </ul>
        </div>

        {/* Columna Legal */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/aviso-legal" className="hover:text-brand transition-colors">Aviso legal</Link></li>
            <li><Link to="/privacidad" className="hover:text-brand transition-colors">Política de privacidad</Link></li>
            <li><Link to="/cookies" className="hover:text-brand transition-colors">Política de cookies</Link></li>
            <li><Link to="/terminos" className="hover:text-brand transition-colors">Términos de uso</Link></li>
            <li><Link to="/reembolsos" className="hover:text-brand transition-colors">Política de reembolsos</Link></li>
          </ul>
        </div>

        {/* Columna Contacto */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-slate-500">Email:</span>
              <a href="mailto:franlambbros@gmail.com" className="text-slate-300 hover:text-brand transition-colors">franlambbros@gmail.com</a>
            </li>
            <li><Link to="/soporte" className="hover:text-brand transition-colors">Soporte</Link></li>
            <li className="pt-4 flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-16 pt-8 border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-xs text-slate-500 space-y-2">
            <p>© 2026 DictadoLab. Todos los derechos reservados.</p>
            <p>El contenido generado por la herramienta debe ser revisado por el docente antes de su uso en el aula.</p>
          </div>
          <div className="text-xs text-slate-500 lg:text-right">
            <p>Las suscripciones digitales y sus condiciones de uso, cancelación y reembolso se regulan en los <Link to="/terminos" className="text-slate-400 hover:text-white underline underline-offset-2">Términos de uso</Link> y la <Link to="/reembolsos" className="text-slate-400 hover:text-white underline underline-offset-2">Política de reembolsos</Link>.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
