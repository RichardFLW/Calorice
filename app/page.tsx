// app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Kalorice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Test du thème clair / sombre avec shadcn/ui.
          </p>
          <ModeToggle />
        </CardContent>
      </Card>
    </main>
  );
}
