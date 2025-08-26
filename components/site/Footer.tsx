// components/site/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:justify-between">
        <div>© {year} Calorice</div>
        <nav className="flex items-center gap-4">
          <Link href="/cgu" className="hover:underline">
            Conditions Générales d’Utilisation
          </Link>
          <Link href="/confidentialite" className="hover:underline">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
