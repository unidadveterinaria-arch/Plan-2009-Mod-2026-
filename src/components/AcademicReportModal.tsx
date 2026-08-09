import React, { useRef } from 'react';
import { StudentProgress } from '../types';
import { SUBJECTS } from '../data/subjects';
import { X, Printer, Copy, Check, GraduationCap, Calendar } from 'lucide-react';

interface AcademicReportModalProps {
  progress: StudentProgress;
  onClose: () => void;
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  progress,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const total = SUBJECTS.length;
  let aprobadasCount = 0;
  let regularizedCount = 0;

  for (const s of SUBJECTS) {
    const st = progress[s.code] || 'pendiente';
    if (st === 'aprobada') aprobadasCount++;
    else if (st === 'regular') regularizedCount++;
  }

  const percentage = Math.round((aprobadasCount / total) * 100);
  const todayDate = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleCopyText = () => {
    let summaryText = `🎓 *Mi Avance en Medicina Veterinaria (FCV-UNR)* 🎓\n`;
    summaryText += `📅 Fecha: ${todayDate}\n`;
    summaryText += `📊 Avance General: ${percentage}% (${aprobadasCount}/${total} Aprobadas)\n`;
    summaryText += `⭐ Regularizadas (Listas para Final): ${regularizedCount}\n\n`;

    summaryText += `*Detalle por Año:*\n`;
    [1, 2, 3, 4, 5, 6].forEach((y) => {
      const yrSubs = SUBJECTS.filter((s) => s.year === y);
      const approvedYr = yrSubs.filter((s) => progress[s.code] === 'aprobada').length;
      summaryText += `• ${y}º Año: ${approvedYr}/${yrSubs.length} Aprobadas\n`;
    });

    summaryText += `\nGenerado con Correlativas FCV-UNR (Plan 2009 / Res. CD 90/2026)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e1e3dd]">
        
        {/* Header toolbar */}
        <div className="p-4 bg-[#003217] text-white flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-[#fec975]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Reporte Académico de Correlatividades
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#fec975]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Resumen'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#fec975] text-[#003217] hover:bg-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-6 text-[#191c19] print:p-0">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-[#003217] pb-4 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#054b26]">
                Universidad Nacional de Rosario • FCV
              </span>
              <h1 className="text-2xl font-bold font-serif text-[#003217] mt-1">
                Ficha de Avance Académico
              </h1>
              <p className="text-xs text-[#707970]">
                Carrera de Medicina Veterinaria (Plan de Estudios 2009 - Res. CD 90/2026)
              </p>
            </div>

            <div className="text-right text-xs text-[#707970]">
              <div className="flex items-center justify-end gap-1 font-semibold text-[#191c19]">
                <Calendar className="w-3.5 h-3.5 text-[#054b26]" />
                <span>{todayDate}</span>
              </div>
              <span className="mt-1 block font-mono font-bold text-[#003217]">
                Estado: {percentage}% Aprobado
              </span>
            </div>
          </div>

          {/* Overview badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#f8faf4] rounded-xl border border-[#e1e3dd] text-center">
            <div>
              <span className="text-2xl font-bold font-serif text-[#003217] block">
                {aprobadasCount} / {total}
              </span>
              <span className="text-xs text-[#707970]">Materias Aprobadas</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-serif text-[#785205] block">
                {regularizedCount}
              </span>
              <span className="text-xs text-[#707970]">Regularizadas</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-serif text-[#191c19] block">
                {percentage}%
              </span>
              <span className="text-xs text-[#707970]">Avance de Carrera</span>
            </div>
          </div>

          {/* Full Table of Subjects */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#191c19] border-b border-[#e1e3dd] pb-1">
              Detalle de Asignaturas y Correlatividades
            </h4>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#003217] text-white">
                  <th className="p-2 font-mono">CÓD.</th>
                  <th className="p-2">ASIGNATURA</th>
                  <th className="p-2 text-center">AÑO</th>
                  <th className="p-2">REQUISITOS PARA RENDIR</th>
                  <th className="p-2 text-center">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3dd]">
                {SUBJECTS.map((sub) => {
                  const st = progress[sub.code] || 'pendiente';
                  return (
                    <tr key={sub.code} className="hover:bg-[#f8faf4]">
                      <td className="p-2 font-mono font-bold text-[#003217]">{sub.code}</td>
                      <td className="p-2 font-semibold text-[#191c19]">{sub.name}</td>
                      <td className="p-2 text-center">{sub.year}º</td>
                      <td className="p-2 text-[#707970] font-mono text-[11px]">{sub.rawPrereqsText}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          st === 'aprobada'
                            ? 'bg-[#003217] text-white'
                            : st === 'regular'
                            ? 'bg-[#fec975] text-[#785205]'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {st}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center text-[11px] text-[#707970] border-t border-[#e1e3dd] pt-4">
            Documento informativo personal para planificación de cursado y exámenes. Facultad de Ciencias Veterinarias, Universidad Nacional de Rosario (Casilda).
          </div>

        </div>

      </div>
    </div>
  );
};
