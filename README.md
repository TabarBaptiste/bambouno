# Bambouno Pizza - site vitrine

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
| Lint, types, tests unitaires, build | ESLint (`next/core-web-vitals` + `jsx-a11y` strict), TypeScript, Vitest (horaires, panier, message WhatsApp, recherche, intégrité de `menu.ts`), `next build` |
| E2E | Playwright sur mobile (Pixel 7) et desktop : audit **axe WCAG 2.2 AA** (accueil, barre et panneau du panier, recherche, 404), parcours de commande au clavier jusqu'à WhatsApp, prénom obligatoire, persistance du panier, absence de défilement horizontal de 320 à 1280 px, espacement du texte (WCAG 1.4.12), zoom 400 % |
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
- Panier dans un `<dialog>` natif modal : focus piégé, Échap pour fermer, focus
  rendu au bouton « Voir le panier ». Prénom manquant signalé par un message
  relié au champ (`aria-invalid` + `aria-describedby`).
- Pictos d'étiquettes nommés (`role="img"` + `<title>`) : l'information
  n'est pas portée par l'image seule.
- Liens WhatsApp/itinéraire signalés « nouvel onglet », bouton d'appel nommé
  même en icône seule, créole balisé `lang="gcf"`.
- Cibles tactiles de 40 px minimum, champ de recherche en 16 px sur mobile
  (pas de zoom automatique iOS), recherche insensible aux accents.
- Écrans très bas (paysage, zoom 400 %) : le header et les filtres cessent
  d'être collants pour laisser la place au contenu (WCAG 1.4.10).

## Ce que fait le site

- **Carte structurée en données** (`src/data/menu.ts`), pas en images : lisible,
  indexable par Google, et modifiable sans retoucher un visuel.
- **Rubriques en cartes** deux par deux en tête de carte, pour sauter
  directement aux crêpes ou aux boissons.
- **Lignes de plats** : vignette à gauche, nom + pictos (végétarien, mer,
  épicé) + prix + ingrédients, et sous le texte le bouton « + », fixe à
  droite pour pouvoir taper vite ; « − » et quantité apparaissent à sa gauche.
- **Menu burger** dans le header : la carte, les horaires, l'adresse.
- **Recherche dans le header** (loupe à côté du burger) : le champ prend la
  place de la ligne du header et filtre la carte directement, insensible aux
  accents. Ouvrir la recherche remonte en haut de page et masque tout sauf la
  carte (`html[data-recherche]`) : le header est à sa place naturelle, rien à
  faire défiler quand le clavier s'ouvre sur iPhone. « Fermer » vide la
  recherche et rend la page à l'endroit où on lisait ; valider ou ranger le
  clavier avec un champ vide referme aussi. Pas de `scroll-padding-top` sur la
  page (le navigateur remontait la page à chaque lettre pour « dégager » le
  champ du header) : la marge est un `scroll-margin` sur le contenu.
- **Barre de rubriques collée** sous le header pendant toute la carte : la
  puce de la rubrique à l'écran est mise en avant et se recentre toute seule,
  pour changer de rubrique sans remonter (`src/components/CategoryBar.tsx`).
- **Commande en deux temps** : la barre basse « Voir le panier » ouvre le
  panier, où l'on ajuste les quantités et donne son **prénom** (obligatoire),
  puis « Commander sur WhatsApp » ouvre le message déjà rempli, sans les
  prix : le restaurant confirme le montant (`src/lib/order.ts`). Liste à plat
  dans l'ordre de la carte (quel que soit l'ordre des ajouts), chaque plat
  précédé de son type (« Pizza sucrée À la banane », « Crêpe sucrée
  Nutella ») : `orderLabel` de chaque rubrique dans `src/data/menu.ts`. Pas
  d'envoi accidentel. Panier et prénom survivent à un rechargement.
- **Statut ouvert/fermé en temps réel**, calculé dans le fuseau de la Martinique
  et non celui du visiteur (`src/lib/hours.ts`). Libellé minimal : « Ouvert »
  (plus « ferme à 22h » dans la dernière heure) ou « Fermé • Ouvre à 17h30 »,
  avec le jour quand ce n'est pas aujourd'hui (« Fermé • Ouvre lundi à
  17h30 »).
- **Plan Google Maps** chargé au toucher (« Afficher le plan ») : l'intégration
  dépose des cookies Google, ce qui demande le consentement du visiteur en
  France, et pèse près d'1 Mo. Le bouton « Itinéraire » ouvre la fiche Google
  Maps de l'établissement.
- **SEO local** : métadonnées, mots-clés « pizza Gros-Morne », et balisage
  schema.org `Restaurant` + `Menu` avec les prix (`src/components/JsonLd.tsx`).
- **Mobile-first strict**, dark-only (c'est l'identité de la marque), zoom non
  bridé, navigation clavier avec anneau de focus visible (voir
  [Accessibilité](#accessibilité)).

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
Aucune image stock générique : tant qu'on n'a pas de photos du client, chaque
plat affiche l'illustration stylisée de sa rubrique
(`src/components/DishIllustration.tsx`). Pour ajouter une photo : la déposer
dans `public/menu/` (carrée, 400 px suffisent) et renseigner
`image: "/menu/nom.jpg"` sur le plat dans `src/data/menu.ts`.

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
(Sanity / Payload) devient utile pour que le client change ses prix lui-même -
`src/data/menu.ts` est volontairement plat et sérialisable pour être remplacé
par un `fetch` sans toucher aux composants.
