# Bambouno Pizza — site vitrine

Site vitrine + carte dynamique pour Bambouno Pizza (Gros-Morne, Martinique).
**Phase 1** : présenter la carte à jour et amener le client au bon canal de
commande en deux clics. Pas de réservation de table : l'établissement fait de
la vente à emporter uniquement, il n'y a rien à réserver.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (statique)
npm run typecheck
```

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
  bridé, navigation clavier avec anneau de focus visible.

## À confirmer avec le client avant mise en ligne

Ces valeurs sont des placeholders repris de la fiche Google et **doivent être
validées**. Elles sont marquées `TODO client` dans `src/data/site.ts` :

- [ ] **Numéro de téléphone / WhatsApp** exact (actuellement `0696 00 00 00`).
      Le numéro WhatsApp est au format international sans `+` ni espace.
- [ ] **Adresse précise** (actuellement « Bourg, 97213 Gros-Morne »).
- [ ] **Coordonnées GPS** à recaler sur l'adresse réelle.
- [ ] **Jour de fermeture** : le lundi est supposé fermé, à confirmer.
- [ ] **Prix et compositions** : relus depuis les visuels de 2023, à faire
      valider un par un.

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

## Phase 2 (si la phase 1 convertit)

Click & collect avec créneaux de retrait et paiement en ligne : **Supabase**
(Postgres + Auth) et **Stripe** ou SumUp. C'est à ce moment-là qu'un CMS
(Sanity / Payload) devient utile pour que le client change ses prix lui-même —
`src/data/menu.ts` est volontairement plat et sérialisable pour être remplacé
par un `fetch` sans toucher aux composants.
