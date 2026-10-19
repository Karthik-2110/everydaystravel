import type { Metadata } from "next";
import { headers } from "next/headers";
import StaffLogin from "./StaffLogin";
import { currentStaff } from "@/app/lib/crm/auth";
import {
  hostedStorage,
  firebaseConfigured,
} from "@/app/lib/crm/firebase-admin";
import CrmWorkspace from "./CrmWorkspace";
import "./crm.css";

export const metadata: Metadata = {
  title: "CRM | Everydays Travel",
  description: "Everydays Travel team workspace",
  robots: { index: false, follow: false },
  alternates: { canonical: "/crm" },
};
export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (hostedStorage()) {
    const staff = await currentStaff();
    if (!staff) return <StaffLogin configured={firebaseConfigured()} />;
  } else {
    const host = (await headers()).get("host") || "";
    if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host))
      return <StaffLogin configured={false} />;
  }
  const params = await searchParams;
  const initialView = [
    "calendar",
    "pipeline",
    "inbox",
    "followups",
    "integrations",
  ].includes(String(params.view))
    ? (params.view as
        "pipeline" | "inbox" | "followups" | "integrations" | "calendar")
    : "pipeline";
  return (
    <CrmWorkspace
      hosted={hostedStorage()}
      initialView={initialView}
      initialError={typeof params.error === "string" ? params.error : ""}
      initialConnected={params.connected === "1"}
    />
  );
}
