import type { Metadata } from "next";
import { headers } from "next/headers";
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
  const host = (await headers()).get("host") || "";
  if (
    process.env.NODE_ENV === "production" ||
    !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)
  ) {
    return (
      <main className="crm-unavailable min-h-screen space-y-4 p-12">
        <h1>CRM workspace</h1>
        <p>
          This first version runs locally. Open the development server on your
          Mac to use it.
        </p>
      </main>
    );
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
      initialView={initialView}
      initialError={typeof params.error === "string" ? params.error : ""}
      initialConnected={params.connected === "1"}
    />
  );
}
