# 🚀 QUICK START - 5 MINUTE GUIDE

**Time:** 5 minutes  
**Goal:** Get the system running and login working  
**Level:** Beginner-friendly

---

## Step 1: Start the Servers (2 minutes)

Open your terminal and run:

```bash
cd /home/sesaymohamedaugustin/EdupluseAdmin
npm run dev
```

**You should see:**
```
✓ Vite backend is running on http://localhost:5001
✓ Vite frontend is running on http://localhost:5173
```

---

## Step 2: Open the Application (30 seconds)

Open your browser and go to:
```
http://localhost:5173
```

**You should see:** The login page with a blue "EduPlus Admin" banner

---

## Step 3: Login with Demo User (2 minutes)

### Option A: Quick Auto-Fill (Recommended)
1. Look for the user type selector buttons at the top
2. Click on **👑 CEO Admin**
3. Email and password auto-fill automatically
4. Click **Sign In**
5. Select **Senior Secondary**
6. ✅ You're in the dashboard!

### Option B: Manual Entry
1. Email: `admin@school.com`
2. Password: `password`
3. Click **Sign In**
4. Select a school
5. ✅ You're in the dashboard!

---

## Step 4: Test Different Users (30 seconds)

Go back to login and try:
- **👨‍🎓 Principal** → principal@school.com (2 schools available)
- **🎯 Regular Admin** → regularadmin@school.com (1 school available)
- **👩‍🏫 Teacher** → teacher@school.com
- **👨‍🎓 Student** → student@school.com
- **👨‍👩‍👧 Parent** → parent@school.com

**Password for all:** `password`

---

## Step 5: Explore the System (1 minute)

Once logged in:
- 👤 See your profile in top right
- 🚪 Click logout button (red button at bottom)
- 📱 Resize browser to test mobile view
- 🔄 Try logging in as different users

---

## ✅ Success!

If you can:
- ✅ Start both servers
- ✅ Login with at least one user
- ✅ See the dashboard
- ✅ Logout successfully

**You're all set!** The system is working.

---

## 🐛 If Something Doesn't Work

### Backend Not Starting?
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill the process using it
kill -9 <PID>

# Try again
npm run dev:backend
```

### Frontend Not Loading?
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Hard refresh
Ctrl + Shift + R

# Or try incognito window
Ctrl + Shift + N
```

### Login Shows 401 Error?
```bash
# Make sure backend is running
curl http://localhost:5001/health

# Should show: {"success":true,"message":"Backend server is running"}
```

### Styling Looks Wrong?
```bash
# Tailwind CSS might not be compiled
# Just refresh the page
F5 or Ctrl + R
```

---

## 📚 Next Steps

Once the system is running:

**For Frontend Development:**
1. Read: `FRONTEND_IMPLEMENTATION_GUIDE.md`
2. Start building dashboard components
3. Use: `PHASE2_IMPLEMENTATION_CHECKLIST.md` to track progress

**For Backend Development:**
1. Read: `BACKEND_DEVELOPMENT_GUIDE.md`
2. Start implementing API endpoints
3. Use: `PHASE2_IMPLEMENTATION_CHECKLIST.md` to track progress

**To Understand Everything:**
1. Read: `COMPLETE_PROJECT_GUIDE.md` (10 min)
2. Then read specific guides based on your role
3. Reference `MASTER_PROJECT_DOCUMENTATION.md` for details

---

## 🎯 Common Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5001 | http://localhost:5001 |
| API | 5001 | http://localhost:5001/api |

---

## 💡 Pro Tips

### Tip 1: Keep Two Terminals Open
```
Terminal 1: npm run dev:backend
Terminal 2: npm run dev:website
```

### Tip 2: Use Browser DevTools
```
F12 or Right-click → Inspect
→ Console tab shows errors
→ Network tab shows API calls
```

### Tip 3: Test API with curl
```bash
curl http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password"}'
```

### Tip 4: Watch File Changes
```bash
# Backend auto-reloads with nodemon
# Frontend auto-reloads with Vite
# Just save your files!
```

---

## 📋 Demo Users Quick Reference

```
CEO Admin
├─ Email: admin@school.com
├─ Password: password
└─ Access: All 3 schools

Principal
├─ Email: principal@school.com
├─ Password: password
└─ Access: 2 schools

Regular Admin
├─ Email: regularadmin@school.com
├─ Password: password
└─ Access: 1 school

Teacher
├─ Email: teacher@school.com
├─ Password: password
└─ Access: Classes

Student
├─ Email: student@school.com
├─ Password: password
└─ Access: Own data

Parent
├─ Email: parent@school.com
├─ Password: password
└─ Access: Child data
```

---

## 🔍 Verify Everything Works

### Checklist:
- [ ] Backend server started (`npm run dev:backend`)
- [ ] Frontend server started (`npm run dev:website`)
- [ ] Can access http://localhost:5173
- [ ] Can see login page with user selector
- [ ] Can click CEO Admin button
- [ ] Email/password auto-fill works
- [ ] Login succeeds
- [ ] Can select a school
- [ ] Can see dashboard
- [ ] Can logout

**If all ✅ → You're ready to code!**

---

## 🚨 Emergency Help

### "Port 5001 already in use"
```bash
# Find what's using port 5001
lsof -i :5001

# Kill it
kill -9 <PID>
```

### "npm: command not found"
```bash
# Install Node.js from nodejs.org
# Then verify:
node --version
npm --version
```

### "ENOENT: no such file or directory"
```bash
# Make sure you're in the right folder
cd /home/sesaymohamedaugustin/EdupluseAdmin

# Then run:
npm run dev
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or for specific directories
npm install --prefix backend
npm install --prefix website
```

---

## 📞 Need More Help?

### Quick Questions?
→ Check `QUICK_REFERENCE_COMMANDS.md` (in docs folder)

### Want to Understand the Project?
→ Read `COMPLETE_PROJECT_GUIDE.md` (10 minutes)

### Need to Build Components?
→ Read `FRONTEND_IMPLEMENTATION_GUIDE.md`

### Need to Build APIs?
→ Read `BACKEND_DEVELOPMENT_GUIDE.md`

### Need Implementation Tasks?
→ Use `PHASE2_IMPLEMENTATION_CHECKLIST.md`

---

## 🎓 Learning Path

```
Day 1: Quick Start (This guide - 5 min)
       ↓
Day 2: Read COMPLETE_PROJECT_GUIDE (10 min)
       ↓
Day 3: Read your specific guide (Frontend or Backend - 20 min)
       ↓
Day 4: Start building components using checklist
       ↓
Day 5+: Development and testing
```

---

## 🎉 You Did It!

**Welcome to EduPlus Admin System!**

You now have:
- ✅ Running backend server
- ✅ Running frontend application
- ✅ Working login system
- ✅ Demo users to test with
- ✅ Dashboard visible

**Next:** Start building by reading the appropriate development guide.

---

**Happy coding! 🚀**

*Remember: If servers aren't running, nothing works!*  
*Always start with: `npm run dev`*

