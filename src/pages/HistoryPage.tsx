import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, LayoutGrid, Plus, Copy, Trash2, ExternalLink, Calendar, X, BookOpen, CheckCircle2, FileText, Monitor, Download, Lock, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { historyService, HistoryItem } from '../services/historyService';
import { useAuth } from '../contexts/AuthContext';
import { exportToPDF } from '../services/pdfService';
import { DictationResult } from '../services/gemini';
import PresentationMode from '../components/PresentationMode';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { isPro } = useAuth();
  const openUpgradeModal = () => {
    navigate('/generador', { state: { openUpgrade: true } });
  };
  const [savedDictations, setSavedDictations] = useState<HistoryItem[]>([]);
  const [selectedDictation, setSelectedDictation] = useState<HistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);

useEffect(() => {
  const loadHistory = async () => {
    const history = await historyService.getHistory();
    setSavedDictations(history);
  };

  loadHistory();
}, []);

const handleDelete = async (id: string, e: React.MouseEvent) => {
  e.stopPropagation();

  try {
    await historyService.deleteDictation(id);
    const history = await historyService.getHistory();
    setSavedDictations(history);

    if (selectedDictation?.id === id) {
      setSelectedDictation(null);
    }

    showToast("Dictado eliminado");
  } catch (error) {
    console.error(error);
    showToast("Error al eliminar");
  }
};

  const copyToClipboard = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    showToast("Texto copiado al portapapeles");
  };

  const handlePresentation = () => {
    if (!selectedDictation) {
      alert("No hay ningún dictado disponible para presentar.");
      return;
    }
    setShowPresentation(true);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isPro) {
    return (
      <div className="animate-in fade-in duration-700 bg-slate-50 min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-12 rounded-2xl border border-slate-200 shadow-xl text-center space-y-8">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center text-brand mx-auto">
            <Lock size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-heading font-bold text-slate-900">Historial disponible en Plan Pro</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Guarda, organiza y reutiliza tus dictados con el Plan Pro.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={openUpgradeModal}
              className="w-full py-4 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
            >
              Ver Plan Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 bg-slate-50 min-h-screen py-12">
      {/* Presentation Mode */}
      <AnimatePresence>
        {showPresentation && (
          <PresentationMode 
            dictation={selectedDictation as unknown as DictationResult} 
            onClose={() => setShowPresentation(false)} 
          />
        )}
      </AnimatePresence>

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[110] bg-slate-800 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={20} className="text-brand" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1100px] mx-auto px-6">
        <Link 
          to="/generador" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver al generador
        </Link>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Tu Historial</h1>
            <p className="text-base text-slate-500 mt-1">Recupera y reutiliza tus dictados anteriores.</p>
          </div>
          <Link 
            to="/generador" 
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-sm"
          >
            <Plus size={18} />
            Nuevo dictado
          </Link>
        </div>

        {savedDictations.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <History size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold text-slate-900">Aún no tienes dictados guardados.</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Cuando generes dictados aparecerán aquí para poder reutilizarlos.
              </p>
            </div>
            
            <Link 
              to="/generador"
              className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md flex items-center gap-2"
            >
              <LayoutGrid size={18} />
              Ir al generador
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDictations.map((item) => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                onClick={() => setSelectedDictation(item)}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} />
                    {formatDate(item.date)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => copyToClipboard(item.content, e)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-brand"
                      title="Copiar texto"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-2 line-clamp-1">
                  {item.title || 'Dictado sin título'}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-brand/5 text-brand text-[10px] font-bold rounded uppercase">
                    {item.rule}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    {item.difficulty}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    {item.length}
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-3 italic">
                  "{item.content}"
                </p>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-brand font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    Abrir dictado
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDictation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDictation(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={selectedDictation.id}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col dictation-card"
            >
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900">
                      {selectedDictation.title || 'Dictado sin título'}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 print-hidden">
                      <Calendar size={12} />
                      Guardado el {formatDate(selectedDictation.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 print-hidden">
                  {/* 1. Copiar (Siempre disponible) */}
                  <button 
                    onClick={() => copyToClipboard(selectedDictation.content)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 flex items-center gap-2 text-xs font-bold"
                    title="Copiar texto"
                  >
                    <Copy size={18} />
                    Copiar
                  </button>

                  {/* 2. Guardar en historial (Ya guardado) */}
                  <div className="relative group">
                    <button 
                      disabled
                      className="p-2 rounded-lg transition-colors flex items-center gap-1 text-brand bg-brand/10 cursor-default" 
                      title="Ya guardado en historial"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Ya guardado en historial
                    </div>
                  </div>

                  {/* 3. PDF (Solo Pro) */}
                  <div className="relative group">
                    <button 
                      onClick={() => isPro && selectedDictation && exportToPDF(selectedDictation as unknown as DictationResult, isPro)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isPro ? 'text-slate-600 bg-slate-100 hover:bg-slate-200' : 'text-slate-300 cursor-not-allowed'}`} 
                      title={isPro ? "Exportar PDF" : "Disponible en Plan Pro"}
                    >
                      <Download size={18} />
                      {!isPro && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {isPro ? "Exportar PDF" : "Disponible en Plan Pro"}
                    </div>
                  </div>

                  {/* 5. Presentación (Solo Pro) */}
                  <div className="relative group">
                    <button 
                      onClick={() => isPro && handlePresentation()}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isPro ? 'text-slate-600 bg-slate-100 hover:bg-slate-200' : 'text-slate-300 cursor-not-allowed'}`} 
                      title={isPro ? "Modo Proyectar" : "Disponible en Plan Pro"}
                    >
                      <Monitor size={18} />
                      {!isPro && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {isPro ? "Modo Proyectar" : "Disponible en Plan Pro"}
                    </div>
                  </div>

                  {/* 6. Cerrar */}
                  <button 
                    onClick={() => setSelectedDictation(null)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 ml-2"
                    title="Cerrar"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-8">
                <div className="flex flex-wrap gap-4">
                  <div className="px-3 py-1 bg-brand/5 border border-brand/10 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Regla</span>
                    <span className="text-sm font-bold text-brand">{selectedDictation.rule}</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Dificultad</span>
                    <span className="text-sm font-bold text-slate-700 capitalize">{selectedDictation.difficulty}</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Longitud</span>
                    <span className="text-sm font-bold text-slate-700 capitalize">{selectedDictation.length}</span>
                  </div>
                </div>

                {selectedDictation.keywords && selectedDictation.keywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-3">Palabras Clave</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDictation.keywords.map((word, i) => (
                        <span key={i} className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium border border-brand/20">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDictation.preExercise && (
                  <div>
                    <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-3">Ejercicio Previo</h4>
                    <div className="text-lg leading-relaxed text-slate-700 p-6 bg-white border border-slate-200 rounded-xl shadow-sm italic">
                      {typeof selectedDictation.preExercise === 'string' ? selectedDictation.preExercise : ''}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-3">Dictado</h4>
                  <div className="text-xl leading-loose text-slate-800 p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                    {typeof selectedDictation.content === 'string' ? selectedDictation.content : ''}
                  </div>
                </div>

                {selectedDictation.solution && (
                  <div>
                    <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-3">Solución</h4>
                    <div 
                      className="text-lg leading-relaxed text-slate-600 bg-slate-50/50 p-6 rounded-xl border border-slate-100"
                      dangerouslySetInnerHTML={{ __html: selectedDictation.solution.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-accent">$1</strong>') }}
                    />
                  </div>
                )}

                {selectedDictation.observations && (
                  <div>
                    <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-3">Observaciones</h4>
                    <p className="text-slate-600 italic leading-relaxed">
                      {typeof selectedDictation.observations === 'string' ? selectedDictation.observations : ''}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center shrink-0 print-hidden">
                <button 
                  onClick={() => {
                    navigate('/generador', { state: { dictation: selectedDictation } });
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md"
                >
                  <LayoutGrid size={18} />
                  Usar en generador
                </button>
                <button 
                  onClick={() => setSelectedDictation(null)}
                  className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
