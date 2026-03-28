<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e94b1356-b2e0-42eb-8c3e-7448894d9b4c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

# Technical Summary of the "Eco-Stroy" Project

## 1. Architecture Overview
The project is a modern **Single Page Application (SPA)** developed for a construction company. The application combines a client-side interface (project showcase, calculator, informational pages) and a hidden admin panel (CRM for requests and CMS for content management).

The project is built on a **Serverless architecture** (without a dedicated backend server), where the cloud infrastructure Firebase acts as both the database and API.

## 2. Tech Stack

### 💻 Frontend (Client-side)
* **React (v19):** The main library for building user interfaces. Uses exclusively functional components and hooks.
* **TypeScript:** Programming language providing strict static typing (interfaces `Project`, `Order`, `ConfigSection`), minimizing errors during development.
* **Vite (v6):** Ultrafast build tool and development server. Ensures instant startup and optimized production builds.
* **React Router DOM (v7):** Client-side routing. Supports dynamic paths (e.g., `/catalog/:id`).

### 🎨 Styling & UI
* **Tailwind CSS (v4):** Utility-first CSS framework. Configured via the new integration standard (`@tailwindcss/vite` and `@theme` directives in `index.css`).
* **Responsiveness & Themes:** Full support for mobile devices (Mobile-First approach) and built-in dark mode support (`dark:` classes).
* **Component Libraries:** 
  * `yet-another-react-lightbox` — for fullscreen gallery and floor plan viewing with zoom support.
  * `Material Symbols` and `lucide-react` — vector icons.

### ☁️ Backend as a Service (BaaS)
* **Firebase Firestore:** Real-time NoSQL database. Stores catalogs of houses, baths, portfolios, and incoming requests (leads).

### 🔔 Integrations
* **Telegram Bot API:** Direct sending of new lead notifications to the managers' Telegram chat via `fetch` requests.
* **EmailJS:** Duplication of requests to email.

## 3. Key Architectural Decisions

1. **Global State Management (Context API):**
   All data logic is extracted into `src/context/ProjectContext.tsx`. This is the Single Source of Truth for the entire application. Pages do not make DB requests independently; they receive ready data from the `useProjects()` hook.
2. **Real-time Synchronization:**
   Using the `onSnapshot` method from Firebase. Any changes in the database (e.g., an administrator adding a new house) are instantly displayed to all users currently on the site without reloading the page.
3. **Separation of Business Logic and UI:**
   Utility functions (Telegram sending, Firebase initialization) are extracted into a separate `src/lib/` directory, making page components clean and easy to read.

## 4. Core Application Features

* **Dynamic Catalogs:** Separate showcases for houses (`Catalog.tsx`) and baths (`CatalogBaths.tsx`) with detailed object cards (`ProjectDetails.tsx`).
* **Interactive Calculator (`Calculator.tsx`):** A complex 8-step setup wizard that dynamically recalculates the final cost depending on selected parameters (number of floors, area, foundation, finishing) using memoization (`useMemo`).
* **Lead Generation (Request Collection):** Feedback forms are integrated into the calculator, contacts, and project cards. All requests are saved in the DB with a `new` status and sent to messengers.
* **Admin Panel (`Admin.tsx`):** Built-in CMS/CRM system allowing:
  * Adding, editing, and deleting projects (CRUD operations).
  * Managing statuses of incoming requests (New, In Progress, Done, Rejected).
* **Informational Sections:** Static, SEO-optimized pages (About Us, Technologies, Portfolio) that increase brand trust.

## 5. Security & Optimization

* **Spam Protection (Honeypot):** A hidden `botField` is implemented in all forms. If a spam bot fills it, the script simulates a successful submission but blocks DB writing and notification sending.
* **Data Validation:** Strict client-side input validation (phone length limits, filtering special characters in names).
* **Rendering Optimization:** Using `referrerPolicy="no-referrer"` for images from third-party resources and proper dependency management in React hooks to prevent unnecessary re-renders.
