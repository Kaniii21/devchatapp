# Firebase Configuration Guide

## How to Fix the Firebase API Key Error

The error "auth/api-key-not-valid" occurs because the Firebase configuration is using placeholder values. Follow these steps to fix it:

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### Step 2: Get Your Firebase Configuration
1. In your Firebase project, click the gear icon (⚙️) → Project settings
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Register your app with a name (e.g., "DevChat")
5. Copy the Firebase configuration object

### Step 3: Create Environment File
Create a file named `.env.local` in your project root with the following content:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase configuration values.

### Step 4: Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - GitHub (if you want social login)

### Step 5: Restart Your Development Server
After creating the `.env.local` file, restart your development server:
```bash
npm run dev
```

### Example Firebase Configuration
Your Firebase config object will look something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "myproject-12345.firebaseapp.com",
  projectId: "myproject-12345",
  storageBucket: "myproject-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Security Note
- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Only use `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in the browser

### Troubleshooting
- Make sure your Firebase project has Authentication enabled
- Verify that the API key is correct and active
- Check that your domain is authorized in Firebase Console (for production)
- Ensure you're using the correct project ID
