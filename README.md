# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Install native UI and development libraries
   ```bash
   npm expo install expo-dev-client react-native-reanimated react-native-gesture-handler react-native-redash
   ```
   - expo-dev-client: Creates custom development builds that work outside Expo Go
   - react-native-reanimated: Powers UI animations with native-thread performance
   - react-native-gesture-handler: Provides native touch handling for swipes, pans, and pinches
   - react-native-redash: A utility library that makes writing complex animations with react-native-reanimated much easier and cleaner.

   ```
   npx expo install @react-navigation/drawer
   ```
   - @react-navigation/drawer: A drawer navigator for React Navigation

   ```
   npm install zeego react-native-ios-context-menu react-native-ios-utilities @react-native-menu/menu
   ```
   - zeego: Cross-platform context menu library that provides a unified API for both iOS and Android
   - react-native-ios-context-menu: iOS-specific implementation of native context menus with preview functionality
   - react-native-ios-utilities: Helper functions for iOS-specific UI elements and interactions
   - @react-native-menu/menu: Native menu implementation for dropdown and popup menus across platforms

   ```
   npm expo install expo-build-properties
   ```
   - expo-build-properties: Allows customization of native build settings like iOS/Android versions, permissions and compiler options while remaining in Expo's development environment.


   ```
   npx expo install expo-blur expo-document-picker expo-image-picker
   ```
   - expo-blur: Creates vlur effect components (like frosted class effects) for creating modern translucent UI elements
   - expo-document-picker: Lets user select documents frm theri device for uploading/importing files like PDFs, spreadsheets, etc.
   - expo-image-picker: Provides access to the device's image and video library and camera for selecting or capturing media

   ```
   npx expo install @shopify/flash-list    
   ```
   - @shopify/flash-list: High-performance list component that renders thousands of items with near-native speed, optimnized for complex scrollign interfaces with minimal memory usage.

   ```
   npx expo install react-native-mmkv
   ```
   - react-native-mmkv: An ultra-fast encrypted key-value storage solution for react native applications (30x faster than AsyncStorage) that uses WeChat's MMKV C++ engine to securely store app data with minimal performance impact.

   ```
   npx expo install expo-media-library expo-file-system expo-sharing expo-clipboard
   ```
   - expo-media-library: Access and manage photos/videos in the device's media library
   - - Works on the device's media gallery (Photos app)
   - - Saves media visible to the user in their Photos app
   - - Requires media library permissions
   - - Used for photos that should appear in user's gallery
   to allow access add to plugins section of `app.json`
   ```
       "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "expo-secure-store",
      [
        "expo-media-library",
        {
          "photosPermission": "Allow ${PRODUCT_NAME} to access your photos.",
          "savePhotosPermission": "Allow ${PRODUCT_NAME} to save photos.",
          "isAccessMediaLibraryEnabled": true
        }
      ]
    ],
   ```
   for ios add to ios section in `app.json`
   ```
       "ios": {
         ...
         "infoPlist": {
            "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to save images."
         }
      }
   ```
   then run
   ```
   npx expo prebuild --clean
   npm run ios
   ```
   - expo-file-system: Read, write, and manage files with downloading capabilities and storage management
   - - Works with the app's private file storage
   - - Files are invisible to the user outside your app
   - - Uses the app's sandbox permissions
   - - Files are deleted when app is uninstalled
   - - Used for temporary files, app data, downloads
   - expo-sharing: Trigger share sheets to share content with another apps on the device
   - expo-clipboard: Copy and paste text between your app and other applications
   - - with out expo-clipboard, you need to write platform-specific native code to access the clipboard from your React Native app.

   ```
   npm install @likashefqet/react-native-image-zoom @gorhom/bottom-sheet@^4 react-native-root-toast react-native-root-siblings@^4.0.0
   ```
   - react-native-image-zoom: Provides interactive image viewing with pinch-to-zoom, pan gestures, and double-tap functionality for enhanced media viewing experiences
   - bottom-sheet: Highly customizable bottom sheet component with smooth animations, snap points, and gesture handling for modal-like interfaces from the bottom of the screen
   - react-native-root-toast: Non-blocking toast notification system that displays temporary messages similar to Android's native Toast, with customizable positioning and styling
   - react-native-root-siblings: Utility library that enables rendering components outside the main component tree, required for overlays like toasts and models to appear above all other UI elements


   ```
   npm install react-native-shimmer-placeholder --save
   npx expo install expo-linear-gradient
   ```
   - react-native-shimmer-placeholder: is a UI loading component that creates animated shimmer effects for content placeholders while data is loading.
   - expo-linear-gradient: A component that renders a gradient view which transitions smoothly between multiple colors, essential for creating modern UI elements with color blending effects.

   ```
   npx expo install expo-sqlite 
   ```
   - expo-sqlite: A SQLite database implementation tha provides persistent local storage for structured data through SQL queries, allowing apps to create, access and manage relational database tables directly on the device.

3. Prebuild native IOS and Androd folders
   ```bash
   npx expo prebuild
   ```

4. Start the app

   ```bash
    npx expo start
   ```

5. Starting app in IOS
   ```bash
    npm run ios
   ```

6. Reset project to clean state
   ```bash
    npm run reset-project
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Authentication
### Using Clerk
https://clerk.com/

Install the following packages
```bash
npm install @clerk/clerk-expo
```

```bash
npx expo install expo-secure-store
```

copy over the following key to .env file client side
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

the CLERK_SECRET_KEY is for the server side

# Routes

```
npx expo-router-sitemap
```

list routes in your project

# Auth Flow
The authflow in an expo project, is why user requests a screen, it
1. Attempt to navigate to `/`
2. Check if user is logged in (authenticated)
- - Yes: open `/`
- - No: redirect to `/login` 

eg;
```
app
├── (drawer)
│   └── (chat)
│       └── new.tsx
├── index.tsx
└── login.tsx
```

The logic for auth flow is in `/app/_layout.tsx`, because this file gets executed before any of the screens gets served.

An issue arises with the root layout files is that we can't currently use redirect in the layout file (will be supported in the future). Grouping folder is supported. 

Grouping folder is denoted by round bracket eg. `/(protected)`

Lets create a grouping folder for our protected routes
```
app
├── (protected)
│   ├── (drawer)
│   │   └── (chat)
│   │       └── new.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── _layout.tsx
├── index.tsx
└── login.tsx
```
The layout file in our protected group folder `/(protected)` is free to use redirects.

The content in the `/app` folder that is not in `/(protected)` can be accessed without being authenticated.

`/reactnativegpt/app/(protected)/(drawer)/(chat)/new.tsx` is the path of the new.tsx file. The route starts with the app folder, so the path before and including the app folder is not included in the route. 

Since Expo Router is a file-based routing system, every endpoint corresponds to a file.

The rules for URL base routing in Expo.
1. `index.tsx` is ignored so `app/index.tsx` -> `/`
2. The extensions are ignored eg.
`app/(api)/users.tsx` -> `/api/users`
3. Square brackets denotes dynamic routes eg.
`app/(api)/(users/[id].tsx)` -> `/api/users/123`
- - The parameter values replaces the bracket portion at runtime by redirection. eg. `router.push('/users/123')` 
- - The value can be accessed with `useLocalSearchParams()`
4. Round brackets denotes grouping folders and is between the app folder and the destination file, we can remove the bracket around them.
5. `_layout.tsx` does not define any routes. It defines navigation containers and screen presentation, not routes themselves. They control how screens are displayed and organize the navigation hierarchy for their directory.

`/(protected)/(drawer)/(chat)/new.tsx` -> `/protected/drawer/chat/new`


All the layout files starting with the root layout file in the app folder are loaded, and finally the screen is rendered. The root layout will always get rendered first, and it will return the first navigator, this will start off the navigation tree for your app. This is why you can't use redirects in your root layout, because if we return a redirect in your root layout instead of a navigator, the navigation tree won't exist because the other layout files in the subtree are not loaded yet.

In the Expo Router:
1. The root `_layout.tsx` is the entry point for your app's navigation tree.
2. It must return a navigator component (like `<Stack>`, `<Tabs>`, or `<Drawer>`) to establish the navigation infrastructure.
3. If you try to use redirects in the root layout (like `router.replace('/login')`), it breaks the navigation tree initialization because:
- - The redirect attempts to the navigate before the navigation tree exists
- - The navigator that would handle the redirect hasn't been created yet
- - The subtree layouts aren't loaded, so there's nowhere to redirect to

This is why:
- Put auth checking logic in the root layout.
- Use conditional state variables and `useEffect for redirection
- Place redirects in nested layout files (like inside `/(protected)/_layout.tsx`)
- Use the `segments` and auth state to conditionally render content

The root layout needs to establish the navigation foundation before redirects can work properly. This is a fundamental limitation of how navigation trees are constructed in React Navigation/Expo Router.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
