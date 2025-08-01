// app/aliments/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlimentsPage() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mes aliments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ajoute et gère tes aliments ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
