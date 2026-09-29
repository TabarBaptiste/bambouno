# Bambouno Pizza — site vitrine

Site vitrine + carte dynamique pour Bambouno Pizza (Gros-Morne, Martinique).
**Phase 1** : présenter la carte à jour et amener le client au bon canal de
commande en deux clics. Pas de réservation de table : l'établissement fait de
la vente à emporter uniquement, il n'y a rien à réserver.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production (statique)
npm run check      # lint + types + tests unitaires, à lancer avant de pousser
npm run test:e2e   # parcours, accessibilité et responsive (après npm run build)
```

Les tests E2E utilisent Playwright (`npx playwright install chromium` la
première fois). Pour réutiliser un Chromium déjà installé :
`CHROMIUM_PATH=/chemin/vers/chrome npm run test:e2e`.

## Qualité et CI

La CI GitHub Actions (`.github/workflows/ci.yml`) tourne sur chaque pull
request et chaque push sur `main` :

| Job | Ce qu'il bloque |
|---|---|
| Lint, types, tests unitaires, build | ESLint (`next/core-web-vitals` + `jsx-a11y` strict), TypeScript, Vitest (horaires, panier, recherche, intégrité de `menu.ts`), `next build` |
| E2E | Playwright sur mobile (Pixel 7) et desktop : audit **axe WCAG 2.2 AA** (accueil, panier ouvert, filtres, 404), parcours de commande au clavier, persistance du panier, absence de défilement horizontal de 320 à 1280 px, espacement du texte (WCAG 1.4.12), zoom 400 % |
| Audit | `npm audit` sur les dépendances de production, niveau *high* et plus |

Dependabot propose chaque semaine les mises à jour mineures et correctifs.

## Accessibilité

Visée : **WCAG 2.2 niveau AA**, vérifiée automatiquement en CI (axe) et par
des tests de parcours clavier.

- Lien d'évitement « Aller au contenu », landmarks nommés, un seul `h1` et
  une hiérarchie de titres continue (h2 carte > h3 catégorie > h4 plat).
- Contrastes AA : le rouge signature `#E63329` ne fait que 4,3:1 sous du
  texte blanc et 4,2:1 sur les cartes. Il reste utilisé pour les grands titres
  et les éléments décoratifs ; les boutons utilisent `red-cta` (`#D42D23`,
  5:1) et le petit texte rouge `red-text` (`#FF5A4F`, 5,9:1).
- Contours des champs et boutons à 3:1 minimum (`control`, WCAG 1.4.11).
- Le focus clavier n'est jamais perdu : « Ajouter » devient « + » sans
  changer de nœud, et retirer la dernière unité rend le focus au bouton
  d'ajout. Le header et la barre de filtres collants ne masquent pas
  l'élément focalisé (`scroll-padding`, WCAG 2.4.11).
- Ajouts/retraits au panier et nombre de résultats de recherche annoncés aux
  lecteurs d'écran (régions `role="status"`).
- Liens WhatsApp/itinéraire signalés « nouvel onglet », bouton d'appel nommé
  même en icône seule, créole balisé `lang="gcf"`.
- Cibles tactiles de 40 px minimum, champ de recherche en 16 px sur mobile
  (pas de zoom automatique iOS), recherche insensible aux accents.
- Écrans très bas (paysage, zoom 400 %) : le header et les filtres cessent
  d'être collants pour laisser la place au contenu (WCAG 1.4.10).

## Ce que fait le site

- **Carte structurée en données** (`src/data/menu.ts`), pas en images : lisible,
  indexable par Google, et modifiable sans retoucher un visuel.
- **Recherche et filtres** (Végé / Mer / Épicé / Sucré), cumulables.
- **Composition de commande + WhatsApp** : le client ajoute ses plats, la barre
  basse affiche le total, et le bouton ouvre WhatsApp avec le message déjà
  rempli (`src/lib/order.ts`). La sélection survit à un rechargement.
- **Statut ouvert/fermé en temps réel**, calculé dans le fuseau de la Martinique
  et non celui du visiteur (`src/lib/hours.ts`).
- **SEO local** : métadonnées, mots-clés « pizza Gros-Morne », et balisage
  schema.org `Restaurant` + `Menu` avec les prix (`src/components/JsonLd.tsx`).
- **Mobile-first strict**, dark-only (c'est l'identité de la marque), zoom non
  bridé, navigation clavier avec anneau de focus visible (voir
  [Accessibilité](#accessibilité)).
- **Sommaire de la carte** défilant sur mobile, pour atteindre directement les
  crêpes ou les boissons.

## Données de l'établissement

Relevées sur la fiche Google Business :

- **Téléphone / WhatsApp** : `+596 696 44 41 22`
- **Adresse** : Route nationale, 97213 Gros-Morne, Martinique (Plus code
  `PX7X+25`)
- **Coordonnées GPS** : `14.7126174, -61.0019799`, relevées sur place
- **Horaires** : lundi au vendredi 17h30–22h, samedi 17h30–**23h**,
  dimanche **fermé**

## À confirmer avec le client avant mise en ligne

- [ ] **Prix et compositions** : relus depuis les visuels de 2023, à faire
      valider un par un.
- [ ] **Boissons** : vérifier que la gamme n'a pas bougé depuis les visuels
      (marques et contenances changent souvent).

## À faire côté contenu

Le vrai différenciateur commercial, ce sont les **photos réelles des pizzas**.
Aucune image stock générique : tant qu'on n'a pas de photos du client, le site
assume le parti pris typographique (fond noir, titres rouges) plutôt que
d'afficher de fausses pizzas. Prévoir une séance photo.

## Charte graphique

| Rôle | Valeur |
|---|---|
| Fond | `#0A0A0A` |
| Surface / cartes | `#161616` |
| Rouge signature | `#E63329` |
| Rouge hover | `#B8241C` |
| Texte secondaire | `#A3A3A3` |
| Accent mangue | `#F5B841` |
| Accent vert | `#2E9E5B` |

Titres : **Anton** italique, majuscules, mot-clé en rouge, filet blanc 2px
dessous. Noms de plats : **Barlow Condensed** SemiBold majuscules rouge, filet
blanc 1px. Corps : **Inter**. Cartes en radius 12px, boutons en pilule avec
ombre rouge diffuse. Tokens définis dans `src/app/globals.css`.

## Déploiement

Build entièrement statique → **Vercel** (Hobby pour la démo, Pro si usage
commercial) ou Netlify. Domaine conseillé : `bambouno-pizza.fr` chez OVH.
Penser à ajouter le lien du site sur la fiche Google Business.

Définir **`NEXT_PUBLIC_SITE_URL`** (ex. `https://bambouno-pizza.fr`) en
production : elle sert au canonical, à l'aperçu Open Graph (image générée par
`src/app/opengraph-image.tsx`, affichée quand le lien est partagé sur
WhatsApp), au `sitemap.xml` et au `robots.txt`. Sur Vercel, le domaine de
production du projet est utilisé à défaut.

## Phase 2 (si la phase 1 convertit)

Click & collect avec créneaux de retrait et paiement en ligne : **Supabase**
(Postgres + Auth) et **Stripe** ou SumUp. C'est à ce moment-là qu'un CMS
(Sanity / Payload) devient utile pour que le client change ses prix lui-même —
`src/data/menu.ts` est volontairement plat et sérialisable pour être remplacé
par un `fetch` sans toucher aux composants.
