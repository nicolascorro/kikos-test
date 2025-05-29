# Masterplan for Café Delivery Service App

## 1. Project Overview
- **Goal:** Build a responsive web app (Next.js) plus standalone mobile apps (Expo/React Native) for a café in Peru to take and deliver orders.
- **User Roles:**
  - **Admin:** Full control (you & restaurant owner)
  - **Worker:** Limited management (menu updates, order status)
  - **Client:** Registered users placing orders
  - **Guest:** Browsing only, cannot order
- **Key Features:**
  - User registration & authentication (Supabase Auth)
  - Menu browsing & ordering
  - 5 km delivery-radius check
  - Real-time order-status phases
  - Payments via Plin, Yape, Niubiz (cards); Apple/Google Pay in v2
  - Loyalty program (free delivery on 1st order + points)
  - Push notifications on status change (FCM)
  - Admin dashboard with analytics

---

## 2. Tech Stack & Tools
- **Frontend (Web):** Next.js (v14+), React, TypeScript, TailwindCSS 4  
- **Mobile (iOS & Android):** Expo (managed workflow), React Native, shared TS + TailwindCSS via [`nativewind`](https://www.nativewind.dev/)  
- **Backend & Database:** Supabase (PostgreSQL, Auth, Edge Functions, Storage)  
- **Payments:**  
  - **Phase 1:** Plin & Yape SDKs or API + Niubiz for cards  
  - **Phase 2:** Add Apple Pay & Google Pay via Niubiz’s gateway  
- **Maps & Geolocation:** Google Maps/Places API (autocomplete + distance calc)  
- **Notifications:** Firebase Cloud Messaging  
- **Deployment:**  
  - **Web:** Vercel (Next.js)  
  - **Mobile:** Expo Application Services (build & OTA updates)  
- **Version Control & CI/CD:** GitHub repo (monorepo via Turborepo), GitHub Actions for lint/typecheck/tests + deploy  
- **Testing:** Jest + React Testing Library (unit), Playwright (E2E)

---

## 3. Development Phases

| Phase                     | Description                                                                 | Time Estimate |
|---------------------------|-----------------------------------------------------------------------------|---------------|
| **0. Setup & Planning**   | Repo, monorepo tooling, environment config, wireframes & API contracts      | 1 week        |
| **1. Core Authentication**| Supabase Auth integration + role-based access (admin/worker/client/guest)   | 1 week        |
| **2. Data Modeling**      | Supabase schema: users, orders, menu_items, addresses, loyalty_points       | 1 week        |
| **3. Backend APIs**       | Edge Functions or Next.js API routes for orders, payments, points, analytics| 2 weeks       |
| **4. Frontend Web**       | Pages/components: menu, cart, checkout, order status, profile, admin panel  | 3 weeks       |
| **5. Mobile App**         | Expo app mirrors web views: menu, ordering, status, profile                 | 3 weeks       |
| **6. Integrations**       | Payments (Plin, Yape, Niubiz), Maps API, FCM push                           | 2 weeks       |
| **7. Loyalty Program**    | 1st-order free delivery + points accrual & redemption logic                 | 1 week        |
| **8. Analytics & Reporting** | Admin dashboard charts + metrics (orders/day, revenue, top items)        | 1 week        |
| **9. Testing & QA**       | Unit, integration, E2E; cross-device manual QA                              | 2 weeks       |
| **10. Launch & Handover** | Final fixes, Vercel & Expo publish, docs & training                         | 1 week        |

_Total ≈ 14–16 weeks (<4 months) + buffer → realistic under 6 months._

---

## 4. Getting Started
1. **Monorepo Initialization**  
   ```bash
   npx create-turbo@latest super-kikos
   cd super-kikos
   npm add -W typescript tailwindcss postcss autoprefixer

2. **Supabase Setup**  
   - Create project → copy `SUPABASE_URL` & `SUPABASE_ANON_KEY`  
   - Define schema in `supabase/migrations/`  
   - Enable Auth providers (email, phone)

3. **Next.js App**  
   ```bash
   cd apps/web
   npx create-next-app@latest --ts .
   npm add @supabase/supabase-js @tanstack/react-query
   npm add -D eslint jest playwright


4. **Expo App**  
   ```bash
   cd apps/mobile
   npx expo init --template expo-template-blank-typescript
   npm add nativewind react-native-safe-area-context


5. **TailwindCSS 4**  
   ```bash
   # in both apps
   npx tailwindcss init -p --postcss
   # tailwind.config.ts → enable JIT, content paths for .tsx/.ts

## 5. Recommended Folder Structure
    /kikos
    ├── apps
    │   ├── web             # Next.js web
    │   └── mobile          # Expo React Native
    ├── packages
    │   ├── ui              # Shared React Native + Web UI components
    │   ├── config          # ESLint, TypeScript, Tailwind configs
    │   └── lib             # Shared helper functions (API clients, types)
    ├── supabase            # Database migrations & seeds
    ├── .github             # CI workflows
    └── turbo.json

## 6. Git & Branch Strategy
    - Main Branch: main (protected; always green CI)
    - Feature Branches: feature/<short-desc> from main
    - Releases: Tag vX.Y.Z on main after merge
    - PRs: Require 1 review + passing CI (lint, typecheck, tests)

## 7. CI/CD Pipeline
    - On PR:
      - npm lint
      - npm type-check
      - npm test

    - On Merge to main:
      - Deploy apps/web to Vercel
      - Build & publish apps/mobile via EAS
      - Run DB migrations via Supabase CLI

## 8. Core Modules

### 8.1 Authentication & RBAC
- Supabase Auth (email + phone)  
- Custom JWT claims for roles (admin, worker, client)  
- Middleware in Next.js App Router to protect pages/API  

### 8.2 Menu & Orders
- **DB Tables:** `menus`, `menu_items`, `orders`, `order_items`  
- **API routes / edge functions:**  
  - `GET /api/menu`  
  - `POST /api/orders`  
  - `GET /api/orders/[id]`  
- **UI flows:** select items → cart → checkout  

### 8.3 Delivery Radius Check
- On address entry, use Google Places Autocomplete  
- Fetch café coords, compute Haversine distance ≤ 5 km  
- Save address if valid; reject otherwise  

### 8.4 Payments Integration
- **Phase 1:**  
  - Integrate Plin & Yape SDKs in frontend  
  - Niubiz server-side tokenization & charge (edge function)  
- **Phase 2:**  
  - Add Apple Pay & Google Pay via Niubiz’s gateway  

### 8.5 Real-Time Order Status
- **Order status enum:** `received → preparing → packaging → delivering → delivered`  
- Worker/Admin UI to advance status  
- Frontend subscribes via Supabase Realtime or listens to DB changes  

### 8.6 Loyalty & Promotions
- **1st Order:**  
  - On user’s first `orders` row → apply free delivery  
- **Points System:**  
  - Earn 1 point per S/10 spent (configurable)  
  - Store in `loyalty_points` table  
  - Redeem:  
    - 20 pts → S/5 off delivery fee  
    - 50 pts → S/15 off combo  
  - Admin UI to adjust rates, view balances  

### 8.7 Notifications
- Use FCM for push tokens via Expo Notifications  
- Trigger on order status change (backend → FCM)  

### 8.8 Analytics & Admin Dashboard
- Supabase SQL views for daily orders, revenue, top items  
- Next.js Admin pages using Chart.js or Recharts  
- Export CSV reports  

## 9. UI/UX Guidelines
- **Colors:** palette of greens & oranges (brand accents)  
- **Layout:** mobile-first, fully responsive grid  
- **Components:** Buttons, Cards, Modals, Forms in `packages/ui`  
- **Styling:** TailwindCSS 4 with custom theme in `tailwind.config.ts`  

## 10. Testing Strategy
- **Unit:** Jest + React Testing Library (components, utils)  
- **Integration:** Supabase local emulators + API tests  
- **E2E:** Playwright test flows (order → payment → status)  

## 11. Roadmap & Future Versions
- Apple Pay & Google Pay  
- Driver-facing mobile app (with map tracking)  
- Multi-language support (English)  
- PWA/offline caching  
- SMS & email notifications  
