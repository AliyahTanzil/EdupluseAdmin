/**
 * ReportCard Page
 * 
 * Full-featured report card with:
 * - All 3 terms side-by-side (Test1, Test2, Mean, Rank per term)
 * - Performance ratings (Cognitive, Affective, Psychomotor)
 * - Attendance per term
 * - Summary (Total, Average, Position, Grade)
 * - Auto-calculation of Mean = (Test1 + Test2) / 2
 * - Color coding: green (high), yellow (average), red (low)
 * - Editable mode for teachers
 * - PDF export via print
 * - Responsive: horizontal scroll on mobile
 */
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Edit3, Save, Download, Eye } from 'lucide-react';
import {
  ReportHeader,
  ScoreTable,
  PerformanceSection,
  AttendanceSection,
  SummarySection,
  SignatureSection,
} from '../components/ReportCard';
import { exampleReportCard } from '../models/reportCardSchema';
import { calculateMean, recalculateAllMeans } from '../utils/reportCardUtils';
import '../styles/reportCardStyles.css';

const ReportCardPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reportRef = useRef(null);

  // ─── State ─────────────────────────────────────────────────────────
  const [reportData, setReportData] = useState(() => recalculateAllMeans(exampleReportCard));
  const [isEditable, setIsEditable] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  // ─── Handlers ──────────────────────────────────────────────────────

  const handleScoreChange = useCallback((subjectId, term, field, value) => {
    setReportData((prev) => {
      const updated = { ...prev };
      updated.subjects = prev.subjects.map((subj) => {
        if (subj.subjectId !== subjectId) return subj;
        const termData = { ...subj.terms[term], [field]: parseFloat(value) || 0 };
        // Auto-calculate mean
        termData.mean = calculateMean(termData.test1, termData.test2);
        return {
          ...subj,
          terms: { ...subj.terms, [term]: termData },
        };
      });
      return updated;
    });
  }, []);

  const handleRemarkChange = useCallback((field, value) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleSection = useCallback((section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Use browser's print-to-PDF
    window.print();
  };

  const toggleEdit = () => setIsEditable((prev) => !prev);

  // ─── School & Student data shorthand ───────────────────────────────
  const school = {
    schoolName: reportData.schoolName,
    schoolAddress: reportData.schoolAddress,
    schoolLogo: reportData.schoolLogo,
    schoolMotto: reportData.schoolMotto,
    schoolPhone: reportData.schoolPhone,
    schoolEmail: reportData.schoolEmail,
  };

  const student = {
    studentName: reportData.studentName,
    admissionNo: reportData.admissionNo,
    class: reportData.class,
    section: reportData.section,
    gender: reportData.gender,
    dateOfBirth: reportData.dateOfBirth,
  };

  // ─── Collapsible wrapper for mobile ────────────────────────────────
  const CollapsibleSection = ({ id: sectionId, title, children, defaultOpen = true }) => {
    const isCollapsed = collapsedSections[sectionId] ?? !defaultOpen;
    return (
      <div className="md:contents">
        {/* Toggle visible only on mobile */}
        <div
          className="rc-collapsible-toggle md:hidden"
          onClick={() => toggleSection(sectionId)}
        >
          <span>{title}</span>
          <span className="text-lg">{isCollapsed ? '▸' : '▾'}</span>
        </div>
        <div className={`rc-collapsible-content md:!max-h-none md:!opacity-100 ${isCollapsed ? 'collapsed' : 'expanded'} md:block`}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1100px] mx-auto px-2 sm:px-4 py-4">
      {/* ══════ Toolbar (hidden on print) ══════ */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            📄 Report Card
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            {isEditable ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Printer size={16} /> Print
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* ══════ THE REPORT CARD ══════ */}
      <div
        id="report-card-full"
        ref={reportRef}
        className="bg-white border-2 border-gray-800 shadow-lg print:shadow-none print:border-black"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {/* ──── Header & Student Info ──── */}
        <ReportHeader
          school={school}
          student={student}
          academicYear={reportData.academicYear}
          currentTerm={reportData.currentTerm}
        />

        {/* ──── Academic Scores Table ──── */}
        <CollapsibleSection id="scores" title="📚 Academic Scores" defaultOpen={true}>
          <div className="rc-scroll-wrapper">
            <ScoreTable
              subjects={reportData.subjects}
              summary={reportData.summary}
              isEditable={isEditable}
              onScoreChange={handleScoreChange}
            />
          </div>
        </CollapsibleSection>

        {/* ──── Performance Ratings ──── */}
        <CollapsibleSection id="performance" title="📊 Performance Ratings" defaultOpen={true}>
          <PerformanceSection ratings={reportData.ratings} />
        </CollapsibleSection>

        {/* ──── Attendance & Summary ──── */}
        <CollapsibleSection id="summary" title="📋 Attendance & Summary" defaultOpen={true}>
          <div className="border-t-2 border-gray-800 px-4 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceSection attendance={reportData.attendance} />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2 flex items-center gap-1">
                  🏆 Quick Overview
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((t) => {
                    const s = reportData.summary?.[t] || {};
                    const gradeColors = {
                      'A+': 'from-emerald-500 to-emerald-600',
                      A: 'from-emerald-500 to-emerald-600',
                      B: 'from-blue-500 to-blue-600',
                      C: 'from-yellow-500 to-yellow-600',
                      D: 'from-orange-500 to-orange-600',
                      E: 'from-red-500 to-red-600',
                      F: 'from-red-600 to-red-700',
                    };
                    const bg = gradeColors[s.overallGrade] || 'from-gray-400 to-gray-500';
                    return (
                      <div
                        key={t}
                        className={`bg-gradient-to-br ${bg} text-white rounded-lg p-3 text-center shadow-sm`}
                      >
                        <div className="text-xs opacity-80 font-medium">Term {t}</div>
                        <div className="text-2xl font-bold mt-1">{s.overallGrade || '—'}</div>
                        <div className="text-xs mt-1 opacity-90">{s.average ? `${s.average}%` : '—'}</div>
                        <div className="text-xs opacity-80 mt-0.5">
                          {s.position ? `Pos: ${s.position}/${s.totalStudents}` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <SummarySection summary={reportData.summary} attendance={reportData.attendance} />
        </CollapsibleSection>

        {/* ──── Remarks & Signatures ──── */}
        <SignatureSection
          data={reportData}
          schoolName={reportData.schoolName}
          isEditable={isEditable}
          onRemarkChange={handleRemarkChange}
        />
      </div>
    </div>
  );
};

export default ReportCardPage;
