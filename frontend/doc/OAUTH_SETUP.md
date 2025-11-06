# Google OAuth Setup Instructions

## To restore proper authentication later:

1. **Revert AuthContext.tsx:**
   ```tsx
   const [user, setUser] = useState<User | null>(null);  // Change back to null
   ```

2. **Create Google OAuth App:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized domains

3. **Create .env file in frontend:**
   ```
   REACT_APP_CLIENT_ID=your_google_client_id_here
   ```

4. **Set backend environment variable:**
   ```
   GS_AUTH_JSON=your_google_oauth_json_config
   ```

## Current Test Setup
- User is automatically logged in as "test@example.com"
- All course features should work normally
- No Google OAuth required for testing