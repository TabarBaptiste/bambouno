# Plan : faire adopter le site par Bambouno Pizza

Objectif : que le restaurant utilise et paie ma solution.
Contexte : ils sont en Martinique, je suis en France hexagonale, tout se fait à distance.

> **Mise à jour après leur réponse automatique** : « Nous ne prenons pas de commande par WhatsApp. Appelez-nous ! » Le restaurant travaille **par téléphone**. Le site ne remplace donc plus le téléphone : il **prépare la commande** (carte à jour, panier, liste claire) que le client **lit au téléphone**. Le bouton « Commander sur WhatsApp » est devenu « Appeler pour commander ». Conséquences : le pitch est plus modeste (appel plus court, moins d'erreurs), je ne vois plus les commandes (seulement les clics sur « Appeler »), et ce message était peut-être **automatique** : personne n'a forcément lu mon message ni vu le lien.

---

## Étape 0 : Préparer le terrain (avant tout contact)

**À faire**
- [x] Mettre le site en ligne sur une adresse provisoire.
- [x] Mettre le site sur Netlify (adresse `.netlify.app`) avec `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Tester une commande de bout en bout.
- [ ] Faire valider **chaque prix et chaque composition** (liste « À confirmer » du README) et la **gamme des boissons**. Un prix faux = perte de confiance immédiate. Cette validation se fait **avec le restaurant, après le premier message** : dans le message, présenter le site comme une démo dont la carte est à confirmer ensemble, et passer la carte en revue au début de l'appel, avant de parler d'offre.
- [x] Ajouter un **suivi d'audience sans cookies** et un suivi des **clics sur « Appeler pour commander »**. Fait : Umami Cloud (offre Hobby, gratuite : 100 000 événements/mois, 1 site, 6 mois de données). Événements : `call-click` (appel lancé depuis le panier) et `call-closed` (tentative hors horaires). Variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID` à définir sur l'hébergeur. À présenter comme « appels lancés », **pas** « commandes confirmées » (on ne sait pas si l'appel aboutit) et les bloqueurs de pub sous-comptent un peu.
- [ ] Faire une **vidéo d'écran de 30 à 60 secondes** : commande préparée sur le site, puis appel lancé avec la liste à l'écran.

**Pas avant l'accord du restaurant** : le **domaine définitif** (IONOS ~1,20 €/an en promo, vérifier le renouvellement) et le **QR code**. Un QR code est imprimé, son adresse ne doit donc plus changer : il pointe vers le domaine, jamais vers `.netlify.app`. Le premier message part avec le lien `.netlify.app` et la vidéo, sans QR code.

**Pourquoi** : à distance, je n'ai qu'une chance de faire bonne impression. Le site et la vidéo doivent marcher avant le premier message.

**Hébergement** : décidé, **Netlify**. Vercel Hobby est exclu : ses conditions réservent ce plan à un usage « personal or non-commercial ». Netlify Free autorise l'usage commercial (d'après leur forum, à relire dans leurs conditions). Attention aux **300 crédits/mois** : un déploiement coûte 15 crédits, et à épuisement tous les sites de l'équipe sont **mis en pause**. Pendant l'essai, regrouper les modifications avant de pousser. Passer à **Personal (9 $/mois, 1 000 crédits)** dès que le restaurant est client payant.

---

## Étape 1 : Premier contact

**Ne pas renvoyer de message WhatsApp** : ils ont écrit qu'ils n'y prennent pas de commande, et leur réponse semble automatique. Le premier contact devient un **appel**, en fin de matinée ou début d'après-midi chez eux, jamais pendant le service.

Numéro du restaurant : +596 696 44 41 22.

**Ce que je dis au téléphone** (à adapter, 30 secondes) :
> Bonjour, je suis développeur web. J'ai créé gratuitement un site pour Bambouno Pizza : vos clients voient la carte à jour, préparent leur commande, puis ils vous appellent et vous la lisent clairement. Ça raccourcit l'appel et ça évite les erreurs. Je peux vous envoyer le lien pour que vous regardiez quand vous avez deux minutes ? C'est une démo : les prix et les compositions sont à confirmer avec vous.

**Question à poser tout de suite** : « Comment préféreriez-vous recevoir les commandes préparées à l'avance ? » Leur réponse décide de la suite (téléphone seul, ou plus tard un autre canal).

**Le lien et la vidéo** : à envoyer **après** l'appel, s'ils sont d'accord, par le canal qu'ils indiquent (SMS, e-mail, ou WhatsApp pour un simple lien, pas pour des commandes).

**Règles**
- Décalage horaire : la Martinique est en UTC−4 toute l'année, la France hexagonale en UTC+1 l'hiver et UTC+2 l'été : **5 h de moins l'hiver, 6 h de moins l'été**. Appeler **avant 16 h chez eux** (ils ouvrent à 17h30), soit avant 22 h chez moi en heure d'été.
- Pas de long pitch : 30 secondes, une question, un lien à envoyer.
- Sans réponse : rappeler **une fois** quelques jours plus tard, pas plus. Un message écrit n'est lu que si c'est eux qui l'ont demandé.

---

## Étape 2 : L'appel / la visio

**Commencer par des questions**, pas par la démo (puis passer la carte en revue : prix, compositions, boissons) :
- Combien d'appels un samedi soir ? Combien durent trop longtemps à cause d'une commande mal dictée ?
- Des erreurs de commande ? Des clients qui n'arrivent pas à vous joindre ?
- Comment les clients connaissent votre carte aujourd'hui ?

**Puis montrer** (en visio, ou en envoyant la vidéo) : composer une commande de trois ou quatre plats, ouvrir le panier, et montrer la **liste prête à lire** à côté du bouton « Appeler ». Ce que je vends est un appel plus court et sans erreur, pas la fin du téléphone.

**Bénéfices à mettre en avant** (pas la technique) :
- Des appels plus courts pendant le rush : le client sait déjà ce qu'il veut et le lit.
- Moins d'erreurs de commande (la liste est écrite, dans l'ordre de la carte).
- Carte à jour visible sur Google (« pizza Gros-Morne »).
- Rien ne change dans leur façon de travailler : ils continuent de prendre les commandes au téléphone.

**Honnêteté sur la valeur** : le gain est plus faible qu'avec une commande par message. Ne pas promettre de gros volumes. Si ça ne les intéresse pas, s'arrêter là.

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
- **Critère de réussite fixé à l'avance**, mesurable, par exemple : « au moins 30 appels lancés depuis le panier par semaine au bout de 6 semaines » (chiffre à ajuster avec eux) (clics `call-click`, sous-comptés par les bloqueurs de pub) **et** un avis du restaurant : « les appels sont plus courts / il y a moins d'erreurs ». Les clics ne prouvent pas une commande : demander leur ressenti.
- Si pas convaincus : je coupe le site, ils n'ont rien perdu.

### Ce que le restaurant s'engage à faire pendant l'essai

Sans cela l'essai ne prouve rien et finira à tort par « ça ne marche pas » :
- [ ] Mettre le lien sur la **fiche Google Business**.
- [ ] Afficher le **QR code** au comptoir et sur les boîtes.
- [ ] Dire aux clients au téléphone : « Préparez votre commande sur notre site, puis rappelez-nous : c'est plus rapide. »
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
- [ ] **RGPD** : déjà bon (panier stocké dans le navigateur uniquement, aucun nom ni donnée personnelle demandés, Google Maps chargé après un clic, audience sans cookies).
- [ ] **TVA** : en micro-entreprise sous le seuil de franchise en base, pas de TVA facturée. À vérifier au moment de créer le statut.
- [ ] **RC Pro** (responsabilité civile professionnelle) : pas obligatoire, à prendre dès le premier client payant (~100 €/an).
- [ ] Paiement par **virement**, facture envoyée par email : aucun déplacement nécessaire.

---

## Étape 5 : Lancement et suivi de l'essai

**Semaine 1**
- Brancher le domaine définitif, vérifier que tout marche.
- Les aider à faire les 4 actions de promotion (Google Business, QR code, phrase au téléphone, post).

**Semaines 2 à 8**
- Point rapide toutes les 2 semaines (appel de 5 minutes, ou message s'ils l'acceptent) avec les **chiffres réels** : visites, clics « Appeler pour commander ».
- Corriger tout de suite ce qui les gêne (prix, horaires, rupture).
- Demander leur retour : les appels sont-ils plus courts ? Les commandes lues sont-elles claires ?

**Repères réalistes** (ordres de grandeur, pas des mesures)
- Site en ligne sans rien faire : quasi aucune commande, même après un mois.
- Lien sur Google + réseaux : quelques commandes par semaine.
- Restaurant qui le pousse vraiment (QR code, téléphone) : premières commandes en quelques jours, une part visible des commandes au bout d'un mois, qui continue de grandir.

---

## Étape 6 : Transformer l'essai en contrat

À la fin de l'essai :
1. Envoyer un **bilan en chiffres** (visites, appels lancés, évolution) **et** leur ressenti sur la durée des appels et les erreurs.
2. Proposer de continuer avec la formule choisie.
3. Devis accepté, première facture, abonnement mis en place.

Si les chiffres sont faibles, regarder d'abord si le restaurant a fait sa part (étape 3) avant de conclure que le site ne marche pas. Prolonger l'essai d'un mois si besoin.

---

## Étape 7 : Phase 2, gestion autonome (après plusieurs mois)

Seulement quand la phase 1 est adoptée **et** que le besoin est prouvé.

**Réception des commandes sans téléphone** : à ne proposer que si le restaurant le demande. Il faudrait un serveur et un moyen de recevoir (e-mail, ticket imprimé, écran). Payant, avec abonnement relevé, à chiffrer avec eux.

**D'abord, pas de développement : modifications par message** (SMS ou WhatsApp, pour les modifications du site uniquement, pas pour les commandes). Le restaurant écrit « plus de pizza X ce soir » ou « la 4 fromages passe à 13 € », je modifie `src/data/menu.ts` et je pousse (environ 2 minutes). Inclus dans l'abonnement. Pas d'outil à apprendre pour eux, et ils n'ont pas forcément d'ordinateur. Attention aux crédits Netlify : un déploiement coûte 15 crédits, regrouper les modifications quand c'est possible.

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

1. [ ] Site en ligne sur Netlify (bouton « Appeler pour commander » : fait), vidéo d'écran
2. [ ] Appel de 30 secondes au restaurant, avant 16 h chez eux (un rappel max), puis envoi du lien `.netlify.app` s'ils sont d'accord
3. [ ] Appel : questions, revue de la carte (prix, boissons), puis démo en direct
4. [ ] Offre : formule A, 2 mois d'essai, engagements du restaurant écrits
5. [ ] Après accord : appel France Travail, micro-entreprise, devis signé, mentions légales, domaine, puis QR code
6. [ ] Lancement : Google Business, QR code, post, phrase au téléphone
7. [ ] Points toutes les 2 semaines avec les chiffres
8. [ ] Bilan, devis, abonnement
9. [ ] Plus tard : phase 2 (gestion autonome)
