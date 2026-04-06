# PW-SAS — Phase 1 Sprint Plan
## Detailed Week-by-Week Task Breakdown (Weeks 1–20)
**Version:** 1.0.0 | **Methodology:** Agile Sprints (1 week each) | **Goal:** MVP Launch

---

## Phase Overview

| Phase | Weeks | Focus | Outcome |
|-------|-------|-------|---------|
| **Phase 1** | 1–20 | MVP: core admin + attendance + exams + fees + notifications | Live system at Prince of Wales |
| Phase 2 | 21–36 | Parent portal, LMS, AI analytics | Full digital school |
| Phase 3 | 37–52 | Multi-school, WAEC integration, biometrics | National platform |

---

## Phase 1 Sprint Breakdown

---

### SPRINT 1 — Weeks 1–2: Project Foundation

**Goal:** Repo, CI/CD, Firebase, Design system all running — zero features, maximum foundation quality.

#### Week 1 Tasks

**Monorepo & Tooling Setup**
- [ ] Initialize pnpm monorepo: `apps/web`, `apps/mobile`, `packages/shared`, `packages/ui`, `packages/firebase`, `functions/`
- [ ] Configure `pnpm-workspace.yaml` with all workspace paths
- [ ] Set up `apps/web` with Vite + React 18 + TypeScript (`pnpm create vite`)
- [ ] Set up `apps/mobile` with Expo CLI (`npx create-expo-app`) + React Native Paper
- [ ] Configure path aliases: `@shared/*`, `@ui/*`, `@firebase/*` in `tsconfig.json` and `vite.config.ts`
- [ ] Install and configure ESLint + Prettier with shared config in `packages/eslint-config/`
- [ ] Configure Husky + lint-staged: runs ESLint + Prettier on commit

**GitHub Repository**
- [ ] Create `pw-sas` GitHub repository (private)
- [ ] Set branch protection rules on `main`: require PR review, require CI pass
- [ ] Create `develop` branch as default working branch
- [ ] Configure GitHub branch strategy: `feature/*` → `develop` → `main`
- [ ] Write `CONTRIBUTING.md` with branch naming and commit message conventions

**GitHub Actions CI/CD**
- [ ] Create `.github/workflows/ci.yml`: runs on PR to `develop` — lint + type-check + unit tests
- [ ] Create `.github/workflows/deploy-web.yml`: runs on merge to `main` — builds web and deploys to Firebase Hosting
- [ ] Create `.github/workflows/deploy-functions.yml`: deploys Cloud Functions on merge to `main`

#### Week 2 Tasks

**Firebase Project Setup**
- [ ] Create Firebase project `pw-sas-prod` in Firebase console
- [ ] Enable: Authentication, Firestore, Storage, Cloud Functions, Hosting, Analytics, App Check
- [ ] Create `packages/firebase/config.ts` with `initializeApp` + all service exports
- [ ] Enable Firestore offline persistence in config
- [ ] Set up Firebase emulators: `firebase.json` with auth, firestore, functions, storage, hosting
- [ ] Write `firestore.rules` with initial deny-all (open only as features are built)
- [ ] Write `storage.rules` with initial deny-all

**MUI Theme & Design System**
- [ ] Create `core/theme/theme.ts` with PW-SAS brand palette (navy primary, red secondary)
- [ ] Configure MUI component defaults: button, card, textField, dataGrid, chip
- [ ] Create base shared components in `shared/ui/`: `StatusChip`, `MetricCard`, `SectionCard`, `EmptyState`, `LoadingSpinner`, `ConfirmDialog`, `PageTitle`
- [ ] Create `shared/utils/`: `formatDate.ts`, `formatCurrency.ts` (SLL), `constants.ts`

**Zustand + React Query Setup**
- [ ] Install Zustand, configure `schoolStore.ts`, `uiStore.ts`, `notifStore.ts`
- [ ] Configure `queryClient.ts` with offline-first settings
- [ ] Install and configure React Router v6

**Deliverable:** `develop` branch with working monorepo, CI running, Firebase emulators operational, design system rendered.

---

### SPRINT 2 — Weeks 3–4: Authentication & RBAC

**Goal:** All user roles can log in, are redirected to the correct dashboard shell, and cannot access resources outside their role.

#### Week 3 Tasks

**Firebase Authentication**
- [ ] Enable Email/Password provider in Firebase console
- [ ] Enable Phone number OTP provider (for parents — simpler access)
- [ ] Create `core/auth/AuthProvider.tsx` — wraps app, listens to `onAuthStateChanged`, populates context
- [ ] Create `core/auth/useAuth.ts` — exposes `{ user, role, schoolId, tenantId, loading, signOut }`
- [ ] Custom claims: on login, decode `user.getIdTokenResult()` to extract `{ role, schoolId, tenantId }`

**Login UI**
- [ ] Build `pages/auth/LoginPage.tsx` — email + password form using React Hook Form + Zod
- [ ] Build `pages/auth/ForgotPasswordPage.tsx` — calls `sendPasswordResetEmail`
- [ ] Handle Firebase auth errors: wrong-password, user-not-found, too-many-requests
- [ ] Add school logo + name to login screen header

**Route Guards**
- [ ] Create `core/auth/ProtectedRoute.tsx` — redirects unauthenticated users to `/auth/login`
- [ ] Create `core/auth/RoleGuard.tsx` — checks `role` against `allow[]` prop; shows 403 if blocked
- [ ] Configure `router.tsx` with all top-level routes and guards (placeholder pages are OK at this stage)

**Cloud Function — User Management**
- [ ] Write `createSchoolUser` callable function (creates Firebase Auth user + sets custom claims)
- [ ] Write `deactivateUser` callable function
- [ ] Deploy both functions and test with Firebase emulator
- [ ] Seed initial admin user via `createSchoolUser` for Prince of Wales School

#### Week 4 Tasks

**App Shell & Navigation**
- [ ] Build `layout/AppShell.tsx` — MUI responsive Drawer layout (persistent on desktop, temporary on mobile)
- [ ] Build `layout/Sidebar.tsx` — role-filtered navigation: admin sees all, teacher sees students/attendance/exams/LMS
- [ ] Build `layout/TopBar.tsx` — school name, notification bell (badge), user avatar menu (profile, logout)
- [ ] Build `layout/PageWrapper.tsx` — MUI Breadcrumbs + page title + children content area
- [ ] Build `layout/UserMenu.tsx` — popover with: user name, role chip, settings link, logout

**Dashboard Shell (Placeholder)**
- [ ] Create `pages/dashboard/DashboardPage.tsx` — role-aware: renders `AdminDashboard`, `TeacherDashboard`, or `BursarDashboard`
- [ ] Create placeholder components for each dashboard (KPI skeletons)

**Firestore — Tenant & School Seed Data**
- [ ] Manually create `/tenants/pwss` and `/tenants/pwss/schools/pwss_main` documents in Firestore
- [ ] Populate school document: name, logo, levels (JSS, SSS), term dates, WAEC grading scale
- [ ] Create `shared/hooks/useSchool.ts` — fetches school config, stored in `schoolStore`

**Testing**
- [ ] Unit test: `useAuth` returns correct role from custom claims
- [ ] Unit test: `RoleGuard` blocks render when role not in allow list
- [ ] E2E (Playwright optional): login → redirected to dashboard, logout → redirected to login

**Deliverable:** All roles can authenticate. Sidebar adapts to role. App shell renders. No content yet.

---

### SPRINT 3 — Weeks 5–7: Student Information System

**Goal:** School admin can enroll students, view profiles, search students, and manage class assignments.

#### Week 5 Tasks

**Firestore Schema — Students**
- [ ] Create Firestore indexes: `schoolId+status`, `schoolId+classId`, `schoolId+name.last`
- [ ] Write `shared/utils/studentId.ts` — `generateStudentId(schoolId)` → `PW-2026-NNNN`
- [ ] Write `modules/students/services/studentService.ts` — all raw Firestore query functions
- [ ] Write `modules/students/hooks/useStudents.ts` — React Query for student list with class filter
- [ ] Write `modules/students/hooks/useStudent.ts` — single student doc + sub-collections

**Class & Subject Setup**
- [ ] Write `shared/hooks/useClasses.ts` — fetch all classes for school
- [ ] Write `shared/hooks/useSubjects.ts` — fetch all subjects
- [ ] Build `shared/ui/ClassSelector.tsx` — Autocomplete for class selection

**Student Enrollment Form**
- [ ] Build `modules/students/components/StudentForm.tsx` with 3 steps:
  - Step 1 Personal: name, dob, gender, photo upload (Firebase Storage), address, district
  - Step 2 Guardian: name, relationship, phone (SL format validation), email, isPrimary toggle
  - Step 3 Medical: blood group dropdown, allergies multi-chip, conditions, emergency contact
- [ ] Integrate React Hook Form + Zod schemas from `shared/utils/validators.ts`
- [ ] Photo upload: use `shared/ui/FileUploadButton.tsx` → Firebase Storage → return URL

#### Week 6 Tasks

**Student List & Search**
- [ ] Build `modules/students/components/StudentTable.tsx` — MUI DataGrid with columns: ID, avatar+name, class, gender, status, risk badge, actions
- [ ] Add server-side search by name (Firestore `where('name.last', '>=', search).where('name.last', '<=', search + '\uf8ff')`)
- [ ] Add client-side filters: class, status, level (JSS/SSS)
- [ ] Add bulk actions: promote selected, export to Excel
- [ ] Implement `shared/utils/exportToExcel.ts` using SheetJS

**Student Profile Page**
- [ ] Build `StudentProfilePage.tsx` with `ProfileHeader.tsx` (photo, name, ID, status chip, QR code icon)
- [ ] Build 5-tab layout: Overview, Academic, Finance, Health, Discipline
  - Overview: bio details, guardian cards (name, relationship, phone, isPrimary badge)
  - Academic: placeholder (wired in Sprint 5)
  - Finance: placeholder (wired in Sprint 6)
  - Health: placeholder (wired in Sprint 8)
  - Discipline: `DisciplinaryRecord` list with add button

**Cloud Function — Student Create**
- [ ] Write `onStudentCreate` trigger: generate QR code PNG → upload to Storage → write URL back to doc → create term 1 invoice
- [ ] Write `StudentQrCard.tsx` — printable A6 card with student photo, name, ID, QR code (PDF via jsPDF)

#### Week 7 Tasks

**Promotion & Transfer Workflow**
- [ ] Build `PromotionModal.tsx` — select new class, confirm → `useMutation` updates student doc
- [ ] Build transfer flow: enter destination school, reason → status = "transferred"
- [ ] Write `onStudentStatusChange` Cloud Function trigger (generate transcript on graduation)

**Bulk Import**
- [ ] Build `BulkImportDialog.tsx` — upload CSV → parse with PapaParse → preview table → confirm
- [ ] Write `bulkImportStudents` Cloud Function callable
- [ ] Provide downloadable CSV template with correct column headers

**Class Management**
- [ ] Build `pages/settings/ClassManagementPage.tsx` — CRUD for classes and sections
- [ ] Build `pages/settings/SubjectManagementPage.tsx` — CRUD for subjects
- [ ] Admin can create JSS 1A, SSS 2 Science, etc. and assign class teachers

**Testing**
- [ ] Unit test: `generateStudentId` produces correct format
- [ ] Unit test: `studentSchema` Zod validation catches invalid phone, future DOB
- [ ] Manual test: enroll 5 students, verify QR generated, profile renders correctly

**Deliverable:** Full student CRUD. List with search/filter. Profile with 5 tabs. QR ID card. Bulk CSV import.

---

### SPRINT 4 — Weeks 8–9: Teacher Management System

**Goal:** Admin can manage staff profiles, assign subjects to classes, and view teacher schedule.

#### Week 8 Tasks

**Staff CRUD**
- [ ] Build `StaffTable.tsx` — DataGrid: name, role, phone, subjects, status, actions
- [ ] Build `StaffForm.tsx` — name, role dropdown, qualifications multi-input, base salary, employment type, hire date, document upload (contract PDF)
- [ ] Write `staff/hooks/useStaff.ts`, `useStaffMember.ts`, `useCreateStaff.ts`, `useUpdateStaff.ts`
- [ ] Call `createSchoolUser` Cloud Function after staff created (generates Auth account)

**Staff Profile**
- [ ] Build `StaffProfilePage.tsx` with tabs: Overview | Subjects | Attendance | Evaluation | Payslips
  - Overview: photo, name, staffId, role, contact, qualifications list, hire date
  - Subjects: table of subject-class assignments with add/remove
  - Attendance: monthly calendar grid (wired in Sprint 5)
  - Evaluation: term cards (wired in Sprint 9)
  - Payslips: list (wired in Sprint 6)

#### Week 9 Tasks

**Subject Assignment**
- [ ] Build `SubjectAssignmentForm.tsx` — select staff + class + subject + term → save to `subjectAssignments`
- [ ] Write `useSubjectAssignments.ts` — fetch assignments by class or by staff
- [ ] Display assigned subjects per teacher on their profile

**Timetable (Basic)**
- [ ] Build `TimetablePage.tsx` — 6-day × 8-period grid (`TimetableGrid.tsx`)
- [ ] Admin can manually assign teacher + subject to each period cell
- [ ] Timetable stored in Firestore under `classes/{classId}/timetable` as a map
- [ ] PDF export of class timetable using jsPDF

**Deliverable:** Full staff CRUD with Auth account creation. Subject assignments. Basic timetable grid.

---

### SPRINT 5 — Weeks 10–12: Attendance System

**Goal:** Teachers can mark daily attendance (manual + QR), parents are notified, reports are available.

#### Week 10 Tasks

**Attendance UI — Manual Entry**
- [ ] Build `AttendanceRegisterPage.tsx` — teacher selects class, sees student list for today
- [ ] Build `AttendanceRegister.tsx` — list of `AttendanceRow.tsx` items with status toggle chips
- [ ] Build `AttendanceSummaryBar.tsx` — "X present / Y total" progress bar
- [ ] Optimistic UI: update local state immediately, sync to Firestore in background
- [ ] Write `useMarkAttendance.ts` — batch writes all records in one Firestore batch

**Cloud Functions — Attendance Alerts**
- [ ] Deploy `onStudentAttendanceCreate` trigger — sends push + SMS on absent/late
- [ ] Deploy `onAttendancePatternCheck` trigger — escalates 3+ consecutive absences
- [ ] Integrate Africa's Talking SMS API in `functions/src/shared/sms.ts`

#### Week 11 Tasks

**QR Code Scanner**
- [ ] Build `QrScannerModal.tsx` — uses `jsQR` library via webcam stream on desktop browser
- [ ] On successful scan: calls `validateQrCode` Cloud Function → marks student present
- [ ] Handle errors: unknown ID, wrong class, already marked
- [ ] Show success animation with student name + photo on successful scan

**Staff Attendance**
- [ ] Build staff attendance daily register (same pattern as student attendance)
- [ ] Admin/designated officer marks each staff: present, absent, late, on-leave
- [ ] Write `useStaffAttendance.ts` and Firestore writes to `staffAttendance` collection

#### Week 12 Tasks

**Attendance Reports**
- [ ] Build `AttendanceReportsPage.tsx` with:
  - Class attendance by date range (DataGrid: student × date)
  - Individual student history with `AttendanceHeatmap.tsx` (react-calendar-heatmap)
  - Students below threshold (configurable %) flagged with red chip
- [ ] Excel export for class attendance register (SheetJS)
- [ ] Deploy `weeklyAttendanceSummary` scheduler
- [ ] Wire student profile Academic tab: show attendance rate + calendar

**Deliverable:** Manual attendance + QR scan both operational. Parents receive push + SMS. Reports exportable.

---

### SPRINT 6 — Weeks 13–14: Exam & Grading System

**Goal:** Teachers enter scores, system auto-grades to WAEC scale, admins publish results, report cards generated.

#### Week 13 Tasks

**Exam Setup**
- [ ] Build `ExamsListPage.tsx` — cards per exam: subject, class, type, date, published status
- [ ] Build `ExamForm.tsx` — subject, class, type (CA1/CA2/end_of_term), CA weight, exam weight, date
- [ ] Write `useExams.ts`, `useCreateExam.ts`, `usePublishExam.ts`

**Score Entry**
- [ ] Build `ScoreEntryPage.tsx` — loads students in class, one row per student
- [ ] Build `ScoreEntryTable.tsx` — DataGrid with editable CA score + Exam score cells
- [ ] Build `ScoreInputCell.tsx` — controlled number input, red border if out of range
- [ ] Write `useSaveScores.ts` — batch upsert `scores` collection

**Cloud Functions — Grading**
- [ ] Deploy `onScoreCreate` trigger — auto-computes total + WAEC grade
- [ ] Deploy `onExamPublish` trigger — sends push notifications to all class parents

#### Week 14 Tasks

**Results & Report Cards**
- [ ] Build `ResultsPage.tsx` — read-only table: name, CA, Exam, Total, Grade, Position
- [ ] Build `GradeBadge.tsx` — A1=green, B2/B3=teal, C4-C6=blue, D7/E8=amber, F9=red
- [ ] Build `GradeDistributionChart.tsx` — BarChart per subject
- [ ] Build `PublishExamDialog.tsx` — confirm before publishing, warn if any scores missing

**Report Card Generation**
- [ ] Deploy `generateReportCard` Cloud Function (builds PDF with pdfmake or puppeteer)
- [ ] Build `ReportCardPreview.tsx` — iframe/object previewing PDF URL
- [ ] Report card includes: school logo, student info, term scores table, attendance summary, teacher comments, principal remark
- [ ] Wire student profile Academic tab: load past report card PDFs

**Deliverable:** Full exam lifecycle: create → score entry → auto-grade → publish → notify → report card PDF.

---

### SPRINT 7 — Weeks 15–16: Finance Module

**Goal:** Bursar can manage fee structures, issue invoices, record payments (cash + mobile money), generate financial reports.

#### Week 15 Tasks

**Fee Structures & Invoices**
- [ ] Build `FeesPage.tsx` — DataGrid of fee structures with CRUD
- [ ] Build `FeeStructureForm.tsx` — category, class/level selector, amount, term, discount
- [ ] Write `useFeeStructures.ts`, `useInvoices.ts`
- [ ] `onStudentCreate` Cloud Function: already creates term 1 invoice — extend for terms 2 and 3

**Invoice Management**
- [ ] Build `InvoicesPage.tsx` — DataGrid: student, term, total, paid, balance, status chip, due date
- [ ] Add filter by: status (unpaid/partial/overdue), class, term
- [ ] Build `InvoiceDetail.tsx` — expandable panel: fee line items + payment history list
- [ ] Build `RecordPaymentModal.tsx` — amount, method dropdown, reference field, submit

**Cloud Functions — Payment**
- [ ] Deploy `onPaymentCreate` trigger — atomic balance update + receipt PDF + parent SMS/push
- [ ] Deploy `onInvoiceStatusChange` trigger — overdue alert to parent
- [ ] Deploy `markOverdueInvoices` scheduler (midnight cron)
- [ ] Deploy `dailyFeeReminder` scheduler (8 AM cron)

#### Week 16 Tasks

**Mobile Money Webhooks**
- [ ] Set up Orange Money sandbox credentials
- [ ] Deploy `orangeMoneyWebhook` REST function with HMAC verification + idempotency check
- [ ] Deploy `africellMoneyWebhook` REST function with API key verification
- [ ] Test end-to-end: simulate webhook → payment recorded → invoice updated → parent notified

**Payroll (Basic)**
- [ ] Build `PayrollPage.tsx` — DataGrid: staff × month, gross, deductions, net, status
- [ ] Build `PayslipModal.tsx` — detailed breakdown: NASSIT, tax, absence deductions
- [ ] Deploy `generateMonthlyPayroll` scheduler (1st of month cron)
- [ ] Admin can approve draft payroll → status changes to "approved"

**Financial Reports**
- [ ] Build `FinancialSummaryCards.tsx` — 4 KPI cards: revenue, collected, outstanding, expenses
- [ ] Build `RevenueChart.tsx` — Recharts AreaChart: monthly revenue past 12 months
- [ ] Deploy `generateFinancialReport` callable (P&L + outstanding fees reports)
- [ ] Wire bursar dashboard with `RevenueVsTarget`, `OverdueInvoices`, `RecentTransactions`

**Deliverable:** Full fee cycle operational. Mobile money webhooks live. Payroll drafts auto-generated. Reports exported.

---

### SPRINT 8 — Weeks 17–18: Notification System

**Goal:** All notification channels (push, SMS) operational across all trigger events.

#### Week 17 Tasks

**FCM Push Notifications**
- [ ] Configure Firebase Cloud Messaging in web app (`getMessaging`, `getToken`, `onMessage`)
- [ ] Build `NotifDrawer.tsx` — real-time notification feed from `notifications` collection
- [ ] Build `NotifBell.tsx` — badge count from `notifStore.unreadCount`
- [ ] Background message handler (service worker): show browser notification when app is in background
- [ ] On login: save FCM token to staff/guardian document in Firestore

**In-App Announcements**
- [ ] Build announcement creation form in admin settings: title, body, target audience (role/class/all)
- [ ] Build announcement display: banner or notification card in relevant dashboards

#### Week 18 Tasks

**Bulk & Emergency Notifications**
- [ ] Deploy `sendEmergencyAlert` callable — push + SMS simultaneously to all parents
- [ ] Deploy `sendBulkPush` callable — targeted by role or class
- [ ] Build `EmergencyAlertButton.tsx` in admin TopBar — opens confirm dialog with red styling
- [ ] Build `AnnouncementsPage.tsx` — admin creates + manages published announcements

**SMS Audit Log**
- [ ] Log every SMS sent to `notifications/{notifId}/logs` collection
- [ ] Build notification log view in admin settings: date, recipient, channel, status

**Deliverable:** Push and SMS notifications operational for all trigger events. Emergency alert working.

---

### SPRINT 9 — Weeks 19–20: Testing, Polish & Soft Launch

**Goal:** System is stable, trained, and handed over to Prince of Wales School admin for live operation.

#### Week 19 Tasks

**Integration Testing**
- [ ] End-to-end test: enroll student → attend → score exam → publish → parent receives notification → report card generated
- [ ] End-to-end test: invoice created → mobile money payment → balance updated → receipt generated → parent notified
- [ ] Test all Cloud Function triggers using Firebase emulator suite
- [ ] Test offline behaviour: mark attendance offline → reconnect → data syncs

**Health, Inventory & Transport (Phase 1 Lite)**
- [ ] Build `HealthRecordsPage.tsx` — CRUD for clinic visits (basic version, no AI alerts)
- [ ] Build `InventoryPage.tsx` — asset list with issue/return log (no procurement workflow yet)
- [ ] Build `TransportPage.tsx` — bus routes + student-route assignments (no GPS)

**Performance & Accessibility**
- [ ] Lighthouse audit on dashboard, student list, and score entry pages — target score ≥ 80
- [ ] Fix any Largest Contentful Paint or Cumulative Layout Shift issues
- [ ] Ensure all DataGrids lazy-load (virtual scroll) — no full list renders
- [ ] Test on low-end Android browser (Chrome on 3G) — all pages must load within 5 seconds

#### Week 20 Tasks

**Settings Module**
- [ ] Build `SettingsPage.tsx` — tabs: School Info | Academic Calendar | Classes | Subjects | Users | Grading Scale
- [ ] School info: edit name, logo, contact, term dates, motto
- [ ] User management: list all users, create new user (calls `createSchoolUser`), deactivate user

**Admin Training Materials**
- [ ] Record 5-minute walkthrough video for each module (screen record + voiceover)
- [ ] Write `ADMIN_GUIDE.md` in `/docs/` covering day-to-day tasks
- [ ] Prepare onboarding checklist for first week of live use

**Go-Live Checklist**
- [ ] Switch Firebase project from emulator to production
- [ ] Set all `functions:config` environment variables (Orange Money, Africell, Africa's Talking, SendGrid)
- [ ] Enable Firebase App Check for abuse protection
- [ ] Enable Firebase Backup (Firestore export to GCS)
- [ ] Deploy web app to Firebase Hosting custom domain (`sas.princewales.edu.sl`)
- [ ] Verify Firestore security rules are fully restrictive (no open reads/writes)
- [ ] Create initial admin account for Prince of Wales principal
- [ ] Bulk import all existing student data from CSV/spreadsheet

**Soft Launch**
- [ ] Run system with live data for 2 weeks in shadow mode (parallel with manual records)
- [ ] Collect feedback from admin, 3 teachers, bursar
- [ ] Fix critical bugs found during shadow mode before full cutover

**Deliverable:** Live PW-SAS system at Prince of Wales School. All Phase 1 modules operational.

---

## Phase 1 Milestone Summary

| Week | Milestone |
|------|-----------|
| 2 | Monorepo + CI/CD + Firebase running |
| 4 | All roles can log in; AppShell with role-aware sidebar |
| 7 | Full SIS: student enrollment, profiles, QR ID, bulk import |
| 9 | Staff management and timetable operational |
| 12 | Attendance: manual + QR, parent alerts, weekly reports |
| 14 | Exam grading: score entry, WAEC grades, report card PDF |
| 16 | Finance: fee invoices, mobile money payments, payroll |
| 18 | All notification channels (push, SMS) operational |
| 20 | **LIVE LAUNCH — PW-SAS operational at Prince of Wales School** |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Orange Money API integration delays | Medium | High | Use cash-only flow first; add OrangeMoney in parallel |
| Internet instability at school | High | Medium | Offline-first implemented from day 1; emulator for testing |
| Staff resistance to new system | Medium | High | Shadow mode for 2 weeks; training sessions during Sprint 20 |
| Firebase quota exceeded (free tier) | Low | Medium | Monitor usage; upgrade to Blaze plan before go-live |
| QR scanner not working on school devices | Medium | Medium | Manual attendance as fallback; test on actual school hardware in Sprint 10 |
| Student data import quality issues | High | Medium | CSV template provided; validation preview before import |

---

## Definition of Done (Per Sprint)

A sprint deliverable is considered "Done" when all of the following are true:

- [ ] All tasks in the sprint are completed
- [ ] Feature works end-to-end in Firebase emulator environment
- [ ] React Query hooks handle loading, error, and empty states correctly
- [ ] All forms validate with Zod and show meaningful error messages
- [ ] New Firestore collections have security rules written and tested
- [ ] Cloud Functions have been deployed to staging and smoke-tested
- [ ] Offline behaviour tested: feature degrades gracefully without network
- [ ] Code reviewed and merged to `develop` via PR
- [ ] No TypeScript errors, no ESLint warnings in CI

---

*PW-SAS Phase 1 Sprint Plan v1.0.0 — Prince of Wales Senior Secondary School, Kingtom, Sierra Leone*
