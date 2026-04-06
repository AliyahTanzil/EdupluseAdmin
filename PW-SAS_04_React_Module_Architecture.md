# PW-SAS — React Module Architecture
## Component Tree for the Web Application
**Version:** 1.0.0 | **Stack:** React 18 + Vite 5 + Material UI 5 + React Query 5 + Zustand 4

---

## 1. Full Project Structure

```
apps/web/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── manifest.json
│
├── src/
│   ├── main.tsx                     # ReactDOM.createRoot, QueryClientProvider, ThemeProvider
│   ├── App.tsx                      # RouterProvider
│   ├── router.tsx                   # All route definitions (see Section 3)
│   │
│   ├── core/                        # App-wide infrastructure — no UI here
│   │   ├── theme/
│   │   │   ├── theme.ts             # MUI createTheme (palette, typography, component overrides)
│   │   │   └── ThemeProvider.tsx    # MUI ThemeProvider + CssBaseline wrapper
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx     # Firebase onAuthStateChanged → AuthContext
│   │   │   ├── useAuth.ts           # hook: { user, role, schoolId, tenantId, loading }
│   │   │   ├── ProtectedRoute.tsx   # redirect to /auth/login if unauthenticated
│   │   │   └── RoleGuard.tsx        # render null + toast if role not in allow[]
│   │   ├── firebase/
│   │   │   ├── config.ts            # initializeApp, getFirestore, getAuth, getStorage, getFunctions
│   │   │   ├── db.ts                # typed Firestore helpers: getDoc, setDoc, query builders
│   │   │   ├── storage.ts           # uploadFile, getDownloadUrl
│   │   │   └── functions.ts         # httpsCallable wrappers (typed)
│   │   ├── store/
│   │   │   ├── schoolStore.ts       # Zustand: { schoolId, tenantId, school, setSchool }
│   │   │   ├── uiStore.ts           # Zustand: { sidebarOpen, activeModal, toast queue }
│   │   │   └── notifStore.ts        # Zustand: { unreadCount, notifications[], markRead }
│   │   └── query/
│   │       └── queryClient.ts       # new QueryClient({ defaultOptions: { staleTime: 5min } })
│   │
│   ├── layout/
│   │   ├── AppShell.tsx             # MUI Box: <Sidebar/> + <Box flex=1><TopBar/><Outlet/></Box>
│   │   ├── Sidebar.tsx              # MUI Drawer, role-filtered NavItem list
│   │   ├── NavItem.tsx              # MUI ListItemButton with icon + label + active highlight
│   │   ├── TopBar.tsx               # MUI AppBar: school name, SearchBar, NotifBell, UserMenu
│   │   ├── SearchBar.tsx            # global student/staff quick search (Autocomplete)
│   │   ├── NotifBell.tsx            # badge icon → opens NotifDrawer
│   │   ├── NotifDrawer.tsx          # slide-in MUI Drawer with notification feed
│   │   ├── UserMenu.tsx             # avatar → Menu: profile, settings, logout
│   │   └── PageWrapper.tsx          # Box with Breadcrumbs + H1 page title + children
│   │
│   ├── pages/                       # Thin route components — compose module components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── students/
│   │   │   ├── StudentsListPage.tsx
│   │   │   ├── StudentProfilePage.tsx
│   │   │   ├── NewStudentPage.tsx
│   │   │   └── StudentReportCardPage.tsx
│   │   ├── staff/
│   │   │   ├── StaffListPage.tsx
│   │   │   ├── StaffProfilePage.tsx
│   │   │   └── TimetablePage.tsx
│   │   ├── attendance/
│   │   │   ├── AttendanceRegisterPage.tsx
│   │   │   └── AttendanceReportsPage.tsx
│   │   ├── exams/
│   │   │   ├── ExamsListPage.tsx
│   │   │   ├── ScoreEntryPage.tsx
│   │   │   └── ResultsPage.tsx
│   │   ├── finance/
│   │   │   ├── FeesPage.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── PaymentsPage.tsx
│   │   │   └── PayrollPage.tsx
│   │   ├── lms/
│   │   │   ├── ContentLibraryPage.tsx
│   │   │   ├── AssignmentsPage.tsx
│   │   │   └── SubmissionsPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboardPage.tsx
│   │   ├── inventory/
│   │   │   └── InventoryPage.tsx
│   │   ├── health/
│   │   │   └── HealthRecordsPage.tsx
│   │   ├── transport/
│   │   │   └── TransportPage.tsx
│   │   └── settings/
│   │       └── SettingsPage.tsx
│   │
│   ├── modules/                     # Feature modules — each is self-contained
│   │   ├── students/
│   │   ├── staff/
│   │   ├── attendance/
│   │   ├── exams/
│   │   ├── finance/
│   │   ├── lms/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   ├── inventory/
│   │   ├── health/
│   │   └── transport/
│   │
│   └── shared/                      # Reusable cross-module building blocks
│       ├── ui/
│       ├── hooks/
│       └── utils/
│
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

## 2. MUI Theme Configuration

```typescript
// core/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary:   { main: '#1D3557', light: '#457B9D', dark: '#0D1B2A' },
    secondary: { main: '#E63946' },
    success:   { main: '#2D6A4F' },
    warning:   { main: '#E9C46A' },
    background:{ default: '#F8F9FA', paper: '#FFFFFF' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontSize: '2rem',   fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem',fontWeight: 500 },
  },
  components: {
    MuiButton:    { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiCard:      { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } } },
    MuiDataGrid:  { defaultProps: { density: 'standard', disableRowSelectionOnClick: true } },
    MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } },
  },
  shape: { borderRadius: 8 }
});
```

---

## 3. Routing Architecture

```typescript
// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login',           element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> }
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },

        // — Students —
        {
          path: 'students',
          element: <RoleGuard allow={['admin','principal','teacher']} />,
          children: [
            { index: true,                  element: <StudentsListPage /> },
            { path: 'new',                  element: <NewStudentPage /> },
            { path: ':studentId',           element: <StudentProfilePage /> },
            { path: ':studentId/report',    element: <StudentReportCardPage /> }
          ]
        },

        // — Staff —
        {
          path: 'staff',
          element: <RoleGuard allow={['admin','principal']} />,
          children: [
            { index: true,         element: <StaffListPage /> },
            { path: ':staffId',    element: <StaffProfilePage /> },
            { path: 'timetable',   element: <TimetablePage /> }
          ]
        },

        // — Attendance —
        {
          path: 'attendance',
          element: <RoleGuard allow={['admin','principal','teacher']} />,
          children: [
            { index: true,       element: <AttendanceRegisterPage /> },
            { path: 'reports',   element: <AttendanceReportsPage /> }
          ]
        },

        // — Exams —
        {
          path: 'exams',
          element: <RoleGuard allow={['admin','principal','teacher']} />,
          children: [
            { index: true,                  element: <ExamsListPage /> },
            { path: ':examId/scores',        element: <ScoreEntryPage /> },
            { path: ':examId/results',       element: <ResultsPage /> }
          ]
        },

        // — Finance —
        {
          path: 'finance',
          element: <RoleGuard allow={['admin','bursar']} />,
          children: [
            { index: true,          element: <FeesPage /> },
            { path: 'invoices',     element: <InvoicesPage /> },
            { path: 'payments',     element: <PaymentsPage /> },
            { path: 'payroll',      element: <PayrollPage /> }
          ]
        },

        // — LMS —
        {
          path: 'lms',
          element: <RoleGuard allow={['admin','principal','teacher']} />,
          children: [
            { index: true,              element: <ContentLibraryPage /> },
            { path: 'assignments',      element: <AssignmentsPage /> },
            { path: ':taskId/submissions', element: <SubmissionsPage /> }
          ]
        },

        // — Analytics —
        { path: 'analytics', element: <RoleGuard allow={['admin','principal','teacher']} />,
          children: [{ index: true, element: <AnalyticsDashboardPage /> }] },

        // — Other modules —
        { path: 'inventory', element: <InventoryPage /> },
        { path: 'health',    element: <HealthRecordsPage /> },
        { path: 'transport', element: <TransportPage /> },
        { path: 'settings',  element: <SettingsPage /> }
      ]
    }]
  }
]);
```

---

## 4. Module Deep-Dives

### 4.1 Students Module

```
modules/students/
├── components/
│   ├── StudentTable.tsx         # MUI DataGrid, sortable/filterable, columns: ID, name, class, status
│   ├── StudentCard.tsx          # compact card for search results and quick view
│   ├── StudentForm.tsx          # multi-step form: Personal → Guardian → Medical → Submit
│   │   ├── Step1Personal.tsx    # name, dob, gender, photo upload, address
│   │   ├── Step2Guardian.tsx    # guardian name, relationship, phone, isPrimary
│   │   └── Step3Medical.tsx     # blood group, allergies, conditions, emergency contact
│   ├── StudentProfile/
│   │   ├── ProfileHeader.tsx    # photo, name, ID badge, QR code, status chip
│   │   ├── ProfileTabs.tsx      # MUI Tabs: Overview | Academic | Finance | Health | Discipline
│   │   ├── OverviewTab.tsx      # bio details, guardian list, quick stats
│   │   ├── AcademicTab.tsx      # term scores table + performance chart
│   │   ├── FinanceTab.tsx       # invoice list + payment history
│   │   ├── HealthTab.tsx        # clinic visits timeline
│   │   └── DisciplineTab.tsx    # disciplinary records table
│   ├── StudentQrCard.tsx        # printable digital ID card component (A6)
│   ├── AttendanceCalendar.tsx   # heatmap calendar (react-calendar-heatmap)
│   ├── PromotionModal.tsx       # promote / transfer / withdraw student dialog
│   └── BulkImportDialog.tsx     # CSV upload → preview table → confirm import
│
├── hooks/
│   ├── useStudents.ts           # useQuery: all students for school+class filter
│   ├── useStudent.ts            # useQuery: single student doc
│   ├── useStudentScores.ts      # useQuery: scores by term/year
│   ├── useStudentAttendance.ts  # useQuery: attendance records → calendar data
│   ├── useCreateStudent.ts      # useMutation: Firestore add + Cloud Function trigger
│   ├── useUpdateStudent.ts      # useMutation: Firestore update
│   └── usePromoteStudents.ts    # useMutation: bulk status update + enrollment update
│
└── services/
    └── studentService.ts        # raw Firestore query functions used by hooks
```

**Key component detail — `StudentTable.tsx`:**

```typescript
const columns: GridColDef[] = [
  { field: 'studentId', headerName: 'ID', width: 130 },
  {
    field: 'name', headerName: 'Name', width: 200, flex: 1,
    renderCell: (p) => (
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <Avatar src={p.row.photo} sx={{ width:32, height:32 }}>{p.row.name.first[0]}</Avatar>
        <Typography variant="body2">{p.row.name.first} {p.row.name.last}</Typography>
      </Box>
    )
  },
  { field: 'className',    headerName: 'Class',     width: 120 },
  { field: 'gender',       headerName: 'Gender',    width: 100 },
  {
    field: 'status', headerName: 'Status', width: 120,
    renderCell: (p) => <StatusChip status={p.value} />
  },
  {
    field: 'dropoutRisk', headerName: 'Risk', width: 100,
    renderCell: (p) => p.value ? <RiskBadge level={p.value} /> : null
  },
  {
    field: 'actions', type: 'actions',
    getActions: (p) => [
      <GridActionsCellItem icon={<VisibilityIcon />} label="View"
        onClick={() => navigate(`/students/${p.id}`)} />,
      <GridActionsCellItem icon={<EditIcon />} label="Edit"
        onClick={() => openEditModal(p.row)} />
    ]
  }
];
```

---

### 4.2 Staff Module

```
modules/staff/
├── components/
│   ├── StaffTable.tsx           # DataGrid: name, role, subjects, status, evaluation grade
│   ├── StaffForm.tsx            # name, role, qualifications, salary, document upload
│   ├── StaffProfile/
│   │   ├── ProfileHeader.tsx    # photo, name, staffId, role chip, hire date
│   │   ├── ProfileTabs.tsx      # Overview | Subjects | Attendance | Evaluation | Payslips
│   │   ├── SubjectsTab.tsx      # subject-class assignment table + add assignment
│   │   ├── AttendanceTab.tsx    # monthly attendance grid with punctuality stats
│   │   └── EvaluationTab.tsx    # term evaluation cards with radar chart
│   ├── TimetableGrid.tsx        # 6-day × 8-period grid, drag-and-drop period assignment
│   ├── LeaveRequestModal.tsx    # leave type, dates, reason → submit to admin
│   └── PayslipCard.tsx          # monthly payslip: gross, deductions breakdown, net
│
├── hooks/
│   ├── useStaff.ts
│   ├── useStaffMember.ts
│   ├── useSubjectAssignments.ts
│   └── useStaffAttendance.ts
│
└── services/
    └── staffService.ts
```

---

### 4.3 Attendance Module

```
modules/attendance/
├── components/
│   ├── ClassSelector.tsx         # Autocomplete: select class for today's register
│   ├── AttendanceRegister.tsx    # student list with Present/Absent/Late/Excused radio chips
│   ├── AttendanceRow.tsx         # single student row: avatar, name, status toggle, note
│   ├── QrScannerModal.tsx        # live camera feed (expo-compatible via jsQR) → auto-marks present
│   ├── AttendanceStatusChip.tsx  # color-coded chip: green/red/amber/blue
│   ├── AttendanceSummaryBar.tsx  # progress bar: X present / Y total
│   ├── AttendanceHeatmap.tsx     # react-calendar-heatmap for student history view
│   ├── AttendanceReportTable.tsx # DataGrid: student × date grid with status cells
│   └── LowAttendanceAlert.tsx    # banner listing students below 75% threshold
│
├── hooks/
│   ├── useClassAttendance.ts     # useQuery: today's records for a class
│   ├── useMarkAttendance.ts      # useMutation: batch write attendance docs
│   ├── useStudentAttendanceHistory.ts
│   └── useAttendanceSummary.ts   # school-wide stats for dashboard
│
└── services/
    └── attendanceService.ts
```

**Key pattern — `AttendanceRegister.tsx`:**

```typescript
// Optimistic UI: mark locally, sync to Firestore in background
const { mutate: markAll } = useMarkAttendance();

const handleSubmit = () => {
  const records = students.map(s => ({
    studentId:  s.studentId,
    classId,
    schoolId,
    date:       today,
    dateString: todayString,
    status:     localStatus[s.studentId] ?? 'absent',
    method:     'manual',
    markedBy:   currentUser.staffId,
    parentNotified: false,
    createdAt:  serverTimestamp()
  }));
  markAll(records, {
    onSuccess: () => toast.success('Attendance saved'),
    onError:   (e) => toast.error(`Failed: ${e.message}`)
  });
};
```

---

### 4.4 Exams Module

```
modules/exams/
├── components/
│   ├── ExamList.tsx              # cards per exam: subject, type, date, published badge
│   ├── ExamForm.tsx              # create exam: subject, class, type, weights, date
│   ├── ScoreEntryTable.tsx       # DataGrid: student row × CA score + Exam score inputs
│   ├── ScoreInputCell.tsx        # controlled number input with validation (0–max)
│   ├── GradeBadge.tsx            # colored badge: A1=green, F9=red, etc.
│   ├── ResultsTable.tsx          # read-only results: name, CA, exam, total, grade, position
│   ├── ReportCardPreview.tsx     # styled iframe/PDF preview of generated report card
│   ├── PublishExamDialog.tsx     # confirm dialog before publishing results
│   └── GradeDistributionChart.tsx # Recharts BarChart: grade counts per subject
│
├── hooks/
│   ├── useExams.ts
│   ├── useExam.ts
│   ├── useScores.ts
│   ├── useSaveScores.ts          # useMutation: batch upsert scores
│   ├── usePublishExam.ts         # useMutation: calls Cloud Function
│   └── useGenerateReportCard.ts  # useMutation: calls generateReportCard Cloud Function
│
└── services/
    └── examService.ts
```

---

### 4.5 Finance Module

```
modules/finance/
├── components/
│   ├── FeeStructureTable.tsx     # DataGrid: category, class, amount, term, edit/delete
│   ├── FeeStructureForm.tsx      # create/edit fee: category, class, amount, term, discount
│   ├── InvoiceTable.tsx          # DataGrid: student, term, total, paid, balance, status, actions
│   ├── InvoiceDetail.tsx         # expandable panel: fee breakdown + payment history
│   ├── RecordPaymentModal.tsx    # amount, method (cash/Orange/Africell), reference → submit
│   ├── PaymentTable.tsx          # DataGrid: date, student, amount, method, reference, receipt
│   ├── ReceiptButton.tsx         # download/view PDF receipt
│   ├── PayrollTable.tsx          # staff × month: gross, deductions, net, status
│   ├── PayslipModal.tsx          # detailed payslip dialog with download
│   ├── FinancialSummaryCards.tsx # 4 KPI cards: revenue, collected, outstanding, expenses
│   └── RevenueChart.tsx          # Recharts AreaChart: monthly revenue trend
│
├── hooks/
│   ├── useFeeStructures.ts
│   ├── useInvoices.ts
│   ├── useRecordPayment.ts
│   ├── usePayroll.ts
│   └── useFinancialSummary.ts
│
└── services/
    └── financeService.ts
```

---

### 4.6 LMS Module

```
modules/lms/
├── components/
│   ├── ContentLibrary.tsx        # grid of ContentCard items, filter by subject/type
│   ├── ContentCard.tsx           # MUI Card: type icon, title, subject chip, download btn
│   ├── UploadContentModal.tsx    # title, subject, class, type selector, file/URL input
│   ├── AssignmentList.tsx        # table: title, subject, due date, submissions/total, actions
│   ├── AssignmentForm.tsx        # title, instructions, max score, due date, attachment
│   ├── SubmissionsTable.tsx      # student, submitted at, late badge, score input, feedback
│   ├── GradeSubmissionModal.tsx  # score + written feedback → save → triggers score sync
│   └── SubjectFilter.tsx         # horizontal chip group for filtering by subject
│
├── hooks/
│   ├── useLmsContent.ts
│   ├── useUploadContent.ts
│   ├── useAssignments.ts
│   ├── useCreateAssignment.ts
│   ├── useSubmissions.ts
│   └── useGradeSubmission.ts
│
└── services/
    └── lmsService.ts
```

---

### 4.7 Analytics Module

```
modules/analytics/
├── components/
│   ├── AnalyticsTabs.tsx         # Performance | Attendance | Finance | AI Insights
│   ├── performance/
│   │   ├── SubjectAveragesChart.tsx   # Recharts BarChart: avg score per subject
│   │   ├── GradeDistribution.tsx      # Recharts PieChart: A1–F9 counts
│   │   ├── TermTrendChart.tsx         # Recharts LineChart: avg per term over time
│   │   ├── TopPerformersTable.tsx     # top 10 students this term
│   │   └── NeedsSupportTable.tsx      # students with 2+ F9 grades flagged
│   ├── attendance/
│   │   ├── AttendanceRateCard.tsx     # big number: school-wide rate this week
│   │   ├── AttendanceTrendChart.tsx   # Recharts AreaChart: daily rate past 30 days
│   │   ├── ClassComparisonChart.tsx   # Recharts BarChart: attendance rate per class
│   │   └── ChronicAbsenteeTable.tsx   # students below 75% with guardian contact
│   ├── finance/
│   │   ├── CollectionRateGauge.tsx    # Recharts RadialBarChart: % fees collected
│   │   ├── RevenueVsExpenseChart.tsx  # Recharts ComposedChart
│   │   └── OutstandingByClassTable.tsx
│   └── ai/
│       ├── AiQueryBox.tsx             # text input → calls aiSchoolQuery Cloud Fn → response
│       ├── RiskDashboard.tsx          # counts of low/medium/high risk students
│       ├── RiskStudentList.tsx        # filtered DataGrid with risk level and factors
│       └── DropoutFactorChart.tsx     # Recharts BarChart: factor frequency
│
├── hooks/
│   ├── useClassAnalytics.ts
│   ├── useSchoolAnalytics.ts
│   ├── useAiQuery.ts               # useMutation: calls aiSchoolQuery
│   └── useRiskDashboard.ts
│
└── services/
    └── analyticsService.ts
```

---

### 4.8 Dashboard Module (Role-Aware)

```
modules/dashboard/
├── components/
│   ├── AdminDashboard.tsx
│   │   ├── KpiRow.tsx             # 4 cards: enrollment, attendance today, fees collected, staff
│   │   ├── AlertFeed.tsx          # overdue invoices, chronic absences, risk students
│   │   ├── RecentPayments.tsx     # last 5 payments with receipt link
│   │   └── QuickActions.tsx       # buttons: Enroll Student, Mark Attendance, Send Alert
│   ├── TeacherDashboard.tsx
│   │   ├── MyClasses.tsx          # class cards with today's attendance status
│   │   ├── PendingGrades.tsx      # exams with ungraded scores
│   │   └── AtRiskStudents.tsx     # AI-flagged students in my classes
│   └── BursarDashboard.tsx
│       ├── RevenueVsTarget.tsx    # progress bar: collected / expected this term
│       ├── OverdueInvoices.tsx    # count + link to invoice list
│       └── RecentTransactions.tsx
│
└── hooks/
    └── useDashboardData.ts        # parallel useQueries for all dashboard metrics
```

---

## 5. Shared Layer

```
shared/
├── ui/
│   ├── StatusChip.tsx            # colored MUI Chip for student/invoice/staff status
│   ├── RiskBadge.tsx             # low=green, medium=amber, high=red badge
│   ├── GradeBadge.tsx            # WAEC grade colored badge
│   ├── ConfirmDialog.tsx         # reusable "Are you sure?" MUI Dialog
│   ├── EmptyState.tsx            # SVG illustration + message for empty lists
│   ├── LoadingSpinner.tsx        # centered MUI CircularProgress
│   ├── ErrorBoundary.tsx         # React error boundary with retry button
│   ├── FileUploadButton.tsx      # MUI Button wrapping hidden <input type="file">
│   ├── SearchInput.tsx           # MUI TextField with search icon adornment
│   ├── PageTitle.tsx             # Typography h1 + optional subtitle
│   ├── DataGridWrapper.tsx       # MUI DataGrid with common props (pagination, toolbar)
│   ├── SectionCard.tsx           # MUI Card with title + optional action button header
│   ├── MetricCard.tsx            # KPI card: label, big number, optional trend indicator
│   ├── DateRangePicker.tsx       # MUI DatePicker pair: from + to
│   └── ClassSelector.tsx         # Autocomplete: fetch classes, return classId
│
├── hooks/
│   ├── useSchool.ts              # fetch school config from Firestore
│   ├── useClasses.ts             # fetch all classes for current school
│   ├── useSubjects.ts            # fetch all subjects
│   ├── useCurrentUser.ts         # extends useAuth with full staff document
│   ├── useDebounce.ts            # debounce a value (for search inputs)
│   ├── useLocalStorage.ts        # typed localStorage hook
│   ├── useOfflineQueue.ts        # queue mutations when offline, flush on reconnect
│   └── useNetworkStatus.ts       # online/offline detector
│
└── utils/
    ├── formatDate.ts             # toLocaleDateString for SL locale
    ├── formatCurrency.ts         # SLL formatter: "Le 1,250,000"
    ├── waecGrade.ts              # computeWaecGrade() and grade color map
    ├── studentId.ts              # generateStudentId() PW-YYYY-NNNN
    ├── exportToExcel.ts          # SheetJS xlsx export helper
    ├── exportToPdf.ts            # client-side jsPDF for simple tables
    ├── validators.ts             # Zod schemas for all forms
    └── constants.ts              # levels, roles, WAEC grades, status options
```

---

## 6. State Management Strategy

```
┌────────────────────────────────────────────────────────────┐
│  Server State (React Query)                                 │
│  • All Firestore data (students, scores, invoices …)       │
│  • Auto-caching, background refresh, offline support       │
│  • staleTime: 5 min for static data, 30 sec for live      │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  Global Client State (Zustand)                             │
│  • schoolStore: schoolId, tenantId, school config          │
│  • uiStore: sidebar open, active modal, toast queue        │
│  • notifStore: unread count, notification list             │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  Local Component State (useState / useReducer)             │
│  • Form values (controlled via React Hook Form)            │
│  • UI toggles (accordion, tab selection)                   │
│  • Optimistic UI updates before mutation resolves          │
└────────────────────────────────────────────────────────────┘
```

---

## 7. Offline-First Strategy (Web)

```typescript
// core/query/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          5 * 60 * 1000,    // 5 minutes
      gcTime:             30 * 60 * 1000,   // 30 minutes in cache
      retry:              2,
      networkMode:        'offlineFirst',   // serve cache when offline
      refetchOnReconnect: true
    },
    mutations: {
      networkMode: 'offlineFirst'           // queue mutations offline
    }
  }
});

// Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') console.warn('Multiple tabs — offline persistence disabled');
});
```

---

## 8. Form Validation (Zod + React Hook Form)

```typescript
// shared/utils/validators.ts
import { z } from 'zod';

export const studentSchema = z.object({
  name: z.object({
    first:  z.string().min(2, 'First name required'),
    last:   z.string().min(2, 'Last name required'),
    middle: z.string().optional()
  }),
  dob:    z.date({ required_error: 'Date of birth required' })
            .max(new Date(), 'Date of birth cannot be in the future'),
  gender: z.enum(['male', 'female', 'other']),
  classId: z.string().min(1, 'Class is required'),
  homeAddress: z.string().min(5),
  district:    z.string().min(2)
});

export const guardianSchema = z.object({
  name:         z.string().min(2),
  relationship: z.enum(['father','mother','uncle','aunt','sibling','guardian','other']),
  phone:        z.string().regex(/^\+232\d{8}$/, 'Enter valid SL phone: +23276xxxxxxx'),
  email:        z.string().email().optional().or(z.literal('')),
  isPrimary:    z.boolean()
});

export const scoreSchema = z.object({
  caScore:   z.number().min(0).max(100),
  examScore: z.number().min(0).max(100)
});

export const paymentSchema = z.object({
  amount:    z.number().positive('Amount must be positive'),
  method:    z.enum(['cash','orange_money','africell_money','bank_transfer','cheque']),
  reference: z.string().optional()
});
```

---

## 9. Component Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Page components | `{Entity}Page.tsx` | `StudentProfilePage.tsx` |
| List components | `{Entity}Table.tsx` or `{Entity}List.tsx` | `InvoiceTable.tsx` |
| Form components | `{Entity}Form.tsx` | `StaffForm.tsx` |
| Modal/Dialog | `{Action}Modal.tsx` or `{Action}Dialog.tsx` | `RecordPaymentModal.tsx` |
| Data hooks | `use{Entities}.ts` (plural for list) | `useStudents.ts` |
| Single-record hooks | `use{Entity}.ts` (singular) | `useStudent.ts` |
| Mutation hooks | `use{Verb}{Entity}.ts` | `useCreateStudent.ts` |
| Service files | `{entity}Service.ts` | `studentService.ts` |
| Zustand stores | `{domain}Store.ts` | `schoolStore.ts` |

---

*PW-SAS React Module Architecture v1.0.0 — Prince of Wales Senior Secondary School, Kingtom, Sierra Leone*
