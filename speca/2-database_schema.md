# Database Schema (Firestore)

This document describes the NoSQL database schema used in the Eco-Stroy application. The application uses Firebase Firestore as its primary database. All collections are stored at the root level.

## 1. Collection: `projects` (Houses)
Stores the catalog of house construction projects.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique identifier for the project. |
| `title` | `string` | Yes | Name of the house project. |
| `price` | `number` | Yes | Base price of the project. |
| `priceWarm` | `number` | No | Price for the "Warm Contour" configuration. |
| `priceTurnkey` | `number` | No | Price for the "Turnkey" configuration. |
| `area` | `string` | Yes | Total area (e.g., "120 м²"). |
| `floors` | `string` | Yes | Number of floors. |
| `bedrooms` | `string` | Yes | Number of bedrooms. |
| `material` | `string` | Yes | Primary construction material. |
| `time` | `string` | Yes | Estimated construction time. |
| `series` | `string` | Yes | Project series/category. |
| `houseSize` | `string` | No | Dimensions of the house (e.g., "8x10 м"). |
| `bathrooms` | `string` | No | Number of bathrooms. |
| `image` | `string` | Yes | URL to the main thumbnail image. |
| `badge` | `string \| null` | Yes | Text for a promotional badge (e.g., "Хит"). |
| `badgeColor` | `string` | Yes | Tailwind color class for the badge. |
| `isPopular` | `boolean` | Yes | Flag to display on the home page. |
| `description` | `string` | Yes | Detailed HTML/Text description. |
| `features` | `string[]` | Yes | Array of key features. |
| `gallery` | `string[]` | No | Array of image URLs for the gallery. |
| `floorPlans` | `string[]` | No | Array of image URLs for floor plans. |
| `configurations` | `ConfigSection[]` | No | Nested array of configuration options. |

## 2. Collection: `baths` (Baths)
Stores the catalog of bathhouse construction projects.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique identifier for the bath project. |
| `title` | `string` | Yes | Name of the bath project. |
| `price` | `number` | Yes | Base price. |
| `description` | `string` | Yes | Detailed description. |
| `area` | `string` | No | Total area. |
| `size` | `string` | No | Dimensions (e.g., "6x6 м"). |
| `showerRoom` | `string` | No | Shower room area/details. |
| `steamRoom` | `string` | No | Steam room area/details. |
| `bathroom` | `string` | No | Bathroom area/details. |
| `guestRoom` | `string` | No | Guest room area/details. |
| `terrace` | `string` | No | Terrace area/details. |
| `equipment` | `string` | No | Included equipment details. |
| `time` | `string` | No | Estimated construction time. |
| `image` | `string` | Yes | URL to the main thumbnail image. |
| `gallery` | `string[]` | No | Array of image URLs for the gallery. |
| `floorPlan` | `string` | No | URL to the floor plan image. |

## 3. Collection: `portfolio` (Completed Projects)
Stores the gallery of successfully completed construction objects.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique identifier for the portfolio item. |
| `title` | `string` | Yes | Title of the completed project. |
| `description` | `string` | Yes | Description of the work done. |
| `images` | `string[]` | Yes | Array of image URLs showcasing the project. |

## 4. Collection: `orders` (Leads & Requests)
Stores customer inquiries, calculator results, and contact form submissions.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique identifier for the order. |
| `name` | `string` | No | Customer's name. |
| `phone` | `string` | Yes | Customer's phone number. |
| `email` | `string` | No | Customer's email address. |
| `message` | `string` | No | Custom message from the user. |
| `summary` | `string` | No | Formatted summary of calculator selections. |
| `projectId` | `string` | No | ID of the associated project (if applicable). |
| `projectTitle` | `string` | No | Title of the associated project. |
| `source` | `string` | Yes | Origin of the lead (e.g., 'home_page', 'calculator'). |
| `status` | `enum` | Yes | Current status: `'new'`, `'in_progress'`, `'done'`, `'rejected'`. |
| `createdAt` | `number` | Yes | Unix timestamp of when the order was created. |

## 5. Nested Data Structures

### `ConfigSection` (Used in `projects.configurations`)
Represents a section in the configuration table (e.g., "Foundation", "Roof").

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | Title of the configuration section. |
| `rows` | `ConfigRow[]` | Yes | Array of configuration rows. |

### `ConfigRow`
Represents a specific item within a configuration section.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Name of the configuration item. |
| `v1` | `boolean` | Yes | Included in "Warm Contour" (v1). |
| `v2` | `boolean` | Yes | Included in "Turnkey" (v2). |
