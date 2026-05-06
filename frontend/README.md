# Research Project Tracker - Educational Institute

A modern, responsive React + TypeScript frontend for the Research Project Tracker system, developed as part of the CMJD Assignment 2.

## 🚀 Key Features

- **JWT Authentication**: Secure login and signup with token storage and automatic session management.
- **Role-Based Access Control (RBAC)**: Restricted access to pages (e.g., Admin Panel) based on user roles (ADMIN, PI, MEMBER).
- **Project Workspace**: Centralized dashboard to manage research projects, milestones, and documentation.
- **Dynamic Dashboard**: Statistics overview and activity feed for all user levels.
- **Responsive Design**: Mobile-first premium UI built with React Bootstrap and custom CSS.
- **Robust API Integration**: Full CRUD operations for all research entities with optimized service layers.

## 🛠 Tech Stack

- **Framework**: React 18 (TypeScript)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: React Bootstrap + Custom CSS + Bootstrap Icons
- **HTTP Client**: Axios (with Interceptors for JWT)
- **Token Handling**: jwt-decode

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- Backend Spring Boot application running (default: http://localhost:8080)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd research-tracker/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the `frontend` root:
   ```env
   REACT_APP_API_BASE=http://localhost:8080
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## 📡 API Endpoint Summary

| Feature | Method | Endpoint | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/signup` | Public |
| **Auth** | POST | `/api/auth/login` | Public |
| **Projects** | GET/POST | `/api/projects` | AUTH |
| **Projects** | GET/PUT/DEL | `/api/projects/{id}` | AUTH/PI |
| **Milestones** | GET/POST | `/api/projects/{id}/milestones` | PI/MEMBER |
| **Documents** | POST/GET | `/api/projects/{id}/documents` | PI/MEMBER |
| **Users** | GET | `/api/users` | ADMIN |

## 📁 Project Structure

- `src/components`: Reusable UI components (NavBar, ProjectForm, Loading, etc.).
- `src/contexts`: Authentication and global state management.
- `src/pages`: Main view components (Dashboard, Projects, Admin, etc.).
- `src/services`: API service layers and Axios configuration.
- `src/types`: TypeScript interfaces for data models.

## 📸 Screenshots
*(Add your screenshots here)*

---
**Developed for CMJD Batch 110/111**
