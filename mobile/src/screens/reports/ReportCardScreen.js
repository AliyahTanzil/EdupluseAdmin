/**
 * ReportCardScreen — React Native
 *
 * Card-based, scrollable report card optimised for small screens.
 * Each term is a horizontally-swipeable card; performance ratings are
 * collapsible accordion sections.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  getScoreColor,
  getMeanColor,
  getGradeColor,
  getOrdinal,
  getRankBadge,
  ratingToLabel,
  ratingToColor,
  RATING_LABELS,
} from '../../utils/reportCardUtils';

// ─── Sample data (same shape as web) ───────────────────────────────
import { exampleData } from './reportCardData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const SectionHeader = ({ title, icon, onToggle, isOpen }) => (
  <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
    <Text style={styles.sectionHeaderText}>
      {icon} {title}
    </Text>
    <Text style={styles.chevron}>{isOpen ? '▾' : '▸'}</Text>
  </TouchableOpacity>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

// ─── Score Card per Subject (shows all 3 terms) ────────────────────
const SubjectCard = ({ subject, index }) => (
  <View style={styles.subjectCard}>
    <View style={styles.subjectCardHeader}>
      <Text style={styles.subjectIndex}>{index}</Text>
      <Text style={styles.subjectName}>{subject.subjectName}</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.termRow}>
        {[1, 2, 3].map((t) => {
          const d = subject.terms?.[t] || {};
          return (
            <View key={t} style={styles.termBlock}>
              <Text style={styles.termLabel}>Term {t}</Text>
              <View style={styles.scoreRow}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>T1</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(d.test1) }]}>
                    {d.test1 ?? '—'}
                  </Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>T2</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(d.test2) }]}>
                    {d.test2 ?? '—'}
                  </Text>
                </View>
                <View style={[styles.scoreItem, styles.meanItem]}>
                  <Text style={styles.scoreLabel}>Mn</Text>
                  <Text style={[styles.scoreValue, styles.meanValue, { color: getMeanColor(d.mean) }]}>
                    {d.mean ?? '—'}
                  </Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Rnk</Text>
                  <Text style={styles.rankValue}>
                    {getRankBadge(d.rank)} {d.rank || '—'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  </View>
);

// ─── Rating Row ────────────────────────────────────────────────────
const RatingRow = ({ trait, label, data }) => (
  <View style={styles.ratingRow}>
    <Text style={styles.ratingTrait}>{label}</Text>
    {[1, 2, 3].map((t) => {
      const val = data?.[t]?.[trait];
      return (
        <View key={t} style={styles.ratingCell}>
          <Text style={[styles.ratingValue, { color: ratingToColor(val) }]}>
            {ratingToLabel(val)}
          </Text>
        </View>
      );
    })}
  </View>
);

// ─── Quick Overview Cards ──────────────────────────────────────────
const TermOverviewCard = ({ term, summary }) => {
  const s = summary || {};
  const bgColors = {
    'A+': '#059669', A: '#059669', B: '#2563eb',
    C: '#ca8a04', D: '#ea580c', E: '#dc2626', F: '#dc2626',
  };
  const bg = bgColors[s.overallGrade] || '#6b7280';

  return (
    <View style={[styles.overviewCard, { backgroundColor: bg }]}>
      <Text style={styles.overviewTermLabel}>Term {term}</Text>
      <Text style={styles.overviewGrade}>{s.overallGrade || '—'}</Text>
      <Text style={styles.overviewAvg}>{s.average ? `${s.average}%` : '—'}</Text>
      <Text style={styles.overviewPos}>
        {s.position ? `${getOrdinal(s.position)} / ${s.totalStudents}` : '—'}
      </Text>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

const ReportCardScreen = ({ navigation, route }) => {
  const data = route?.params?.reportData || exampleData;

  const [sections, setSections] = useState({
    scores: true,
    performance: false,
    attendance: false,
    summary: false,
  });

  const toggle = (key) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ──── School Header ──── */}
      <View style={styles.schoolHeader}>
        <Text style={styles.schoolName}>
          {data.schoolName || 'EDUPLUS INTERNATIONAL ACADEMY'}
        </Text>
        <Text style={styles.schoolMotto}>{data.schoolMotto || 'Excellence in Education'}</Text>
        <View style={styles.reportBadge}>
          <Text style={styles.reportBadgeText}>STUDENT REPORT CARD</Text>
        </View>
      </View>

      {/* ──── Student Info ──── */}
      <View style={styles.infoSection}>
        <InfoRow label="Name" value={data.studentName} />
        <InfoRow label="Class" value={`${data.class} (${data.section})`} />
        <InfoRow label="Adm. No" value={data.admissionNo} />
        <InfoRow label="Gender" value={data.gender} />
        <InfoRow label="Academic Year" value={data.academicYear} />
      </View>

      {/* ──── Quick Overview ──── */}
      <View style={styles.overviewRow}>
        {[1, 2, 3].map((t) => (
          <TermOverviewCard key={t} term={t} summary={data.summary?.[t]} />
        ))}
      </View>

      {/* ──── Academic Scores ──── */}
      <SectionHeader
        title="Academic Scores"
        icon="📚"
        isOpen={sections.scores}
        onToggle={() => toggle('scores')}
      />
      {sections.scores && (
        <View>
          {data.subjects?.map((subj, idx) => (
            <SubjectCard key={subj.subjectId} subject={subj} index={idx + 1} />
          ))}
        </View>
      )}

      {/* ──── Performance Ratings ──── */}
      <SectionHeader
        title="Performance Ratings"
        icon="📊"
        isOpen={sections.performance}
        onToggle={() => toggle('performance')}
      />
      {sections.performance && (
        <View style={styles.ratingsContainer}>
          {['cognitive', 'affective', 'psychomotor'].map((category) => (
            <View key={category} style={styles.ratingCategory}>
              <Text style={styles.ratingCategoryTitle}>
                {category === 'cognitive' ? '🧠' : category === 'affective' ? '💜' : '🏃'}{' '}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              {/* Header */}
              <View style={styles.ratingRow}>
                <Text style={[styles.ratingTrait, { fontWeight: '700' }]}>Trait</Text>
                {[1, 2, 3].map((t) => (
                  <View key={t} style={styles.ratingCell}>
                    <Text style={styles.ratingHeaderText}>T{t}</Text>
                  </View>
                ))}
              </View>
              {Object.keys(RATING_LABELS[category]).map((trait) => (
                <RatingRow
                  key={trait}
                  trait={trait}
                  label={RATING_LABELS[category][trait]}
                  data={data.ratings?.[category]}
                />
              ))}
            </View>
          ))}
        </View>
      )}

      {/* ──── Attendance ──── */}
      <SectionHeader
        title="Attendance"
        icon="📋"
        isOpen={sections.attendance}
        onToggle={() => toggle('attendance')}
      />
      {sections.attendance && (
        <View style={styles.attendanceContainer}>
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingTrait, { fontWeight: '700' }]}>Metric</Text>
            {[1, 2, 3].map((t) => (
              <View key={t} style={styles.ratingCell}>
                <Text style={styles.ratingHeaderText}>T{t}</Text>
              </View>
            ))}
          </View>
          {[
            { key: 'totalDays', label: 'Total Days' },
            { key: 'onTime', label: 'On Time' },
            { key: 'late', label: 'Late' },
            { key: 'absent', label: 'Absent' },
          ].map((row) => (
            <View key={row.key} style={styles.ratingRow}>
              <Text style={styles.ratingTrait}>{row.label}</Text>
              {[1, 2, 3].map((t) => (
                <View key={t} style={styles.ratingCell}>
                  <Text
                    style={[
                      styles.ratingValue,
                      row.key === 'onTime' && { color: '#059669', fontWeight: '700' },
                      row.key === 'absent' && { color: '#dc2626', fontWeight: '700' },
                      row.key === 'late' && { color: '#ca8a04', fontWeight: '700' },
                    ]}
                  >
                    {data.attendance?.[t]?.[row.key] ?? '—'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* ──── Summary ──── */}
      <SectionHeader
        title="Summary"
        icon="🏆"
        isOpen={sections.summary}
        onToggle={() => toggle('summary')}
      />
      {sections.summary && (
        <View style={styles.summaryContainer}>
          {[1, 2, 3].map((t) => {
            const s = data.summary?.[t] || {};
            return (
              <View key={t} style={styles.summaryTermCard}>
                <Text style={styles.summaryTermTitle}>Term {t}</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Score</Text>
                  <Text style={styles.summaryValue}>{s.totalScore}/{s.maxPossible}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Average</Text>
                  <Text style={[styles.summaryValue, { color: '#2563eb' }]}>{s.average}%</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Grade</Text>
                  <Text style={[styles.summaryValue, { color: getGradeColor(s.overallGrade), fontSize: 18 }]}>
                    {s.overallGrade}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Position</Text>
                  <Text style={styles.summaryValue}>{getOrdinal(s.position)} / {s.totalStudents}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Remark</Text>
                  <Text style={[styles.summaryValue, { color: getGradeColor(s.overallGrade) }]}>
                    {s.performanceRemark}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* ──── Signatures ──── */}
      <View style={styles.signaturesSection}>
        <View style={styles.signatureLine}>
          <View style={styles.signatureBar} />
          <Text style={styles.signatureLabel}>Class Teacher</Text>
        </View>
        <View style={styles.signatureLine}>
          <View style={styles.signatureBar} />
          <Text style={styles.signatureLabel}>Principal</Text>
        </View>
        <View style={styles.signatureLine}>
          <View style={styles.signatureBar} />
          <Text style={styles.signatureLabel}>Parent / Guardian</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This report card is the property of {data.schoolName || 'EduPlus Academy'}.
        </Text>
      </View>
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingBottom: 40 },

  // School Header
  schoolHeader: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  schoolName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  schoolMotto: {
    color: '#94a3b8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  reportBadge: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  reportBadgeText: {
    color: '#1e3a5f',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },

  // Student Info
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    width: 100,
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 12,
  },
  infoValue: {
    flex: 1,
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 12,
  },

  // Overview Cards
  overviewRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  overviewTermLabel: { color: '#ffffffcc', fontSize: 10, fontWeight: '600' },
  overviewGrade: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 2 },
  overviewAvg: { color: '#ffffffdd', fontSize: 11, marginTop: 2 },
  overviewPos: { color: '#ffffffbb', fontSize: 10, marginTop: 2 },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sectionHeaderText: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  chevron: { fontSize: 16, color: '#6b7280' },

  // Subject Card
  subjectCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 6,
    borderRadius: 8,
    padding: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectIndex: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    width: 20,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  termRow: { flexDirection: 'row', gap: 12 },
  termBlock: {
    width: SCREEN_WIDTH * 0.42,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 8,
  },
  termLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around' },
  scoreItem: { alignItems: 'center', minWidth: 30 },
  scoreLabel: { fontSize: 9, color: '#9ca3af', fontWeight: '600' },
  scoreValue: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  meanItem: {
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  meanValue: { fontWeight: '800' },
  rankValue: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  // Ratings
  ratingsContainer: { paddingHorizontal: 12, marginTop: 6 },
  ratingCategory: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ratingCategoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  ratingTrait: {
    flex: 1,
    fontSize: 11,
    color: '#4b5563',
  },
  ratingCell: {
    width: 40,
    alignItems: 'center',
  },
  ratingHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Attendance
  attendanceContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 6,
    borderRadius: 8,
    padding: 10,
    elevation: 1,
  },

  // Summary
  summaryContainer: {
    paddingHorizontal: 12,
    marginTop: 6,
    gap: 8,
  },
  summaryTermCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryTermTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  summaryValue: { fontSize: 12, color: '#1f2937', fontWeight: '700' },

  // Signatures
  signaturesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  signatureLine: { alignItems: 'center' },
  signatureBar: {
    width: '80%',
    height: 1,
    backgroundColor: '#1f2937',
    marginBottom: 4,
    marginTop: 30,
  },
  signatureLabel: { fontSize: 10, fontWeight: '600', color: '#6b7280' },

  // Footer
  footer: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ReportCardScreen;
