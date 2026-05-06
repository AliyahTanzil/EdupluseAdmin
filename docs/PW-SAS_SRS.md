# Software Requirements Specification (SRS)
## PW-SAS — Prince of Wales School Administration System
### Prince of Wales Senior Secondary School, Kingtom, Sierra Leone

---

**Document Version:** 1.0.0
**Prepared By:** Mohamed Augustin
**Institution:** Prince of Wales Senior Secondary School
**Date:** March 2026
**Classification:** Internal — Project Documentation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Tech Stack & Frameworks](#4-tech-stack--frameworks)
5. [Module Specifications](#5-module-specifications)
   - 5.1 Student Information System (SIS)
   - 5.2 Teacher Management System (TMS)
   - 5.3 Parent Portal
   - 5.4 Administration & Operations
   - 5.5 Finance & Accounting System
   - 5.6 AI & Analytics Engine
   - 5.7 Communication & Notification System
   - 5.8 Attendance System
   - 5.9 Exam & Grading System
   - 5.10 Learning Management System (LMS)
   - 5.11 Inventory & Asset Management
   - 5.12 Health Management System
   - 5.13 Transport Management System
   - 5.14 Reporting & Dashboard System
   - 5.15 Security & Identity Management
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Requirements](#7-data-requirements)
8. [System Integration](#8-system-integration)
9. [User Roles & Access Control](#9-user-roles--access-control)
10. [Development Roadmap](#10-development-roadmap)
11. [Appendix](#11-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the **Prince of Wales School Administration System (PW-SAS)** — a production-grade, full-scale digital administration and education management platform designed for Prince of Wales Senior Secondary School, Kingtom, Sierra Leone.

The document serves as the authoritative reference for all design, development, testing, and deployment activities associated with PW-SAS.

### 1.2 Project Vision

> **"Good Governance = Reliable Data + Monitoring + Accountability"**

PW-SAS is not merely a school management app. It is designed to be a **National Education Infrastructure Platform** — scalable, intelligent, and capable of serving multiple schools under a single federated architecture. Starting with Prince of Wales Senior Secondary School, the system is architected to expand across the Sierra Leone education ecosystem.

### 1.3 Scope

PW-SAS encompasses the following domains:

- Student Information & Lifecycle Management
- Teacher & Staff Administration
- Academic Records, Exams & Grading
- Financial Management & Fee Collection
- Parent Engagement & Communication
- AI-Powered Analytics & Predictive Intelligence
- Learning Content Delivery (LMS)
- Attendance Tracking (Smart/Biometric)
- Health, Transport & Inventory Management
- Real-Time Multi-Channel Notifications
- Security, Audit Trails & Role-Based Access Control
- Offline-First Operation with Cloud Sync

### 1.4 Definitions, Acronyms & Abbreviations

| Term | Definition |
|------|------------|
| PW-SAS | Prince of Wales School Administration System |
| SIS | Student Information System |
| TMS | Teacher Management System |
| LMS | Learning Management System |
| RBAC | Role-Based Access Control |
| WAEC | West African Examinations Council |
| JSS | Junior Secondary School |
| SSS | Senior Secondary School |
| MVP | Minimum Viable Product |
| ERD | Entity Relationship Diagram |
| API | Application Programming Interface |
| PWA | Progressive Web Application |
| SLE | Sierra Leone |
| MoMo | Mobile Money (e.g., Orange Money, Africell Money) |
| QR | Quick Response (code) |
| RFID | Radio Frequency Identification |

### 1.5 References

- WAEC Sierra Leone Grading Standards
- Sierra Leone Ministry of Education Curriculum Framework
- Firebase Documentation (v9+)
- React Native / Expo Documentation
- Material UI & React Native Paper Documentation

### 1.6 Overview

This document is structured as follows: Section 2 provides an overall system description. Section 3 defines the architecture. Section 4 specifies the technology stack. Sections 5 through 8 detail functional and non-functional requirements per module. Section 9 covers access control, Section 10 presents the development roadmap, and Section 11 contains supporting appendices.

---

## 2. Overall Description

### 2.1 Product Perspective

PW-SAS is a **modular, multi-tier, offline-first** platform designed for the educational and administrative context of Sierra Leone. It operates as:

- A **Web Application** (React + Vite) for administration and desktop use
- A **Mobile Application** (React Native + Expo) for teachers, parents, and students
- A **Firebase-backed cloud service** for real-time sync, authentication, and data persistence
- An **AI/Analytics layer** for predictive intelligence and reporting

The system is designed around a **multi-tenant architecture**, enabling future expansion to multiple schools under one platform umbrella.

### 2.2 Product Functions (Summary)

| Domain | Core Functions |
|--------|---------------|
| Student Management | Enrollment, profiles, academic lifecycle, digital IDs |
| Teacher Management | Profiles, schedules, payroll linkage, evaluations |
| Attendance | QR, biometric, RFID; automated alerts |
| Exams & Grading | WAEC-compatible grading, auto-computation, transcripts |
| Finance | Fees, mobile money, invoicing, payroll, reports |
| LMS | Content upload, quizzes, assignments, submissions |
| Parent Portal | Dashboard, chat, payments, report downloads |
| AI Analytics | Failure prediction, dropout risk, performance trends |
| Communication | Push, SMS, Email, WhatsApp alerts |
| Inventory | Books, equipment, assets tracking |
| Health | Medical records, clinic visits, vaccination |
| Transport | Bus routes, student alerts, GPS tracking |
| Security | RBAC, audit logs, encryption |
| Reporting | PDF/Excel exports, dashboards per role |

### 2.3 User Classes and Characteristics

| User Class | Description | Primary Interface |
|------------|-------------|-------------------|
| Super Admin | Platform owner; full system access | Web App |
| School Admin | Manages school-wide operations | Web App |
| Principal / Head Teacher | Academic oversight | Web App |
| Bursar / Finance Officer | Fee and payroll management | Web App |
| Teacher / Instructor | Class management, grading, attendance | Web App + Mobile |
| Student | Access to results, content, timetable | Mobile App |
| Parent / Guardian | Monitor child progress, pay fees | Mobile App |
| IT Administrator | System configuration, user management | Web App |
| Health Officer | Medical records management | Web App |
| Inventory Officer | Asset and stock management | Web App |

### 2.4 Operating Environment

- **Web:** Modern browsers (Chrome, Firefox, Edge, Safari) on Windows, macOS, Linux
- **Mobile:** Android 8.0+ and iOS 13+ (via Expo/React Native)
- **Network:** Designed for low-bandwidth and intermittent connectivity (Kingtom, Sierra Leone)
- **Storage:** Firebase Firestore (cloud), AsyncStorage / SQLite (local cache)
- **Authentication:** Firebase Authentication

### 2.5 Design and Implementation Constraints

- Must support **offline-first** operation with background sync when connectivity resumes
- Must work on **low-cost Android devices** (common among students and parents in SLE)
- Financial module must support **Orange Money and Africell Money** (Sierra Leone mobile money)
- Grading must be **WAEC-compatible** out of the box
- UI must be intuitive for users with varying digital literacy levels
- All sensitive data must be **encrypted at rest and in transit**
- The system must support **multi-school tenancy** with data isolation

### 2.6 Assumptions and Dependencies

- Prince of Wales School has access to at least one internet-connected device for administration
- Firebase project provisioned and configured for PW-SAS
- GitHub repository maintained for CI/CD and version control
- Teachers and administrators will receive onboarding training
- Mobile money API credentials obtainable from Orange SL / Africell

---

## 3. System Architecture

### 3.1 Architectural Pattern

PW-SAS follows a **Modular Monorepo + Domain-Driven Design** pattern in Phase 1, with a clear pathway to **microservices** in Phase 3.

```
PW-SAS Monorepo
├── apps/
│   ├── web/              # React + Vite (Admin & Teacher Web Portal)
│   └── mobile/           # React Native + Expo (Student, Parent, Teacher Mobile)
├── packages/
│   ├── shared/           # Shared types, utilities, constants
│   ├── ui/               # Shared UI components (MUI + React Native Paper)
│   └── firebase/         # Firebase config, hooks, services
├── functions/            # Firebase Cloud Functions (backend logic)
├── firestore.rules       # Firestore security rules
├── storage.rules         # Firebase Storage rules
└── docs/                 # SRS, ERD, API docs
```

### 3.2 System Layers

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│        React (Vite) Web App │ React Native Mobile App    │
│        Material UI          │ React Native Paper         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   APPLICATION LAYER                       │
│     Firebase Cloud Functions │ Custom Business Logic     │
│     REST API Endpoints       │ Event-Driven Triggers     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   DATA LAYER                              │
│     Firebase Firestore (Cloud) │ AsyncStorage (Local)   │
│     Firebase Storage           │ Firebase RTDB (Live)   │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Multi-Tenant Architecture

Each school is identified by a unique `tenantId`. All Firestore documents are namespaced under:

```
/tenants/{tenantId}/students/{studentId}
/tenants/{tenantId}/teachers/{teacherId}
/tenants/{tenantId}/finance/{transactionId}
...
```

This enables complete data isolation between schools while sharing the same Firebase project and application codebase.

### 3.4 Offline-First Strategy

- **React Query + AsyncStorage** for local caching on web
- **MMKV / AsyncStorage** for mobile-side cache
- **Firebase offline persistence** enabled (`enableIndexedDbPersistence`)
- **Background sync queue** — actions performed offline are queued and synced on reconnect
- **Conflict resolution** — last-write-wins with server timestamp for non-critical data; manual review required for financial records

---

## 4. Tech Stack & Frameworks

### 4.1 Frontend — Web Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI component library |
| **Vite** | 5.x | Build tool and dev server |
| **Material UI (MUI)** | 5.x | Component design system |
| **React Router** | 6.x | Client-side routing |
| **React Query** | 5.x | Server state management and caching |
| **Zustand** | 4.x | Global client state management |
| **Recharts** | 2.x | Data visualization and charts |
| **React Hook Form** | 7.x | Form handling and validation |
| **Zod** | 3.x | Schema validation |

### 4.2 Frontend — Mobile Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.73.x | Cross-platform mobile framework |
| **Expo CLI** | 50.x | Development toolchain and build service |
| **React Native Paper** | 5.x | Material Design component library for RN |
| **Expo Router** | 3.x | File-based navigation for Expo apps |
| **React Native MMKV** | — | High-performance local storage |
| **React Native Reanimated** | 3.x | Smooth animations |
| **Expo Notifications** | — | Push notification handling |
| **Expo Camera** | — | QR code scanning for attendance |
| **Expo Barcode Scanner** | — | Student digital ID scanning |

### 4.3 Backend & Cloud Services

| Technology | Purpose |
|------------|---------|
| **Firebase Authentication** | User identity, session management, social login |
| **Firebase Firestore** | Primary NoSQL cloud database |
| **Firebase Realtime Database** | Live data (attendance events, notifications) |
| **Firebase Cloud Functions** | Server-side business logic, scheduled tasks, triggers |
| **Firebase Storage** | Document, image, and media file storage |
| **Firebase Cloud Messaging (FCM)** | Push notifications to mobile devices |
| **Firebase Analytics** | Usage analytics and event tracking |
| **Firebase Hosting** | Deployment of the web application |
| **Firebase App Check** | API abuse protection |

### 4.4 Version Control & DevOps

| Technology | Purpose |
|------------|---------|
| **GitHub** | Source code hosting, version control |
| **GitHub Actions** | CI/CD pipelines (lint, test, build, deploy) |
| **Expo EAS Build** | Cloud builds for Android and iOS |
| **Firebase CLI** | Deployment and environment management |

### 4.5 AI & Analytics Layer (Phase 2+)

| Technology | Purpose |
|------------|---------|
| **Python (scikit-learn)** | Machine learning models (performance prediction, dropout risk) |
| **Firebase Cloud Functions (Python runtime)** | Serving ML model inference |
| **Anthropic Claude API** | AI agent for natural language school insights |
| **Recharts / D3.js** | Advanced analytics visualization |

---

## 5. Module Specifications

---

### 5.1 Student Information System (SIS)

#### 5.1.1 Overview
The SIS is the central repository for all student-related data, managing the full academic lifecycle from admission through graduation.

#### 5.1.2 Functional Requirements

**FR-SIS-001: Student Registration & Enrollment**
- The system shall support new student registration with full biographical data
- Required fields: Full name, date of birth, gender, nationality, religion (optional), home address, LGA/district
- The system shall auto-generate a unique Student ID (e.g., `PW-2026-0001`)
- The system shall support enrollment into a specific school level (Nursery, Primary, JSS, SSS) and class

**FR-SIS-002: Student Profile Management**
- Each student shall have a comprehensive digital profile containing:
  - Personal information (bio, photo)
  - Medical history, known allergies, blood group
  - Guardian/parent relationships (supports multiple guardians)
  - Emergency contact details
  - Academic history (previous schools attended)
  - Documents (birth certificate, previous results — stored in Firebase Storage)

**FR-SIS-003: Academic Lifecycle Tracking**
- The system shall track: Admission → Class Assignment → Promotion → Graduation/Transfer/Withdrawal
- Annual promotion shall be processed based on exam results, with manual override by admin
- Transfer records shall be maintained with date, destination school, and reason

**FR-SIS-004: Student Digital ID**
- Each student shall have a digital ID with embedded QR code
- The QR code links to the student's profile for attendance scanning and identity verification
- Physical ID card generation (PDF format) shall be supported

**FR-SIS-005: Behavioral Tracking**
- Disciplinary records: incident date, type, description, action taken, teacher/admin who recorded it
- Rewards/commendations tracking for positive behavior (gamification)
- Behavioral summary visible on student profile

**FR-SIS-006: Class & Section Management**
- The system shall support creation and management of classes (e.g., JSS 1A, SSS 2 Science)
- Class capacity limits shall be configurable
- Students can be reassigned between classes by admin

#### 5.1.3 Data Entities
- `Student`: studentId, tenantId, name, dob, gender, photo, classId, status, enrollmentDate
- `Guardian`: guardianId, studentId, name, relationship, phone, email, isPrimary
- `MedicalRecord`: studentId, bloodGroup, allergies, conditions, emergencyContact
- `DisciplinaryRecord`: studentId, date, incident, action, recordedBy
- `AcademicHistory`: studentId, schoolYear, classId, promotionStatus

---

### 5.2 Teacher Management System (TMS)

#### 5.2.1 Overview
The TMS manages all staff-related data, qualifications, workload, scheduling, and performance evaluation.

#### 5.2.2 Functional Requirements

**FR-TMS-001: Teacher Profile Management**
- Staff profiles shall include: name, photo, staff ID, contact, qualifications, specialization, employment type (full-time/part-time/contract), employment date
- Supporting documents: certificates, NIN, contracts (Firebase Storage)

**FR-TMS-002: Subject & Class Assignment**
- Admins shall assign teachers to specific subjects and classes
- A teacher can be assigned multiple subjects across multiple classes
- Subject-teacher assignments shall be versioned per academic year

**FR-TMS-003: Timetable Management**
- The system shall support manual and AI-assisted timetable generation
- Timetable shall consider: teacher availability, class capacity, subject frequency per week, room availability
- Timetables shall be exportable as PDF and viewable on mobile

**FR-TMS-004: Teacher Attendance & Punctuality**
- Teacher daily attendance shall be recorded (present, absent, late, on-leave)
- Late arrival threshold is configurable by admin
- Monthly punctuality reports shall be auto-generated

**FR-TMS-005: Performance Evaluation**
- Evaluation components: admin rating (score + notes), peer review, student satisfaction (anonymous survey)
- Evaluation frequency: per term
- Performance history is stored and visible to admin and principal only

**FR-TMS-006: Payroll Integration**
- Teacher salary data linked to Finance module
- Deductions configurable: absences, advances, taxes
- Monthly payslip generation (PDF)

#### 5.2.3 Data Entities
- `Staff`: staffId, tenantId, name, role, qualifications, subjects, status, hireDate
- `TeacherAttendance`: staffId, date, status, checkInTime
- `SubjectAssignment`: staffId, classId, subjectId, academicYear
- `PerformanceEvaluation`: staffId, term, year, adminScore, studentScore, notes

---

### 5.3 Parent Portal

#### 5.3.1 Overview
A dedicated mobile-first portal enabling parents and guardians to monitor their child's academic progress, communicate with teachers, and manage payments.

#### 5.3.2 Functional Requirements

**FR-PP-001: Parent Dashboard**
- Real-time summary: today's attendance, upcoming exams, recent grades, fee balance
- Child selector (supports parents with multiple children at the school)
- Alert badges for critical events

**FR-PP-002: Academic Progress Tracking**
- View term-by-term results per subject
- Grade trend charts (subject performance over time)
- Class rank visibility (configurable by school policy)

**FR-PP-003: Attendance Visibility**
- View full attendance history for each child
- Calendar heatmap showing attendance patterns
- Push notification on each absence or late arrival

**FR-PP-004: Parent-Teacher Messaging**
- In-app direct messaging between parent and assigned teachers
- Message history persisted in Firestore
- Admin moderation capability

**FR-PP-005: Fee Payment**
- View current fee balance and payment history
- Online payment via Orange Money / Africell Money API integration
- Receipt generation and download (PDF)

**FR-PP-006: Report Card Download**
- End-of-term report cards downloadable as PDF
- Academic transcripts (for SSS graduates) available

---

### 5.4 Administration & Operations

#### 5.4.1 Overview
Centralized administrative control for school-wide operations, configurations, academic calendar, and governance.

#### 5.4.2 Functional Requirements

**FR-ADM-001: Academic Calendar Management**
- Define school terms, holidays, exam periods, event dates
- Calendar visible to all users; editable by admin only
- Push notifications sent when events are added or modified

**FR-ADM-002: School Configuration**
- Configure school name, logo, contact, address, motto
- Set academic year structure (number of terms, dates)
- Define grading scales per level (JSS vs. SSS)

**FR-ADM-003: Admission Management**
- Online admission application form
- Application status tracking (pending, approved, rejected)
- Bulk enrollment from spreadsheet upload

**FR-ADM-004: Staff Leave Management**
- Leave application and approval workflow
- Leave types: sick leave, annual leave, maternity/paternity, emergency
- Leave balance tracking per staff member

**FR-ADM-005: Announcements & Circulars**
- Admin can publish announcements visible to all users
- Target audience: all users, specific roles, specific classes

---

### 5.5 Finance & Accounting System

#### 5.5.1 Overview
A full-featured financial management system handling student fees, staff payroll, school expenses, and financial reporting.

#### 5.5.2 Functional Requirements

**FR-FIN-001: Fee Structures**
- Define fee categories: tuition, development levy, exam fees, uniform, boarding (if applicable)
- Different fee structures per class/level
- Scholarship and discount management (percentage or fixed amount)

**FR-FIN-002: Fee Collection & Invoicing**
- Auto-generate term invoices per student
- Record fee payments with date, amount, payment method, reference
- Partial payment support with outstanding balance tracking

**FR-FIN-003: Mobile Money Integration**
- Integration with Orange Money Sierra Leone API
- Integration with Africell Money API
- Payment confirmation via webhook; receipt auto-generated on success

**FR-FIN-004: Expense Tracking**
- Record school expenses: utilities, maintenance, procurement, salaries
- Expense categories configurable
- Attach receipts/documents to expense records

**FR-FIN-005: Payroll Processing**
- Monthly payroll run for all staff
- Configurable deductions (NASSIT contributions, income tax, absences)
- Payslip generation (PDF) and payroll reports

**FR-FIN-006: Financial Reporting**
- Profit & Loss report (per term, per year)
- Cash flow statement
- Outstanding fees report (overdue by 30/60/90 days)
- Revenue breakdown by fee category
- All reports exportable as PDF and Excel

**FR-FIN-007: Financial Alerts**
- Automated reminders for overdue fees (push + SMS)
- Fee default prediction (AI-powered, Phase 2)

#### 5.5.3 Data Entities
- `FeeStructure`: tenantId, classId, category, amount, academicYear
- `Invoice`: studentId, term, year, totalAmount, amountPaid, balance, dueDate
- `Payment`: invoiceId, date, amount, method, reference, receivedBy
- `Expense`: category, amount, date, description, receipt, approvedBy
- `Payroll`: staffId, month, year, gross, deductions, net, status

---

### 5.6 AI & Analytics Engine

#### 5.6.1 Overview
The AI layer provides predictive intelligence and natural language insights to transform raw school data into actionable decisions.

#### 5.6.2 Functional Requirements

**FR-AI-001: Student Performance Prediction**
- Predict risk of subject failure based on: attendance rate, assignment completion, mid-term scores, historical performance
- Risk classification: Low / Medium / High
- Triggered per term, surfaced on teacher and admin dashboards

**FR-AI-002: Dropout Risk Detection**
- Identify students at risk of dropping out based on: extended absences, declining grades, fee default patterns, behavioral incidents
- Risk score surfaced to admin and counselor role
- Configurable intervention workflow (notification + meeting flag)

**FR-AI-003: Attendance-Performance Correlation**
- Automated correlation analysis between attendance rate and academic performance
- Visualized as scatter plots per class/subject

**FR-AI-004: Teacher Effectiveness Analytics**
- Aggregate student performance per teacher per subject
- Identify top-performing and underperforming subject-teacher combinations
- Visible to principal and admin only

**FR-AI-005: AI Query Agent (Phase 2)**
- Natural language query interface powered by Anthropic Claude API
- Example queries:
  - "Why is JSS 3B underperforming in Mathematics this term?"
  - "Which teachers have the highest student pass rates?"
  - "Show me attendance trends for last 3 months"
- Responses grounded in real Firestore data pulled via Cloud Functions

**FR-AI-006: Financial Default Prediction**
- Predict which families are at high risk of not paying fees
- Based on: payment history, payment delays, partial payments
- Surfaced to bursar dashboard with recommended action

---

### 5.7 Communication & Notification System

#### 5.7.1 Overview
A multi-channel, event-driven notification system ensuring all stakeholders receive timely information across multiple delivery channels.

#### 5.7.2 Functional Requirements

**FR-COM-001: Push Notifications**
- Firebase Cloud Messaging (FCM) for mobile push notifications
- Triggered by: attendance events, result publishing, fee reminders, announcements, emergency alerts

**FR-COM-002: SMS Notifications**
- SMS fallback for critical events (absence, emergency, fee overdue)
- Integration with Africa's Talking or similar SLE-compatible SMS gateway
- SMS targeted to parent/guardian phone numbers on file

**FR-COM-003: In-App Messaging**
- Direct messaging between: teacher ↔ parent, admin ↔ teacher, admin ↔ parent
- Group announcements from admin to classes or all parents

**FR-COM-004: Email Notifications**
- Email delivery for: term reports, invoices, admin circulars
- Firebase + third-party email provider (e.g., SendGrid)

**FR-COM-005: WhatsApp Integration (Phase 2)**
- WhatsApp Business API for high-priority notifications
- Opt-in model (parent must consent)

**FR-COM-006: Emergency Alert System**
- One-click emergency broadcast to all parents and staff simultaneously
- Delivered via push + SMS simultaneously
- Admin-only trigger, with audit log

#### 5.7.3 Notification Triggers

| Event | Channel | Recipient |
|-------|---------|-----------|
| Student absent | Push + SMS | Parent |
| Student late arrival | Push | Parent |
| Exam result published | Push + Email | Parent + Student |
| Fee due (3 days before) | Push + SMS | Parent |
| Fee overdue | SMS + Email | Parent |
| New announcement | Push | All affected users |
| Emergency alert | Push + SMS | All users |
| Low attendance warning | Push | Parent + Teacher |

---

### 5.8 Attendance System

#### 5.8.1 Overview
A smart attendance system supporting multiple capture methods with automated alerting and analytics.

#### 5.8.2 Functional Requirements

**FR-ATT-001: Student Attendance Capture Methods**
- **Method 1 — QR Code Scan:** Teacher scans student QR code via mobile app camera (Expo Camera)
- **Method 2 — Manual Entry:** Teacher marks attendance on class list (web or mobile)
- **Method 3 — RFID (Phase 2):** NFC/RFID card tap at school gate
- **Method 4 — Biometric (Phase 3):** Fingerprint / face recognition at entry points

**FR-ATT-002: Attendance Status Types**
- Present, Absent, Late, Excused (with document), Medical Leave

**FR-ATT-003: Attendance Locking**
- Teachers can mark attendance within a configurable time window (e.g., first 30 minutes of period)
- After lock, modification requires admin approval with reason

**FR-ATT-004: Automated Alerts**
- Parent notified within 15 minutes of unexcused absence
- Late arrival notification with timestamp
- Pattern alerts: 3+ consecutive absences trigger escalation notification to admin

**FR-ATT-005: Teacher Attendance**
- Admin or designated officer records teacher attendance daily
- Lateness threshold configurable (e.g., more than 10 minutes = late)
- Monthly punctuality summary per teacher

**FR-ATT-006: Attendance Reports**
- Class attendance by date range (PDF/Excel)
- Individual student attendance history with calendar view
- School-wide attendance rate dashboard
- Students below attendance threshold flagged (e.g., below 75%)

---

### 5.9 Exam & Grading System

#### 5.9.1 Overview
A flexible grading system aligned with WAEC standards, supporting automated result computation, transcript generation, and ranking.

#### 5.9.2 Functional Requirements

**FR-EXM-001: Exam Configuration**
- Exam types: Continuous Assessment (CA), Mid-Term, End-of-Term, Mock WAEC
- CA weight and exam weight configurable per subject (e.g., 40% CA / 60% exam)
- Exam timetable creation and publication

**FR-EXM-002: Score Entry**
- Teachers enter scores per student per subject per exam
- Score validation: cannot exceed maximum marks configured
- Bulk upload via CSV supported

**FR-EXM-003: WAEC-Compatible Grading**
- Auto-compute total scores and letter grades per Sierra Leone/WAEC scale:

| Score Range | Grade | Remark |
|------------|-------|--------|
| 75 – 100 | A1 | Excellent |
| 70 – 74 | B2 | Very Good |
| 65 – 69 | B3 | Good |
| 60 – 64 | C4 | Credit |
| 55 – 59 | C5 | Credit |
| 50 – 54 | C6 | Credit |
| 45 – 49 | D7 | Pass |
| 40 – 44 | E8 | Pass |
| 0 – 39 | F9 | Fail |

**FR-EXM-004: Result Publication**
- Admin publishes results; push notification sent to parents and students
- Results locked after publication; amendment requires admin approval

**FR-EXM-005: Report Card Generation**
- Automated PDF report card per student per term
- Includes: subject scores, grades, teacher comments, class teacher remarks, principal's remark, attendance summary
- Report card branded with school logo and official signature area

**FR-EXM-006: Transcript Generation**
- Cumulative academic transcript for SSS graduates
- Covers full three-year SSS academic record
- Exportable as PDF, with school seal

**FR-EXM-007: Class Ranking**
- Optional (school policy configurable): class rank per term
- Subject-level ranking per class
- Position displayed on report card if enabled

---

### 5.10 Learning Management System (LMS)

#### 5.10.1 Overview
A digital learning platform enabling content delivery, assignment management, online assessments, and teacher-student academic interaction.

#### 5.10.2 Functional Requirements

**FR-LMS-001: Content Management**
- Teachers can upload: notes (PDF, Word), presentations (PPTX), videos (YouTube link or Firebase Storage), images
- Content organized by subject and class
- Students receive push notification when new content is uploaded

**FR-LMS-002: Assignment Management**
- Teacher creates assignments with: title, instructions, due date, maximum score, attachment (optional)
- Students submit: text response or file upload (PDF, image)
- Late submission flag configurable

**FR-LMS-003: Online Quizzes & Assessments**
- Question types: multiple choice, true/false, short answer
- Timer support per quiz
- Auto-grading for objective questions
- Manual grading for short answer questions

**FR-LMS-004: Homework Tracking**
- Teacher assigns homework per class
- Students mark homework as completed
- Teacher sees completion rate per assignment

**FR-LMS-005: Student Submission Portal**
- Students view all pending and submitted assignments in one view
- Submission history with score and teacher feedback per submission

**FR-LMS-006: Teacher Grading Interface**
- List of submissions per assignment
- Grade entry with written feedback per student
- Grade auto-syncs to Exam & Grading module

---

### 5.11 Inventory & Asset Management

#### 5.11.1 Functional Requirements

**FR-INV-001: Asset Registry**
- Register all school assets: furniture, electronics, lab equipment, library books, sports equipment
- Each asset: name, category, quantity, condition, location, purchase date, value

**FR-INV-002: Stock Tracking**
- Track consumables: stationery, lab chemicals, cleaning supplies
- Low stock alerts when quantity falls below configurable threshold

**FR-INV-003: Issue & Return Log**
- Record items issued to teachers or students with due return date
- Overdue return alerts

**FR-INV-004: Damage & Loss Reports**
- Log damaged or lost items with description, responsible party, estimated cost
- Linked to student or staff profile where applicable

**FR-INV-005: Procurement Requests**
- Staff can submit procurement requests via system
- Admin approval workflow
- Linked to Finance module for expense recording

---

### 5.12 Health Management System

#### 5.12.1 Functional Requirements

**FR-HLT-001: Student Medical Records**
- Record: blood group, chronic conditions, allergies, disabilities
- Emergency contact specifically for medical situations

**FR-HLT-002: Clinic Visit Log**
- Record each clinic visit: date, student, complaint, treatment given, medication administered, outcome
- Health officer records; visible to parent and admin

**FR-HLT-003: Vaccination Records**
- Track vaccination history per student (date, vaccine, batch, administered by)
- Alert when vaccination is due for renewal

**FR-HLT-004: Health Alerts**
- If a student visits clinic 3+ times in a month, parent and admin are notified
- Emergency medical flag: critical condition visible on student profile dashboard

---

### 5.13 Transport Management System

#### 5.13.1 Functional Requirements

**FR-TRS-001: Bus & Route Management**
- Register school buses/vehicles: number plate, capacity, driver details
- Define bus routes with stops and estimated pickup times

**FR-TRS-002: Student Transport Assignment**
- Assign students to specific routes and pickup stops
- Parents opt-in to transport service

**FR-TRS-003: Pickup & Drop-Off Alerts**
- Notify parent when student boards school bus (QR scan at bus entry)
- Notify parent when student is dropped off

**FR-TRS-004: GPS Tracking (Phase 2)**
- Real-time GPS location of school buses on parent mobile app
- ETA calculation for next stop

---

### 5.14 Reporting & Dashboard System

#### 5.14.1 Overview
Role-specific dashboards and exportable reports providing stakeholders with the data they need at a glance.

#### 5.14.2 Dashboard Specifications

**Admin Dashboard**
- School-wide KPIs: total enrollment, attendance rate today, fee collection rate, staff count
- Alert feed: overdue fees, chronic absentees, low-performing classes
- Quick links: new enrollment, publish results, send announcement

**Principal Dashboard**
- Academic performance overview by class and subject
- Teacher performance summary
- Exam results trend across terms

**Teacher Dashboard**
- My classes: today's attendance status per class
- Assignment submission rates
- Student performance alerts (AI-flagged at-risk students)

**Parent Dashboard**
- Child's attendance, grades, fee balance at a glance
- Upcoming events from academic calendar
- Unread messages from teachers

**Bursar Dashboard**
- Revenue vs. target per term
- Outstanding fee collections
- Recent transactions

#### 5.14.3 Exportable Reports

| Report | Formats | Frequency |
|--------|---------|-----------|
| Student Academic Report Card | PDF | Per term |
| Class Attendance Register | PDF, Excel | On demand |
| End-of-Term Results Sheet | PDF, Excel | Per term |
| Financial Summary (P&L) | PDF, Excel | Monthly/Yearly |
| Fee Outstanding Report | PDF, Excel | On demand |
| Staff Payroll Report | PDF | Monthly |
| Student Academic Transcript | PDF | On demand |
| Inventory Status Report | PDF, Excel | On demand |

---

### 5.15 Security & Identity Management

#### 5.15.1 Functional Requirements

**FR-SEC-001: Authentication**
- Firebase Authentication: email/password login
- Optional: Google Sign-In for admin and teacher accounts
- Phone number OTP for parents and students (more accessible)
- Session management with token expiry and refresh

**FR-SEC-002: Role-Based Access Control (RBAC)**
- Roles defined: Super Admin, School Admin, Principal, Bursar, Teacher, Health Officer, Inventory Officer, Parent, Student
- Permissions matrix enforced at both Firestore Security Rules level and UI level

**FR-SEC-003: Audit Logs**
- All write operations logged: who, what, when, from which device
- Audit logs retained for 12 months minimum
- Admin-only visibility; non-deletable

**FR-SEC-004: Data Encryption**
- All data in transit protected via HTTPS/TLS (Firebase default)
- Sensitive fields (medical records, financial data) encrypted at the document level before storage
- Firebase Storage files access-controlled by Firestore security rules

**FR-SEC-005: Multi-Factor Authentication (MFA)**
- Optional MFA for admin and finance roles
- Firebase MFA (TOTP or SMS OTP)

**FR-SEC-006: Data Backup**
- Automated daily Firestore export to Firebase Storage
- Backup retention: 30 days rolling
- Recovery procedure documented and tested quarterly

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|--------|--------|
| Page load time (web, 3G) | ≤ 4 seconds |
| App cold start (mobile) | ≤ 3 seconds |
| API/Cloud Function response | ≤ 800ms (p95) |
| Offline data availability | 100% of cached data within 100ms |
| Report generation (PDF) | ≤ 10 seconds |

### 6.2 Scalability

- Firebase Firestore auto-scales; no manual scaling needed at MVP
- Architecture supports horizontal scaling via Cloud Functions when needed
- Multi-tenant design supports up to 50 schools without architectural changes

### 6.3 Reliability & Availability

- Target uptime: 99.5% (Firebase SLA + application layer)
- Offline-first ensures core functionality available even without internet
- Graceful degradation: read-only mode when cloud sync unavailable

### 6.4 Usability

- Web app: WCAG 2.1 Level AA accessibility compliance
- Mobile app: minimum touch target 44x44pt
- All user-facing text available in English; Krio translation considered for Phase 2
- Onboarding tutorials and tooltips for first-time users

### 6.5 Maintainability

- Component-based architecture; each module independently testable
- Code coverage target: ≥ 70% for critical modules (finance, grading)
- Linting: ESLint + Prettier enforced via CI/CD
- TypeScript used throughout for type safety

### 6.6 Portability

- Web app deployable to Firebase Hosting, Vercel, or any static host
- Mobile app distributable via Expo Go (development), APK/IPA (production via EAS Build)
- No platform-specific native code unless absolutely required

---

## 7. Data Requirements

### 7.1 Data Models (High-Level)

```
Tenant
  └── School (config, name, logo, settings)

Students
  ├── Profile (bio, photo, class, status)
  ├── Guardian(s)
  ├── Medical Records
  ├── Behavioral Records
  └── Academic History

Staff
  ├── Profile (bio, qualifications, role)
  ├── Attendance Records
  ├── Evaluations
  └── Payroll Records

Classes
  ├── Students (reference)
  ├── Teachers (reference by subject)
  └── Timetable

Academic
  ├── Subjects
  ├── Exams
  ├── Scores
  └── Report Cards

Finance
  ├── Fee Structures
  ├── Invoices
  ├── Payments
  ├── Expenses
  └── Payroll

LMS
  ├── Content (by subject/class)
  ├── Assignments
  ├── Submissions
  └── Quizzes

Attendance
  ├── Student Attendance (daily)
  └── Staff Attendance (daily)

Notifications
  └── Notification Log

Audit
  └── Audit Trail (all writes)
```

### 7.2 Data Retention Policy

| Data Type | Retention Period |
|-----------|-----------------|
| Student records | Permanently (graduates become alumni) |
| Financial transactions | 7 years |
| Attendance records | 5 years |
| Audit logs | 2 years |
| Notification logs | 1 year |
| Backup snapshots | 30 days rolling |

### 7.3 Privacy & Data Protection

- Student data classified as sensitive PII; access restricted by RBAC
- Medical data classified as highly sensitive; additional encryption applied
- Parent data: phone and email used only for school communications; not shared with third parties
- Students under 18: parental consent required for data collection (handled via enrollment form)

---

## 8. System Integration

### 8.1 Internal Integrations

| Source Module | Target Module | Data Flow |
|--------------|---------------|-----------|
| Attendance → | AI Engine | Attendance data feeds dropout/risk models |
| Exams → | LMS | Scores sync to LMS gradebook |
| Finance → | Notification | Overdue triggers alert workflows |
| TMS Payroll → | Finance | Payroll data feeds expense tracking |
| Health → | Admin Dashboard | Clinic visit alerts surface to admin |

### 8.2 External Integrations

**8.2.1 Mobile Money (Phase 1)**
- Orange Money Sierra Leone Payment API
- Africell Money API
- Integration pattern: REST API + webhook for payment confirmation

**8.2.2 SMS Gateway (Phase 1)**
- Africa's Talking (recommended for Sierra Leone coverage)
- Twilio (alternative)
- Used for: attendance alerts, fee reminders, emergency alerts

**8.2.3 Email Service**
- Firebase + SendGrid or Mailgun
- Used for: report card delivery, invoice email, admin circulars

**8.2.4 WAEC Integration (Phase 3)**
- API or data exchange with WAEC Sierra Leone for exam registration
- Student data export in WAEC-required format

**8.2.5 Government Education Portal (Phase 3)**
- Ministry of Basic and Senior Secondary Education (MBSSE) data reporting
- Enrollment statistics, exam data submission

---

## 9. User Roles & Access Control

### 9.1 RBAC Permission Matrix

| Feature | Super Admin | School Admin | Principal | Bursar | Teacher | Parent | Student |
|---------|------------|--------------|-----------|--------|---------|--------|---------|
| Manage all schools | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View all students | ✅ | ✅ | ✅ | ❌ | Own class | Own child | Self |
| Manage finance | ✅ | ✅ | ❌ | ✅ | ❌ | View only | ❌ |
| Enter exam scores | ✅ | ✅ | ✅ | ❌ | Own subject | ❌ | ❌ |
| View results | ✅ | ✅ | ✅ | ❌ | Own class | Own child | Self |
| Mark attendance | ✅ | ✅ | ❌ | ❌ | Own class | ❌ | ❌ |
| View attendance | ✅ | ✅ | ✅ | ❌ | Own class | Own child | Self |
| Upload LMS content | ✅ | ✅ | ✅ | ❌ | Own subject | ❌ | ❌ |
| Submit assignments | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send emergency alert | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AI analytics | ✅ | ✅ | ✅ | Fin only | Own class | ❌ | ❌ |

---

## 10. Development Roadmap

### Phase 1 — MVP (Weeks 1–20)
**Goal:** Core administrative functionality live and operational

| Week | Deliverable |
|------|------------|
| 1–2 | Project setup: monorepo, Firebase config, GitHub CI/CD, design system |
| 3–5 | Authentication, RBAC, user management, admin dashboard shell |
| 6–8 | Student Information System (SIS) — profiles, enrollment, class management |
| 9–10 | Teacher Management System — profiles, subject assignments |
| 11–12 | Attendance System — manual + QR code capture, alerts |
| 13–14 | Exam & Grading System — score entry, auto-grading, report cards |
| 15–16 | Finance Module — fee structures, invoicing, mobile money integration |
| 17–18 | Notification System — push + SMS |
| 19–20 | Testing, bug fixes, admin training, soft launch |

### Phase 2 — Intelligence & Engagement (Weeks 21–36)
**Goal:** Parent portal, LMS, and AI analytics operational

| Week | Deliverable |
|------|------------|
| 21–23 | Parent Portal (mobile app) — dashboard, messaging, payments |
| 24–26 | Learning Management System (LMS) — content, assignments, quizzes |
| 27–29 | AI Analytics Engine — performance prediction, dropout risk |
| 30–32 | Advanced Reporting — dashboards, PDF/Excel exports |
| 33–34 | AI Query Agent (Claude API integration) |
| 35–36 | Health & Inventory Modules |

### Phase 3 — Expansion & Integration (Weeks 37–52)
**Goal:** Full platform maturity, multi-school support, national integrations

| Week | Deliverable |
|------|------------|
| 37–39 | Transport Management System + GPS tracking |
| 40–42 | Multi-tenant architecture — onboard second school |
| 43–45 | WAEC & government portal integrations |
| 46–48 | Biometric attendance (RFID/fingerprint hardware integration) |
| 49–51 | WhatsApp Business API notifications |
| 52 | Full system audit, security penetration test, documentation |

---

## 11. Appendix

### 11.1 Folder Structure (Monorepo)

```
pw-sas/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── students/
│   │   │   │   ├── teachers/
│   │   │   │   ├── attendance/
│   │   │   │   ├── exams/
│   │   │   │   ├── finance/
│   │   │   │   ├── lms/
│   │   │   │   ├── notifications/
│   │   │   │   └── analytics/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── App.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── mobile/
│       ├── app/                  # Expo Router file-based routing
│       │   ├── (auth)/
│       │   ├── (admin)/
│       │   ├── (teacher)/
│       │   ├── (parent)/
│       │   └── (student)/
│       ├── components/
│       ├── hooks/
│       └── package.json
├── packages/
│   ├── shared/
│   │   ├── types/               # Shared TypeScript types
│   │   ├── constants/           # Enums, WAEC grades, roles
│   │   └── utils/               # Shared utility functions
│   ├── ui/
│   │   ├── web/                 # MUI shared components
│   │   └── mobile/              # React Native Paper shared components
│   └── firebase/
│       ├── config.ts
│       ├── auth.ts
│       ├── firestore.ts
│       └── storage.ts
├── functions/                   # Firebase Cloud Functions
│   ├── src/
│   │   ├── triggers/            # Firestore event triggers
│   │   ├── schedulers/          # Cron-based functions
│   │   ├── api/                 # HTTP endpoint functions
│   │   └── ai/                  # ML model inference functions
│   └── package.json
├── firestore.rules
├── storage.rules
├── firebase.json
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint + test on PR
│       └── deploy.yml           # Deploy on merge to main
├── docs/
│   ├── PW-SAS_SRS.md           # This document
│   ├── ERD.md
│   └── API.md
└── package.json                 # Monorepo root (pnpm workspaces)
```

### 11.2 Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Student ID | `PW-{YEAR}-{4-digit seq}` | `PW-2026-0042` |
| Staff ID | `PW-STF-{4-digit seq}` | `PW-STF-0007` |
| Class Code | `{Level}{Year}{Section}` | `SSS2A`, `JSS1B` |
| Academic Year | `{startYear}/{endYear}` | `2025/2026` |
| Term | `Term {1|2|3}` | `Term 1` |
| Firebase Collections | camelCase plural | `students`, `staffMembers`, `feeInvoices` |
| React Components | PascalCase | `StudentProfileCard` |
| Hooks | camelCase with `use` prefix | `useStudentProfile` |
| Cloud Functions | camelCase | `onPaymentWebhook` |

### 11.3 WAEC Grade Scale Reference

| Grade | Score Range | Classification |
|-------|------------|----------------|
| A1 | 75 – 100 | Distinction |
| B2 | 70 – 74 | Very Good |
| B3 | 65 – 69 | Good |
| C4 | 60 – 64 | Credit |
| C5 | 55 – 59 | Credit |
| C6 | 50 – 54 | Credit |
| D7 | 45 – 49 | Pass |
| E8 | 40 – 44 | Pass |
| F9 | 0 – 39 | Fail |

### 11.4 Design Principles

1. **Offline-First** — Every feature must degrade gracefully without internet
2. **Mobile-First** — Design for small screens and touch; scale up to desktop
3. **Data Integrity** — Financial and academic records are never soft-deleted; only archived
4. **Least Privilege** — Users see and do only what their role permits
5. **Auditability** — Every state-changing action is logged with user, timestamp, and reason
6. **Simplicity** — UI must be usable by non-technical school staff with minimal training
7. **Performance on Low Bandwidth** — Optimize payloads; lazy-load large content

### 11.5 Glossary

| Term | Definition |
|------|-----------|
| Tenant | An individual school instance on the platform |
| Academic Year | The annual cycle from term start to end (typically 3 terms in SL) |
| CA | Continuous Assessment — in-term test scores weighted toward final grade |
| Bursar | School finance officer responsible for fee collection and accounts |
| NASSIT | National Social Security and Insurance Trust — SL pension body |
| EAS | Expo Application Services — Expo's cloud build and distribution service |
| FCM | Firebase Cloud Messaging — push notification delivery service |
| RBAC | Role-Based Access Control — permission system based on user roles |
| Firestore | Firebase's NoSQL cloud database with real-time sync |

---

*End of Document*

**PW-SAS Software Requirements Specification v1.0.0**
**Prince of Wales Senior Secondary School, Kingtom, Sierra Leone**
**© 2026 Mohamed Augustin. All rights reserved.**
