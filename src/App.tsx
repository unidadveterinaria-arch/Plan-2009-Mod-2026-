import React, { useState, useEffect } from 'react';
import { StudentProgress, SubjectState, Subject } from './types';
import { SUBJECTS, evaluateAllSubjects } from './data/subjects';
import {
  UnidadVeterinariaLogoHorizontal,
  UnidadVeterinariaLogoBadge,
  UnidadVeterinariaEmblem
} from './components/UnidadVeterinariaLogo';
import { AcademicCalendar } from './components/AcademicCalendar';
import { FlappyUnidadModal } from './components/FlappyUnidadModal';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  RotateCcw,
  Calendar,
  Download,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check
} from 'lucide-react';

const STORAGE_KEY = 'fcv_unr_correlativas_simple_v2';

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading progress:', e);
    }
    return {};
  });

  const [activeTab, setActiveTab] = useState<'cursar' | 'rendir' | 'calendario'>('cursar');
  const [activeFilter, setActiveFilter] = useState<'todas' | 'aprobadas' | 'regularizadas' | 'puedo_cursar' | 'puedo_rendir' | 'no_puedo_cursar'>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFlappyOpen, setIsFlappyOpen] = useState(false);
  
  // Collapse state for years (all open by default)
  const [openYears, setOpenYears] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true
  });

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [progress]);

  // Evaluated subjects map
  const evalCursar = evaluateAllSubjects(progress, 'cursar');
  const evalRendir = evaluateAllSubjects(progress, 'rendir');

  // Stats calculation
  const totalSubjects = SUBJECTS.length; // 48
  let approvedCount = 0;
  let regularCount = 0;
  let readyToCourseCount = 0;
  let readyToExamCount = 0;
  let cannotCourseCount = 0;

  SUBJECTS.forEach((subject) => {
    const st = progress[subject.code] || 'pendiente';
    if (st === 'aprobada') approvedCount++;
    if (st === 'regular') regularCount++;

    const cursarEnable = evalCursar.get(subject.code)?.isEnabled;
    const rendirEnable = evalRendir.get(subject.code)?.isEnabled;

    if (cursarEnable && st !== 'aprobada') readyToCourseCount++;
    if (rendirEnable && st !== 'aprobada') readyToExamCount++;
    if (!cursarEnable && st === 'pendiente') cannotCourseCount++;
  });

  const generalPercentage = Math.round((approvedCount / totalSubjects) * 100);

  // Cycle state: pendiente -> regular (1 tap) -> aprobada (2 taps) -> pendiente
  const handleSubjectTap = (code: string) => {
    setProgress((prev) => {
      const current = prev[code] || 'pendiente';
      let next: SubjectState = 'pendiente';
      if (current === 'pendiente') {
        next = 'regular';
      } else if (current === 'regular') {
        next = 'aprobada';
      } else {
        next = 'pendiente';
      }
      return {
        ...prev,
        [code]: next,
      };
    });
  };

  const handleReset = () => {
    if (window.confirm('¿Deseás reiniciar todo tu avance grabado?')) {
      setProgress({});
    }
  };

  const toggleYear = (yearNum: number) => {
    setOpenYears((prev) => ({ ...prev, [yearNum]: !prev[yearNum] }));
  };

  const toggleAllYears = (expand: boolean) => {
    setOpenYears({
      1: expand,
      2: expand,
      3: expand,
      4: expand,
      5: expand,
      6: expand
    });
  };

  const allExpanded = Object.values(openYears).every(Boolean);

  const handleExportPDF = () => {
    window.print();
  };

  // Group subjects by Year (1 to 6)
  const years = [1, 2, 3, 4, 5, 6];

  // Helper labels for years
  const yearNames: { [key: number]: string } = {
    1: 'Primer año',
    2: 'Segundo año',
    3: 'Tercer año',
    4: 'Cuarto año',
    5: 'Quinto año',
    6: 'Sexto año / Orientación'
  };

  // Filter subject logic
  const filterSubject = (subject: Subject) => {
    const st = progress[subject.code] || 'pendiente';
    const canCourse = evalCursar.get(subject.code)?.isEnabled;
    const canExam = evalRendir.get(subject.code)?.isEnabled;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = subject.name.toLowerCase().includes(q);
      const matchCode = subject.code.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }

    // Secondary Filter Pill
    if (activeFilter === 'aprobadas') return st === 'aprobada';
    if (activeFilter === 'regularizadas') return st === 'regular';
    if (activeFilter === 'puedo_cursar') return st !== 'aprobada' && canCourse;
    if (activeFilter === 'puedo_rendir') return st !== 'aprobada' && canExam;
    if (activeFilter === 'no_puedo_cursar') return st === 'pendiente' && !canCourse;

    // Tab view mode adjustment
    if (activeTab === 'cursar' && activeFilter === 'todas') {
      // In 'cursar' view, prioritize showing subjects or highlight them
      return true;
    }
    if (activeTab === 'rendir' && activeFilter === 'todas') {
      return true;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] text-[#191c19] flex flex-col font-sans pb-16 print:bg-white print:pb-0">
      
      {/* Top Main Container */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-6 sm:pt-8 space-y-6">
        
        {/* Main Banner Card (Match reference screenshot) */}
        <header className="bg-[#008037] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-emerald-600/30 print:shadow-none print:border-none print:bg-emerald-800">
          
          {/* Top Brand Tag & Logos */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="text-xs font-bold text-emerald-200/90 tracking-wider uppercase font-mono">
              RES. C.D. N° 30/2026 • ANEXO ÚNICO
            </div>
            
            <UnidadVeterinariaLogoHorizontal className="scale-95 border-none bg-white/15 text-white py-1 px-3" />
          </div>

          {/* Big Title */}
          <div className="space-y-1 mb-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
              Plan de Estudios 2009
            </h1>
            <p className="text-xs sm:text-sm font-medium text-emerald-100/90">
              Medicina Veterinaria • FCV-UNR
            </p>
          </div>

          {/* Progress Circular Gauge & Stats Grid */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-black/10 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-white/10">
            
            <div className="flex items-center gap-5">
              {/* Circle Gauge */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-300 transition-all duration-700 ease-out"
                    strokeDasharray={`${generalPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center flex flex-col items-center justify-center leading-none">
                  <span className="text-xl font-black font-mono">{approvedCount}</span>
                  <span className="text-[10px] opacity-75 font-mono">/ {totalSubjects}</span>
                </div>
              </div>

              {/* Stats Labels */}
              <div className="space-y-1">
                <div className="text-sm font-black text-white">
                  {generalPercentage}% aprobado
                </div>
                <div className="text-xs text-emerald-100/90 font-medium flex flex-wrap gap-x-2">
                  <span><strong>{regularCount}</strong> regularizadas</span>
                  <span>•</span>
                  <span><strong>{readyToCourseCount}</strong> para cursar</span>
                </div>
              </div>
            </div>

            {/* Export PDF Button */}
            <div className="flex flex-col sm:items-end w-full sm:w-auto gap-2 print:hidden">
              <button
                onClick={handleExportPDF}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#008037] hover:bg-emerald-50 text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Exportar progreso a PDF
              </button>
              <span className="text-[11px] text-emerald-100/80 text-center sm:text-right">
                Queda guardado como archivo, listo para consultar cuando quieras
              </span>
            </div>

          </div>

        </header>

        {/* Main Tab Navigation Buttons (Qué puedo cursar / Qué puedo rendir / Calendario) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 print:hidden">
          
          <button
            onClick={() => {
              setActiveTab('cursar');
              setActiveFilter('puedo_cursar');
            }}
            className={`py-3.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'cursar' && activeFilter === 'puedo_cursar'
                ? 'bg-[#b37e33] text-white ring-2 ring-[#b37e33]/50 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Qué puedo cursar ({readyToCourseCount})
          </button>

          <button
            onClick={() => {
              setActiveTab('rendir');
              setActiveFilter('puedo_rendir');
            }}
            className={`py-3.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'rendir' && activeFilter === 'puedo_rendir'
                ? 'bg-[#008037] text-white ring-2 ring-emerald-500/50 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Qué puedo rendir ({readyToExamCount})
          </button>

          <button
            onClick={() => {
              setActiveTab('calendario');
            }}
            className={`py-3.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'calendario'
                ? 'bg-slate-900 text-white ring-2 ring-slate-700 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Calendario Académico
          </button>

        </div>

        {/* CALENDARIO ACADÉMICO TAB */}
        {activeTab === 'calendario' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <AcademicCalendar
              evaluations={Object.fromEntries(evalRendir)}
              progress={progress}
              onSubjectSelect={(code) => {
                setActiveTab('cursar');
                setSearchQuery(code);
              }}
            />
          </div>
        )}

        {/* CORRELATIVAS LIST TABS (cursar / rendir) */}
        {activeTab !== 'calendario' && (
          <div className="space-y-5">
            
            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar materia por nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#008037]"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              ) : (
                <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              )}
            </div>

            {/* Quick Filter Pills Row & Expand Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              
              {/* Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveFilter('todas')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'todas'
                      ? 'bg-[#b37e33] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todas ({totalSubjects})
                </button>

                <button
                  onClick={() => setActiveFilter('aprobadas')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'aprobadas'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Aprobadas ({approvedCount})
                </button>

                <button
                  onClick={() => setActiveFilter('regularizadas')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'regularizadas'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Regularizadas ({regularCount})
                </button>

                <button
                  onClick={() => setActiveFilter('puedo_cursar')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'puedo_cursar'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Puedo cursar ({readyToCourseCount})
                </button>

                <button
                  onClick={() => setActiveFilter('puedo_rendir')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'puedo_rendir'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Puedo rendir ({readyToExamCount})
                </button>

                <button
                  onClick={() => setActiveFilter('no_puedo_cursar')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                    activeFilter === 'no_puedo_cursar'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  No puedo cursar ({cannotCourseCount})
                </button>
              </div>

              {/* Toggle Expand/Collapse All Years */}
              <button
                onClick={() => toggleAllYears(!allExpanded)}
                className="text-emerald-800 hover:text-emerald-900 font-bold underline shrink-0 text-right self-end sm:self-auto"
              >
                {allExpanded ? 'Colapsar todos los años' : 'Expandir todos los años'}
              </button>

            </div>

            {/* Instruction Banner */}
            <div className="bg-emerald-100/60 border border-emerald-200 text-emerald-950 text-xs px-4 py-3 rounded-2xl flex items-center justify-between">
              <span>
                💡 <strong>Instrucción rápida:</strong> Tocá <strong>1 vez</strong> para marcar como <em>Regularizada</em>. Tocá <strong>2 veces</strong> para marcar como <em>Aprobada</em>.
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-emerald-800 underline font-semibold ml-2 hover:text-emerald-950"
              >
                Reiniciar avance
              </button>
            </div>

            {/* Grouped Years Collapsible List */}
            <div className="space-y-4">
              {years.map((yearNum) => {
                const yearSubjects = SUBJECTS.filter((s) => s.year === yearNum).filter(filterSubject);
                const yearTotal = SUBJECTS.filter((s) => s.year === yearNum).length;
                const yearApproved = SUBJECTS.filter((s) => s.year === yearNum && progress[s.code] === 'aprobada').length;

                if (yearSubjects.length === 0 && searchQuery) return null;

                const isOpen = openYears[yearNum];

                return (
                  <div
                    key={yearNum}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleYear(yearNum)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#008037] font-black text-sm flex items-center justify-center font-mono shrink-0">
                          {yearNum}
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800">
                          {yearNames[yearNum]}{' '}
                          <span className="text-xs font-semibold text-slate-400 font-sans ml-1">
                            {yearApproved}/{yearTotal} aprobadas
                          </span>
                        </h2>
                      </div>

                      <div className="text-slate-400 p-1 rounded-full hover:bg-slate-100">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Subjects Grid inside Year */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 grid grid-cols-1 gap-2.5 border-t border-slate-100">
                        {yearSubjects.map((subject) => {
                          const st = progress[subject.code] || 'pendiente';
                          const canCourse = evalCursar.get(subject.code)?.isEnabled;
                          const canExam = evalRendir.get(subject.code)?.isEnabled;

                          const isApproved = st === 'aprobada';
                          const isRegular = st === 'regular';

                          // Icon & color styling according to status
                          let badgeText = 'Faltan correlativas';
                          let badgeBg = 'text-slate-400';

                          if (isApproved) {
                            badgeText = 'Aprobada';
                            badgeBg = 'text-emerald-700 font-bold';
                          } else if (isRegular) {
                            badgeText = 'Regularizada';
                            badgeBg = 'text-amber-700 font-bold';
                          } else if (canExam && (activeTab === 'rendir' || activeFilter === 'puedo_rendir')) {
                            badgeText = 'Puedo rendir';
                            badgeBg = 'text-blue-700 font-bold';
                          } else if (canCourse) {
                            badgeText = 'Puedo cursar';
                            badgeBg = 'text-emerald-700 font-bold';
                          }

                          return (
                            <div
                              key={subject.code}
                              onClick={() => handleSubjectTap(subject.code)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                                isApproved
                                  ? 'bg-emerald-50/80 border-emerald-300'
                                  : isRegular
                                  ? 'bg-amber-50/80 border-amber-300'
                                  : canExam && (activeTab === 'rendir' || activeFilter === 'puedo_rendir')
                                  ? 'bg-blue-50/80 border-blue-300 hover:border-blue-500 hover:shadow-xs'
                                  : canCourse
                                  ? 'bg-white border-[#dfd8cc] hover:border-emerald-500 hover:shadow-xs'
                                  : 'bg-slate-50/50 border-slate-200 opacity-70'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Left Status Icon Circle */}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                  isApproved
                                    ? 'bg-emerald-600 text-white'
                                    : isRegular
                                    ? 'bg-amber-500 text-white'
                                    : canCourse
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-400'
                                }`}>
                                  {isApproved ? (
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  ) : isRegular ? (
                                    <Clock className="w-4 h-4" />
                                  ) : canCourse ? (
                                    <BookOpen className="w-4 h-4" />
                                  ) : (
                                    <Lock className="w-4 h-4" />
                                  )}
                                </div>

                                {/* Subject Details */}
                                <div className="min-w-0">
                                  <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono font-bold text-slate-700">{subject.code}</span>
                                    <span>•</span>
                                    <span className={badgeBg}>{badgeText}</span>
                                  </div>
                                  <h3 className="text-sm font-bold text-slate-900 truncate">
                                    {subject.name}
                                  </h3>
                                  <div className="text-[11px] text-slate-400 truncate">
                                    Año {subject.year} • Req: {subject.rawPrereqsText || 'Ninguno'}
                                  </div>
                                </div>
                              </div>

                              {/* State Tap Trigger Pill */}
                              <div className="shrink-0">
                                <span className={`text-[11px] px-3 py-1 rounded-xl font-extrabold ${
                                  isApproved
                                    ? 'bg-emerald-700 text-white'
                                    : isRegular
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}>
                                  {isApproved ? 'Aprobada' : isRegular ? 'Regular' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-slate-300 py-10 border-t border-slate-800 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <button
            onClick={() => setIsFlappyOpen(true)}
            className="flex items-center gap-3 text-left group cursor-pointer p-1.5 -m-1.5 rounded-2xl hover:bg-slate-800/80 transition-all active:scale-95"
            title="🎮 ¡Tocá acá para jugar al Easter Egg de Flappy Unidad!"
          >
            <UnidadVeterinariaEmblem className="w-10 h-10 group-hover:scale-110 transition-transform shadow-xs" />
            <div>
              <p className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                UNIDAD VETERINARIA
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  🎮 Easter Egg
                </span>
              </p>
              <p className="text-slate-400 text-[11px]">Facultad de Ciencias Veterinarias • UNR Casilda</p>
            </div>
          </button>
          <p className="text-slate-500 text-center sm:text-right">
            Plan 2009 • Resolución C.D. Nº 30/2026
          </p>
        </div>
      </footer>

      {/* Easter Egg Flappy Unidad Game Modal */}
      <FlappyUnidadModal
        isOpen={isFlappyOpen}
        onClose={() => setIsFlappyOpen(false)}
      />

    </div>
  );
}
