// app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("❌ Une erreur est survenue :", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Oups, une erreur est survenue</h2>
      <p className="text-muted-foreground mb-6">
        Quelque chose n’a pas fonctionné comme prévu. Essaie de recharger la
        page.
      </p>
      <Button onClick={() => reset()}>Recharger</Button>
    </div>
  );
}
