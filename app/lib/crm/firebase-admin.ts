import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
export function hostedStorage() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.CRM_STORAGE === "firestore"
  );
}
export function firebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
  );
}
function adminApp() {
  if (!firebaseConfigured())
    throw new Error("Firebase server configuration is incomplete");
  return (
    getApps().find((a) => a.name === "crm") ||
    initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      },
      "crm",
    )
  );
}
export const staffAuth = () => getAuth(adminApp());
export const crmDatabase = () => getFirestore(adminApp());
export function publicFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
  };
  if (!config.apiKey || !config.authDomain || !config.projectId)
    throw new Error("Firebase sign-in configuration is incomplete");
  return config as { apiKey: string; authDomain: string; projectId: string };
}
