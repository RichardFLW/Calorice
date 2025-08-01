// app/eau/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EauPage() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hydratation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Suis ta consommation d’eau quotidienne ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
