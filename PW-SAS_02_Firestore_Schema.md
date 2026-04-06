# PW-SAS — Firestore Schema
## Collection / Document Structure with Fields and Types
**Version:** 1.0.0 | **Database:** Firebase Firestore (NoSQL)

---

## 1. Namespace Architecture

Every document lives under a `tenants` root, giving full multi-school isolation.

```
/tenants/{tenantId}
  /schools/{schoolId}
    /students/{studentId}
      /guardians/{guardianId}
      /medicalRecords/{recordId}
      /disciplinaryRecords/{recordId}
    /staff/{staffId}
      /evaluations/{evalId}
    /classes/{classId}
    /subjects/{subjectId}
    /subjectAssignments/{assignId}
    /enrollments/{enrollId}
    /attendance/{attendId}           ← student daily attendance
    /staffAttendance/{attendId}      ← staff daily attendance
    /exams/{examId}
    /scores/{scoreId}
    /feeStructures/{feeId}
    /invoices/{invoiceId}
    /payments/{paymentId}
    /expenses/{expenseId}
    /payroll/{payrollId}
    /lmsContent/{contentId}
    /assignments/{taskId}
    /submissions/{submissionId}
    /assets/{assetId}
      /logs/{logId}
    /healthVisits/{visitId}
    /busRoutes/{routeId}
    /notifications/{notifId}
      /logs/{logId}
    /auditLogs/{logId}              ← write-once, never deleted
```

---

## 2. Collection Schemas

### 2.1 `/tenants/{tenantId}`

```ts
{
  tenantId:     string,          // "tenant_pwss_001"
  name:         string,          // "Prince of Wales School"
  plan:         "starter" | "standard" | "enterprise",
  contactEmail: string,
  contactPhone: string,
  country:      string,          // "Sierra Leone"
  status:       "active" | "suspended" | "trial",
  createdAt:    Timestamp,
  updatedAt:    Timestamp
}
```

---

### 2.2 `.../schools/{schoolId}`

```ts
{
  schoolId:     string,          // "school_pwss_main"
  tenantId:     string,          // FK → tenants
  name:         string,          // "Prince of Wales Senior Secondary"
  shortName:    string,          // "PWSS"
  logo:         string,          // Firebase Storage URL
  address:      string,
  phone:        string,
  email:        string,
  motto:        string,
  principalId:  string,          // FK → staff
  levels:       string[],        // ["JSS", "SSS"]
  academicYear: string,          // "2025/2026"
  termDates: {
    term1: { start: Timestamp, end: Timestamp },
    term2: { start: Timestamp, end: Timestamp },
    term3: { start: Timestamp, end: Timestamp }
  },
  gradingScale: "WAEC" | "custom",
  timezone:     string,          // "Africa/Freetown"
  currency:     string,          // "SLL"
  createdAt:    Timestamp,
  updatedAt:    Timestamp
}
```

---

### 2.3 `.../students/{studentId}`

```ts
{
  studentId:       string,       // "PW-2026-0001"
  schoolId:        string,       // FK → schools
  classId:         string,       // FK → classes
  name: {
    first:  string,
    last:   string,
    middle: string | null
  },
  dob:             Timestamp,
  gender:          "male" | "female" | "other",
  photo:           string,       // Storage URL
  nationality:     string,
  religion:        string | null,
  homeAddress:     string,
  district:        string,
  status:          "active" | "graduated" | "transferred" | "withdrawn" | "suspended",
  enrolledAt:      Timestamp,
  graduatedAt:     Timestamp | null,
  transferredTo:   string | null,
  previousSchool:  string | null,
  digitalIdQr:     string,       // Storage URL of QR PNG
  busRouteId:      string | null, // FK → busRoutes
  busStop:         string | null,
  dropoutRisk:     "low" | "medium" | "high" | null,  // set by AI nightly
  dropoutRiskScore: number | null,
  riskUpdatedAt:   Timestamp | null,
  createdBy:       string,       // staffId
  createdAt:       Timestamp,
  updatedAt:       Timestamp
}
```

**Sub-collection — `.../students/{studentId}/guardians/{guardianId}`**

```ts
{
  guardianId:   string,
  name:         string,
  relationship: "father"|"mother"|"uncle"|"aunt"|"sibling"|"guardian"|"other",
  phone:        string,
  email:        string | null,
  whatsapp:     string | null,
  occupation:   string | null,
  isPrimary:    boolean,
  uid:          string | null,   // Firebase Auth UID (if uses parent portal)
  fcmToken:     string | null,   // for push notifications
  createdAt:    Timestamp
}
```

**Sub-collection — `.../students/{studentId}/medicalRecords/{recordId}`**

```ts
{
  recordId:         string,
  bloodGroup:       "A+"|"A-"|"B+"|"B-"|"AB+"|"AB-"|"O+"|"O-"|"unknown",
  allergies:        string[],    // ["penicillin", "peanuts"]
  conditions:       string[],    // ["asthma", "epilepsy"]
  disabilities:     string[],
  vaccinations: Array<{
    name:    string,
    date:    Timestamp,
    batch:   string | null
  }>,
  emergencyContact: {
    name:         string,
    phone:        string,
    relationship: string
  },
  notes:    string | null,
  updatedBy: string,             // staffId
  updatedAt: Timestamp
}
```

**Sub-collection — `.../students/{studentId}/disciplinaryRecords/{recordId}`**

```ts
{
  recordId:       string,
  incidentDate:   Timestamp,
  type:           "truancy"|"violence"|"cheating"|"misconduct"|"bullying"|"other",
  description:    string,
  action:         "warning"|"suspension"|"expulsion"|"detention"|"parent_meeting"|"counseling",
  actionDate:     Timestamp,
  recordedBy:     string,        // staffId
  parentNotified: boolean,
  resolved:       boolean,
  notes:          string | null,
  createdAt:      Timestamp
}
```

**Firestore indexes — students:**

| Fields | Order | Use case |
|--------|-------|----------|
| `schoolId`, `status` | ASC, ASC | Active students per school |
| `schoolId`, `classId` | ASC, ASC | Students per class |
| `schoolId`, `name.last` | ASC, ASC | Alphabetical listing |
| `schoolId`, `dropoutRisk` | ASC, ASC | AI risk dashboard |

---

### 2.4 `.../staff/{staffId}`

```ts
{
  staffId:        string,        // "PW-STF-0001"
  schoolId:       string,
  uid:            string | null, // Firebase Auth UID
  fcmToken:       string | null,
  name: {
    first: string,
    last:  string
  },
  role:           "teacher"|"principal"|"bursar"|"admin"|"health_officer"
                  |"inventory_officer"|"driver"|"support_staff",
  photo:          string | null,
  phone:          string,
  email:          string,
  nin:            string | null, // National ID Number
  qualifications: string[],
  specialization: string[],      // subjects qualified to teach
  employmentType: "full_time"|"part_time"|"contract",
  baseSalary:     number,
  hireDate:       Timestamp,
  status:         "active"|"on_leave"|"terminated",
  documents: {
    contractUrl:     string | null,
    certificateUrls: string[]
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Sub-collection — `.../staff/{staffId}/evaluations/{evalId}`**

```ts
{
  evalId:       string,
  term:         "1"|"2"|"3",
  academicYear: string,
  adminScore:   number,          // 0–100
  adminNotes:   string,
  studentScore: number | null,   // anonymous survey average
  criteria: {
    punctuality: number,
    preparation: number,
    delivery:    number,
    results:     number,
    conduct:     number
  },
  overallGrade: "A"|"B"|"C"|"D",
  evaluatedBy:  string,          // staffId (principal/admin)
  createdAt:    Timestamp
}
```

---

### 2.5 `.../classes/{classId}`

```ts
{
  classId:        string,        // "cls_sss2_science_2526"
  schoolId:       string,
  name:           string,        // "SSS 2 Science"
  level:          "Nursery"|"Primary"|"JSS"|"SSS",
  year:           "1"|"2"|"3",
  section:        string,        // "A", "B", "Science", "Arts"
  classTeacherId: string,        // FK → staff
  capacity:       number,
  academicYear:   string,
  createdAt:      Timestamp
}
```

---

### 2.6 `.../subjects/{subjectId}`

```ts
{
  subjectId:  string,
  schoolId:   string,
  name:       string,            // "Further Mathematics"
  code:       string,            // "FMAT"
  level:      "JSS"|"SSS"|"all",
  waecCode:   string | null,
  createdAt:  Timestamp
}
```

---

### 2.7 `.../subjectAssignments/{assignId}`

```ts
{
  assignId:       string,
  staffId:        string,        // FK → staff
  classId:        string,        // FK → classes
  subjectId:      string,        // FK → subjects
  schoolId:       string,
  academicYear:   string,
  term:           "1"|"2"|"3"|"all",
  periodsPerWeek: number,
  createdAt:      Timestamp
}
```

---

### 2.8 `.../enrollments/{enrollId}`

```ts
{
  enrollId:     string,
  studentId:    string,
  classId:      string,
  schoolId:     string,
  academicYear: string,
  status:       "active"|"transferred_in"|"transferred_out"|"graduated"|"withdrawn",
  startDate:    Timestamp,
  endDate:      Timestamp | null,
  createdAt:    Timestamp
}
```

**Index:** `schoolId, classId, academicYear` (ASC, ASC, ASC)

---

### 2.9 `.../attendance/{attendId}`

One document per student per date. `attendId` = `att_{studentId}_{YYYYMMDD}`.

```ts
{
  attendId:        string,
  studentId:       string,
  classId:         string,
  schoolId:        string,
  date:            Timestamp,    // midnight of the day
  dateString:      string,       // "2026-03-26" — for range queries
  status:          "present"|"absent"|"late"|"excused"|"medical_leave",
  checkInTime:     Timestamp | null,
  method:          "manual"|"qr_scan"|"rfid",
  excuseDocUrl:    string | null,
  markedBy:        string,       // staffId
  parentNotified:  boolean,
  createdAt:       Timestamp,
  updatedAt:       Timestamp
}
```

**Indexes:**

| Fields | Order | Use case |
|--------|-------|----------|
| `schoolId`, `classId`, `dateString` | ASC | Class register for a date |
| `studentId`, `dateString` | ASC | Student history |
| `schoolId`, `status`, `dateString` | ASC | Absent students today |

**Separate collection — `.../staffAttendance/{attendId}`** (same shape, `staffId` instead of `studentId`, no `method`/`excuseDocUrl`/`parentNotified`)

---

### 2.10 `.../exams/{examId}`

```ts
{
  examId:       string,
  schoolId:     string,
  subjectId:    string,
  classId:      string,
  title:        string,          // "Mathematics End of Term 1"
  type:         "CA1"|"CA2"|"midterm"|"end_of_term"|"mock_waec"|"quiz",
  maxScore:     number,          // typically 100
  caWeight:     number,          // 40  (percentage)
  examWeight:   number,          // 60  (percentage)
  term:         "1"|"2"|"3",
  academicYear: string,
  examDate:     Timestamp,
  published:    boolean,
  publishedAt:  Timestamp | null,
  createdBy:    string,          // staffId
  createdAt:    Timestamp
}
```

---

### 2.11 `.../scores/{scoreId}`

`scoreId` = `score_{examId}_{studentId}`

```ts
{
  scoreId:      string,
  studentId:    string,
  examId:       string,
  subjectId:    string,
  classId:      string,
  schoolId:     string,
  term:         "1"|"2"|"3",
  academicYear: string,
  caScore:      number | null,
  examScore:    number | null,
  totalScore:   number,          // auto-computed by Cloud Function
  grade:        "A1"|"B2"|"B3"|"C4"|"C5"|"C6"|"D7"|"E8"|"F9",
  remark:       string,          // "Excellent", "Credit", "Fail" …
  position:     number | null,   // class rank (optional)
  teacherNote:  string | null,
  enteredBy:    string,
  enteredAt:    Timestamp,
  updatedAt:    Timestamp
}
```

**Indexes:**

| Fields | Order | Use case |
|--------|-------|----------|
| `studentId`, `academicYear`, `term` | ASC | Report card fetch |
| `classId`, `subjectId`, `academicYear` | ASC | Class results sheet |
| `examId` | ASC | Bulk score entry |

---

### 2.12 `.../feeStructures/{feeId}`

```ts
{
  feeId:        string,
  schoolId:     string,
  classId:      string | null,   // null = applies to all classes
  level:        string | null,   // "SSS" — alternate to classId
  category:     "tuition"|"development"|"exam"|"uniform"|"boarding"|"transport"|"other",
  label:        string,          // "Term 1 Tuition Fee"
  amount:       number,          // in SLL
  term:         "1"|"2"|"3"|"all",
  academicYear: string,
  discount:     number,          // percentage 0–100; 0 = no discount
  createdAt:    Timestamp
}
```

---

### 2.13 `.../invoices/{invoiceId}`

```ts
{
  invoiceId:       string,
  studentId:       string,
  schoolId:        string,
  feeStructureIds: string[],     // fees this invoice covers
  totalAmount:     number,
  amountPaid:      number,
  balance:         number,       // kept in sync by Cloud Function
  dueDate:         Timestamp,
  issueDate:       Timestamp,
  term:            "1"|"2"|"3",
  academicYear:    string,
  status:          "unpaid"|"partial"|"paid"|"overdue"|"waived",
  reminderCount:   number,       // SMS/push reminders sent
  lastReminderAt:  Timestamp | null,
  createdBy:       string,
  createdAt:       Timestamp,
  updatedAt:       Timestamp
}
```

**Indexes:**

| Fields | Order | Use case |
|--------|-------|----------|
| `schoolId`, `status`, `dueDate` | ASC | Overdue dashboard |
| `studentId`, `academicYear` | ASC | Student fee history |
| `schoolId`, `term`, `academicYear` | ASC | Term revenue totals |

---

### 2.14 `.../payments/{paymentId}`

*Immutable after creation — Cloud Functions write; direct client writes blocked.*

```ts
{
  paymentId:       string,
  invoiceId:       string,
  studentId:       string,
  schoolId:        string,
  amount:          number,
  paymentDate:     Timestamp,
  method:          "cash"|"orange_money"|"africell_money"|"bank_transfer"|"cheque",
  reference:       string,       // internal receipt number
  mobileMoneyRef:  string | null, // telco transaction ID (idempotency key)
  receiptUrl:      string | null, // generated PDF
  receivedBy:      string,       // staffId (bursar) or "system"
  notes:           string | null,
  createdAt:       Timestamp
}
```

---

### 2.15 `.../expenses/{expenseId}`

```ts
{
  expenseId:   string,
  schoolId:    string,
  category:    "salaries"|"utilities"|"maintenance"|"procurement"|"transport"|"events"|"other",
  description: string,
  amount:      number,
  date:        Timestamp,
  receiptUrl:  string | null,
  vendor:      string | null,
  approvedBy:  string,           // staffId
  status:      "pending"|"approved"|"rejected",
  createdBy:   string,
  createdAt:   Timestamp
}
```

---

### 2.16 `.../payroll/{payrollId}`

```ts
{
  payrollId:        string,
  staffId:          string,
  schoolId:         string,
  month:            string,      // "03"
  year:             string,      // "2026"
  grossSalary:      number,
  nassitDeduction:  number,      // National Social Security & Insurance Trust
  taxDeduction:     number,
  absenceDeduction: number,
  otherDeductions:  number,
  netSalary:        number,
  status:           "draft"|"approved"|"paid",
  paidDate:         Timestamp | null,
  payslipUrl:       string | null,
  approvedBy:       string,      // staffId (principal/admin)
  createdAt:        Timestamp
}
```

---

### 2.17 `.../lmsContent/{contentId}`

```ts
{
  contentId:    string,
  schoolId:     string,
  subjectId:    string,
  classId:      string,
  title:        string,
  description:  string | null,
  type:         "note"|"video"|"presentation"|"image"|"link"|"other",
  fileUrl:      string | null,   // Firebase Storage URL
  externalUrl:  string | null,   // YouTube / external link
  fileSize:     number | null,   // bytes
  term:         "1"|"2"|"3",
  academicYear: string,
  isPublished:  boolean,
  downloadCount: number,
  uploadedBy:   string,          // staffId
  createdAt:    Timestamp
}
```

---

### 2.18 `.../assignments/{taskId}`

```ts
{
  taskId:           string,
  schoolId:         string,
  subjectId:        string,
  classId:          string,
  title:            string,
  instructions:     string,
  attachmentUrl:    string | null,
  maxScore:         number,
  dueDate:          Timestamp,
  allowLate:        boolean,
  term:             "1"|"2"|"3",
  academicYear:     string,
  totalSubmissions: number,      // counter maintained by Cloud Function
  createdBy:        string,
  createdAt:        Timestamp
}
```

---

### 2.19 `.../submissions/{submissionId}`

```ts
{
  submissionId: string,
  taskId:       string,
  studentId:    string,
  schoolId:     string,
  classId:      string,
  fileUrl:      string | null,
  textResponse: string | null,
  submittedAt:  Timestamp,
  isLate:       boolean,
  score:        number | null,
  feedback:     string | null,
  gradedBy:     string | null,   // staffId
  gradedAt:     Timestamp | null,
  status:       "submitted"|"graded"|"returned"
}
```

---

### 2.20 `.../assets/{assetId}`

```ts
{
  assetId:           string,
  schoolId:          string,
  name:              string,
  category:          "furniture"|"electronics"|"books"|"lab_equipment"|"sports"|"vehicle"|"other",
  quantity:          number,
  availableQty:      number,     // quantity − currently issued
  condition:         "new"|"good"|"fair"|"poor"|"damaged",
  location:          string,     // "Library", "Lab 1"
  purchaseDate:      Timestamp | null,
  value:             number,     // SLL
  serialNo:          string | null,
  lowStockThreshold: number,
  createdAt:         Timestamp,
  updatedAt:         Timestamp
}
```

**Sub-collection — `.../assets/{assetId}/logs/{logId}`**

```ts
{
  logId:       string,
  action:      "issued"|"returned"|"damaged"|"lost"|"replenished",
  quantity:    number,
  issuedTo:    string | null,    // studentId or staffId
  issuedBy:    string,           // staffId
  date:        Timestamp,
  dueReturn:   Timestamp | null,
  returnedAt:  Timestamp | null,
  notes:       string | null
}
```

---

### 2.21 `.../healthVisits/{visitId}`

```ts
{
  visitId:        string,
  studentId:      string,
  schoolId:       string,
  visitDate:      Timestamp,
  complaint:      string,
  treatment:      string,
  medication:     string | null,
  dosage:         string | null,
  outcome:        "discharged"|"referred"|"rest"|"emergency",
  referredTo:     string | null,
  parentNotified: boolean,
  recordedBy:     string,        // health officer staffId
  createdAt:      Timestamp
}
```

---

### 2.22 `.../busRoutes/{routeId}`

```ts
{
  routeId:      string,
  schoolId:     string,
  name:         string,          // "Route A — East Freetown"
  vehiclePlate: string,
  driverName:   string,
  driverPhone:  string,
  capacity:     number,
  stops: Array<{
    name:            string,     // "Wilberforce Barracks"
    estimatedPickup: string,     // "07:15"
    lat:             number | null,
    lng:             number | null
  }>,
  isActive:  boolean,
  createdAt: Timestamp
}
```

---

### 2.23 `.../notifications/{notifId}`

```ts
{
  notifId:    string,
  schoolId:   string,
  type:       "attendance"|"fee_reminder"|"results"|"announcement"|"emergency"|"health"|"assignment",
  channel:    "push"|"sms"|"email"|"in_app",
  title:      string,
  body:       string,
  data:       Record<string, string> | null,  // deeplink payload
  targetRole: "parent"|"teacher"|"student"|"admin"|"all" | null,
  targetId:   string | null,                 // specific userId or classId
  sentBy:     string,            // staffId
  createdAt:  Timestamp
}
```

**Sub-collection — `.../notifications/{notifId}/logs/{logId}`**

```ts
{
  logId:       string,
  recipientId: string,
  channel:     "push"|"sms"|"email",
  status:      "sent"|"delivered"|"read"|"failed",
  sentAt:      Timestamp,
  deliveredAt: Timestamp | null,
  readAt:      Timestamp | null,
  errorMsg:    string | null
}
```

---

### 2.24 `.../auditLogs/{logId}`

*Write-once. Security rules block all updates and deletes.*

```ts
{
  logId:       string,
  schoolId:    string,
  tenantId:    string,
  userId:      string,           // Firebase Auth UID
  userRole:    string,
  action:      "CREATE"|"UPDATE"|"DELETE"|"LOGIN"|"EXPORT"|"PUBLISH",
  collection:  string,           // Firestore collection name
  docId:       string,           // affected document ID
  before:      Record<string, any> | null,  // sensitive fields redacted
  after:       Record<string, any> | null,
  ipAddress:   string | null,
  device:      string | null,
  timestamp:   Timestamp
}
```

**Indexes:**

| Fields | Order | Use case |
|--------|-------|----------|
| `schoolId`, `userId`, `timestamp` | ASC, ASC, DESC | User audit trail |
| `schoolId`, `collection`, `timestamp` | ASC, ASC, DESC | Collection audit trail |

---

## 3. Security Rules Summary

```js
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth()  { return request.auth != null; }
    function uid()     { return request.auth.uid; }
    function role(schoolPath) {
      return get(schoolPath + '/staff/' + uid()).data.role;
    }
    function isAdmin(sp)   { return role(sp) in ['admin','principal']; }
    function isBursar(sp)  { return role(sp) == 'bursar'; }
    function isTeacher(sp) { return role(sp) == 'teacher'; }
    function isHealth(sp)  { return role(sp) == 'health_officer'; }

    match /tenants/{t}/schools/{s} {
      allow read:  if isAuth();
      allow write: if isAdmin(/databases/$(database)/documents/tenants/$(t)/schools/$(s));

      match /students/{studentId} {
        allow read:          if isAuth();
        allow create,update: if isAdmin(/…/schools/$(s)) || isTeacher(/…/schools/$(s));
        allow delete:        if isAdmin(/…/schools/$(s));

        match /medicalRecords/{r} {
          allow read,write: if isAdmin(/…/schools/$(s)) || isHealth(/…/schools/$(s));
        }
      }

      match /invoices/{i}  { allow read,write: if isAdmin(/…/schools/$(s)) || isBursar(/…/schools/$(s)); }
      match /payments/{p}  {
        allow read:          if isAdmin(/…/schools/$(s)) || isBursar(/…/schools/$(s));
        allow create:        if isAdmin(/…/schools/$(s)) || isBursar(/…/schools/$(s));
        allow update,delete: if false;  // immutable
      }
      match /auditLogs/{l} {
        allow read:          if isAdmin(/…/schools/$(s));
        allow write:         if false;  // Cloud Functions only
      }
    }
  }
}
```

---

## 4. Composite Index Reference

| Collection | Fields | Direction | Purpose |
|-----------|--------|-----------|---------|
| students | schoolId, status | ASC, ASC | Active student list |
| students | schoolId, classId | ASC, ASC | Students per class |
| students | schoolId, dropoutRisk | ASC, ASC | AI risk dashboard |
| attendance | schoolId, classId, dateString | ASC | Class register |
| attendance | studentId, dateString | ASC | Student history |
| attendance | schoolId, status, dateString | ASC | Absent today |
| scores | studentId, academicYear, term | ASC | Report card |
| scores | classId, subjectId, academicYear | ASC | Class results sheet |
| invoices | schoolId, status, dueDate | ASC | Overdue fees |
| invoices | studentId, academicYear | ASC | Student fee history |
| payroll | schoolId, month, year | ASC | Monthly payroll run |
| auditLogs | schoolId, userId, timestamp | ASC, DESC | User trail |
| notifications | schoolId, targetId, createdAt | ASC, DESC | User inbox |

---

*PW-SAS Firestore Schema v1.0.0 — Prince of Wales Senior Secondary School, Kingtom, Sierra Leone*
