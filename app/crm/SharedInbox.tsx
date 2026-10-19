"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, MessageCircle } from "lucide-react";
import type { ComponentProps } from "react";
import Mailbox from "./Mailbox";
import WhatsAppInbox from "./WhatsAppInbox";
export default function SharedInbox(props: ComponentProps<typeof Mailbox>) {
  return (
    <Tabs defaultValue="gmail" className="space-y-5">
      <TabsList>
        <TabsTrigger value="gmail">
          <Mail className="size-4" />
          Gmail
        </TabsTrigger>
        <TabsTrigger value="whatsapp">
          <MessageCircle className="size-4" />
          WhatsApp
        </TabsTrigger>
      </TabsList>
      <TabsContent value="gmail">
        <Mailbox {...props} />
      </TabsContent>
      <TabsContent value="whatsapp">
        <WhatsAppInbox {...props} />
      </TabsContent>
    </Tabs>
  );
}
