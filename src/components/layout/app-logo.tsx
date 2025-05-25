"use client";

import { Compass } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Compass className="text-primary w-7 h-7" />
      {state === "expanded" && (
        <h1 className="text-xl font-semibold text-foreground">HR Compass</h1>
      )}
    </div>
  );
}
