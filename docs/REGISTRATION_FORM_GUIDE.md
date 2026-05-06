# Enhanced Registration Form - Quick Reference

**Status:** ✅ COMPLETE - Ready to Use

---

## What's New

The registration form now asks **role-specific questions** to collect all necessary information upfront.

---

## Quick Form Lookup

### ADMIN Registration
```
Name:          [Text input]
Email:         [Text input]
School Level:  [REQUIRED - Dropdown: Primary / Junior / Senior]
Department:    [Text: e.g., Administration]
Phone:         [Text]
Password:      [Hidden]
```

### TEACHER Registration
```
Name:          [Text input]
Email:         [Text input]
School Level:  [REQUIRED - Dropdown: Primary / Junior / Senior]
Teacher Type:  [Dropdown: Regular / Class Master / Subject Head / Dept Head]
Class:         [Shows if Class Master selected - REQUIRED]
Department:    [Text: e.g., Mathematics]
Phone:         [Text]
Password:      [Hidden]
```

### PARENT Registration
```
Name:          [Text input]
Email:         [Text input]
School:        [REQUIRED - Dropdown: Primary / Secondary]
Children Qty:  [Dropdown: 1 / 2 / 3 / 4+]
Child Names:   [Shows if >1 child - comma-separated]
Phone:         [Text]
Password:      [Hidden]
```

### STUDENT Registration
```
Name:          [Text input]
Email:         [Text input]
Class:         [Text: e.g., Class 10A]
Phone:         [Text]
Password:      [Hidden]
```

---

## Field Visibility Matrix

| Field | Student | Teacher | Admin | Parent |
|-------|---------|---------|-------|--------|
| Name | ✅ | ✅ | ✅ | ✅ |
| Email | ✅ | ✅ | ✅ | ✅ |
| Phone | ✅ | ✅ | ✅ | ✅ |
| Password | ✅ | ✅ | ✅ | ✅ |
| **Class** | ✅ | ✅ (if CM) | ❌ | ❌ |
| **School Level** | ❌ | ✅ (REQ) | ✅ (REQ) | ❌ |
| **Teacher Type** | ❌ | ✅ | ❌ | ❌ |
| **Department** | ❌ | ✅ | ✅ | ❌ |
| **School** | ❌ | ❌ | ❌ | ✅ (REQ) |
| **Children Count** | ❌ | ❌ | ❌ | ✅ |
| **Children Names** | ❌ | ❌ | ❌ | ✅ (if >1) |

**Legend:** ✅ = Shows | ❌ = Hidden | (REQ) = Required | (if CM) = If Class Master

---

## Registration Examples

### Example 1: Admin User
```
Account Type: Admin
↓
Name: Robert Principal
Email: robert.principal@school.com
School Level: Junior Secondary ← MUST SELECT
Department: Academic Affairs
Phone: +1-800-100-0001
Password: SecurePass123
↓
Result: Admin for Junior Secondary school created ✅
```

### Example 2: Class Master Teacher
```
Account Type: Teacher
↓
Name: Angela ClassTeacher
Email: angela.ct@school.com
School Level: Senior Secondary ← MUST SELECT
Teacher Type: Class Master ← SELECT THIS
Class: SSS3 Science ← APPEARS AUTOMATICALLY
Department: Sciences
Phone: +1-800-200-0002
Password: SecurePass123
↓
Result: Class Master for SSS3 Science created ✅
```

### Example 3: Parent with Multiple Children
```
Account Type: Parent
↓
Name: David ParentUser
Email: david.parent@school.com
School: Secondary School ← MUST SELECT
Children Count: 2 Children ← SELECT THIS
Children Names: Chioma, Tunde ← APPEARS AUTOMATICALLY
Phone: +1-800-300-0003
Password: SecurePass123
↓
Result: Parent account for 2 children created ✅
Parent can view grades for both Chioma and Tunde
```

---

## What Happens on Selection

### When you select "Admin"
```
Form shows:
✅ School Level dropdown (REQUIRED)
✅ Department text field
❌ Class field hidden
❌ Teacher type hidden
❌ Children fields hidden
```

### When you select "Teacher" → "Class Master"
```
Form shows:
✅ School Level dropdown (REQUIRED)
✅ Teacher Type dropdown
✅ Class field (REQUIRED - auto-appears)
✅ Department field
❌ Children fields hidden
```

### When you select "Parent" → "2 Children"
```
Form shows:
✅ School dropdown (REQUIRED)
✅ Children Count dropdown
✅ Children Names field (REQUIRED - auto-appears)
❌ School Level hidden
❌ Teacher fields hidden
```

---

## Validation Errors

You'll see these if you try to submit without required fields:

| Error | What to do |
|-------|-----------|
| "Please select school level for admin" | Select Primary/Junior/Senior |
| "Please select school level for teacher" | Select Primary/Junior/Senior |
| "Please select class for class master" | Enter class name (e.g., SSS2) |
| "Please select school for parent" | Select Primary or Secondary |

---

## Common Scenarios

### Scenario 1: Creating Head Master
```
What to select:
- Account Type: Admin
- School Level: Primary School
- Department: Administration

Result: Head Master account for Primary School ✅
```

### Scenario 2: Creating Subject Head
```
What to select:
- Account Type: Teacher
- School Level: Senior Secondary
- Teacher Type: Subject Head
- Department: Physics

Result: Subject Head for Physics in Senior Secondary ✅
```

### Scenario 3: Creating Parent for Two Schools
```
Note: Parent must choose ONE school
If parent has children in both Primary and Secondary:
- Create account for Primary
- Then create second account for Secondary
OR
- Use one account for primary school, 
  contact admin about secondary children

Result: Parent can manage kids in one school ✅
```

---

## Field Descriptions

### School Level (Admin/Teacher)
**Why it's needed:** Different school levels have different curricula and requirements
- Primary: Grades/Classes 1-6
- Junior Secondary: Forms 1-3 (JSS1-3)
- Senior Secondary: Senior classes (SSS1-3)

### Teacher Type (Teacher only)
**Why it's needed:** Teachers have different responsibilities
- Regular Teacher: Teaches subjects
- Class Master: Manages a specific class + teaches
- Subject Head: Oversees subject across classes
- Department Head: Manages entire department

### Children Count (Parent only)
**Why it's needed:** Parents may have 1+ children in school
- Important for linking grades/reports
- Helps organize parent dashboard
- Enables multi-child features

---

## Testing the Form

### Test Admin Fields
1. Go to Register
2. Select "Admin"
3. ✅ School Level field appears
4. ✅ Department field appears
5. ✅ Other student/parent fields hidden

### Test Teacher - Regular
1. Go to Register
2. Select "Teacher"
3. ✅ School Level field appears
4. ✅ Teacher Type field appears
5. Select "Regular Teacher"
6. ❌ Class field is hidden

### Test Teacher - Class Master
1. Go to Register
2. Select "Teacher"
3. ✅ School Level appears
4. ✅ Teacher Type appears
5. Select "Class Master"
6. ✅ Class field appears (REQUIRED)

### Test Parent
1. Go to Register
2. Select "Parent"
3. ✅ School field appears
4. ✅ Children Count field appears
5. Select "2 Children"
6. ✅ Children Names field appears

---

## Frontend File Modified

📄 **[website/src/pages/Register.jsx](website/src/pages/Register.jsx)**

All changes in one file. No other files need updates for basic functionality.

---

## Status

✅ Form validation complete  
✅ Conditional fields working  
✅ No syntax errors  
✅ Ready to use  
✅ All error messages in place  

---

**Ready to Register Users?** Go to http://localhost:5174/register 🚀
