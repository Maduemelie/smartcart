# SmartCart App Structure

This document explains the folder structure of the SmartCart application.

## Directory Structure

```
app/
├── (auth)/                 # Authentication screens
│   ├── login.jsx           # Login screen
│   └── signup.jsx          # Signup screen
├── (tabs)/                 # Main application with tab navigation
│   ├── index.jsx           # Home screen
│   ├── list.jsx            # Lists overview
│   ├── malls.jsx           # Malls overview
│   ├── profile.jsx         # User profile
│   ├── compare.jsx         # Price comparison
│   ├── list/               # List related screens
│   │   ├── [id].jsx        # Individual list details
│   │   ├── history.jsx     # List history
│   │   └── newList.jsx     # Create new list
│   └── mall/               # Mall related screens
│       ├── [id].jsx        # Individual mall details
│       ├── edit.jsx        # Edit mall
│       └── new.jsx         # Create new mall
└── _layout.jsx             # Root layout and navigation configuration
```

## Structure Explanation

### (auth) Directory
Contains all screens related to user authentication:
- Login screen
- Signup screen

These screens are only accessible when a user is not authenticated.

### (tabs) Directory
Contains all screens that are part of the main application with tab navigation:
- Home screen (`index.jsx`)
- Lists overview (`list.jsx`)
- Malls overview (`malls.jsx`)
- Profile screen (`profile.jsx`)
- Compare screen (`compare.jsx`)

Also contains subdirectories for more complex features:
- `list/` - All list-related screens
- `mall/` - All mall-related screens

### _layout.jsx
The root layout file that configures the navigation structure and handles:
- Authentication state checking
- Rendering of appropriate screen groups based on authentication status
- Context providers for the application
- Initial app setup and data loading

## Navigation Flow

1. When a user opens the app:
   - If authenticated → Redirect to `(tabs)` group (main app with bottom tabs)
   - If not authenticated → Redirect to `(auth)` group (login/signup)

2. After successful authentication:
   - User is redirected to the home screen (`(tabs)/index.jsx`)
   - Bottom tab navigation becomes visible

3. Protected routes:
   - All routes in the `(tabs)` group are protected and require authentication
   - The bottom tab navigation is only visible for authenticated users