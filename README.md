# Biz MuncH Mobile App

The customer-facing mobile application for Biz MuncH restaurant discount platform. Users receive a weekly rotation of 10 local restaurants with exclusive discounts, can pin up to 2 favorites, and redeem offers through scannable barcodes - all syncing in real-time with the admin dashboard via MongoDB.

**Backend Repository:** [bizmunch-backend](https://github.com/JamieJiHeonKim/bizmunch_dashboard_services)

-Mobile App (React Native): *Unfortunately the mobile app is not available for showcase*

### Application Workflow

1. **Register & Verify Account**
   - Open the app and tap "Create Account"
   - Enter your name, email, company invitation code, and password
   - Verify your email with the OTP sent to your inbox
   - System logs you in automatically

2. **Browse Your Weekly Restaurants**
   - View 10 randomly selected local restaurants on your home screen
   - Each restaurant displays its logo, name, category, and location
   - Restaurants rotate every Monday at midnight
   - Pinned restaurants appear at the top of the list

3. **Pin Your Favorites**
   - Tap the pin icon on any restaurant card (up to 2 restaurants)
   - Pinned restaurants remain in next week's rotation
   - Unpin by tapping the pin icon again
   - Pins sync to MongoDB → accessible across devices

4. **Filter by Category**
   - Scroll the horizontal category bar at the top
   - Tap a category (Asian, Fastfood, Café, Grill, Vegetarian, etc.)
   - Only restaurants matching that category appear
   - Tap again to clear the filter

5. **View Restaurant Details & Menu**
   - Tap any restaurant card to view full details
   - Swipe through carousel to see discounted menu items
   - Tap to flip card and reveal barcode for discount redemption
   - Browse full menu with collapsible sections by category
   - View prices, calories, and descriptions for each item

6. **Get Directions**
   - Tap "Google Maps" button on restaurant detail screen
   - Google Maps app opens with restaurant location pre-loaded
   - One-tap navigation to the restaurant

7. **Redeem Discounts**
   - Show the barcode to restaurant staff at checkout
   - Staff scans the barcode to apply your discount
   - Manager records the transaction in the dashboard

---

## Technologies Used

### Mobile Framework
- **React Native 0.74** - Cross-platform mobile development (Android + iOS)
- **Expo 51** - Simplified build process, no native code required
- **TypeScript** - Type safety for props, API responses, and navigation

### Navigation & Routing
- **React Navigation v6** - Stack and tab navigation with type-safe route params
- **@react-navigation/native-stack** - Native stack navigator for performance
- **@react-navigation/bottom-tabs** - Tab navigation (future feature)

### State Management & Persistence
- **React Context API** - Global authentication state management
- **@react-native-async-storage/async-storage** - Local data persistence
- **React Hooks** - useState, useEffect, useMemo, useCallback for local state

### HTTP Client
- **Axios** - REST API calls with environment-based configuration

### UI Components & Libraries
- **react-native-reanimated-carousel** - Menu item carousel with flip animations
- **react-native-collapsible** - Expandable menu sections
- **react-native-maps** - Google Maps integration for restaurant locations
- **react-native-vector-icons** - Material Community Icons for UI

### Geolocation & Device APIs
- **expo-location** - User location permissions and coordinates
- **expo-navigation-bar** - Android navigation bar customization
- **expo-secure-store** - Secure token storage
- **expo-status-bar** - Status bar styling

### Animations
- **react-native-reanimated** - High-performance animations (60 FPS)
- **React Native Animated API** - Card flip animations for barcode reveal

### Build & Deployment
- **EAS (Expo Application Services)** - Cloud build service for APK/AAB generation
- **Android Gradle** - Native Android build configuration

---

## System Architecture

### Design Rationale

This architecture was built to support **weekly restaurant rotation**, **real-time data synchronization with the dashboard**, and **offline-friendly persistence** for a consumer-facing mobile app.

**Key Design Decisions:**

1. **Decoupled Mobile/Dashboard (Shared Backend)**
   - **Why:** Mobile app and dashboard need access to the same data (restaurants, menus, discounts); separating frontends allows independent deployment
   - **Usage:** Admin updates menu in dashboard → Writes to MongoDB → Mobile app queries same collection → Users see changes immediately on next fetch

2. **Context API for Auth State (No Redux)**
   - **Why:** Authentication is the only truly global state; Context API is lighter than Redux for a single slice of state
   - **Usage:** Login → Store user object + token in Context → Persist to AsyncStorage → All screens access via `useAuth()` hook

3. **AsyncStorage for Offline Persistence**
   - **Why:** Users expect to stay logged in across app restarts; tokens and pinned restaurants must persist locally
   - **Usage:** On login, save `{ token, user, pinnedRestaurants }` to AsyncStorage → On app launch, load from AsyncStorage → If exists, skip login screen

4. **Conditional Navigation Based on Auth State**
   - **Why:** Unauthorized users must not access restaurant screens; different UI trees for auth vs. main app
   - **Usage:** Root `App.tsx` checks `authState.authenticated` → If false, render `AuthNavigator` (Login, Register) → If true, render `AppNavigator` (Home, RestaurantDetails)

5. **Optimistic UI for Pin/Unpin**
   - **Why:** Immediate feedback feels more responsive; users shouldn't wait for server response to see pin icon change
   - **Usage:** Tap pin → Update local state instantly → Send API call in background → If fails, show alert (but keep UI as-is to avoid jarring flash)

6. **Memoized Filtering for Performance**
   - **Why:** Recalculating filtered/sorted restaurant lists on every render is wasteful; useMemo caches result
   - **Usage:** `useMemo` recomputes filtered list only when `selectedCategory` or `pinnedRestaurants` changes → Pinned restaurants always sorted to top

**Real-World Usage:**
- User registers → Receives 10 restaurants → Pins 2 favorites → Filters by "Asian" category → Taps restaurant card → Views menu → Swipes carousel to see discount items → Taps card to flip and reveal barcode → Shows barcode to cashier → Discount applied → Manager logs transaction in dashboard → User's pin persists to next week

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │  Mobile App  │   │  Admin Web   │   │ Manager Web  │     │
│  │  (React      │   │  Dashboard   │   │  Dashboard   │     │
│  │  Native +    │   │   (React)    │   │   (React)    │     │
│  │  Expo)       │   │              │   │              │     │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTPS (JWT Bearer Token)
┌────────────────────────────┼────────────────────────────────┐
│                  Backend API Server (Node.js)               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Express.js REST API                   │     │
│  │  • JWT Authentication  • Weekly Rotation Logic     │     │
│  │  • Pin Management      • Menu Queries              │     │
│  │  • User Registration   • Email Verification (OTP)  │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │ Mongoose ODM
                    ┌────────▼────────┐
                    │    MongoDB      │
                    │    Database     │
                    │                 │
                    │ Collections:    │
                    │ • users         │
                    │ • restaurants   │
                    │ • menus         │
                    │ • companies     │
                    │ • transactions  │
                    │ • rotations     │
                    └─────────────────┘
```

### Mobile App Architecture

```
app/
├── components/
│   ├── CustomButton.tsx          # Reusable styled button
│   └── RestaurantCard.tsx        # Card with logo, name, category, pin toggle
│
├── context/
│   ├── AuthContext.tsx           # Global auth state (login, register, logout, pinning)
│   └── FormValidation.tsx        # Input validation helpers
│
├── navigation/
│   ├── AppNavigator.tsx          # Main app stack (authenticated)
│   │                             #   → Home → RestaurantDetails
│   ├── AuthNavigator.tsx         # Auth stack (unauthenticated)
│   │                             #   → Login → Register → VerifyEmail
│   ├── MainNavigator.tsx         # Root navigator (unused - replaced by App.tsx)
│   └── DropdownMenu.tsx          # Dropdown component for future use
│
├── screens/
│   ├── Home.tsx                  # Main screen (renders RestaurantList)
│   ├── RestaurantList.tsx        # FlatList of 10 rotated restaurants
│   ├── RestaurantDetails.tsx     # Menu, barcode carousel, Google Maps button
│   │
│   ├── CategoriesList.tsx        # Horizontal category filter chips
│   ├── CategoryItem.tsx          # Individual category chip (icon + name)
│   │
│   ├── Login.tsx                 # Email + password form
│   ├── Register.tsx              # Sign-up form with invitation code
│   ├── VerifyEmail.tsx           # OTP input for email verification
│   ├── VerifyOTP.tsx             # Reusable OTP component
│   │
│   ├── ForgotPassword.tsx        # Password reset flow
│   ├── ForgotPasswordVerify.tsx  # OTP verification for password reset
│   │
│   ├── UserSettings.tsx          # Account settings (change password)
│   ├── UserData.tsx              # User profile display
│   │
│   ├── LoadingScreen.tsx         # Initial loading state with logo
│   └── MapModal.tsx              # Google Maps modal (not actively used)
│
android/                          # Native Android configuration
│   ├── app/
│   │   ├── build.gradle          # Gradle build config
│   │   ├── debug.keystore        # Debug signing key
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/bizmunch/
│   │       │   ├── MainActivity.kt
│   │       │   └── MainApplication.kt
│   │       └── res/              # App icons, splash screens
│   └── gradle/                   # Gradle wrapper
│
assets/                           # Static assets
│   ├── bizmunch-icon-white.png   # Logo
│   ├── icon.png                  # App icon
│   ├── splash.png                # Splash screen
│   └── Screenshot_*.jpg          # App screenshots
│
App.tsx                           # Root component
│                                 #   → Renders AuthNavigator or AppNavigator
│                                 #     based on authState.authenticated
│
index.tsx                         # Entry point
│                                 #   → Registers root component with Expo
│
eas.json                          # EAS Build configuration
tsconfig.json                     # TypeScript config
babel.config.js                   # Babel config for Expo
metro.config.js                   # Metro bundler config
```

### Data Flow

1. **Authentication Flow**
   ```
   Register Form → Axios POST /users/register → Backend Creates User → 
   Email OTP Sent → User Enters OTP → Axios POST /users/verify → 
   Backend Validates → Login Form → Axios POST /users/auth → 
   JWT Token Generated → AuthContext Updates State → 
   AsyncStorage Saves { token, user, pinnedRestaurants } → 
   App.tsx Detects authState.authenticated = true → 
   Switches to AppNavigator → Home Screen Renders
   ```

2. **Restaurant Rotation Flow**
   ```
   User Opens App → Home Screen Mounts → 
   useEffect Triggers → Axios GET /users/rotated-restaurants/:userId → 
   Backend Queries MongoDB (checks user's last rotation date) → 
   If Monday passed since last rotation: Random 10 restaurants + 2 pinned → 
   Returns Restaurant Array → RestaurantList Updates State → 
   FlatList Renders Cards → Pinned Restaurants Sorted to Top
   ```

3. **Pin/Unpin Flow**
   ```
   User Taps Pin Icon → togglePin(restaurantId) Called → 
   Optimistic Update: Add/Remove from pinnedRestaurants Array → 
   Update Local State Immediately → 
   AsyncStorage Update → 
   Background: Axios POST /users/update-favorites { userId, restaurantIds } → 
   Backend Updates User Document in MongoDB → 
   If Error: Show Alert (Keep UI As-Is) → 
   Next Week: Pinned Restaurants Included in Rotation
   ```

4. **Menu Fetching Flow**
   ```
   User Taps Restaurant Card → Navigate to RestaurantDetails → 
   Screen Mounts → useEffect Triggers → 
   Axios GET /restaurant/:restaurantId/menu → 
   Backend Queries Menus Collection → 
   Returns Nested Object { Appetizers: {...}, Entrees: {...} } → 
   Frontend Transforms to Array [ { category: "Appetizers", items: [...] } ] → 
   Filters Items with Discount = true → 
   Carousel Displays Discounted Items → 
   Collapsible Sections Display Full Menu
   ```

5. **Barcode Display Flow**
   ```
   RestaurantDetails Screen → Carousel Renders Discounted Menu Items → 
   Each Item Has { image, barcode, name, price } → 
   User Taps Card → flipToShowBarcode() → 
   Animated.timing Rotates Card 180° (interpolate: 0° → 180°) → 
   Front (image) Hidden → Back (barcode) Visible → 
   User Shows Barcode to Staff → Staff Scans → 
   Discount Applied (Manager Logs in Dashboard)
   ```

### Key Design Patterns

- **Context Provider Pattern:** `AuthContext` wraps entire app, provides `useAuth()` hook
- **Conditional Navigation:** Root component switches between AuthNavigator/AppNavigator based on auth state
- **Optimistic UI:** Pin/unpin updates local state immediately, API call in background
- **Memoized Filtering:** `useMemo` caches filtered restaurant list until dependencies change
- **Component Composition:** Small components (RestaurantCard, CategoryItem, CustomButton) composed into screens
- **Loading State Management:** AsyncStorage loads on mount, blocks render until resolved

---

## Features

### User Features
- **Weekly Rotation:** 10 random restaurants every Monday at midnight
- **Pin Favorites:** Pin up to 2 restaurants to keep them in next week's rotation
- **Category Filtering:** Filter by Asian, Fastfood, Café, Grill, Vegetarian, Spicy, American, Pizza, Dessert
- **Restaurant Details:** View full menu, prices, calories, descriptions, photos
- **Barcode Redemption:** Tap-to-flip carousel reveals scannable barcodes for discounts
- **Google Maps Integration:** One-tap navigation to restaurant location
- **Persistent Login:** Stay logged in across app restarts with AsyncStorage
- **Email Verification:** OTP-based email verification during registration
- **Password Reset:** Forgot password flow with OTP verification

### Technical Features
- **Type-Safe Navigation:** TypeScript interfaces for route params prevent data mismatches
- **Dark Theme:** Consistent `#121212` background with `#b57602` accent color
- **Responsive Layouts:** Flexbox adapts to different screen sizes
- **Smooth Animations:** 60 FPS flip animation for barcode reveal
- **Offline Persistence:** Auth tokens and pinned restaurants cached locally
- **Real-Time Sync:** Menu changes in dashboard appear immediately on next fetch

---

## Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for Android) or Xcode (for iOS)
- Expo CLI: `npm install -g expo-cli`
- Backend API running (see backend repo)

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/bizmunch-app-site.git
cd bizmunch-app-site

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
API_URL=http://localhost:5000

# Start Expo development server
npm start

# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Or scan QR code with Expo Go app
```

### Running on Android

```bash
# Run on Android emulator or connected device
npm run android
```

### Running on iOS

```bash
# Run on iOS simulator (macOS only)
npm run ios
```

---

## Deployment

### EAS Build (Production)

This project uses Expo Application Services for building Android APKs and AABs.

**eas.json Configuration:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

**Build Steps:**
```bash
# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure

# Build Android APK for testing
eas build --platform android --profile preview

# Build Android AAB for Google Play Store
eas build --platform android --profile production

# Build iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

**Deployment Steps:**
1. Update version in `app.json` (`"version": "1.0.1"`)
2. Run EAS build for production profile
3. Download AAB file from EAS dashboard
4. Upload to Google Play Console
5. Submit for review

---

## API Integration

All API calls are made directly in screens and AuthContext using Axios. The base URL is configured via environment variables.

### Authentication Endpoints
```javascript
POST /users/register              // Register new user
// Body: { firstName, lastName, email, company, invitation, password }

POST /users/auth                  // Login
// Body: { email, password }
// Returns: { token, user, pinnedRestaurants }

POST /users/update-password       // Change password
// Body: { userId, email, currentPassword, newPassword }
```

### Restaurant Endpoints
```javascript
GET  /users/rotated-restaurants/:userId    // Get user's weekly 10 restaurants
// Returns: [ { _id, name, logo, category, location } ]

GET  /restaurant/:restaurantId/menu        // Get restaurant menu
// Returns: { menu: { Appetizers: {...}, Entrees: {...} } }

POST /users/update-favorites               // Update pinned restaurants
// Body: { userId, restaurantIds: ["id1", "id2"] }
```

### Request/Response Format

**Authentication Header:**
```javascript
Authorization: Bearer <JWT_TOKEN>
```

**Example Request (Get Rotated Restaurants):**
```javascript
GET /users/rotated-restaurants/60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response:**
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "Downtown Burgers",
    "logo": "https://backend.com/uploads/logo-123.png",
    "category": "Fastfood",
    "location": "123 Main St, City"
  },
  ...
]
```

## Screenshots

Here are some screenshots of the Biz MuncH mobile app in action:

**Images are placeholders and they don't represent real menu photo, nor does it match real price**

<div align="center">

### Restaurant List
<img src="assets/Screenshot_20251213-165113_Biz_MuncH.jpg" width="250" alt="Login Screen" />
<img src="assets/Screenshot_20251213-165119_Biz_MuncH.jpg" width="250" alt="Restaurant List" />
<img src="assets/Screenshot_20251213-165134_Biz_MuncH.jpg" width="250" alt="Restaurant List with Categories" />

### Restaurant Details
<img src="assets/Screenshot_20251213-165156_Biz_MuncH.jpg" width="250" alt="Restaurant Details - Menu Items" />
<img src="assets/Screenshot_20251213-165201_Biz_MuncH.jpg" width="250" alt="Restaurant Details - Barcode Display" />

### Menu & Item Details
<img src="assets/Screenshot_20251213-165210_Biz_MuncH.jpg" width="250" alt="Menu Sections" />
<img src="assets/Screenshot_20251213-165219_Biz_MuncH.jpg" width="250" alt="Item Detail Modal" />

### Settings
<img src="assets/Screenshot_20251213-165225_Biz_MuncH.jpg" width="250" alt="Additional Features" />

</div>

---

## License

MIT License - See LICENSE file for details

---

**Note:** This is the mobile app frontend only. The backend API and admin dashboard are in separate repositories.
