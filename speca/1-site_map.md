
### 1. Project Directory Tree (eco-stroy-app)

The following structure represents the technical architecture of the Eco-Stroy application. This representation uses standard ASCII for terminal compatibility.

```text
eco-stroy-app/
├── Project Configuration & Root
│   ├── package.json         # Dependency manifest (React, Firebase, Tailwind) and scripts
│   ├── vite.config.ts       # Vite bundler configuration (path aliases, React/Tailwind plugins)
│   ├── index.html           # Main HTML template for React mounting
│   └── .env                 # Environment variables for Firebase keys and API tokens
│
└── src/                     # Application Source Code
    ├── main.tsx             # Entry point: renders <App /> into the div#root mounting point
    ├── App.tsx              # Root component: manages Layout and high-level Routing
    ├── index.css            # Global styles, Tailwind CSS v4 config, and custom scrollbars
    ├── vite-env.d.ts        # TypeScript declarations for Vite-specific features
    │
    ├── components/          # Reusable UI components (Shared UI)
    │   ├── Header.tsx       # Navigation, branding, and primary contact information
    │   └── Footer.tsx       # Copyright, legal links, and secondary navigation
    │
    ├── context/             # Global State Management
    │   └── ProjectContext.tsx # Data Provider: Fetches Firebase data and distributes it to the tree
    │
    ├── lib/                 # Third-party integrations and infrastructure
    │   ├── firebase.ts      # Firebase SDK initialization and Firestore (db) export
    │   ├── telegram.ts      # Domain logic for lead notifications via Telegram Bot API
    │   └── email.ts         # SMTP/API logic for email notifications via EmailJS
    │
    ├── types/               # Data Models and TypeScript Interfaces
    │   ├── project.ts       # Schema for houses, baths, portfolios, and build configurations
    │   └── order.ts         # Schema for leads/orders and their respective statuses
    │
    └── pages/               # Route-level Components
        ├── Home.tsx         # Landing page (Hero section, featured listings, lead acquisition)
        ├── Catalog.tsx      # House catalog (filtering, sorting, and pagination logic)
        ├── CatalogBaths.tsx # Bath catalog (reusable catalog logic specialized for baths)
        ├── ProjectDetails.tsx # House details (galleries, floor plans, config tables)
        ├── BathDetails.tsx  # Bath details specialized view
        ├── Portfolio.tsx    # Gallery of completed objects for social proof
        ├── Calculator.tsx   # Multi-step construction cost calculation engine
        ├── About.tsx        # Corporate history, statistics, and team profiles
        ├── Technologies.tsx # Technical documentation on construction methodologies
        ├── Contacts.tsx     # Physical locations, interactive maps, and feedback forms
        └── Admin.tsx        # Internal CMS (CRUD operations) and CRM for lead management
```

### 2. Routing Map Table

The following table maps the application's URL paths to their corresponding React components and functional roles as defined in the `src/App.tsx` router configuration.

|   |   |   |
|---|---|---|
|URL Path (Route)|Component (Page)|Description|
|`/`|`<Home />`|Primary landing page and entry point|
|`/catalog`|`<Catalog />`|Comprehensive house project directory|
|`/catalog/:id`|`<ProjectDetails />`|Dynamic project view for specific houses|
|`/baths`|`<CatalogBaths />`|Comprehensive bath project directory|
|`/baths/:id`|`<BathDetails />`|Dynamic project view for specific baths|
|`/portfolio`|`<Portfolio />`|Photo gallery of successfully built objects|
|`/calculator`|`<Calculator />`|Interactive construction cost estimation tool|
|`/technologies`|`<Technologies />`|Information regarding construction standards|
|`/about`|`<About />`|Organizational background and company details|
|`/contacts`|`<Contacts />`|Communication channels and feedback mechanisms|
|`/admin`|`<Admin />`|Secure content management and CRM dashboard|

### 3. Architectural Data Flow

The runtime execution and state synchronization logic of the application follow a reactive five-step flow:

1. **Infrastructure Initialization:** During the application mount phase, `ProjectContext.tsx` initializes a connection to the Firebase backend services via the `firebase.ts` configuration.
2. **Reactive Data Retrieval:** The global Context provider subscribes to the Firestore `projects`, `baths`, and `portfolio` collections. Utilizing the `onSnapshot` method, it ensures real-time synchronization of the database into the global state and distributes this state throughout the entire component tree.
3. **UI Rendering:** Downstream page components (e.g., `Catalog.tsx`) consume the `useProjects()` hook to access the synchronized global state, instantly rendering project arrays to the interface.
4. **Lead Acquisition Pipeline:** When a user submits a lead form (located on the `Home`, `Calculator`, or `Contacts` pages), the application persists the data to the Firestore `orders` collection. This event triggers the notification logic in `telegram.ts` and `email.ts` to alert administrative staff.
5. **State Synchronization & Management:** Updates performed by administrators via the `/admin` panel modify the Firestore source of truth. Due to the reactive `onSnapshot` listener in the Context provider, these changes are instantly propagated to all active client instances, maintaining a consistent UI state across the application.


