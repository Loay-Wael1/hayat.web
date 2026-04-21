# Hayat - Hospital Information System

![Project Banner](./src/assets/al_hayat_hospital_logo1.png)

A high-performance, modern web application serving as the frontline command center for **Hayat** hospital administrative and clinical interactions. Built to deliver a premium user experience with robust architectural patterns separating the concerns of the **Receptionist Network** and the **Clinical/Doctor Workspace**.

## 🌟 Key Features

### Reception Node (بوابة الاستقبال)
- **Fluid Scheduling**: Instant check-ins transforming Scheduled appointments to Active queues dynamically. 
- **Doctor Directory Module**: Specialized lookup system indexing doctor working hours mapped individually per clinic branch.
- **Smart Patient Overlays**: Floating modal workflows for rapid new patient file registration and immediate booking.
- **Printable Tickets**: Formatted popup appointment tickets generated seamlessly after Check-Ins.

### Doctor Workspace (شاشة الطبيب)
- **Role-Guarded Entry**: Fully protected router enforcing strict access constraints ensuring isolated environments.
- **Auto-Saving Drafts (Zustand)**: An intelligent form mechanism persisting clinical notes, diagnoses, and multi-ingredient prescriptions in local memory. Protects the doctor from accidental data loss upon refreshing or swapping tabs.
- **Dynamic Active Queue**: "On-the-fly" waitlist polling reflecting the exact reception updates in real-time, coupled with One-Click absence reporting and auto-patient-selecting logic.
- **Interactive Medical Timeline**: Comprehensive vertical historical visualizer presenting any patient's previous visits effortlessly before continuing an active diagnosis format.

## 🛠️ Technology Stack
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) - Utilizing blazingly fast HMR.
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/) mapped to standardized premium design aesthetics.
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Role-based Navigation Guards).
- **Data Fetching/Caching**: [TanStack Query (React Query)](https://tanstack.com/query) for declarative invalidating endpoint caching and request life-cycles.
- **Global State**: [Zustand](https://github.com/pmndrs/zustand) driving transient layout drafting and Auth token retention.
- **Form Management**: [React Hook Form](https://react-hook-form.com/) combined with [Yup](https://github.com/jquense/yup) resolving schemas.
- **Icons**: [Lucide React](https://lucide.dev/).

## 🏗️ Architecture

The codebase adheres strictly to layered separation:
* `/services/`: Raw Axios fetch mapping separating domains (`authService.js`, `receptionService.js`, `doctorService.js`).
* `/Hooks/`: Abstracted implementations of TanStack mapping business query endpoints.
* `/store/`: Isolated contexts governing global state variables (Auth/Identity + Clinical Transient Drafts).
* `/pages/`: Root-level rendering templates.
* `/components/`: Granular, stateless presentation logic.

## 🚀 Running Locally

To install and initialize the dashboard in your development environment:

1. **Install dependencies**:
```bash
npm install
```

2. **Run Development Server**:
```bash
npm run dev
```

Build the project for production:
```bash
npm run build
```

---
*Built meticulously for exceptional hospital operations handling.*
