# PW-SAS — Cloud Functions Blueprint
## All Triggers, Schedulers, and HTTP Endpoints
**Version:** 1.0.0 | **Runtime:** Node.js 20 (Firebase Cloud Functions v2)

---

## 1. Folder Structure

```
functions/
├── src/
│   ├── triggers/
│   │   ├── attendance.ts      ← onStudentAttendanceCreate, onPatternCheck
│   │   ├── students.ts        ← onStudentCreate, onStudentStatusChange
│   │   ├── finance.ts         ← onPaymentCreate, onInvoiceStatusChange
│   │   ├── exams.ts           ← onScoreCreate, onExamPublish
│   │   ├── lms.ts             ← onContentUpload, onAssignmentCreate
│   │   └── audit.ts           ← auditWrite (applied to sensitive collections)
│   ├── schedulers/
│   │   ├── feeReminders.ts    ← daily 8 AM WAT
│   │   ├── overdue.ts         ← daily midnight WAT
│   │   ├── attendance.ts      ← weekly Monday 7:30 AM WAT
│   │   ├── payroll.ts         ← 1st of month 6 AM WAT
│   │   ├── aiRiskScan.ts      ← daily 11 PM WAT
│   │   └── backup.ts          ← daily 2 AM WAT
│   ├── api/
│   │   ├── auth.ts            ← createSchoolUser, resetUserPassword
│   │   ├── reports.ts         ← generateReportCard, generateResultsSheet, generateFinancialReport
│   │   ├── payments.ts        ← orangeMoneyWebhook, africellMoneyWebhook (REST)
│   │   ├── notifications.ts   ← sendEmergencyAlert, sendBulkPush
│   │   ├── ai.ts              ← getStudentRiskProfile, aiSchoolQuery, getClassAnalytics
│   │   └── utils.ts           ← validateQrCode, bulkImportStudents
│   └── shared/
│       ├── notify.ts          ← multi-channel dispatcher (FCM + SMS + email)
│       ├── grading.ts         ← computeWaecGrade()
│       ├── pdf.ts             ← report card / receipt PDF builders
│       ├── sms.ts             ← Africa's Talking client wrapper
│       ├── audit.ts           ← writeAuditLog() helper
│       └── db.ts              ← Firestore path helpers
├── package.json
└── tsconfig.json
```

---

## 2. Firestore Triggers

### 2.1 Attendance Triggers

#### `onStudentAttendanceCreate`
**File:** `triggers/attendance.ts`
**Trigger:** `onCreate` — `.../attendance/{attendId}`
**Purpose:** Alert parent immediately when student is marked absent or late.

```typescript
export const onStudentAttendanceCreate = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/attendance/{attendId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    if (!['absent', 'late'].includes(data.status)) return;  // only alert on these

    const student = await getStudentWithGuardians(data.studentId, data.schoolId);
    const guardian = student.guardians.find(g => g.isPrimary);
    if (!guardian) return;

    const msg = data.status === 'absent'
      ? `${student.name.first} was marked ABSENT today (${formatDate(data.date)}).`
      : `${student.name.first} arrived LATE at ${formatTime(data.checkInTime)}.`;

    await notify({
      recipientUid:   guardian.uid,
      recipientPhone: guardian.phone,
      title:          `Attendance Alert — ${student.name.first}`,
      body:           msg,
      channels:       ['push', 'sms'],
      data:           { studentId: data.studentId, date: data.dateString, type: 'attendance' }
    });

    await event.data.ref.update({ parentNotified: true });
    await writeAuditLog({ action: 'NOTIFY', collection: 'attendance',
      docId: event.params.attendId, schoolId: data.schoolId });
  }
);
```

#### `onAttendancePatternCheck`
**Trigger:** `onCreate` — `.../attendance/{attendId}`
**Purpose:** Detect 3+ consecutive absences; escalate to admin.

```typescript
export const onAttendancePatternCheck = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/attendance/{attendId}',
  async (event) => {
    const data = event.data?.data();
    if (data?.status !== 'absent') return;

    const recent = await db
      .collection(`tenants/${event.params.tenantId}/schools/${data.schoolId}/attendance`)
      .where('studentId', '==', data.studentId)
      .orderBy('date', 'desc')
      .limit(7)
      .get();

    const consecutive = countConsecutiveAbsences(recent.docs.map(d => d.data()));
    if (consecutive < 3) return;

    const student = await getStudent(data.studentId, data.schoolId);
    await notifyByRole({
      schoolId: data.schoolId,
      roles: ['admin', 'principal'],
      title: 'Chronic Absenteeism Alert',
      body:  `${student.name.first} ${student.name.last} has been absent for ${consecutive} consecutive school days.`,
      channels: ['push'],
      data: { studentId: data.studentId, type: 'chronic_absence' }
    });
  }
);
```

---

### 2.2 Student Triggers

#### `onStudentCreate`
**Trigger:** `onCreate` — `.../students/{studentId}`
**Purpose:** Generate QR code, create first-term invoice, write audit.

```typescript
export const onStudentCreate = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/students/{studentId}',
  async (event) => {
    const data = event.data?.data();
    const { studentId, schoolId, tenantId } = event.params;

    // 1. Generate QR code PNG → Storage
    const qrPng      = await generateQRCodePng(studentId);
    const qrUrl      = await uploadToStorage(`qr/${schoolId}/${studentId}.png`, qrPng, 'image/png');
    await event.data.ref.update({ digitalIdQr: qrUrl });

    // 2. Create term 1 invoice using current fee structure
    await createTermInvoice({ studentId, schoolId, tenantId, classId: data.classId, term: '1' });

    // 3. Audit
    await writeAuditLog({ action: 'CREATE', collection: 'students', docId: studentId, schoolId });
  }
);
```

#### `onStudentStatusChange`
**Trigger:** `onUpdate` — `.../students/{studentId}`
**Purpose:** Handle graduation, transfer, and withdrawal workflows.

```typescript
export const onStudentStatusChange = onDocumentUpdated(
  'tenants/{tenantId}/schools/{schoolId}/students/{studentId}',
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();
    if (before.status === after.status) return;

    if (after.status === 'graduated') {
      await generateAndStoreTranscript(event.params.studentId, event.params.schoolId);
    }
    if (after.status === 'transferred') {
      await archiveEnrollment(event.params.studentId, event.params.schoolId);
    }
    await writeAuditLog({
      action: 'UPDATE', collection: 'students',
      docId: event.params.studentId, schoolId: event.params.schoolId,
      before: { status: before.status }, after: { status: after.status }
    });
  }
);
```

---

### 2.3 Finance Triggers

#### `onPaymentCreate`
**Trigger:** `onCreate` — `.../payments/{paymentId}`
**Purpose:** Update invoice balance atomically, generate receipt PDF, notify parent.

```typescript
export const onPaymentCreate = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/payments/{paymentId}',
  async (event) => {
    const payment = event.data?.data();
    const { schoolId, tenantId, paymentId } = event.params;

    // 1. Atomic balance update
    const invoiceRef = db.doc(
      `tenants/${tenantId}/schools/${schoolId}/invoices/${payment.invoiceId}`
    );
    await db.runTransaction(async (tx) => {
      const inv    = (await tx.get(invoiceRef)).data()!;
      const paid   = inv.amountPaid + payment.amount;
      const bal    = inv.totalAmount - paid;
      const status = bal <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
      tx.update(invoiceRef, { amountPaid: paid, balance: bal, status });
    });

    // 2. Generate receipt PDF
    const receiptUrl = await generateReceiptPdf(payment, schoolId);
    await event.data.ref.update({ receiptUrl });

    // 3. Notify parent
    const student  = await getStudentWithGuardians(payment.studentId, schoolId);
    const guardian = student.guardians.find(g => g.isPrimary);
    if (guardian) {
      await notify({
        recipientUid:   guardian.uid,
        recipientPhone: guardian.phone,
        title: 'Payment Received',
        body:  `Le ${payment.amount.toLocaleString()} received for ${student.name.first}. Receipt ready in parent portal.`,
        channels: ['push', 'sms'],
        data: { paymentId, receiptUrl, type: 'payment' }
      });
    }

    await writeAuditLog({ action: 'CREATE', collection: 'payments', docId: paymentId, schoolId });
  }
);
```

#### `onInvoiceStatusChange`
**Trigger:** `onUpdate` — `.../invoices/{invoiceId}`
**Purpose:** Alert parent when invoice transitions to `overdue`.

```typescript
export const onInvoiceStatusChange = onDocumentUpdated(
  'tenants/{tenantId}/schools/{schoolId}/invoices/{invoiceId}',
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();
    if (before.status === after.status || after.status !== 'overdue') return;

    const student  = await getStudentWithGuardians(after.studentId, event.params.schoolId);
    const guardian = student.guardians.find(g => g.isPrimary);
    if (!guardian) return;

    await notify({
      recipientUid:   guardian.uid,
      recipientPhone: guardian.phone,
      title: 'Fee Payment Overdue',
      body:  `Le ${after.balance.toLocaleString()} owed for ${student.name.first} is now overdue. Please pay at the bursar's office or via mobile money.`,
      channels: ['push', 'sms'],
      data: { invoiceId: event.params.invoiceId, type: 'fee_overdue' }
    });
  }
);
```

---

### 2.4 Exam & Score Triggers

#### `onScoreCreate`
**Trigger:** `onCreate` — `.../scores/{scoreId}`
**Purpose:** Auto-compute total and WAEC grade the moment a score is saved.

```typescript
export const onScoreCreate = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/scores/{scoreId}',
  async (event) => {
    const score = event.data?.data();
    const exam  = await getExam(score.examId, event.params.schoolId);
    const total = computeTotal(score.caScore, score.examScore, exam.caWeight, exam.examWeight);
    const { grade, remark } = computeWaecGrade(total);
    await event.data.ref.update({ totalScore: total, grade, remark });
  }
);

// Shared grading util (grading.ts)
export function computeWaecGrade(score: number): { grade: string; remark: string } {
  if (score >= 75) return { grade: 'A1', remark: 'Excellent' };
  if (score >= 70) return { grade: 'B2', remark: 'Very Good' };
  if (score >= 65) return { grade: 'B3', remark: 'Good' };
  if (score >= 60) return { grade: 'C4', remark: 'Credit' };
  if (score >= 55) return { grade: 'C5', remark: 'Credit' };
  if (score >= 50) return { grade: 'C6', remark: 'Credit' };
  if (score >= 45) return { grade: 'D7', remark: 'Pass' };
  if (score >= 40) return { grade: 'E8', remark: 'Pass' };
  return { grade: 'F9', remark: 'Fail' };
}

export function computeTotal(ca: number, exam: number, caW: number, examW: number): number {
  return parseFloat(((ca * caW + exam * examW) / 100).toFixed(2));
}
```

#### `onExamPublish`
**Trigger:** `onUpdate` — `.../exams/{examId}`
**Purpose:** Push result notifications to all parents in the class.

```typescript
export const onExamPublish = onDocumentUpdated(
  'tenants/{tenantId}/schools/{schoolId}/exams/{examId}',
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();
    if (before.published || !after.published) return; // only on first publish

    const subject  = await getSubject(after.subjectId, event.params.schoolId);
    const students = await getStudentsInClass(after.classId, event.params.schoolId);

    await Promise.all(students.map(async (s) => {
      const guardian = await getPrimaryGuardian(s.studentId, event.params.schoolId);
      if (!guardian?.uid) return;
      await notify({
        recipientUid: guardian.uid,
        title: 'Results Published',
        body:  `${subject.name} results for ${s.name.first} are now available in the parent portal.`,
        channels: ['push'],
        data: { examId: event.params.examId, type: 'results' }
      });
    }));
  }
);
```

---

### 2.5 LMS Triggers

#### `onContentUpload`
**Trigger:** `onCreate` — `.../lmsContent/{contentId}`

```typescript
export const onContentUpload = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/lmsContent/{contentId}',
  async (event) => {
    const content  = event.data?.data();
    const students = await getStudentsInClass(content.classId, content.schoolId);
    const tokens   = students.map(s => s.fcmToken).filter(Boolean);
    if (!tokens.length) return;

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: 'New Study Material', body: `"${content.title}" has been uploaded.` },
      data: { contentId: event.params.contentId, type: 'lms_content' }
    });
  }
);
```

#### `onAssignmentCreate`
**Trigger:** `onCreate` — `.../assignments/{taskId}`

```typescript
export const onAssignmentCreate = onDocumentCreated(
  'tenants/{tenantId}/schools/{schoolId}/assignments/{taskId}',
  async (event) => {
    const task     = event.data?.data();
    const subject  = await getSubject(task.subjectId, task.schoolId);
    const students = await getStudentsInClass(task.classId, task.schoolId);
    const tokens   = students.map(s => s.fcmToken).filter(Boolean);
    if (!tokens.length) return;

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: `New Assignment — ${subject.name}`,
        body:  `"${task.title}" due ${formatDate(task.dueDate)}.`
      },
      data: { taskId: event.params.taskId, type: 'assignment' }
    });
  }
);
```

---

### 2.6 Audit Triggers

Applied to all sensitive collections (invoices, payments, scores, staff, students).

```typescript
// Pattern — replicated for each collection
export const auditPaymentWrite = onDocumentWritten(
  'tenants/{t}/schools/{s}/payments/{p}',
  async (event) => {
    const action = !event.data.before.exists ? 'CREATE'
                 : !event.data.after.exists  ? 'DELETE' : 'UPDATE';
    await writeAuditLog({
      action, collection: 'payments', docId: event.params.p, schoolId: event.params.s,
      before: event.data.before.data() ?? null,
      after:  event.data.after.data()  ?? null
    });
  }
);
```

---

## 3. Scheduled Functions (Cron)

All cron expressions are in `Africa/Freetown` timezone (GMT+0 / WAT).

### 3.1 Daily Fee Reminder — `0 8 * * *` (8:00 AM)

```typescript
export const dailyFeeReminder = onSchedule(
  { schedule: '0 8 * * *', timeZone: 'Africa/Freetown' },
  async () => {
    const threeDaysAhead = addDays(new Date(), 3);
    const snap = await db.collectionGroup('invoices')
      .where('status', 'in', ['unpaid', 'partial'])
      .where('dueDate', '<=', Timestamp.fromDate(threeDaysAhead))
      .where('dueDate', '>=', Timestamp.now())
      .get();

    for (const doc of snap.docs) {
      const inv      = doc.data();
      const student  = await getStudentWithGuardians(inv.studentId, inv.schoolId);
      const guardian = student.guardians.find(g => g.isPrimary);
      if (!guardian) continue;

      await notify({
        recipientUid:   guardian.uid,
        recipientPhone: guardian.phone,
        title: 'Fee Payment Due Soon',
        body:  `Le ${inv.balance.toLocaleString()} due for ${student.name.first} on ${formatDate(inv.dueDate)}. Pay via Orange Money or at the bursar's office.`,
        channels: ['push', 'sms']
      });
      await doc.ref.update({ reminderCount: FieldValue.increment(1), lastReminderAt: Timestamp.now() });
    }
    logger.info(`Fee reminders sent: ${snap.size}`);
  }
);
```

### 3.2 Mark Overdue Invoices — `0 0 * * *` (Midnight)

```typescript
export const markOverdueInvoices = onSchedule(
  { schedule: '0 0 * * *', timeZone: 'Africa/Freetown' },
  async () => {
    const snap = await db.collectionGroup('invoices')
      .where('status', 'in', ['unpaid', 'partial'])
      .where('dueDate', '<', Timestamp.now())
      .get();

    const batches: WriteBatch[] = [];
    let batch = db.batch();
    let count = 0;

    for (const doc of snap.docs) {
      batch.update(doc.ref, { status: 'overdue' });
      if (++count % 499 === 0) { batches.push(batch); batch = db.batch(); }
    }
    batches.push(batch);
    await Promise.all(batches.map(b => b.commit()));
    logger.info(`Marked overdue: ${snap.size}`);
  }
);
```

### 3.3 Weekly Attendance Summary — `30 7 * * 1` (Monday 7:30 AM)

```typescript
export const weeklyAttendanceSummary = onSchedule(
  { schedule: '30 7 * * 1', timeZone: 'Africa/Freetown' },
  async () => {
    const schools = await getAllActiveSchools();
    for (const school of schools) {
      const { rate, lowStudents } = await computeWeeklyAttendance(school.schoolId);

      await notifyByRole({
        schoolId: school.schoolId,
        roles: ['admin', 'principal'],
        title: 'Weekly Attendance Summary',
        body:  `School-wide attendance last week: ${rate}%. ${lowStudents.length} students below 75%.`,
        channels: ['push']
      });

      for (const s of lowStudents) {
        const guardian = await getPrimaryGuardian(s.studentId, school.schoolId);
        if (!guardian) continue;
        await notify({
          recipientUid: guardian.uid, recipientPhone: guardian.phone,
          title: 'Low Attendance Warning',
          body:  `${s.name.first}'s attendance this week is ${s.weekRate}%, below the 75% minimum.`,
          channels: ['push', 'sms']
        });
      }
    }
  }
);
```

### 3.4 Monthly Payroll Draft — `0 6 1 * *` (1st of month, 6 AM)

```typescript
export const generateMonthlyPayroll = onSchedule(
  { schedule: '0 6 1 * *', timeZone: 'Africa/Freetown' },
  async () => {
    const schools = await getAllActiveSchools();
    const month   = String(new Date().getMonth() + 1).padStart(2, '0');
    const year    = String(new Date().getFullYear());

    for (const school of schools) {
      const staff = await getActiveStaff(school.schoolId);
      for (const member of staff) {
        const absences   = await countMonthlyAbsences(member.staffId, school.schoolId, month, year);
        const deductions = computeDeductions(member.baseSalary, absences);
        await db.collection(`tenants/${school.tenantId}/schools/${school.schoolId}/payroll`).add({
          staffId: member.staffId, schoolId: school.schoolId, month, year,
          grossSalary:      member.baseSalary,
          nassitDeduction:  deductions.nassit,
          taxDeduction:     deductions.tax,
          absenceDeduction: deductions.absence,
          otherDeductions:  0,
          netSalary:        deductions.net,
          status:           'draft',
          createdAt:        Timestamp.now()
        });
      }
      logger.info(`Payroll draft — ${school.name}: ${staff.length} staff`);
    }
  }
);
```

### 3.5 AI Risk Scan — `0 23 * * *` (11:00 PM)

```typescript
export const dailyAiRiskScan = onSchedule(
  { schedule: '0 23 * * *', timeZone: 'Africa/Freetown',
    memory: '1GiB', timeoutSeconds: 540 },
  async () => {
    const schools = await getAllActiveSchools();
    for (const school of schools) {
      const features = await buildStudentFeatureMatrix(school.schoolId);
      const risks    = await runDropoutRiskModel(features);        // Python ML model via HTTP

      const batch = db.batch();
      for (const { studentId, riskScore, riskLevel } of risks) {
        const ref = db.doc(`tenants/${school.tenantId}/schools/${school.schoolId}/students/${studentId}`);
        batch.update(ref, { dropoutRisk: riskLevel, dropoutRiskScore: riskScore, riskUpdatedAt: Timestamp.now() });
      }
      await batch.commit();
      logger.info(`AI scan — ${school.name}: ${risks.filter(r => r.riskLevel === 'high').length} high-risk`);
    }
  }
);
```

### 3.6 Firestore Backup — `0 2 * * *` (2:00 AM)

```typescript
export const dailyFirestoreBackup = onSchedule(
  { schedule: '0 2 * * *', timeZone: 'Africa/Freetown' },
  async () => {
    const client   = new FirestoreAdminClient();
    const project  = process.env.GCLOUD_PROJECT!;
    const today    = new Date().toISOString().split('T')[0];
    const bucket   = `gs://${project}-backups/${today}`;

    await client.exportDocuments({
      name: `projects/${project}/databases/(default)`,
      outputUriPrefix: bucket,
      collectionIds: []   // exports all collections
    });
    logger.info(`Backup complete → ${bucket}`);
  }
);
```

---

## 4. HTTP Callable Endpoints

All callables use Firebase's `onCall` — authentication tokens verified automatically.

### 4.1 Auth & User Management

#### `createSchoolUser` — Admin only
```typescript
export const createSchoolUser = onCall(async (req) => {
  assertRole(req.auth, ['admin']);
  const { email, password, role, schoolId, staffId, tenantId } = req.data;

  const user = await admin.auth().createUser({ email, password });
  await admin.auth().setCustomUserClaims(user.uid, { role, schoolId, tenantId });
  await db.doc(`tenants/${tenantId}/schools/${schoolId}/staff/${staffId}`)
          .update({ uid: user.uid });

  return { uid: user.uid };
});
```

#### `deactivateUser` — Admin only
```typescript
export const deactivateUser = onCall(async (req) => {
  assertRole(req.auth, ['admin']);
  await admin.auth().updateUser(req.data.uid, { disabled: true });
  await db.doc(`tenants/${req.data.tenantId}/schools/${req.data.schoolId}/staff/${req.data.staffId}`)
          .update({ status: 'terminated' });
  return { success: true };
});
```

---

### 4.2 Report Generation

#### `generateReportCard` — Teacher, Admin, Principal
```typescript
export const generateReportCard = onCall(
  { memory: '2GiB', timeoutSeconds: 300 },
  async (req) => {
    assertRole(req.auth, ['admin', 'principal', 'teacher']);
    const { studentId, schoolId, tenantId, term, academicYear } = req.data;

    const [student, school, scores, attendance] = await Promise.all([
      getStudent(studentId, schoolId),
      getSchool(schoolId, tenantId),
      getStudentTermScores(studentId, schoolId, term, academicYear),
      getTermAttendanceSummary(studentId, schoolId, term, academicYear)
    ]);

    const pdfBuffer = await buildReportCardPdf({ student, school, scores, attendance, term, academicYear });
    const url       = await uploadToStorage(
      `report_cards/${schoolId}/${academicYear}/term${term}/${studentId}.pdf`, pdfBuffer, 'application/pdf'
    );
    await db.doc(`tenants/${tenantId}/schools/${schoolId}/students/${studentId}`)
            .update({ [`reportCards.${academicYear}.term${term}`]: url });

    return { url };
  }
);
```

#### `generateClassResultsSheet` — Teacher, Admin
```typescript
export const generateClassResultsSheet = onCall(
  { memory: '1GiB', timeoutSeconds: 180 },
  async (req) => {
    assertRole(req.auth, ['admin', 'principal', 'teacher']);
    const url = await buildResultsSheetPdf(req.data);
    return { url };
  }
);
```

#### `generateFinancialReport` — Bursar, Admin
```typescript
export const generateFinancialReport = onCall(
  { memory: '1GiB', timeoutSeconds: 180 },
  async (req) => {
    assertRole(req.auth, ['admin', 'bursar']);
    const { schoolId, type, from, to } = req.data;
    let data;
    if (type === 'pnl')         data = await buildPnLReport(schoolId, from, to);
    if (type === 'cashflow')    data = await buildCashflowReport(schoolId, from, to);
    if (type === 'outstanding') data = await buildOutstandingReport(schoolId);
    const url = await generateReportFiles(data!, type, schoolId);   // PDF + Excel
    return { url };
  }
);
```

---

### 4.3 Payment Webhooks (REST — not callable)

#### `orangeMoneyWebhook` — REST POST, HMAC-verified
```typescript
export const orangeMoneyWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }

  const sig = req.headers['x-orange-signature'] as string;
  if (!verifyHmac(req.rawBody, sig, process.env.ORANGE_WEBHOOK_SECRET!)) {
    res.status(401).send('Invalid signature'); return;
  }

  const { transactionId, amount, metadata } = req.body;
  const { invoiceId, studentId, schoolId, tenantId } = JSON.parse(metadata);

  // Idempotency check
  const existing = await db.collectionGroup('payments')
    .where('mobileMoneyRef', '==', transactionId).limit(1).get();
  if (!existing.empty) { res.status(200).send('Already processed'); return; }

  await db.collection(`tenants/${tenantId}/schools/${schoolId}/payments`).add({
    invoiceId, studentId, schoolId,
    amount:         parseFloat(amount),
    paymentDate:    Timestamp.now(),
    method:         'orange_money',
    reference:      `OM-${Date.now()}`,
    mobileMoneyRef: transactionId,
    receivedBy:     'system',
    createdAt:      Timestamp.now()
  });
  res.status(200).send('OK');
});
```

#### `africellMoneyWebhook` — REST POST, API-key verified
```typescript
export const africellMoneyWebhook = onRequest(async (req, res) => {
  if (req.headers['x-api-key'] !== process.env.AFRICELL_WEBHOOK_SECRET) {
    res.status(401).send('Unauthorized'); return;
  }
  const { ref, paidAmount, extra } = req.body;
  const { invoiceId, studentId, schoolId, tenantId } = JSON.parse(extra);

  const dup = await db.collectionGroup('payments')
    .where('mobileMoneyRef', '==', ref).limit(1).get();
  if (!dup.empty) { res.status(200).send('Duplicate'); return; }

  await db.collection(`tenants/${tenantId}/schools/${schoolId}/payments`).add({
    invoiceId, studentId, schoolId,
    amount: parseFloat(paidAmount), paymentDate: Timestamp.now(),
    method: 'africell_money', reference: `AM-${Date.now()}`,
    mobileMoneyRef: ref, receivedBy: 'system', createdAt: Timestamp.now()
  });
  res.status(200).send('OK');
});
```

---

### 4.4 Notifications

#### `sendEmergencyAlert` — Admin only
```typescript
export const sendEmergencyAlert = onCall(async (req) => {
  assertRole(req.auth, ['admin']);
  const { schoolId, title, body } = req.data;
  const parents = await getAllParentsForSchool(schoolId);

  const tokens = parents.map(p => p.fcmToken).filter(Boolean);
  if (tokens.length) {
    await admin.messaging().sendEachForMulticast({ tokens, notification: { title, body } });
  }

  const phones = parents.map(p => p.phone).filter(Boolean);
  if (phones.length) {
    await sendBulkSms(phones, `[PWSS EMERGENCY] ${title}: ${body}`);
  }

  await db.collection(`tenants/${req.data.tenantId}/schools/${schoolId}/notifications`).add({
    type: 'emergency', channel: 'push_sms', title, body,
    targetRole: 'all', sentBy: req.auth!.uid, createdAt: Timestamp.now()
  });

  return { push: tokens.length, sms: phones.length };
});
```

#### `sendBulkPush` — Admin, Teacher
```typescript
export const sendBulkPush = onCall(async (req) => {
  assertRole(req.auth, ['admin', 'principal', 'teacher']);
  const { schoolId, title, body, targetRole, classId } = req.data;
  const recipients = await getRecipientsByRole(schoolId, targetRole, classId);
  const tokens     = recipients.map(r => r.fcmToken).filter(Boolean);
  if (!tokens.length) return { sent: 0 };
  await admin.messaging().sendEachForMulticast({ tokens, notification: { title, body } });
  return { sent: tokens.length };
});
```

---

### 4.5 AI & Analytics

#### `getStudentRiskProfile` — Teacher, Admin, Principal
```typescript
export const getStudentRiskProfile = onCall(
  { memory: '512MiB', timeoutSeconds: 60 },
  async (req) => {
    assertRole(req.auth, ['admin', 'principal', 'teacher']);
    const { studentId, schoolId } = req.data;
    const features         = await buildStudentFeatures(studentId, schoolId);
    const performanceRisk  = await runPerformancePrediction(features);
    const dropoutRisk      = await runDropoutRiskModel([features]);

    return {
      studentId,
      performanceRisk: {
        level:           performanceRisk[0].riskLevel,
        score:           performanceRisk[0].riskScore,
        weakSubjects:    performanceRisk[0].weakSubjects,
        recommendations: performanceRisk[0].recommendations
      },
      dropoutRisk: {
        level:   dropoutRisk[0].riskLevel,
        score:   dropoutRisk[0].riskScore,
        factors: dropoutRisk[0].factors
      }
    };
  }
);
```

#### `aiSchoolQuery` — Admin, Principal only
```typescript
export const aiSchoolQuery = onCall(
  { memory: '1GiB', timeoutSeconds: 120 },
  async (req) => {
    assertRole(req.auth, ['admin', 'principal']);
    const { schoolId, question } = req.data;
    const context  = await buildSchoolContext(schoolId, question);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a school analytics assistant for Prince of Wales Senior Secondary School.
                 Answer questions using only the provided school data. Cite specific numbers.
                 School data context: ${JSON.stringify(context)}`,
        messages: [{ role: 'user', content: question }]
      })
    });

    const data = await response.json();
    return { answer: data.content[0].text };
  }
);
```

#### `getClassPerformanceAnalytics` — Teacher, Admin, Principal
```typescript
export const getClassPerformanceAnalytics = onCall(async (req) => {
  assertRole(req.auth, ['admin', 'principal', 'teacher']);
  const { classId, schoolId, term, academicYear } = req.data;
  const [scores, attendance] = await Promise.all([
    getClassScores(classId, schoolId, term, academicYear),
    getClassAttendance(classId, schoolId)
  ]);
  return {
    subjectAverages:          computeSubjectAverages(scores),
    gradeDistribution:        computeGradeDistribution(scores),
    passRate:                 computePassRate(scores),
    attendanceRate:           computeAttendanceRate(attendance),
    correlationCoefficient:   computeCorrelation(scores, attendance),
    topPerformers:            getTopN(scores, 5),
    needsSupport:             getNeedingSupport(scores)
  };
});
```

---

### 4.6 Utility Endpoints

#### `validateQrCode` — Teacher (used during QR attendance scan)
```typescript
export const validateQrCode = onCall(async (req) => {
  assertRole(req.auth, ['teacher', 'admin']);
  const { qrContent, classId, schoolId, tenantId } = req.data;

  const snap = await db
    .collection(`tenants/${tenantId}/schools/${schoolId}/students`)
    .where('studentId', '==', qrContent)
    .limit(1).get();

  if (snap.empty)                              return { valid: false, reason: 'Unknown student ID' };
  const s = snap.docs[0].data();
  if (s.classId !== classId)                   return { valid: false, reason: 'Not enrolled in this class' };
  if (s.status  !== 'active')                  return { valid: false, reason: 'Student is not active' };

  return { valid: true, student: { id: s.studentId, name: s.name, photo: s.photo } };
});
```

#### `bulkImportStudents` — Admin only
```typescript
export const bulkImportStudents = onCall(
  { timeoutSeconds: 300, memory: '512MiB' },
  async (req) => {
    assertRole(req.auth, ['admin']);
    const { rows, schoolId, tenantId, classId, academicYear } = req.data;
    const results = { success: 0, errors: [] as { name: string; error: string }[] };

    const batches: WriteBatch[] = [];
    let batch = db.batch();
    let count = 0;

    for (const row of rows) {
      try {
        const studentId = await generateStudentId(schoolId);
        const ref       = db.collection(`tenants/${tenantId}/schools/${schoolId}/students`).doc(studentId);
        batch.set(ref, mapCsvToStudent(row, studentId, schoolId, classId));
        if (++count % 499 === 0) { batches.push(batch); batch = db.batch(); }
        results.success++;
      } catch (e: any) {
        results.errors.push({ name: row.name ?? 'Unknown', error: e.message });
      }
    }
    batches.push(batch);
    await Promise.all(batches.map(b => b.commit()));
    return results;
  }
);
```

---

## 5. Environment Variables

```bash
# Set via: firebase functions:config:set key=value
# Or via .env.local for local emulation

ANTHROPIC_API_KEY=sk-ant-...
ORANGE_MONEY_API_KEY=...
ORANGE_WEBHOOK_SECRET=...
AFRICELL_API_KEY=...
AFRICELL_WEBHOOK_SECRET=...
AFRICASTALKING_API_KEY=...
AFRICASTALKING_USERNAME=pwss
SENDGRID_API_KEY=SG...
ADMIN_EMAIL=admin@princewales.edu.sl
GCLOUD_PROJECT=pw-sas-prod
```

---

## 6. Complete Function Inventory

| Function | Type | Trigger / Schedule | Auth Required | Memory |
|----------|----|------------------|---------------|--------|
| onStudentAttendanceCreate | Trigger | Firestore onCreate | — | 256 MB |
| onAttendancePatternCheck | Trigger | Firestore onCreate | — | 256 MB |
| onStudentCreate | Trigger | Firestore onCreate | — | 512 MB |
| onStudentStatusChange | Trigger | Firestore onUpdate | — | 256 MB |
| onPaymentCreate | Trigger | Firestore onCreate | — | 512 MB |
| onInvoiceStatusChange | Trigger | Firestore onUpdate | — | 256 MB |
| onScoreCreate | Trigger | Firestore onCreate | — | 256 MB |
| onExamPublish | Trigger | Firestore onUpdate | — | 512 MB |
| onContentUpload | Trigger | Firestore onCreate | — | 256 MB |
| onAssignmentCreate | Trigger | Firestore onCreate | — | 256 MB |
| auditPaymentWrite | Trigger | Firestore onWrite | — | 256 MB |
| auditScoreWrite | Trigger | Firestore onWrite | — | 256 MB |
| auditStudentWrite | Trigger | Firestore onWrite | — | 256 MB |
| dailyFeeReminder | Scheduler | `0 8 * * *` WAT | — | 256 MB |
| markOverdueInvoices | Scheduler | `0 0 * * *` WAT | — | 256 MB |
| weeklyAttendanceSummary | Scheduler | `30 7 * * 1` WAT | — | 256 MB |
| generateMonthlyPayroll | Scheduler | `0 6 1 * *` WAT | — | 512 MB |
| dailyAiRiskScan | Scheduler | `0 23 * * *` WAT | — | 1 GiB |
| dailyFirestoreBackup | Scheduler | `0 2 * * *` WAT | — | 256 MB |
| createSchoolUser | Callable | On demand | admin | 256 MB |
| deactivateUser | Callable | On demand | admin | 256 MB |
| generateReportCard | Callable | On demand | teacher+ | 2 GiB |
| generateClassResultsSheet | Callable | On demand | teacher+ | 1 GiB |
| generateFinancialReport | Callable | On demand | bursar+ | 1 GiB |
| sendEmergencyAlert | Callable | On demand | admin | 256 MB |
| sendBulkPush | Callable | On demand | admin/teacher | 256 MB |
| getStudentRiskProfile | Callable | On demand | teacher+ | 512 MB |
| aiSchoolQuery | Callable | On demand | admin/principal | 1 GiB |
| getClassPerformanceAnalytics | Callable | On demand | teacher+ | 256 MB |
| validateQrCode | Callable | On demand | teacher | 256 MB |
| bulkImportStudents | Callable | On demand | admin | 512 MB |
| orangeMoneyWebhook | REST POST | Payment gateway | HMAC sig | 256 MB |
| africellMoneyWebhook | REST POST | Payment gateway | API key | 256 MB |

---

*PW-SAS Cloud Functions Blueprint v1.0.0 — Prince of Wales Senior Secondary School, Kingtom, Sierra Leone*
