import { GoogleAuth } from 'react-native-google-auth';

const WEB_CLIENT_ID =
  '450195054535-tbf14l0n9dhvjon1ili187agq5bcf89k.apps.googleusercontent.com';
const IOS_CLIENT_ID =
  '450195054535-j1v4j3vcg8rtl0oek01n1g7nkto7c7vc.apps.googleusercontent.com';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;

  GoogleAuth.configure({
    // Android uses the Web client ID (the Android OAuth client in Google
    // Cloud Console only registers the package name + SHA-1, it is never
    // passed here).
    androidClientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['email', 'profile'],
  });

  configured = true;
}
