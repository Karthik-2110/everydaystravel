"use client";
import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({
  items,
  active,
  overdue,
  onNavigate,
  onCreate,
}: {
  items: { id: string; label: string; icon: LucideIcon }[];
  active: string;
  overdue: number;
  onNavigate: (id: string) => void;
  onCreate: () => void;
}) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="crm-theme">
      <SidebarHeader className="gap-7 px-4 pt-7 pb-4">
        <Link
          href="/crm"
          aria-label="Everydays Travel CRM"
          className="px-1 text-2xl font-semibold leading-tight tracking-tight"
        >
          everydays.
        </Link>
        <Button
          className="w-full justify-start"
          onClick={() => {
            setOpenMobile(false);
            onCreate();
          }}
        >
          <Plus />
          Quick capture
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu aria-label="CRM navigation">
              {items.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    isActive={active === id}
                    aria-current={active === id ? "page" : undefined}
                    onClick={() => {
                      onNavigate(id);
                      setOpenMobile(false);
                    }}
                    className="h-10 gap-3"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                  {id === "followups" && overdue > 0 && (
                    <SidebarMenuBadge>{overdue}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
