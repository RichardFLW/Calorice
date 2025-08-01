// app/loading.tsx
"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingPage() {
  return (
    <div className={cn("flex h-screen items-center justify-center")}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
