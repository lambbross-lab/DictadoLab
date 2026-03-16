import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Maximize2, Minimize2, Monitor } from 'lucide-react';
import { DictationResult } from '../services/gemini';

interface PresentationModeProps {
  dictation: DictationResult | null;
  onClose: () => void;
}

export default function PresentationMode({ dictation, onClose }: PresentationModeProps) {
  const [showPreExercise, setShowPreExercise] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!dictation) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <Monitor size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Modo Presentación</h2>
          <p className="text-slate-500 mb-6">No hay ningún dictado disponible para presentar.</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand text-white rounded-lg font-bold hover:brightness-110 transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto font-sans text-slate-900 selection:bg-brand/20">
      {/* Floating Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl z-[110] transition-opacity hover:opacity-100 opacity-40 group">
        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
          <button 
            onClick={() => setShowPreExercise(!showPreExercise)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${showPreExercise ? 'text-brand-accent' : 'text-white/60 hover:text-white'}`}
            title={showPreExercise ? "Ocultar Ejercicio" : "Mostrar Ejercicio"}
          >
            {showPreExercise ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">Ejercicio</span>
          </button>
          <button 
            onClick={() => setShowContent(!showContent)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${showContent ? 'text-brand-accent' : 'text-white/60 hover:text-white'}`}
            title={showContent ? "Ocultar Dictado" : "Mostrar Dictado"}
          >
            {showContent ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">Dictado</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFullscreen}
            className="text-white/60 hover:text-white transition-colors p-1"
            title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-red-400 transition-colors p-1"
            title="Salir de Presentación"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-20 sm:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 sm:mb-24"
        >
          <span className="inline-block px-4 py-1 bg-brand/5 text-brand rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-brand/10">
            Regla: {dictation.rule}
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            {dictation.title || 'Dictado'}
          </h1>
        </motion.div>

        <div className="space-y-24 sm:space-y-32">
          <AnimatePresence>
            {showPreExercise && dictation.preExercise && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Actividad Previa</h2>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <div className="text-3xl sm:text-4xl leading-relaxed text-slate-700 text-center italic font-medium bg-slate-50 p-12 rounded-3xl border border-slate-100">
                  {dictation.preExercise.replace(/\*\*(.*?)\*\*/g, '__________')}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showContent && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Texto del Dictado</h2>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <div className="text-4xl sm:text-5xl leading-[1.6] text-slate-900 text-justify font-serif bg-white p-4 sm:p-0">
                  {dictation.content}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
