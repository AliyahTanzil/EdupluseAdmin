import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Printer } from 'lucide-react';
import { gradesAPI } from '../services/api';

const StudentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2025/2026');

  useEffect(() => {
    if (id) loadReportCard();
  }, [id, selectedTerm, selectedYear]);

  const loadReportCard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gradesAPI.getStudentReportCard(id, {
        term: selectedTerm,
        academic_year: selectedYear,
      });
      if (response.success) {
        setReportCard(response.data);
      } else {
        setError(response.message || 'Failed to load report card');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading the report card');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const getGradeColor = (grade) => {
    const m = { A: '#16a34a', B: '#2563eb', C: '#ca8a04', D: '#ea580c', F: '#dc2626' };
    return m[grade] || '#6b7280';
  };

  if (loading) return <LoadingSpinner message="Loading student results..." />;

  const school = reportCard?.school || {};
  const student = reportCard?.student || {};
  const grades = reportCard?.grades || [];
  const summary = reportCard?.summary || {};
  const attendance = reportCard?.attendance || {};

  // Group grades by category
  const grouped = {};
  grades.forEach(g => {
    const cat = g.subject_category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(g);
  });

  const gradingKey = [
    { range: '90 – 100', grade: 'A', desc: 'Excellent' },
    { range: '80 – 89', grade: 'B', desc: 'Very Good' },
    { range: '70 – 79', grade: 'C', desc: 'Good' },
    { range: '60 – 69', grade: 'D', desc: 'Satisfactory' },
    { range: '50 – 59', grade: 'E', desc: 'Fair' },
    { range: '0 – 49', grade: 'F', desc: 'Fail' },
  ];

  let rowNumber = 0;

  return (
    <div className="max-w-[900px] mx-auto">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Controls — hidden on print */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Student Report Card</h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
          </select>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* ============== REPORT CARD ============== */}
      <div id="report-card" className="bg-white border-2 border-gray-800 print:border-black" style={{ fontFamily: 'serif' }}>

        {/* ---- School Header ---- */}
        <div className="border-b-2 border-gray-800 px-6 py-4 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wide" style={{ letterSpacing: '2px' }}>
            {school.name || 'EDUPLUS ACADEMY'}
          </h2>
          {school.address && <p className="text-sm mt-1">{school.address}</p>}
          {(school.phone || school.email) && (
            <p className="text-xs mt-0.5">
              {school.phone && `Tel: ${school.phone}`}{school.phone && school.email && ' | '}{school.email && `Email: ${school.email}`}
            </p>
          )}
          <p className="text-xs italic mt-1">{school.motto || 'Excellence in Education'}</p>
          <div className="mt-2 inline-block border-2 border-gray-800 px-6 py-1">
            <span className="text-lg font-bold uppercase tracking-wider">Student Report Card</span>
          </div>
        </div>

        {/* ---- Student Information ---- */}
        <div className="border-b-2 border-gray-800 px-6 py-3">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-semibold w-1/6">Name:</td>
                <td className="py-1 border-b border-dotted border-gray-400 w-1/3">{student.name}</td>
                <td className="py-1 font-semibold w-1/6 pl-4">Class:</td>
                <td className="py-1 border-b border-dotted border-gray-400 w-1/3">{student.class}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Admission No:</td>
                <td className="py-1 border-b border-dotted border-gray-400">{student.roll}</td>
                <td className="py-1 font-semibold pl-4">Gender:</td>
                <td className="py-1 border-b border-dotted border-gray-400">{student.gender || '—'}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Term:</td>
                <td className="py-1 border-b border-dotted border-gray-400">Term {reportCard?.term}</td>
                <td className="py-1 font-semibold pl-4">Academic Year:</td>
                <td className="py-1 border-b border-dotted border-gray-400">{reportCard?.academic_year}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Date of Birth:</td>
                <td className="py-1 border-b border-dotted border-gray-400">{student.date_of_birth || '—'}</td>
                <td className="py-1 font-semibold pl-4">Position:</td>
                <td className="py-1 border-b border-dotted border-gray-400 font-bold">
                  {summary.classPosition ? `${summary.classPosition} out of ${summary.totalInClass}` : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ---- Grades Table ---- */}
        <div className="px-4 py-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-2 py-2 text-center w-8">S/N</th>
                <th className="border border-gray-800 px-2 py-2 text-left">SUBJECTS</th>
                <th className="border border-gray-800 px-2 py-2 text-center w-14">
                  <div>CA 1</div><div className="text-xs font-normal">(20)</div>
                </th>
                <th className="border border-gray-800 px-2 py-2 text-center w-14">
                  <div>CA 2</div><div className="text-xs font-normal">(20)</div>
                </th>
                <th className="border border-gray-800 px-2 py-2 text-center w-14">
                  <div>EXAM</div><div className="text-xs font-normal">(60)</div>
                </th>
                <th className="border border-gray-800 px-2 py-2 text-center w-16">
                  <div>TOTAL</div><div className="text-xs font-normal">(100)</div>
                </th>
                <th className="border border-gray-800 px-2 py-2 text-center w-14">GRADE</th>
                <th className="border border-gray-800 px-2 py-2 text-center w-14">POS.</th>
                <th className="border border-gray-800 px-2 py-2 text-left">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grouped).length > 0 ? (
                Object.entries(grouped).map(([category, subjectList]) => (
                  <React.Fragment key={category}>
                    {Object.keys(grouped).length > 1 && (
                      <tr className="bg-gray-50">
                        <td colSpan={9} className="border border-gray-800 px-2 py-1 font-bold text-xs uppercase tracking-wider text-gray-600">
                          {category}
                        </td>
                      </tr>
                    )}
                    {subjectList.map((grade) => {
                      rowNumber++;
                      return (
                        <tr key={grade.subject_id} className="hover:bg-blue-50">
                          <td className="border border-gray-800 px-2 py-1.5 text-center">{rowNumber}</td>
                          <td className="border border-gray-800 px-2 py-1.5 font-medium">{grade.subject_name}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center">{grade.ca1 ?? '—'}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center">{grade.ca2 ?? '—'}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center">{grade.exam ?? '—'}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center font-bold">{grade.total || '—'}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center font-bold"
                            style={{ color: getGradeColor(grade.grade) }}>{grade.grade || '—'}</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-center">—</td>
                          <td className="border border-gray-800 px-2 py-1.5 text-xs">{grade.interpretation || grade.remarks || '—'}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="border border-gray-800 px-4 py-8 text-center text-gray-400 italic">
                    No grades recorded for Term {selectedTerm}, {selectedYear}.
                  </td>
                </tr>
              )}
              {grades.length > 0 && (
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={2} className="border border-gray-800 px-2 py-2 text-right uppercase">Total / Average</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{grades.reduce((s, g) => s + (g.ca1 || 0), 0) || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{grades.reduce((s, g) => s + (g.ca2 || 0), 0) || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{grades.reduce((s, g) => s + (g.exam || 0), 0) || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center text-blue-700">{summary.totalScore}/{summary.maxPossibleScore}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center text-lg" style={{ color: getGradeColor(summary.overallGrade) }}>{summary.overallGrade}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{summary.classPosition || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs">Avg: {summary.averageScore}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---- Grading Key + Attendance + Performance ---- */}
        <div className="border-t-2 border-gray-800 px-4 py-3">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-sm mb-1 uppercase">Grading Key</h4>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-600 px-2 py-1">Mark Range</th>
                    <th className="border border-gray-600 px-2 py-1">Grade</th>
                    <th className="border border-gray-600 px-2 py-1">Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingKey.map(gk => (
                    <tr key={gk.grade}>
                      <td className="border border-gray-600 px-2 py-0.5 text-center">{gk.range}</td>
                      <td className="border border-gray-600 px-2 py-0.5 text-center font-bold">{gk.grade}</td>
                      <td className="border border-gray-600 px-2 py-0.5">{gk.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1 uppercase">Attendance Summary</h4>
              <table className="w-full border-collapse text-xs mb-3">
                <tbody>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Total School Days</td><td className="border border-gray-600 px-2 py-1 text-center">{attendance.totalDays}</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Days Present</td><td className="border border-gray-600 px-2 py-1 text-center text-green-700 font-bold">{attendance.present}</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Days Absent</td><td className="border border-gray-600 px-2 py-1 text-center text-red-700 font-bold">{attendance.absent}</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Attendance Rate</td><td className="border border-gray-600 px-2 py-1 text-center font-bold">{attendance.attendanceRate}</td></tr>
                </tbody>
              </table>
              <h4 className="font-bold text-sm mb-1 uppercase">Performance Summary</h4>
              <table className="w-full border-collapse text-xs">
                <tbody>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Total Marks</td><td className="border border-gray-600 px-2 py-1 text-center font-bold">{summary.totalScore}/{summary.maxPossibleScore}</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Average</td><td className="border border-gray-600 px-2 py-1 text-center font-bold">{summary.averageScore}%</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Overall Grade</td><td className="border border-gray-600 px-2 py-1 text-center font-bold text-lg" style={{ color: getGradeColor(summary.overallGrade) }}>{summary.overallGrade}</td></tr>
                  <tr><td className="border border-gray-600 px-2 py-1 font-semibold bg-gray-50">Position in Class</td><td className="border border-gray-600 px-2 py-1 text-center font-bold">{summary.classPosition ? `${summary.classPosition} / ${summary.totalInClass}` : '—'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---- Remarks & Signatures ---- */}
        <div className="border-t-2 border-gray-800 px-6 py-4">
          <div className="mb-4">
            <p className="font-bold text-sm">Class Teacher's Remark:</p>
            <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-4 min-h-[30px] text-sm italic text-gray-600">
              {summary.overallGrade === 'A' ? 'An excellent performance. Keep up the outstanding work!' :
               summary.overallGrade === 'B' ? 'Very good performance. Continue to aim higher!' :
               summary.overallGrade === 'C' ? 'Good effort. There is room for improvement.' :
               summary.overallGrade === 'D' ? 'Satisfactory. More dedication and hard work is needed.' :
               summary.overallGrade === 'F' ? 'Below average. Requires urgent attention and improvement.' :
               grades.length === 0 ? '' : 'Keep working hard.'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-6">
            <div className="text-center">
              <div className="border-b-2 border-gray-800 mb-1 pb-6"></div>
              <p className="text-xs font-semibold">Class Teacher's Signature</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-800 mb-1 pb-6"></div>
              <p className="text-xs font-semibold">Principal's Signature</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-800 mb-1 pb-6"></div>
              <p className="text-xs font-semibold">Parent's Signature</p>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            <p className="italic">This report card is the property of {school.name || 'EduPlus Academy'}. If found, please return to the school.</p>
            <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; margin: 0; padding: 10px; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentResults;