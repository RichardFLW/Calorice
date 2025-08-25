// app/auth/error/page.tsx
import Link from "next/link";

type Props = {
  searchParams: { error?: string };
};

const MESSAGES: Record<string, { title: string; detail: string }> = {
  // Email provider (lien expiré / déjà utilisé)
  Verification: {
    title: "Lien expiré ou déjà utilisé",
    detail:
      "Ton lien de connexion n’est plus valide. Demande un nouveau lien et essaie à nouveau.",
  },
  // Accès refusé par un callback (signIn/redirect), ou restriction
  AccessDenied: {
    title: "Accès refusé",
    detail:
      "Tu n’as pas les droits pour accéder à cette page. Réessaie ou contacte le support si besoin.",
  },
  // Problème de configuration serveur
  Configuration: {
    title: "Problème de configuration",
    detail:
      "Un souci côté configuration s’est produit. Réessaie plus tard, on s’en occupe.",
  },
  // Fourre-tout si on ne reconnaît pas l’erreur
  Default: {
    title: "Quelque chose s’est mal passé",
    detail:
      "Une erreur est survenue. Réessaie dans un instant ou retourne à l’accueil.",
  },
};

export default function AuthErrorPage({ searchParams }: Props) {
  const code = searchParams?.error ?? "Default";
  const { title, detail } = MESSAGES[code] ?? MESSAGES.Default;

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-semibold">🔒 {title}</h1>
        <p className="text-sm text-gray-600">{detail}</p>

        {/* Actions utiles */}
        <div className="pt-2 space-x-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
          >
            Revenir à l’accueil
          </Link>
        </div>

        {/* Aide dev: affiche le code d’erreur si utile au support */}
        <p className="mt-4 text-xs text-gray-400">
          Code: <code>{code}</code>
        </p>
      </div>
    </main>
  );
}
