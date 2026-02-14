

# Department Newsletter Management System

## Overview
A centralized web platform for department communication where faculty post newsletters, students view updates and submit projects, and an approval workflow manages content publishing. Built with React + Supabase (auth, database, storage, edge functions).

---

## 1. Authentication & Roles

- **Email/password signup & login** via Supabase Auth
- Two roles: **STUDENT** and **FACULTY** — stored in a secure `user_roles` table (not on profiles)
- Role selection during signup (dropdown: Student or Faculty)
- Separate login flows redirect to role-specific dashboards
- `profiles` table for name, department, avatar
- Auto-create profile on signup via database trigger

---

## 2. Landing Page

- Hero section explaining the system's purpose
- Feature highlights (newsletters, project submissions, notifications, digital archive)
- Two prominent buttons: **Student Login** and **Faculty Login**
- Clean, academic/college-themed design

---

## 3. Faculty Dashboard

### Home / Stats
- Overview cards: total newsletters, pending submissions, approved/rejected counts, total students

### Create Newsletter
- Title, category selector (Technical, Placement, New Technologies, Achievements)
- **Rich text editor (WYSIWYG)** for content
- Optional file attachments (PDF/PNG/JPG, max 5MB via Supabase Storage)
- On publish: auto-notify all students

### Manage Newsletters
- Table of all newsletters by this faculty member
- Edit and delete actions (only own newsletters)
- Search and filter by category

### Student Submissions Review
- Table view of all student submissions
- Filter by status: Pending / Approved / Rejected
- Click to view full submission details
- **Approve** button to publish
- **Reject** button with required feedback textarea
- On approve/reject: auto-notify the submitting student

### Sidebar Navigation
- Home, Create Newsletter, Manage Newsletters, Submissions, Notifications, Profile, Logout

---

## 4. Student Dashboard

### Home
- Latest newsletters feed
- Recent notifications panel

### Newsletter Archive
- Full list of published newsletters
- Filter by category (Technical, Placement, New Technologies, Achievements)
- Search by title/keyword
- Sort by newest first
- Pagination
- Click to view full newsletter detail page

### Submit Project
- Form: Title, Category, Description, Team Members (multi-input), Mentor, Achievement details, Proof link, File upload (optional, via Supabase Storage)
- Validation with Zod

### My Submissions
- List of own submissions with status pills (Pending / Approved / Rejected)
- If rejected: show faculty feedback inline
- Click to view full submission details

### Notifications
- In-app notification list (new newsletter posted, submission approved/rejected)
- Mark as read / mark all as read
- Unread count badge in sidebar

### Sidebar Navigation
- Home, Newsletters, Submit Project, My Submissions, Notifications, Profile, Logout

---

## 5. Notification System (via Edge Functions)

- **Newsletter posted** → Edge function creates notification for all students: "New {category} update: {title}"
- **Submission approved** → Notify submitting student
- **Submission rejected** → Notify student with feedback summary
- Notifications stored in database with read/unread status
- Bell icon with unread count badge

---

## 6. Database Design (Supabase/PostgreSQL)

- **profiles**: id, user_id (FK auth.users), name, department, avatar_url, created_at
- **user_roles**: id, user_id (FK auth.users), role (enum: student, faculty)
- **newsletters**: id, title, category (enum), content (rich text HTML), created_by (FK), attachments (text array of storage URLs), created_at, updated_at
- **submissions**: id, student_id (FK), title, category, description, team_members (text array), mentor, proof_link, file_url, status (enum: pending/approved/rejected), faculty_feedback, reviewed_by (FK), reviewed_at, created_at
- **notifications**: id, user_id (FK), type (enum), message, link, read (boolean), created_at
- Full RLS policies on all tables with role-based access via `has_role()` security definer function

---

## 7. File Storage

- Supabase Storage bucket for newsletter attachments and submission proof files
- Allowed types: PDF, PNG, JPG — max 5MB
- Store URLs in database, files in storage
- RLS policies on storage bucket

---

## 8. UX & Design

- Sidebar navigation layout for both dashboards
- Toast notifications for all actions (create, approve, reject, etc.)
- Empty states for no newsletters, no submissions
- Loading skeletons during data fetches
- Mobile responsive design
- Clean, minimal, modern academic theme
- Status pills with color coding (yellow=pending, green=approved, red=rejected)

