"use client";
import Link from "next/link";
import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
export default function StaffLogin({ configured }: { configured: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function login() {
    setPending(true);
    setError("");
    let auth: ReturnType<typeof getAuth> | undefined;
    try {
      const setup = await fetch("/api/crm/session", { cache: "no-store" });
      const { config, csrf, error: failure } = await setup.json();
      if (!setup.ok) throw new Error(failure);
      const app =
        getApps().find((a) => a.name === "crm-login") ||
        initializeApp(config, "crm-login");
      auth = getAuth(app);
      await setPersistence(auth, inMemoryPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(auth, provider);
      const response = await fetch("/api/crm/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-crm-csrf": csrf },
        body: JSON.stringify({ idToken: await credential.user.getIdToken() }),
      });
      if (!response.ok) throw new Error((await response.json()).error);
      await signOut(auth);
      window.location.replace("/crm");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Sign-in failed. Please try again.",
      );
    } finally {
      if (auth) await signOut(auth).catch(() => {});
      setPending(false);
    }
  }
  return (
    <main className="crm-theme flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="text-3xl font-semibold tracking-tight">
          everydays.
        </Link>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to the CRM
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your pipeline, shared inbox and booking calendar in one place.
          </p>
        </div>
        {!configured && (
          <Alert>
            <AlertDescription>
              Online sign-in is being configured. Please contact the workspace
              administrator.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          className="w-full"
          disabled={!configured || pending}
          onClick={() => void login()}
        >
          {pending ? "Signing in…" : "Continue with Google"}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Any verified Google account can access this shared workspace.
        </p>
      </div>
    </main>
  );
}
