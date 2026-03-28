# Specification: Calculator Page (Calculator.tsx)

## 1. Tech Stack and Design Patterns

The `Calculator.tsx` page is a complex multi-step interactive tool for preliminary calculation of house construction costs, followed by contact data collection (lead generation).

### 1.1. Core Technologies

- **React Hooks:**
    - `useState`: Manages multiple states: current calculator step (`step`), selected house parameters (floors, area, layout, foundation, insulation, finish, windows), as well as the request form state (field data, submission status, success status).
    - `useMemo`: **Crucial hook for performance.** Used for the `calculateTotal` function. It recalculates the total cost *only* when one of the house parameters or the current step changes, preventing unnecessary calculations on every component render.
    - `useEffect`: Used to reset the calculator (`resetCalculator`) to its initial state when navigating to the page (tracks `location.pathname` changes).
- **React Router DOM:**
    - `useLocation`: Used to track the current path and trigger the calculator state reset upon revisiting the page.
- **Tailwind CSS:**
    - Responsive layout using `flex` and `grid`.
    - Styling the slider (`range input`) using `accent-primary`.
    - Interactive states (`hover`, `focus`, `disabled`).
    - Dark mode support (`dark:` classes).

### 1.2. Data Management (Backend & Services)

- **Firebase Firestore (`addDoc`):** Saving the final request to the `orders` collection. Not only contacts are sent to the database, but also a detailed text summary (`summary`) of all selected parameters and the final price.
- **Telegram API (`sendTelegramNotification`):** Sending a notification to the managers' Telegram channel/chat.
- **Email API (`sendEmailNotification`):** Duplicating the request to email.

---

## 2. Data Structure (Configuration)

At the beginning of the file, constants are defined that determine the pricing logic:

- **`PRICES`:** A dictionary object containing base rates.
    - `areaPerM2`: Base price per square meter (65,000 ₽).
    - `layout`, `foundation`, `insulation`, `finish`, `windows`: Objects with prices for each specific option (extra bedrooms, foundation type, insulation thickness, etc.).
- **`LABELS`:** A dictionary object for mapping technical keys (e.g., `iron_piles`) to human-readable names (e.g., 'Iron piles') for display in the UI and generating the request summary.
- **`STEPS`:** An array of strings with step names (8 steps).

---

## 3. Functionality by Sections (Steps)

The calculator is implemented using a "Wizard" principle, where content changes depending on the state of the `step` variable.

### 3.1. Progress Bar

- Displays the current step (e.g., "STEP 2 OF 8").
- Visual progress bar (filled in percentages).
- Text list of all steps with completed ones highlighted.

### 3.2. Sidebar ("Your Choice")

- **Sticky block:** Sticks to the top of the screen on scroll (on desktop).
- **Dynamic receipt:** Shows the list of selected options and their cost *in real-time*.
- Options appear in the receipt only after the user reaches the corresponding step (check `step >= N`).
- At the bottom, the total amount is displayed, formatted by the `formatPrice` function (digit grouping and adding the ₽ symbol).

### 3.3. Calculator Steps (`renderStepContent`)

- **Step 1: Floors (`floors`)**
    - Choice between 1 and 2 floors (card buttons).
    - *Logic:* Choosing the 2nd floor applies a 1.15 multiplier (increases the total cost by 15%).
- **Step 2: Area (`area`)**
    - Slider (`input type="range"`) from 30 to 300 m².
    - *Logic:* Base cost = area * `PRICES.areaPerM2`.
- **Step 3: Layout (`layout`)**
    - A complex step with multiple controls:
        - Checkbox: Separate kitchen and living room.
        - Dropdowns (`select`): Number of bedrooms (from 1 to 4) and bathrooms (from 0 to 2).
        - Number input (`input type="number"`): Number of entrance doors.
        - Checkboxes: Additional options (terrace, utility room, storage, vestibule). The `toggleOption` function adds or removes an option from the array.
- **Step 4: Foundation (`foundation`)**
    - Choosing the foundation type (RC piles, grillage, slab, etc.) via card buttons.
- **Step 5: Insulation (`insulation`)**
    - Three independent blocks of radio buttons: for the floor, walls, and roof.
- **Step 6: Exterior Finish (`finish`)**
    - Choosing the exterior finish material (siding, timber, etc.).
- **Step 7: Windows (`windows`)**
    - Choosing the glazing type (standard, panoramic, energy-saving).
- **Step 8: Total and Request Form**
    - Displaying the large total amount.
    - "Recalculate" button (calls `resetCalculator`).
    - **Lead Capture Form:**
        - Fields: Name, Phone (with mask/restriction to digits only), Email (optional).
        - **Honeypot:** Hidden `botField`. If filled (which bots do), the form simulates a successful submission, but data is not sent anywhere.
        - **Submission (`handleFormSubmit`):** Generates a text `summary` of all selected parameters, sends data to Firebase, and calls notification functions (Telegram, Email).
        - **Success Screen:** After successful submission, the form is replaced with a thank-you message.

### 3.4. Navigation

- "Back" and "Next step" buttons control the `step` variable.
- When moving to a new step, `window.scrollTo({ top: 0, behavior: 'smooth' })` is called to smoothly return to the top of the calculator block.
