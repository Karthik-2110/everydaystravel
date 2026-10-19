import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <span className="hidden text-xs text-muted-foreground sm:block">
        Workspace /
      </span>
      <span className="text-xs font-medium">{title}</span>
      <Badge variant="outline" className="ml-auto text-[9px] tracking-widest">
        LOCAL
      </Badge>
    </header>
  );
}
