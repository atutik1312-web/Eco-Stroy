# Specification: Project Details Page (ProjectDetails.tsx)

## 1. Tech Stack and Design Patterns

The `ProjectDetails.tsx` page is responsible for the detailed presentation of a specific house, viewing its photos and floor plans, as well as collecting leads (requests) for this project.

### 1.1. Core Technologies

- **React Hooks:**
    - `useEffect`: used to automatically scroll the page to the top when the project ID in the URL changes.
    - `useState`: manages the state of the gallery (open/closed, current photo index), the state of the request modal window, and form data.
- **React Router DOM:**
    - `useParams`: extracts the `id` parameter from the URL (e.g., `/catalog/project-123`) to find the required project in the database.
    - `Link`: used for breadcrumbs (navigating back).
- **Tailwind CSS:** Responsive layout (Grid layouts), styling modal windows (`backdrop-blur`), dark mode support.

### 1.2. Third-party Libraries

- **yet-another-react-lightbox:** A professional library for viewing images (Lightbox). It is connected along with the `Zoom` plugin to allow zooming in on photos and floor plans.

### 1.3. Data Management (Backend)

- **Context API (`useProjects`):** The page receives an array of all projects from the global context and searches for the required project by `id` (using the `.find()` method).
- **Firebase Firestore (`addDoc`):** Saving the request to the `orders` collection, linked to the specific project ID and title.
- **Telegram & Email API:** Sending notifications to managers, specifying exactly which project the request came from.

---

## 2. Functionality by Page Sections

### Section 1: Navigation and Project Search

- **Project Search:** The script searches for the project by `id` from the URL. If a project with this ID is not found (e.g., deleted or invalid link), a "Project not found" placeholder is displayed.
- **Breadcrumbs:** Navigation chain `Home > Project Catalog > [Project Title]`. Allows the user to easily navigate back.

### Section 2: Hero Section (Gallery and Main Information)

The section is divided into two columns (on desktop):

- **Left Column (Media):**
    - Displays the main project photo (cover) in a large format.
    - Below the main photo, a grid of 4 thumbnails is displayed (additional photos from the `gallery` array).
    - Clicking on any photo calls the `openGallery` function, which opens a fullscreen Lightbox on the selected photo.
- **Right Column (Info):**
    - Displays the title, series, base price (from ...), and text description.
    - **Characteristics Grid:** A block with icons displaying the area, number of floors, number of bedrooms, bathrooms, house dimensions, and construction time.
    - "Order project" button, which opens a modal window with a form.

### Section 3: Floor Plans

- **Description:** A block with floor blueprints. It is rendered only if there is at least one image in the `floorPlans` array.
- **Functionality:**
    - Displays floor plans as cards labeled "1st floor", "2nd floor", etc.
    - Clicking on a floor plan also opens a fullscreen Lightbox with zoom capabilities, which is critical for reading small dimensions on blueprints.

### Section 4: Configurations and Prices Table

- **Description:** A detailed table showing what is included in different plans (e.g., "Warm Contour" and "Warm Contour PLUS").
- **Functionality:**
    - The table is built dynamically based on the `configurations` array (which is configured in the admin panel).
    - In the table header, prices are calculated automatically: base price (`priceWarm` or `price`) and turnkey price (`priceTurnkey` or `price * 1.3`).
    - Cells display checkmarks (`check` icon) if the option is included in the plan, or a dash (`—`) if not.
    - Below the table, footnotes (notes) are displayed, and the "Order project" button is duplicated.

### Section 5: Order Modal Window

- **Description:** A pop-up window with a lead capture form.
- **Technical Implementation:**
    - Rendered over all content when `isModalOpen === true`. Clicking on the dark background closes the window.
    - **Form Fields:** Name (only letters, hyphens, and spaces) and Phone (only digits, exactly 10 characters).
    - **Honeypot:** A hidden `botField` to protect against spam bots without using annoying CAPTCHAs.
- **Submission Process (`handleOrderSubmit`):**
    1. Data validation.
    2. Enabling the loading state (`isSubmitting = true`), disabling the button.
    3. Writing to Firebase (`addDoc` to the `orders` collection) passing `projectId` and `projectTitle`.
    4. Sending notifications to Telegram and Email.
    5. Showing the success screen ("Request sent!") inside the modal window.
    6. Automatically closing the window and resetting the form after 3 seconds.
