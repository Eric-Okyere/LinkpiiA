import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Same OAuth clients the backend already has in LinkpiiBackend's .env
// (GOOGLE_CLIENT_ID / GOOGLE_IOS_CLIENT_ID) and verifies Google ID tokens
// against (controllers/user.js -> googleSignIn). webClientId is what makes
// the native SDK actually return an idToken (not just an access token) -
// Google always sets that token's "aud" claim to the webClientId, never
// to an Android/iOS client ID, so this is the one value that has to match
// the backend exactly.
const WEB_CLIENT_ID =
  '450195054535-tbf14l0n9dhvjon1ili187agq5bcf89k.apps.googleusercontent.com';
const IOS_CLIENT_ID =
  '450195054535-j1v4j3vcg8rtl0oek01n1g7nkto7c7vc.apps.googleusercontent.com';

let configured = false;

/**
 * Configures the native Google Sign-In SDK. Safe to call more than once -
 * only actually configures on the first call. Call this once on app start
 * (see App.js), before any screen renders a "Sign in with Google" button.
 */
export function configureGoogleSignIn() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}
