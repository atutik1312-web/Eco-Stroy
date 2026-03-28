# Comprehensive Technical Stack & Architecture Specification

This document provides an expanded, in-depth overview of the technologies, architectural decisions, and functional implementations of the Eco-Stroy project.

## 1. System Architecture
The "Eco-Stroy" application is built as a **Single Page Application (SPA)** utilizing a **Serverless architecture**. It eliminates the need for a traditional backend server by leveraging Backend-as-a-Service (BaaS) solutions for data storage and serverless functions/APIs for third-party integrations.

## 2. Core Frontend Technologies
* **React (v19):** The foundational library for building the user interface. The project strictly adheres to modern React paradigms, utilizing functional components and hooks (`useState`, `useEffect`, `useMemo`) without legacy class components.
* **TypeScript:** Provides strict static typing across the application. Custom interfaces (`Project`, `BathProject`, `Order`) ensure data integrity between the database and UI components, significantly reducing runtime errors and improving developer experience.
* **Vite (v6):** The build tool and development server. Chosen for its extremely fast Hot Module Replacement (HMR) and optimized Rollup-based production builds.
* **React Router DOM (v7):** Handles client-side routing. It manages navigation between static pages (`/about`, `/contacts`), dynamic catalog items (`/catalog/:id`), and the protected admin dashboard (`/admin`).

## 3. Styling and UI Ecosystem
* **Tailwind CSS (v4):** The primary styling engine. The project uses the latest v4 configuration paradigm, utilizing the `@theme` directive in `index.css` instead of a traditional `tailwind.config.js`.
  * *Responsive Design:* Strictly follows a Mobile-First approach using `sm:`, `md:`, and `lg:` breakpoints.
  * *Theming:* Built-in dark mode support via `dark:` utility classes, toggled globally.
* **yet-another-react-lightbox:** A robust library used for fullscreen image galleries and floor plan viewing. It is integrated with the `Zoom` plugin to allow detailed inspection of architectural blueprints.
* **Icons:** A hybrid approach using **Material Symbols Outlined** (via Google Fonts CDN) for general UI elements and **lucide-react** for specific component icons.

## 4. Data Management & State
* **Firebase Firestore (v12):** A NoSQL cloud database used as the primary data store.
  * *Real-time Sync:* Utilizes `onSnapshot` listeners to push database updates to connected clients instantly.
  * *Collections:* `projects`, `baths`, `portfolio`, `orders`.
* **React Context API (`ProjectContext.tsx`):** Acts as the global state manager. It abstracts Firebase interactions away from UI components.
  * The `ProjectProvider` fetches data on mount and distributes it via the `useProjects()` custom hook.
  * It exposes asynchronous CRUD functions (`addProject`, `updateProject`, `deleteProject`) used primarily by the Admin panel.

## 5. External Integrations
* **Telegram Bot API:** Used for instant lead notification. When a user submits a form, a `fetch` POST request is sent directly to the Telegram API, formatting the lead data (name, phone, calculator summary) into an HTML-styled message.
* **EmailJS:** Provides a secondary notification channel, sending lead data to the company's email address without requiring a custom SMTP server.

## 6. Key Feature Implementations
* **Interactive Calculator (`Calculator.tsx`):** A complex 8-step wizard. It uses `useMemo` to recalculate the total construction cost dynamically only when specific dependencies (area, floors, materials) change, ensuring optimal rendering performance.
* **Admin Dashboard (`Admin.tsx`):** A custom-built CMS/CRM interface. It allows staff to manage catalog content (CRUD operations) and track lead statuses (`new`, `in_progress`, `done`, `rejected`) in real-time.
* **Catalog Filtering & Pagination (`Catalog.tsx`):** Implements client-side filtering (by popularity) and sorting (by price ascending/descending) using `useMemo`, combined with custom pagination logic to handle large datasets efficiently.

## 7. Security & Performance Optimizations
* **Honeypot Spam Protection:** All lead generation forms include a hidden input field (`botField`). If filled (typically by automated spam bots), the submission is silently discarded without hitting the database or APIs, avoiding the UX friction of CAPTCHAs.
* **Client-Side Validation:** Forms enforce strict validation (e.g., exact 10-digit phone numbers, minimum message lengths) before allowing submission.
* **Image Optimization:** External images use `referrerPolicy="no-referrer"` to bypass hotlinking restrictions, and CSS `aspect-ratio` properties prevent Cumulative Layout Shift (CLS) during image loading.
