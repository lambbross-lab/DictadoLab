import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  RefreshCcw, 
  Copy, 
  BookOpen,
  Settings2,
  AlertCircle,
  Loader2,
  Lock,
  Monitor,
  FileText,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import { generateDictations, DictationRequest, DictationResult } from '../services/gemini';
import { historyService } from '../services/historyService';
import { useAuth } from '../contexts/AuthContext';
import { exportToPDF } from '../services/pdfService';
import PresentationMode from '../components/PresentationMode';

export default function GeneratorPage() {
  const { isPro, profile, user, refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<DictationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [presentingDictation, setPresentingDictation] = useState<DictationResult | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showPlanesModal, setShowPlanesModal] = useState(false);
  
  const usageCount = profile?.dictados_usados || 0;
  const dailyUsageCount = profile?.dictados_usados_hoy || 0;
  const LIMIT = profile?.plan === 'pro' ? 500 : 10;
  const DAILY_LIMIT = 50;
  
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const openLoginModal = () => {
    navigate('/auth', { state: { backgroundLocation: location } });
  };

  const handleAction = (action: () => void) => {
    if (!user) {
      openLoginModal();
      return;
    }
    action();
  };

  // Form state
  const [config, setConfig] = useState<DictationRequest>({
    rule: 'B / V',
    difficulty: 'media',
    length: 'medio',
    textType: 'narrativo',
    theme: '',
    count: 1,
    includeTitle: false,
    includeSolution: false,
    includeObservations: false,
    includeFinalActivity: false,
    generatePT: false,
    generateAL: false
  });

  // Load dictation from history if passed in state
  useEffect(() => {
    if (location.state?.openUpgrade) {
      setShowPlanesModal(true);
      window.history.replaceState({}, document.title);
    }

    if (location.state?.dictation) {
      const d = location.state.dictation;
      
      // Convert HistoryItem to DictationResult format
      const result: DictationResult = {
        title: d.title,
        content: d.content,
        keywords: d.keywords || [],
        preExercise: d.preExercise || '',
        solution: d.solution || '',
        observations: d.observations || '',
        rule: d.rule,
        difficulty: d.difficulty,
        length: d.length,
        finalActivity: d.finalActivity,
        ptAdaptation: d.ptAdaptation,
        alAdaptation: d.alAdaptation
      };

      setResults([result]);
      
      // Update config to match the loaded dictation
      setConfig(prev => ({
        ...prev,
        rule: d.rule,
        difficulty: d.difficulty as any,
        length: d.length as any
      }));

      // Scroll to results area
      setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
      // Clear state to avoid reloading on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-open upgrade modal when limit reached
  useEffect(() => {
    if (!isPro && usageCount >= LIMIT) {
      setShowPlanesModal(true);
    }
  }, [isPro, usageCount, LIMIT]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check limits
    if (user) {
      if (isPro) {
        // Silent daily limit for Pro
        if (dailyUsageCount >= DAILY_LIMIT) {
          setError('Has alcanzado el límite de generación por hoy. Podrás generar más dictados mañana.');
          return;
        }
        // Silent monthly limit for Pro
        if (usageCount >= LIMIT) {
          setError('Has alcanzado el límite mensual de uso.');
          return;
        }
      } else {
        // Visible limit for Free
        if (usageCount >= LIMIT) {
          goToPlanes();
          return;
        }
      }
    }

    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateDictations(config);
      setResults(data);
      
      // Refresh profile to update usage counters
      if (user) {
        await refreshProfile();
      }
          
      // Scroll to results area
      setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('Hubo un error al generar el dictado. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePresentation = (dictation: DictationResult) => {
    setPresentingDictation(dictation);
    setShowPresentation(true);
  };

  const handleSaveToHistory = (result: DictationResult) => {
    if (!isPro) {
      goToPlanes();
      return;
    }
    historyService.saveDictation(result, config.length);
    setSaveMessage("Dictado guardado en tu historial");
    
    // Auto-hide message
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  const goToPlanes = () => {
    setShowPlanesModal(true);
  };

  return (
    <div className="animate-in fade-in duration-700 bg-slate-50 min-h-screen">
      {/* Presentation Mode */}
      <AnimatePresence>
        {showPresentation && (
          <PresentationMode 
            dictation={presentingDictation} 
            onClose={() => setShowPresentation(false)} 
          />
        )}
      </AnimatePresence>

      {/* Account Info Bar */}
      <div className="bg-white border-b border-slate-200 py-4 no-print">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan actual:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${isPro ? 'text-amber-600 bg-amber-50 border border-amber-100' : 'text-brand bg-brand/5 border border-brand/10'}`}>
                {isPro ? 'Plan Pro activo' : 'Plan Gratuito'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso mensual:</span>
              <div className="flex items-center gap-3">
                {!isPro && (
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        usageCount >= LIMIT ? 'bg-red-500' : usageCount >= 8 ? 'bg-orange-500' : 'bg-brand'
                      }`}
                      style={{ width: `${(usageCount / LIMIT) * 100}%` }}
                    ></div>
                  </div>
                )}
                <span className={`text-xs font-bold ${!isPro && usageCount >= LIMIT ? 'text-red-600' : 'text-slate-700'}`}>
                  {isPro ? 'Dictados ilimitados' : `${usageCount} / ${LIMIT} dictados`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {!isPro && (
              <>
                <p className={`text-xs font-medium ${usageCount >= LIMIT ? 'text-red-600 font-bold' : usageCount >= 8 ? 'text-orange-600' : 'text-slate-500'}`}>
                  {usageCount >= LIMIT 
                    ? 'Has alcanzado el límite del plan gratuito.' 
                    : `Te quedan ${LIMIT - usageCount} dictados este mes.`}
                </p>
                <button 
                  onClick={goToPlanes}
                  className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent/5 rounded-lg border border-brand-accent/10 transition-all"
                >
                  <RefreshCcw size={14} />
                  Mejorar a Pro
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Toast Message */}
          <AnimatePresence>
            {saveMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="fixed top-24 left-1/2 z-50 bg-brand text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-bold"
              >
                <CheckCircle2 size={20} />
                {saveMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-10">
            <h1 className="text-3xl font-heading font-bold text-slate-900">Crear nuevo dictado</h1>
            <p className="text-base text-slate-500 mt-1">Configura los parámetros y genera un texto original para tu clase.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Config */}
          <div className="lg:col-span-4 space-y-6 no-print">
            <div className="bg-white p-6 rounded-xl border border-[#e6e6e6] shadow-[0_6px_20px_rgba(0,0,0,0.06)] sticky top-24">
              <h2 className="text-lg font-heading font-bold mb-6 flex items-center gap-2 text-slate-900">
                <Settings2 size={20} className="text-brand" />
                Configuración
              </h2>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Regla ortográfica</label>
                  <select 
                    value={config.rule}
                    onChange={(e) => setConfig({...config, rule: e.target.value})}
                    className="w-full border-slate-300 rounded-lg focus:ring-brand focus:border-brand text-sm"
                  >
                    <optgroup label="Letras con confusión ortográfica">
                      <option>B / V</option>
                      <option>G / J</option>
                      <option>C / Z</option>
                      <option>S / Z</option>
                      <option>LL / Y</option>
                      <option>R / RR</option>
                      <option>H</option>
                      <option>M antes de P y B</option>
                    </optgroup>
                    <optgroup label="Acentuación">
                      <option>Agudas</option>
                      <option>Llanas</option>
                      <option>Esdrújulas</option>
                    </optgroup>
                    <optgroup label="Normas generales">
                      <option>Mayúsculas y minúsculas</option>
                    </optgroup>
                    <optgroup label="Puntuación">
                      <option>Signos de puntuación</option>
                    </optgroup>
                    <optgroup label="Otros">
                      <option>Dictado mixto</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nivel de dificultad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fácil', 'media', 'avanzada'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfig({...config, difficulty: level})}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          config.difficulty === level 
                            ? 'bg-brand text-white border-brand' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Longitud</label>
                    <select 
                      value={config.length}
                      onChange={(e) => setConfig({...config, length: e.target.value as any})}
                      className="w-full border-slate-300 rounded-lg focus:ring-brand focus:border-brand text-sm"
                    >
                      <option value="corto">Corto</option>
                      <option value="medio">Medio</option>
                      <option value="largo">Largo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de texto</label>
                    <select 
                      value={config.textType}
                      onChange={(e) => setConfig({...config, textType: e.target.value as any})}
                      className="w-full border-slate-300 rounded-lg focus:ring-brand focus:border-brand text-sm"
                    >
                      <option value="narrativo">Narrativo</option>
                      <option value="descriptivo">Descriptivo</option>
                      <option value="frases">Frases</option>
                      <option value="diálogo">Diálogo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tema opcional</label>
                  <input 
                    type="text"
                    placeholder="Ej: piratas, espacio, animales..."
                    value={config.theme}
                    onChange={(e) => setConfig({...config, theme: e.target.value})}
                    className="w-full border-slate-300 rounded-lg focus:ring-brand focus:border-brand text-sm"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={config.includeTitle}
                      onChange={(e) => setConfig({...config, includeTitle: e.target.checked})}
                      className="rounded border-slate-300 text-brand focus:ring-brand" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Incluir título sugerido</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={config.includeSolution}
                      onChange={(e) => setConfig({...config, includeSolution: e.target.checked})}
                      className="rounded border-slate-300 text-brand focus:ring-brand" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Mostrar solución resaltada</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={config.includeObservations}
                      onChange={(e) => setConfig({...config, includeObservations: e.target.checked})}
                      className="rounded border-slate-300 text-brand focus:ring-brand" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Incluir observaciones pedagógicas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={config.includeFinalActivity}
                      onChange={(e) => setConfig({...config, includeFinalActivity: e.target.checked})}
                      className="rounded border-slate-300 text-brand focus:ring-brand" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Incluir actividad final de refuerzo</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Adaptaciones para diversidad (Pro)</h3>
                  <div className="space-y-3">
                    <label 
                      className={`flex items-center gap-2 cursor-pointer group ${!isPro ? 'opacity-50' : ''}`}
                      onClick={(e) => {
                        if (!isPro) {
                          e.preventDefault();
                          goToPlanes();
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={config.generatePT}
                        disabled={!isPro}
                        onChange={(e) => setConfig({...config, generatePT: e.target.checked})}
                        className="rounded border-slate-300 text-brand focus:ring-brand disabled:bg-slate-100" 
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">
                        Generar adaptación PT {!isPro && <span className="text-[10px] font-bold text-brand ml-1">(Pro)</span>}
                      </span>
                    </label>
                    <label 
                      className={`flex items-center gap-2 cursor-pointer group ${!isPro ? 'opacity-50' : ''}`}
                      onClick={(e) => {
                        if (!isPro) {
                          e.preventDefault();
                          goToPlanes();
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={config.generateAL}
                        disabled={!isPro}
                        onChange={(e) => setConfig({...config, generateAL: e.target.checked})}
                        className="rounded border-slate-300 text-brand focus:ring-brand disabled:bg-slate-100" 
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">
                        Generar adaptación AL {!isPro && <span className="text-[10px] font-bold text-brand ml-1">(Pro)</span>}
                      </span>
                    </label>
                  </div>
                </div>

                <button 
                  disabled={isGenerating || (!isPro && usageCount >= LIMIT)}
                  className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                    !isPro && usageCount >= LIMIT 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-brand text-white hover:brightness-110'
                  } disabled:opacity-50`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generando...
                    </>
                  ) : (!isPro && usageCount >= LIMIT) ? (
                    <>
                      <Lock size={20} />
                      Límite alcanzado
                    </>
                  ) : (
                    'Generar dictado'
                  )}
                </button>
                {!isPro && usageCount >= LIMIT && (
                  <p className="text-[10px] text-center text-red-500 font-bold mt-2">
                    Mejora a Plan Pro para generar dictados ilimitados.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div id="results-area" className="lg:col-span-8 space-y-8 scroll-mt-24">
            {isGenerating && (
              <div className="bg-white p-12 rounded-xl border border-[#e6e6e6] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-brand" size={48} />
                <p className="text-slate-600 font-medium">Creando tu dictado personalizado...</p>
              </div>
            )}

            {!isGenerating && results.length === 0 && !error && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center text-brand">
                  <BookOpen size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-bold text-slate-900">Empieza creando tu primer dictado</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Selecciona una regla ortográfica y un nivel de dificultad para generar un dictado listo para usar en clase.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    const form = document.querySelector('form');
                    form?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md"
                >
                  Crear primer dictado
                </button>

                <div className="pt-6 border-t border-slate-100 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                    <span className="text-brand">✔</span> Dictados claros y naturales
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                    <span className="text-brand">✔</span> Adaptados al nivel
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                    <span className="text-brand">✔</span> Listos para copiar o imprimir
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start gap-4 text-red-700">
                <AlertCircle className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {results.map((result, idx) => (
                <motion.article 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl border border-[#e6e6e6] shadow-[0_6px_20px_rgba(0,0,0,0.06)] overflow-hidden dictation-card"
                >
                  <div className="bg-slate-50 px-8 py-6 border-b border-[#e6e6e6] flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 print-hidden">Vista previa del resultado</span>
                      <h3 className="text-2xl font-heading font-bold text-slate-900 mt-1">
                        {result.title || 'Dictado sin título'}
                      </h3>
                    </div>
                    <div className="flex gap-2 print-hidden">
                      {/* 1. Copiar */}
                      <button 
                        onClick={() => handleAction(() => copyToClipboard(result.content))}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${user ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-300'}`} 
                        title={user ? "Copiar texto" : "Regístrate para copiar"}
                      >
                        <Copy size={18} />
                        {!user && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                      </button>

                      {/* 2. Guardar en historial */}
                      <div className="relative group">
                        <button 
                          onClick={() => handleAction(() => isPro ? handleSaveToHistory(result) : goToPlanes())}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${user && isPro ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-300'}`} 
                          title={!user ? "Regístrate para guardar" : isPro ? "Guardar en historial" : "Disponible en Plan Pro"}
                        >
                          <Save size={18} />
                          {(!user || !isPro) && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                        </button>
                      </div>

                      {/* 3. PDF */}
                      <div className="relative group">
                        <button 
                          onClick={() => handleAction(() => isPro ? exportToPDF(result, isPro) : goToPlanes())}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${user && isPro ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-300'}`} 
                          title={!user ? "Regístrate para exportar" : isPro ? "Exportar PDF" : "Disponible en Plan Pro"}
                        >
                          <Download size={18} />
                          {(!user || !isPro) && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                        </button>
                      </div>

                      {/* 5. Presentación */}
                      <div className="relative group">
                        <button 
                          onClick={() => handleAction(() => isPro ? handlePresentation(result) : goToPlanes())}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${user && isPro ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-300'}`} 
                          title={!user ? "Regístrate para proyectar" : isPro ? "Modo Proyectar" : "Disponible en Plan Pro"}
                        >
                          <Monitor size={18} />
                          {(!user || !isPro) && <Lock size={10} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-10">
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Regla:</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{result.rule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Nivel:</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs capitalize">{result.difficulty}</span>
                      </div>
                      {result.length && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Longitud:</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs capitalize">{result.length}</span>
                        </div>
                      )}
                    </div>

                    {/* Palabras Clave */}
                    <div>
                      <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">Palabras Clave</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((word, i) => (
                          <span key={i} className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium border border-brand/20">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ejercicio Previo */}
                    <div>
                      <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">Ejercicio Previo</h4>
                      <div className="text-lg leading-relaxed text-slate-700 p-6 bg-white border border-slate-200 rounded-xl shadow-sm italic">
                        {user ? (typeof result.preExercise === 'string' ? result.preExercise : '') : (
                          (typeof result.preExercise === 'string' && result.preExercise.length > 120)
                            ? `${result.preExercise.substring(0, 120)}...` 
                            : (typeof result.preExercise === 'string' ? result.preExercise : '')
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">Dictado</h4>
                      <div className="text-xl leading-loose text-slate-800 font-normal p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl relative overflow-hidden">
                        {user ? (typeof result.content === 'string' ? result.content : '') : (
                          <>
                            <div className="blur-[2px] select-none">
                              {typeof result.content === 'string' 
                                ? result.content.split(' ').slice(0, 15).join(' ') 
                                : ''}...
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 flex items-end justify-center pb-8">
                              <button 
                                onClick={openLoginModal}
                                className="bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                              >
                                <Lock size={18} />
                                Regístrate gratis para ver el dictado completo
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      {!user && (
                        <p className="text-center text-slate-500 text-sm mt-4 font-medium">
                          Regístrate gratis para ver el dictado completo y usar todas las funciones.
                        </p>
                      )}
                    </div>

                    {user && result.solution && (
                      <div className="pt-8 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">Solución (Palabras clave resaltadas)</h4>
                        <div 
                          className="text-lg leading-relaxed text-slate-600 bg-slate-50/50 p-6 rounded-xl border border-slate-100"
                          dangerouslySetInnerHTML={{ 
                            __html: typeof result.solution === 'string' 
                              ? result.solution.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-accent">$1</strong>')
                              : '' 
                          }}
                        />
                      </div>
                    )}

                    {user && result.observations && (
                      <div className="pt-8 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">Observaciones pedagógicas</h4>
                        <p className="text-slate-600 italic leading-relaxed">
                          {typeof result.observations === 'string' ? result.observations : ''}
                        </p>
                      </div>
                    )}

                    {/* Actividad Final */}
                    {result.finalActivity && (
                      <div className="pt-8 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-brand uppercase tracking-widest mb-4">
                          {typeof result.finalActivity.title === 'string' ? result.finalActivity.title : 'Actividad Final'}
                        </h4>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                          {user ? (
                            <>
                              <p className="text-sm font-bold text-slate-700 mb-2">
                                {typeof result.finalActivity.instruction === 'string' ? result.finalActivity.instruction : ''}
                              </p>
                              <div className="text-lg text-slate-600 whitespace-pre-wrap">
                                {typeof result.finalActivity.content === 'string' ? result.finalActivity.content : ''}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="blur-[2px] select-none">
                                <p className="text-sm font-bold text-slate-700 mb-2">
                                  {typeof result.finalActivity.instruction === 'string' ? result.finalActivity.instruction : ''}
                                </p>
                                <div className="text-lg text-slate-600">
                                  {typeof result.finalActivity.content === 'string' 
                                    ? result.finalActivity.content.substring(0, 40) 
                                    : ''}...
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50 flex items-center justify-center">
                                <button 
                                  onClick={openLoginModal}
                                  className="bg-brand text-white px-4 py-2 rounded-lg font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2 text-sm"
                                >
                                  <Lock size={14} />
                                  Regístrate gratis para ver la actividad
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Adaptación PT */}
                    {result.ptAdaptation && (
                      <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-brand/10 text-brand px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Extra Pro</span>
                          <h4 className="text-xs font-bold text-brand uppercase tracking-widest">Adaptación PT</h4>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h5 className="font-bold text-slate-900 mb-2">
                            {typeof result.ptAdaptation.title === 'string' ? result.ptAdaptation.title : 'Adaptación PT'}
                          </h5>
                          <div className="space-y-4">
                            <div className="text-sm text-slate-600">
                              {Array.isArray(result.ptAdaptation.instructions) && result.ptAdaptation.instructions.map((inst, i) => (
                                <p key={i}>{typeof inst === 'string' ? inst : ''}</p>
                              ))}
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-100">
                              {Array.isArray(result.ptAdaptation.sentences) && result.ptAdaptation.sentences.map((sentence, i) => (
                                <p key={i} className="text-lg text-slate-800">{typeof sentence === 'string' ? sentence : ''}</p>
                              ))}
                            </div>
                            <p className="text-sm font-bold text-brand italic">
                              {typeof result.ptAdaptation.hint === 'string' ? result.ptAdaptation.hint : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Adaptación AL */}
                    {result.alAdaptation && (
                      <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-brand/10 text-brand px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Extra Pro</span>
                          <h4 className="text-xs font-bold text-brand uppercase tracking-widest">Adaptación AL</h4>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h5 className="font-bold text-slate-900 mb-2">
                            {typeof result.alAdaptation.title === 'string' ? result.alAdaptation.title : 'Adaptación AL'}
                          </h5>
                          <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                              {typeof result.alAdaptation.instructions === 'string' ? result.alAdaptation.instructions : ''}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {Array.isArray(result.alAdaptation.words) && result.alAdaptation.words.map((word, i) => (
                                <span key={i} className="bg-white px-4 py-2 rounded-lg border border-slate-100 text-lg text-slate-800 font-medium">
                                  {typeof word === 'string' ? word : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center print-hidden">
                    <p className="text-xs text-slate-400 italic">* Revisa el contenido antes de usarlo en el aula.</p>
                    <button 
                      onClick={() => handleAction(() => handleGenerate())}
                      className="text-sm font-bold text-brand hover:text-brand/80 flex items-center gap-2 transition-colors"
                    >
                      <RefreshCcw size={16} />
                      Regenerar versión
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {/* Pricing Section for Visitors */}
            {!user && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
              >
                <div className="bg-slate-900 p-8 text-center">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">¿Te gusta lo que ves?</h3>
                  <p className="text-slate-400 text-sm">Regístrate para desbloquear todo el potencial de DictadoLab.</p>
                </div>
                
                <div className="grid md:grid-cols-2 divide-x divide-slate-100">
                  {/* Plan Gratuito */}
                  <div className="p-8 flex flex-col">
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Plan Gratuito</h4>
                      <p className="text-slate-500 text-xs">Ideal para empezar.</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      {[
                        "10 dictados al mes",
                        "Acceso a todas las reglas",
                        "Copiar dictado"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                          <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={openLoginModal}
                      className="w-full py-3 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
                    >
                      Registrarme gratis
                    </button>
                  </div>

                  {/* Plan Pro */}
                  <div className="p-8 flex flex-col bg-brand/5">
                    <div className="mb-6 flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">Plan Pro</h4>
                        <p className="text-slate-500 text-xs">Para docentes exigentes.</p>
                      </div>
                      <span className="bg-brand/10 text-brand px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Premium</span>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-brand">29 €</span>
                        <span className="text-slate-500 text-sm font-bold">/ año</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">equivale a unos 2,4 € al mes</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      {[
                        "Dictados ilimitados",
                        "Exportar PDF",
                        "Modo presentación",
                        "Historial de dictados",
                        "Reutilizar dictados"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-800 text-sm font-medium">
                          <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={openLoginModal}
                      className="w-full py-3 px-6 rounded-xl bg-brand text-white font-bold hover:brightness-110 transition-all shadow-md text-sm"
                    >
                      Pasar a Pro
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Planes Modal */}
      <AnimatePresence>
        {showPlanesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlanesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl p-0 max-w-4xl w-full overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                {/* Plan Gratuito */}
                <div className="p-8 md:p-10 bg-slate-50 border-r border-slate-100">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Gratuito</h3>
                    <p className="text-slate-500 text-sm">Ideal para probar la herramienta.</p>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      "10 dictados al mes",
                      "Copiar dictado",
                      "Acceso a todas las reglas ortográficas"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => {
                      if (!user) {
                        setShowPlanesModal(false);
                        openLoginModal();
                      } else {
                        setShowPlanesModal(false);
                      }
                    }}
                    className="w-full py-4 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-all text-center text-sm"
                  >
                    {user ? 'Seguir con plan gratuito' : 'Registrarme gratis'}
                  </button>
                </div>

                {/* Plan Pro */}
                <div className="p-8 md:p-10 bg-white relative">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Recomendado</span>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Pro</h3>
                    <p className="text-slate-500 text-sm">Para docentes que quieren lo mejor.</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-3">
                    <div className="text-center">
                      <span className="text-3xl font-black text-brand">29 €</span>
                      <span className="text-slate-400 text-sm font-bold ml-1">/ año</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100 mx-2" />
                    <div className="text-center">
                      <span className="text-xl font-bold text-slate-600">5 €</span>
                      <span className="text-slate-400 text-xs font-bold ml-1">/ mes</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      "Dictados ilimitados",
                      "Historial de dictados",
                      "Exportar PDF",
                      "Modo presentación",
                      "Reutilizar dictados",
                      "Adaptaciones automáticas para alumnado PT y AL"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-800 text-sm font-semibold">
                        <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => {
                      // Redirect to landing page planes section for checkout
                      window.location.href = "/#planes";
                    }}
                    className="w-full py-4 px-6 rounded-xl bg-brand text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-brand/20 text-center text-sm"
                  >
                    Pasar a Pro
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
