# Specification: Admin Panel (Admin.tsx)

## 1. Tech Stack and Design Patterns

The `Admin.tsx` page is a full-fledged SPA (Single Page Application) admin panel within the main application. It combines CMS (Content Management System) and CRM (Customer Relationship Management) functionalities.

### 1.1. Core Technologies

- **React (Functional Components & Hooks):**
    - `useState` is used to manage complex interface states: switching tabs (`adminTab`), switching screens (list/editor — `view`), storing the currently edited object (`currentProject`, `currentBathProject`, etc.), managing deletion modal windows, and notifications (toast).
    - `useEffect` is used to subscribe to the `orders` collection upon component mounting.
- **Tailwind CSS:** Provides complex layout for tables, forms, tabs, and modal windows. Classes are actively used to style states (e.g., `hover:bg-slate-50`, `disabled:opacity-50`).

### 1.2. Data Management (Backend & State)

- **Context API (`useProjects`):** The admin panel receives functions for working with the catalog (adding, updating, deleting houses, baths, and portfolio items) from the global `ProjectContext`. This allows separating DB logic from UI rendering logic.
- **Firebase Firestore (Direct Queries):**
    - For working with requests (`orders`), the admin panel makes direct queries to the database using methods like `query`, `orderBy`, `onSnapshot` (to get the list of requests in real-time), and `updateDoc`, `deleteDoc` (to change status or delete requests).
    - **Import/Export (Backup)** functionality is implemented: `getDocs` and `setDoc` methods are used to export the entire database to a JSON file and restore from it.

---

## 2. Functionality by Page Sections

The admin interface is divided into 4 main tabs, switching between which is managed by the `adminTab` state.

### Section 1: "House Projects" Tab (`adminTab === 'projects'`)

- **Description:** Management of the frame houses catalog.
- **List Functionality (View: 'list'):**
    - Displays a table of all houses with a thumbnail, title, price, and "Popular" status.
    - Action buttons for each house: Edit (pencil), Duplicate (copy project), Delete (trash bin).
    - "Add project" button, which generates an empty template (`handleCreateNew`).
- **Editor Functionality (View: 'edit'):**
    - The editing form is divided into 4 sub-tabs (`activeTab`):
        1. **General:** Title, prices (base, warm contour, turnkey), badges (hit, new).
        2. **Characteristics:** Area, floors, bedrooms, materials, deadlines.
        3. **Media:** Uploading links for the cover, gallery (up to 5 photos), and floor plans.
        4. **Configurations:** A complex editor for the configuration table (`DEFAULT_CONFIGS`), allowing to add/remove options and check their availability in different plans.
    - Validation: checks for the presence of a cover image before saving.

### Section 2: "Baths" Tab (`adminTab === 'baths'`)

- **Description:** Management of the wooden baths catalog.
- **Functionality:** Completely analogous to the "House Projects" section, but uses its own data structure (`BathProject`) and saves data via `addBath` / `updateBath` methods. The editor contains specific fields (steam room, washing room, relaxation room).

### Section 3: "Portfolio" Tab (`adminTab === 'portfolio'`)

- **Description:** Management of the completed works list.
- **Functionality:**
    - Displays the list of completed projects.
    - The editor (View: 'edit_portfolio') contains a simplified form: Title, Description (with line break support), Year built, Area, Duration, and an array of 5 photo links.
    - Validation requires at least one photo before saving (`handleSavePortfolio`).

### Section 4: "Requests" Tab (`adminTab === 'orders'`)

- **Description:** Built-in mini-CRM for lead processing.
- **Functionality:**
    - **Real-time list:** Requests are loaded from Firestore sorted from newest to oldest (`orderBy('createdAt', 'desc')`).
    - **Data display:** Displays date, phone, source (from main, from calculator, from project page), and status. If the request came from the calculator, the full estimate is displayed (`order.summary`).
    - **Status management:** A dropdown list allows changing the request status: "New" (red), "In progress" (yellow), "Completed" (green), "Cancelled" (gray). Upon change, `updateOrderStatus` is called, which updates the document in Firebase.
    - **Deletion:** Ability to delete an irrelevant request.

### Section 5: System Functions (Backup and Notifications)

- **Import / Export (Backup):**
    - **Export (`handleExport`):** Collects all data from the context (houses, baths, portfolio) and makes a request to the `orders` collection. Forms a single JSON object, converts it to a Blob, and downloads it to the user's computer as the `ecostroy-backup.json` file.
    - **Import (`handleImport`):** Reads the uploaded JSON file, parses it, and sequentially restores all documents in the Firebase database using `for...of` loops.
- **Notification System (`showNotification`):**
    - Custom Toast component. Upon successful save or error, a banner pops up in the bottom right corner of the screen, which automatically disappears after 3 seconds.
- **Confirmation Modal Windows:**
    - When attempting to delete any item (house, bath, portfolio), an Alert Dialog pops up asking to confirm the action to avoid accidental data deletion.
