"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
export default function ImportRecords() {
  const [data, setData] = useState<unknown>(null);
  const [summary, setSummary] = useState<{
    enquiries: number;
    vehicles: number;
    bookings: number;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(confirm: boolean, payload: unknown = data) {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/crm/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm, data: payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (confirm) {
        setMessage(result.notice);
        setSummary(null);
        setData(null);
      } else setSummary(result.summary);
    } catch (e) {
      setMessage((e as Error).message);
      setSummary(null);
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="space-y-4 border-t pt-6">
      <div className="space-y-1">
        <h2 className="font-semibold">Import existing records</h2>
        <p className="text-sm text-muted-foreground">
          Preview an export from your Mac. Imports only work in an empty
          workspace and don’t include inbox messages or Google credentials.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="crm-import">CRM export file</Label>
        <Input
          id="crm-import"
          type="file"
          accept="application/json,.json"
          disabled={pending}
          onChange={async (e) => {
            setSummary(null);
            setData(null);
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 4000000) {
              setMessage("Choose a file smaller than 4 MB");
              return;
            }
            try {
              const payload = JSON.parse(await file.text());
              setData(payload);
              await submit(false, payload);
            } catch {
              setMessage("Could not read this export file");
            }
          }}
        />
      </div>
      {summary && (
        <div className="space-y-3">
          <p className="text-sm">
            Ready to import {summary.enquiries} enquiries, {summary.vehicles}{" "}
            vehicles and {summary.bookings} bookings.
          </p>
          <Button disabled={pending} onClick={() => void submit(true)}>
            Confirm import
          </Button>
        </div>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </section>
  );
}
