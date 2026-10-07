# Plan : faire adopter le site par Bambouno Pizza

Objectif : que le restaurant utilise et paie ma solution.
Contexte : ils sont en Martinique, je suis en France hexagonale, tout se fait à distance.

---

## Étape 0 : Préparer le terrain (avant tout contact)

**À faire**
- [ ] Mettre le site en ligne sur une adresse provisoire.
- [ ] Mettre le site sur Netlify (adresse `.netlify.app`) avec `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Tester une commande de bout en bout.
- [ ] Faire valider **chaque prix et chaque composition** (liste « À confirmer » du README) et la **gamme des boissons**. Un prix faux = perte de confiance immédiate. Cette validation se fait **avec le restaurant, après le premier message** : dans le message, présenter le site comme une démo dont la carte est à confirmer ensemble, et passer la carte en revue au début de l'appel, avant de parler d'offre.
- [x] Ajouter un **suivi d'audience sans cookies** et un suivi des **clics sur « Commander sur WhatsApp »**. Fait : Umami Cloud (offre Hobby, gratuite : 100 000 événements/mois, 1 site, 6 mois de données). Événements : `whatsapp-click` (commande envoyée) et `whatsapp-closed` (tentative hors horaires). Variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID` à définir sur l'hébergeur. À présenter comme « demandes envoyées », pas « commandes confirmées » : les bloqueurs de pub sous-comptent un peu.
- [ ] Faire une **vidéo d'écran de 30 à 60 secondes** : commande passée sur le site, puis message reçu sur WhatsApp.

**Pas avant l'accord du restaurant** : le **domaine définitif** (IONOS ~1,20 €/an en promo, vérifier le renouvellement) et le **QR code**. Un QR code est imprimé, son adresse ne doit donc plus changer : il pointe vers le domaine, jamais vers `.netlify.app`. Le premier message part avec le lien `.netlify.app` et la vidéo, sans QR code.

**Pourquoi** : à distance, je n'ai qu'une chance de faire bonne impression. Le site et la vidéo doivent marcher avant le premier message.

**Hébergement** : décidé, **Netlify**. Vercel Hobby est exclu : ses conditions réservent ce plan à un usage « personal or non-commercial ». Netlify Free autorise l'usage commercial (d'après leur forum, à relire dans leurs conditions). Attention aux **300 crédits/mois** : un déploiement coûte 15 crédits, et à épuisement tous les sites de l'équipe sont **mis en pause**. Pendant l'essai, regrouper les modifications avant de pousser. Passer à **Personal (9 $/mois, 1 000 crédits)** dès que le restaurant est client payant.

---

## Étape 1 : Premier contact (WhatsApp)

Numéro du restaurant : +596 696 44 41 22 (le même que pour les commandes).

**Message court** (à adapter) :
> Bonjour, je suis développeur web. J'ai créé gratuitement un site pour Bambouno Pizza : vos clients voient la carte, choisissent leurs pizzas, et la commande arrive directement sur ce WhatsApp, déjà écrite et rangée. Voici le lien, vous pouvez tester depuis votre téléphone : [lien]. C'est une démo : les prix et les compositions sont à confirmer avec vous. Je peux vous montrer en 10 minutes par téléphone, quand ça vous arrange.

**À joindre** : le lien + la vidéo d'écran.

**Règles**
- Décalage horaire : 5 à 6 h de moins en Martinique. Écrire en **fin de matinée ou début d'après-midi chez eux**, jamais pendant le service (soir).
- Pas de long pitch. Un lien, une vidéo, une proposition d'appel.
- Sans réponse : relancer **une fois** après 3 à 4 jours, pas plus.

---

## Étape 2 : L'appel / la visio

**Commencer par des questions**, pas par la démo (puis passer la carte en revue : prix, compositions, boissons) :
- Combien d'appels et de messages un samedi soir ?
- Des erreurs de commande ? Des clients qui n'arrivent pas à vous joindre ?
- Comment les clients connaissent votre carte aujourd'hui ?

**Puis montrer** : faire passer une vraie commande devant eux et la voir arriver sur leur WhatsApp. C'est le moment qui convainc.

**Bénéfices à mettre en avant** (pas la technique) :
- Moins d'appels pendant le rush, commandes écrites donc moins d'erreurs.
- Carte visible sur Google (« pizza Gros-Morne »).
- Rien ne change dans leur façon de travailler : tout arrive sur WhatsApp.

---

## Étape 3 : L'offre

### Formules

| Formule | Création | Ensuite |
|---|---|---|
| **A. Tout compris (recommandée)** | 300 à 500 € | 15 à 20 €/mois (hébergement, domaine, petites modifications) |
| **B. Sans abonnement** | 600 à 800 € | 0 €, chaque modification facturée 15 à 30 € |
| **C. Abonnement seul** | 0 € | 30 à 40 €/mois, engagement 12 mois |

Recommandation : **A + essai gratuit**. Ticket d'entrée faible pour eux, revenu régulier pour moi.

### Essai

- **2 mois d'essai gratuit** (un mois est trop court pour juger, l'habitude met du temps à s'installer).
- **Critère de réussite fixé à l'avance**, par exemple : « au moins 10 commandes par semaine via le site au bout de 6 semaines ».
- Si pas convaincus : je coupe le site, ils n'ont rien perdu.

### Ce que le restaurant s'engage à faire pendant l'essai

Sans cela l'essai ne prouve rien et finira à tort par « ça ne marche pas » :
- [ ] Mettre le lien sur la **fiche Google Business**.
- [ ] Afficher le **QR code** au comptoir et sur les boîtes.
- [ ] Dire aux clients au téléphone : « Vous pouvez commander directement sur notre site, c'est plus rapide. »
- [ ] Faire **un post** Facebook/Instagram avec le lien.
- [ ] Idée : une petite offre de lancement (boisson offerte pour une commande via le site).

---

## Étape 4 : Cadre administratif (avant toute facture)

- [ ] **Créer ma micro-entreprise** (gratuit : formalites.entreprise.gouv.fr). Sans statut, pas de facture légale.
- [ ] **France Travail, avant de créer le statut** (appeler le 3949 ou écrire via l'espace personnel, et garder une trace écrite). Questions à poser :
  - Dans ma situation (date de fin de contrat, droits restants), vaut-il mieux **cumuler ARE et revenus** ou demander l'**ARCE** ?
  - Cumul : complément d'ARE = ARE mensuelle − 70 % des revenus déclarés ; pour une fin de contrat depuis le 1er avril 2025, plafond de **60 % des droits restants**. Quel est mon chiffre à moi ? Demander une simulation.
  - Comment déclarer chaque mois (actualisation, même à 0 € de chiffre d'affaires) et quels justificatifs fournir ?
  - Déclarer l'activité **dès la création du statut**, même sans facture. Ne pas facturer avant d'avoir la réponse.
- [ ] **Si je trouve un CDI plus tard** : le cumul avec une micro-entreprise est légal, mais relire le contrat (clause d'exclusivité, non-concurrence), ne pas concurrencer l'employeur, ne pas utiliser son temps ni son matériel. Un CDI de développeur web peut entrer en concurrence avec cette activité : en parler à l'employeur avant de signer.
- [ ] **Devis signé par email** avant de commencer : ce qui est inclus, ce qui ne l'est pas, prix, durée de l'essai.
- [ ] **Domaine au nom du restaurant** (ou règle écrite sur ce qu'il devient si on arrête). Ça les rassure beaucoup.
- [ ] **Page de mentions légales** sur le site (éditeur = le restaurant, hébergeur, contact).
- [ ] **RGPD** : déjà bon (prénom stocké dans le navigateur uniquement, Google Maps chargé après un clic, audience sans cookies).
- [ ] **TVA** : en micro-entreprise sous le seuil de franchise en base, pas de TVA facturée. À vérifier au moment de créer le statut.
- [ ] **RC Pro** (responsabilité civile professionnelle) : pas obligatoire, à prendre dès le premier client payant (~100 €/an).
- [ ] Paiement par **virement**, facture envoyée par email : aucun déplacement nécessaire.

---

## Étape 5 : Lancement et suivi de l'essai

**Semaine 1**
- Brancher le domaine définitif, vérifier que tout marche.
- Les aider à faire les 4 actions de promotion (Google Business, QR code, phrase au téléphone, post).

**Semaines 2 à 8**
- Point rapide toutes les 2 semaines (message WhatsApp, 5 lignes) avec les **chiffres réels** : visites, clics « Commander sur WhatsApp ».
- Corriger tout de suite ce qui les gêne (prix, horaires, rupture).
- Demander leur retour : les commandes reçues sont-elles claires ?

**Repères réalistes** (ordres de grandeur, pas des mesures)
- Site en ligne sans rien faire : quasi aucune commande, même après un mois.
- Lien sur Google + réseaux : quelques commandes par semaine.
- Restaurant qui le pousse vraiment (QR code, téléphone) : premières commandes en quelques jours, une part visible des commandes au bout d'un mois, qui continue de grandir.

---

## Étape 6 : Transformer l'essai en contrat

À la fin de l'essai :
1. Envoyer un **bilan en chiffres** (visites, commandes envoyées, évolution).
2. Proposer de continuer avec la formule choisie.
3. Devis accepté, première facture, abonnement mis en place.

Si les chiffres sont faibles, regarder d'abord si le restaurant a fait sa part (étape 3) avant de conclure que le site ne marche pas. Prolonger l'essai d'un mois si besoin.

---

## Étape 7 : Phase 2, gestion autonome (après plusieurs mois)

Seulement quand la phase 1 est adoptée **et** que le besoin est prouvé.

**D'abord, pas de développement : modifications par WhatsApp.** Le restaurant écrit « plus de pizza X ce soir » ou « la 4 fromages passe à 13 € », je modifie `src/data/menu.ts` et je pousse (environ 2 minutes). Inclus dans l'abonnement. Pas d'outil à apprendre pour eux, et ils n'ont pas forcément d'ordinateur. Attention aux crédits Netlify : un déploiement coûte 15 crédits, regrouper les modifications quand c'est possible.

**Signal pour passer à la suite** : ils envoient des modifications toutes les semaines pendant l'essai. Sinon, ne rien construire.

**Ensuite : page d'admin pensée pour le téléphone** (liste des plats, bouton « indisponible ce soir », champ prix), protégée par un compte unique pour le personnel.

| Solution | Coût | Remarque |
|---|---|---|
| **Supabase Pro** + page admin | ~25 $/mois | Solution de référence : sauvegardes, pas de mise en pause, indispensable pour paiement et créneaux |
| Supabase gratuit | 0 € | À éviter pour un client : pause après une semaine sans activité, pas de sauvegardes |
| Base et stockage Netlify (plan Free) | 0 € | Pas encore évalué : à regarder à ce moment-là |
| Google Sheets, CMS (Sanity) | 0 € | Écartés : pas adaptés à un restaurant sans ordinateur |

- L'authentification du personnel n'est pas un obstacle : un compte unique (e-mail + mot de passe ou lien magique) se configure en une heure.
- Garder une **carte de secours** : si une modification est invalide (prix mal saisi), le site garde la dernière carte valide.
- `src/data/menu.ts` est déjà plat et sérialisable : il peut être remplacé par un `fetch` sans toucher aux composants.
- **Paiement en ligne** (Stripe, SumUp) : commission par transaction (~1,5 % + 0,25 €), sans abonnement.
- **Tarif phase 2** : devis à part (environ 400 à 1 000 € selon l'option) et abonnement relevé à environ 40 €/mois pour couvrir Supabase Pro.

---

## Récapitulatif des coûts

| Poste | Qui paie | Montant |
|---|---|---|
| Hébergement (Netlify) | Moi, inclus dans l'abonnement | 0 € pendant l'essai, puis 9 $/mois (Personal) |
| Statistiques (Umami Hobby) | Moi | 0 € (Pro 20 $/mois si 2e restaurant) |
| Domaine | Moi, inclus dans l'abonnement | ~1,20 € la 1re année chez IONOS, puis à vérifier |
| Micro-entreprise | Moi | 0 € (cotisations sur le chiffre d'affaires) |
| RC Pro | Moi | ~100 €/an |
| Phase 2 : Supabase Pro | Moi, répercuté dans l'abonnement | ~25 $/mois |

---

## Checklist résumée

1. [ ] Site en ligne sur Netlify, vidéo d'écran (audience + clics WhatsApp : fait)
2. [ ] Message WhatsApp envoyé avec le lien `.netlify.app` (une relance max)
3. [ ] Appel : questions, revue de la carte (prix, boissons), puis démo en direct
4. [ ] Offre : formule A, 2 mois d'essai, engagements du restaurant écrits
5. [ ] Après accord : appel France Travail, micro-entreprise, devis signé, mentions légales, domaine, puis QR code
6. [ ] Lancement : Google Business, QR code, post, phrase au téléphone
7. [ ] Points toutes les 2 semaines avec les chiffres
8. [ ] Bilan, devis, abonnement
9. [ ] Plus tard : phase 2 (gestion autonome)
