// app/cgu/page.tsx
import Link from "next/link";

export default function CGUPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Conditions Générales d’Utilisation
      </h1>
      <p className="text-sm text-gray-500">
        Dernière mise à jour : 26 août 2025
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">1. Objet</h2>
        <p>
          Calorice est une application qui aide à estimer les besoins
          caloriques, consigner les repas et suivre ses objectifs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">
          2. Compte et exactitude des données
        </h2>
        <p>
          Vous êtes responsable des informations saisies dans l’application. Les
          estimations (BMR, TDEE, etc.) sont fournies à titre indicatif et ne
          constituent pas un avis médical.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">3. Utilisation acceptable</h2>
        <p>
          N’utilisez pas Calorice d’une manière illégale, pour nuire au service
          ou pour tenter d’accéder à des données d’autres utilisateurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">4. Disponibilité et évolutions</h2>
        <p>
          Le service peut évoluer ou être momentanément indisponible pour des
          raisons techniques. Nous faisons des efforts raisonnables pour assurer
          sa disponibilité.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">5. Limitation de responsabilité</h2>
        <p>
          Calorice n’est pas responsable des conséquences liées à l’utilisation
          des estimations fournies. Pour tout conseil nutritionnel ou médical,
          consultez un professionnel de santé.
        </p>
      </section>

      <div>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Revenir à l’accueil
        </Link>
      </div>
    </main>
  );
}
