# 🚀 Quick Start Guide - Research Tracker Backend

## Prerequisites
- ✅ Java 17+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ Maven (included via wrapper)
- ✅ VS Code with Java extensions (optional)

## Step-by-Step Setup (5 minutes)

### Step 1: Create Database
```sql
CREATE DATABASE research_tracker;
```

### Step 2: Configure Database Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3: Build & Run
```bash
# Windows PowerShell
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Wait for the message: `Started ResearchTrackApplication`

### Step 4: Test the API

#### 1️⃣ Create an Admin User
```bash
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d '{\"username\":\"admin\",\"password\":\"admin123\",\"fullName\":\"Admin User\",\"role\":\"ADMIN\"}'
```

#### 2️⃣ Login
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

Copy the `token` from the response.

#### 3️⃣ Get Current User
```bash
curl -X GET http://localhost:8080/api/users/me -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 What's Next?

### Use Postman (Recommended)
1. Import `postman-collection.json`
2. Set the `jwt_token` variable after login
3. Test all endpoints easily

### Create More Users
Create users with different roles:
- **PI** (Principal Investigator) - Can create and manage projects
- **MEMBER** - Can create milestones and upload documents
- **VIEWER** - Read-only access

### Create Your First Project
```json
POST /api/projects
Authorization: Bearer YOUR_TOKEN

{
  "title": "My Research Project",
  "summary": "Project description",
  "status": "ACTIVE",
  "piId": "YOUR_USER_ID",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         Spring Security + JWT           │
│  (Authentication & Authorization)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         REST Controllers                │
│  (Auth, User, Project, Milestone, Doc)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  (Business Logic & Authorization)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Repository Layer                │
│  (Spring Data JPA)                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         MySQL Database                  │
│  (Data Persistence)                     │
└─────────────────────────────────────────┘
```

## 🔐 Role-Based Access Matrix

| Feature | ADMIN | PI | MEMBER | VIEWER |
|---------|-------|----|---------| -------|
| View Projects | ✅ | ✅ | ✅ | ✅ |
| Create Projects | ✅ | ✅ | ❌ | ❌ |
| Update Projects | ✅ | Own | ❌ | ❌ |
| Delete Projects | ✅ | ❌ | ❌ | ❌ |
| Create Milestones | ✅ | ✅ | ✅ | ❌ |
| Update Milestones | ✅ | Own | Own | ❌ |
| Upload Documents | ✅ | ✅ | ✅ | ❌ |
| Delete Documents | ✅ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |

## 🛠️ Common Issues & Solutions

### Issue: "Access denied for user"
**Solution**: Check MySQL username/password in `application.properties`

### Issue: "Port 8080 already in use"
**Solution**: Change port in `application.properties`:
```properties
server.port=8081
```

### Issue: "JWT token expired"
**Solution**: Login again to get a new token (expires in 24 hours)

### Issue: "Unauthorized" when accessing endpoints
**Solution**: Ensure you're sending the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Development Tips

### Enable Debug Logging
Add to `application.properties`:
```properties
logging.level.com.ijse.researchtrack=DEBUG
logging.level.org.springframework.security=DEBUG
```

### View SQL Queries
Already enabled! Check console output for SQL statements.

### Hot Reload
Install Spring Boot DevTools for automatic restart on code changes.

## 📞 Support

For issues or questions:
1. Check the main `README.md`
2. Review the Postman collection examples
3. Check application logs in the console

## ✅ Verification Checklist

- [ ] MySQL database created
- [ ] Application starts without errors
- [ ] Can signup new users
- [ ] Can login and receive JWT token
- [ ] Can access protected endpoints with token
- [ ] Role-based authorization working
- [ ] CRUD operations work for all entities

---

**Congratulations! Your Research Tracker Backend is ready! 🎉**
