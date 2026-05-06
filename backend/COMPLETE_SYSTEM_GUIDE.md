# 🎯 Complete Research Tracker System - Ready to Run!

## 📦 What You Have

### ✅ Backend (Spring Boot + MySQL)
- **Location:** `c:\Users\M S I\Desktop\researchTrack\`
- **Status:** Running on http://localhost:8080
- **Database:** MySQL (research_tracker)
- **Features:** JWT Auth, REST APIs, Role-based access

### ✅ Frontend (React + Vite + TailwindCSS)
- **Location:** `c:\Users\M S I\Desktop\researchTrack\frontend\`
- **Status:** Ready to start
- **Port:** http://localhost:3000 (when running)
- **Features:** Modern UI, Dark mode, Responsive design

---

## 🚀 How to Run Everything

### Step 1: Start the Backend (Already Running ✅)
The Spring Boot backend is currently running on port 8080.

To restart if needed:
```bash
cd c:\Users\M S I\Desktop\researchTrack
.\mvnw.cmd spring-boot:run
```

### Step 2: Start the Frontend

**Option A: Quick Setup (Recommended)**
```bash
cd c:\Users\M S I\Desktop\researchTrack\frontend
setup.bat
```
Then run:
```bash
npm run dev
```

**Option B: Manual Setup**
```bash
cd c:\Users\M S I\Desktop\researchTrack\frontend
npm install
npm run dev
```

### Step 3: Open Your Browser
Navigate to: **http://localhost:3000**

---

## 🔐 First Login

### Option 1: Use Existing Admin
- **Username:** admin
- **Password:** admin123
- **Role:** ADMIN

### Option 2: Create New Account
1. Click **"Sign up"** on the login page
2. Fill in your details
3. Choose a role (VIEWER, MEMBER, PI, or ADMIN)
4. Click **"Create Account"**
5. Login with your new credentials

---

## 📱 Application Features

### 🏠 Dashboard
- View statistics (users, projects, milestones)
- See project status distribution chart
- Quick access to recent projects
- Role-based quick actions

### 📁 Projects
- List all projects with filters
- Create new projects (PI/Admin only)
- View project details
- Edit/Delete projects (based on role)
- Status indicators (Planning, Active, Completed, etc.)

### ✅ Milestones
- Track project milestones
- Mark as complete/incomplete
- Add new milestones
- View milestone details

### 📄 Documents
- Upload project documents
- View all documents
- Delete documents (PI/Admin only)

### 👥 Users (Admin Only)
- View all system users
- Manage user accounts
- See user roles

### 👤 Profile
- View your account information
- See your role permissions
- Account details

---

## 🎨 UI Features

### Dark/Light Mode
- Toggle button in the navbar (sun/moon icon)
- Automatic system detection
- Saved preference

### Responsive Design
- Works on mobile, tablet, desktop
- Collapsible sidebar on mobile
- Adaptive layouts

### Notifications
- Toast messages for success/errors
- Auto-dismiss after 3-4 seconds
- Color-coded (green=success, red=error)

---

## 🔑 Role-Based Access

| Feature | ADMIN | PI | MEMBER | VIEWER |
|---------|-------|----|----|--------|
| View Projects | ✅ | ✅ | ✅ | ✅ |
| Create Projects | ✅ | ✅ | ❌ | ❌ |
| Edit Own Projects | ✅ | ✅ | ❌ | ❌ |
| Delete Projects | ✅ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| Add Milestones | ✅ | ✅ | ✅ | ❌ |
| Upload Documents | ✅ | ✅ | ✅ | ❌ |
| View Everything | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 17
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **HTTP Client:** Axios
- **Routing:** React Router DOM 6
- **Icons:** React Icons
- **Charts:** Recharts
- **Notifications:** React Hot Toast

---

## 📂 Project Structure

```
researchTrack/
├── backend (Spring Boot)
│   ├── src/main/java/com/ijse/researchtrack/
│   │   ├── auth/          # Authentication
│   │   ├── user/          # User management
│   │   ├── project/       # Project CRUD
│   │   ├── milestone/     # Milestone tracking
│   │   ├── document/      # Document management
│   │   ├── config/        # Security config
│   │   └── common/        # Shared utilities
│   ├── pom.xml
│   └── mvnw.cmd
│
└── frontend/ (React)
    ├── src/
    │   ├── api/           # API services
    │   ├── components/    # Reusable components
    │   ├── context/       # State management
    │   ├── pages/         # Application pages
    │   ├── App.jsx        # Main app
    │   └── main.jsx       # Entry point
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── README.md
    ├── QUICKSTART.md
    ├── BUILD_SUMMARY.md
    └── setup.bat
```

---

## 🧪 Testing the System

### 1. Test Authentication
- [ ] Login with admin account
- [ ] Logout
- [ ] Create new account
- [ ] Login with new account

### 2. Test Project Management
- [ ] View projects list
- [ ] Filter by status
- [ ] Create new project (as PI/Admin)
- [ ] View project details
- [ ] Edit project
- [ ] Delete project (as Admin)

### 3. Test Role Permissions
- [ ] Login as ADMIN - see all features
- [ ] Login as PI - can create projects
- [ ] Login as MEMBER - can add milestones
- [ ] Login as VIEWER - read-only access

### 4. Test UI Features
- [ ] Toggle dark/light mode
- [ ] Test on mobile view (browser DevTools)
- [ ] Check notifications
- [ ] Navigate through all pages

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend not starting
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill the process if needed
taskkill /F /PID <process-id>

# Restart backend
cd c:\Users\M S I\Desktop\researchTrack
.\mvnw.cmd spring-boot:run
```

**Problem:** Database connection error
- Ensure MySQL is running
- Verify database `research_tracker` exists
- Check credentials in `application.properties`

### Frontend Issues

**Problem:** Cannot install dependencies
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rmdir /s /q node_modules
npm install
```

**Problem:** Cannot connect to backend
- Verify backend is running on port 8080
- Check browser console for errors
- Ensure CORS is configured in backend

**Problem:** White screen / Page not loading
```bash
# Clear cache and rebuild
npm run dev -- --force

# Or restart dev server
Ctrl+C (to stop)
npm run dev
```

---

## 📊 API Endpoints Reference

### Authentication (Public)
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users (Admin only)

### Projects (Protected)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `PATCH /api/projects/{id}/status` - Update status
- `DELETE /api/projects/{id}` - Delete project

### Milestones (Protected)
- `GET /api/milestones/project/{projectId}` - List milestones
- `POST /api/milestones` - Create milestone
- `PUT /api/milestones/{id}` - Update milestone
- `PATCH /api/milestones/{id}/toggle-completion` - Toggle status
- `DELETE /api/milestones/{id}` - Delete milestone

### Documents (Protected)
- `GET /api/documents/project/{projectId}` - List documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/{id}` - Delete document

---

## 📝 Development Notes

### Backend
- Java 17 required
- Maven wrapper included (no Maven install needed)
- Uses Spring Boot DevTools for hot reload
- JWT tokens expire after 24 hours

### Frontend
- Node.js 18+ required
- Vite provides instant HMR
- TailwindCSS for styling
- Axios interceptors handle auth automatically

---

## 🎉 Quick Start Summary

1. **Backend:** Already running ✅
2. **Frontend:** Run `cd frontend && npm install && npm run dev`
3. **Browser:** Open http://localhost:3000
4. **Login:** Use admin/admin123 or create new account
5. **Explore:** Dashboard → Projects → Create Project

---

## 🚀 Production Deployment

### Backend
```bash
# Build JAR
.\mvnw.cmd clean package

# Run JAR
java -jar target/researchTrack-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
# Build for production
npm run build

# Deploy 'dist' folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - Any static hosting
```

---

## 📚 Documentation

- **Frontend README:** `frontend/README.md`
- **Quick Start:** `frontend/QUICKSTART.md`
- **Build Summary:** `frontend/BUILD_SUMMARY.md`
- **Backend API:** See `API_DOCUMENTATION.md` (if exists)

---

## 💡 Tips for Success

1. **Keep backend running** while using frontend
2. **Check browser console** for any errors
3. **Use different roles** to test permissions
4. **Try dark mode** for better experience
5. **Test on mobile view** for responsiveness

---

## 🎊 You're All Set!

**Backend:** ✅ Running on port 8080
**Frontend:** ✅ Ready to start on port 3000
**Database:** ✅ MySQL configured
**Documentation:** ✅ Complete guides provided

**Now run the frontend and start tracking your research projects!** 🚀

---

**Need Help?**
- Check QUICKSTART.md for step-by-step guide
- See BUILD_SUMMARY.md for complete feature list
- Review browser console for error messages
- Check terminal output for backend logs

**Happy Researching! 🎓**
