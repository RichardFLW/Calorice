// app/page.tsx
"use client";

import { useCounterStore } from "@/store/counter-store";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Compteur : {count}</h1>
      <div className="flex gap-2">
        <Button onClick={increment}>+1</Button>
        <Button onClick={decrement}>-1</Button>
        <Button onClick={reset} variant="outline">
          Reset
        </Button>
      </div>
    </main>
  );
}
