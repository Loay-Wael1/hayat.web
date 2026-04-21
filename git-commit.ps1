# Group 1: Project Setup & Configuration
git add .gitignore README.md eslint.config.js index.html package.json package-lock.json pnpm-lock.yaml postcss.config.js tailwind.config.js vite.config.js src/index.css src/main.jsx src/App.jsx
git commit -m "chore: initial project setup, dependencies, and base configuration"

# Group 2: Core Assets & Shared UI Components
git add src/assets/ src/components/Button.jsx src/components/Input.jsx src/components/Select.jsx
git commit -m "feat(ui): add core UI components and static assets"

# Group 3: Infrastructure (Networking & State)
git add src/services/ src/store/ src/Hooks/
git commit -m "feat(core): setup api services, global state management, and data-fetching hooks"

# Group 4: Authentication & Reception Dashboard
git add src/pages/Login.jsx src/pages/ReceptionDashboard.jsx src/pages/ReceptionDoctors.jsx src/components/Layout.jsx src/components/Sidebar.jsx src/components/Topbar.jsx src/components/AppointmentModal.jsx src/components/AppointmentTicket.jsx src/components/NewPatientModal.jsx
git commit -m "feat(reception): implement auth flow, reception dashboard, and patient management modules"

# Group 5: Doctor Workspace
git add src/pages/DoctorDashboard/ src/components/DoctorLayout.jsx
git commit -m "feat(doctor): implement doctor active visit dashboard and interactive timeline"

# Safety fallback (add everything else)
git add .
git commit -m "chore: catch all uncommitted files"

git log --oneline -n 6
