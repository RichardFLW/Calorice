// app/confidentialite/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Politique de confidentialité</h1>
      <p className="text-sm text-gray-500">
        Dernière mise à jour : 26 août 2025
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Données que nous collectons</h2>
        <p>
          Lorsque vous utilisez Calorice, nous pouvons collecter et stocker :
        </p>
        <ul className="list-inside list-disc text-sm text-gray-700">
          <li>
            Votre adresse e-mail (pour la connexion et la gestion du compte)
          </li>
          <li>Âge, poids, taille, sexe biologique</li>
          <li>
            Niveau d’activité et objectif (perte, maintien, prise de poids,
            recomposition)
          </li>
          <li>Journal alimentaire (aliments ajoutés, quantités, dates)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Finalité de la collecte</h2>
        <p>
          Ces informations servent à calculer votre métabolisme de base (BMR),
          estimer vos besoins caloriques de maintien (TDEE) et déterminer un
          apport cible en fonction de votre objectif. Elles permettent aussi de
          tenir votre journal quotidien et d’afficher vos totaux.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Stockage et partage</h2>
        <p>
          Les données sont stockées de manière sécurisée. Nous ne vendons pas
          vos données et ne les partageons pas à des fins commerciales. Des
          prestataires techniques strictement nécessaires (ex. hébergement,
          envoi d’e-mails) peuvent traiter certaines données pour notre compte,
          conformément à nos instructions et avec un niveau de sécurité adapté.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Vos choix</h2>
        <p className="text-sm text-gray-700">
          Vous pouvez corriger ou supprimer vos informations de profil depuis
          l’application. Vous pouvez également demander la suppression de votre
          compte et de vos données.
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
