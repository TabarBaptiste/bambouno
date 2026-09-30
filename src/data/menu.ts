/**
 * Carte Bambouno Pizza.
 *
 * Source : visuels du menu fournis par le client. Les prix sont en euros.
 * Cette structure est volontairement plate et sérialisable : elle se remplace
 * par un fetch CMS (Sanity / Payload) sans toucher aux composants.
 */

export type MenuItem = {
  /** Identifiant stable, utilisé pour le panier et les ancres. */
  id: string;
  name: string;
  price: number;
  description?: string;
  /**
   * Photo du plat, chemin sous /public (ex. "/menu/4-fromages.jpg").
   * Sans photo, la vignette affiche l'illustration de la rubrique.
   */
  image?: string;
  /** Affiché en badge sur la carte. */
  note?: string;
  tags?: Array<"vegetarien" | "poisson" | "epice" | "sucre" | "alcool">;
};

/** Illustration de repli des vignettes, tant qu'il n'y a pas de photo. */
export type DishVisual =
  | "pizza-tomate"
  | "pizza-creme"
  | "pizza-sucree"
  | "calzone"
  | "friand"
  | "crepe-salee"
  | "crepe-sucree"
  | "boisson"
  | "biere";

export type MenuCategory = {
  id: string;
  /** Titre court, en deux temps : premier mot en blanc… */
  titlePrefix: string;
  /** …mot-clé en rouge signature. */
  titleAccent: string;
  /** Nom au pluriel pour le compteur, ex. « 15 pizzas ». */
  unit: string;
  visual: DishVisual;
  /**
   * Ce qu'est le plat, en tête de sa ligne dans le message WhatsApp et le
   * panier (« Pizza sucrée À la banane »). Sans ça, « À la banane » ne dit rien
   * à quelqu'un qui découvre la carte. Vide quand le nom suffit (boissons).
   */
  orderLabel?: string;
  /** Précision utile uniquement (supplément, commande à l'avance, loi). */
  subtitle?: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "pizzas-tomate",
    titlePrefix: "Pizzas",
    titleAccent: "tomate",
    unit: "pizzas",
    visual: "pizza-tomate",
    orderLabel: "Pizza",
    subtitle: "Toutes garnies d'emmental râpé.",
    items: [
      {
        id: "p-4-fromages",
        name: "4 Fromages",
        price: 14,
        description:
          "Sauce tomate, emmental râpé, chèvre, roquefort, mozzarella, camembert, basilic",
        tags: ["vegetarien"],
      },
      {
        id: "p-exotique",
        name: "Exotique",
        price: 14,
        description:
          "Sauce tomate, emmental râpé, jambon, ananas, olives, pesto de basilic",
      },
      {
        id: "p-la-cote",
        name: "La Côte",
        price: 14,
        description:
          "Sauce tomate, emmental râpé, côte de porc, oignons frais, pesto de basilic, poivrons, olives",
      },
      {
        id: "p-vegetarienne",
        name: "Végétarienne",
        price: 14,
        description:
          "Sauce tomate, emmental râpé, champignons, poivrons, oignons frais, aubergine, huile d'olive",
        tags: ["vegetarien"],
      },
      {
        id: "p-paysanne",
        name: "Paysanne",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, saucisses, jambon, champignons, poivrons, crème, olives",
      },
      {
        id: "p-kebab",
        name: "Kebab",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, viande de kebab, poivrons, oignons frais, olives",
      },
      {
        id: "p-le-chef",
        name: "Le Chef",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, viande hachée, merguez, oignons frais, poivrons, sauce barbecue",
        tags: ["epice"],
      },
      {
        id: "p-bolognaise",
        name: "La Bolognaise",
        price: 14,
        description: "Sauce tomate, emmental râpé, viande hachée, oignons, olives",
      },
      {
        id: "p-margharita",
        name: "Margharita",
        price: 13,
        description: "Sauce tomate, emmental râpé, mozzarella, origan, olives",
        tags: ["vegetarien"],
      },
      {
        id: "p-boucane",
        name: "La Boucané",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, poulet boucané, oignons frais, poivrons, origan, sauce barbecue",
      },
      {
        id: "p-la-morue",
        name: "La Morue",
        price: 13,
        description:
          "Sauce tomate, emmental râpé, morue, poivrons, aubergines, olives, tomate fraîche",
        tags: ["poisson"],
      },
      {
        id: "p-royale",
        name: "Royale",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, jambon, champignons, merguez, olives",
      },
      {
        id: "p-chorizo",
        name: "Chorizo",
        price: 14,
        description: "Sauce tomate, mozzarella, chorizo, œuf",
        tags: ["epice"],
      },
      {
        id: "p-hareng",
        name: "Hareng",
        price: 15,
        description:
          "Sauce tomate, emmental râpé, hareng saur, poivrons, oignons frais, tomate fraîche",
        tags: ["poisson"],
      },
      {
        id: "p-regina",
        name: "Régina",
        price: 13,
        description: "Sauce tomate, emmental râpé, jambon, origan, olives",
      },
    ],
  },
  {
    id: "pizzas-creme",
    titlePrefix: "Pizzas",
    titleAccent: "crème",
    unit: "pizzas",
    visual: "pizza-creme",
    orderLabel: "Pizza",
    items: [
      {
        id: "c-savoyarde",
        name: "Savoyarde",
        price: 15,
        description:
          "Crème liquide, emmental râpé, pomme de terre, lardons, oignons rouges, reblochon, olives",
      },
      {
        id: "c-chevre-miel",
        name: "La Chèvre Miel",
        price: 15,
        description:
          "Crème liquide, emmental, chèvre, parmesan, miel, olives",
        tags: ["vegetarien"],
      },
      {
        id: "c-carbonara",
        name: "La Carbonara",
        price: 14,
        description: "Crème liquide, emmental râpé, lardons, oignons",
      },
      {
        id: "c-pom-poulet",
        name: "Pom Poulet",
        price: 15,
        description:
          "Crème liquide, emmental râpé, poulet fumé, champignons, pomme de terre, olives",
      },
    ],
  },
  {
    id: "pizzas-pecheur",
    titlePrefix: "Pizzas",
    titleAccent: "pêcheur",
    unit: "pizzas",
    visual: "pizza-tomate",
    orderLabel: "Pizza pêcheur",
    subtitle: "La Langoustine est à commander à l'avance.",
    items: [
      {
        id: "pe-crevettes",
        name: "Crevettes",
        price: 16,
        description:
          "Sauce tomate, emmental râpé, crevettes, oignons frais, pesto de basilic",
        tags: ["poisson"],
      },
      {
        id: "pe-crevettes-creme",
        name: "Crevettes à la crème",
        price: 19,
        description:
          "Crème, emmental râpé, crevettes, oignons frais, sauce tomate basilic",
        tags: ["poisson"],
      },
      {
        id: "pe-la-fumee",
        name: "La Fumée",
        price: 15,
        description: "Crème, emmental râpé, saumon, sauce roquefort, olives",
        tags: ["poisson"],
      },
      {
        id: "pe-lambis",
        name: "Lambis",
        price: 19,
        description: "Sauce tomate, emmental râpé, lambis, poivrons, olives",
        tags: ["poisson"],
      },
      {
        id: "pe-langoustine",
        name: "Langoustine",
        price: 22,
        note: "Sur commande",
        description:
          "Crème, emmental râpé, langouste, oignons, poivrons, origan",
        tags: ["poisson"],
      },
      {
        id: "pe-lardons-creme",
        name: "Lardons à la crème",
        price: 15,
        description: "Crème, emmental râpé, lardons, miel",
      },
      {
        id: "pe-oceane",
        name: "Océane",
        price: 16,
        description:
          "Sauce tomate, emmental râpé, cocktail de fruits de mer, oignons frais, herbes de Provence, olives",
        tags: ["poisson"],
      },
    ],
  },
  {
    id: "calzone",
    titlePrefix: "Nos",
    titleAccent: "calzones",
    unit: "calzones",
    visual: "calzone",
    orderLabel: "Calzone",
    items: [
      {
        id: "cz-classique",
        name: "Calzone jambon",
        price: 16,
        description: "Sauce tomate, jambon, emmental, champignons",
      },
      {
        id: "cz-pimente",
        name: "Calzone poulet piment",
        price: 16,
        description:
          "Sauce tomate, saucisse poulet, jambon, emmental, mozzarella, sauce pimentée",
        tags: ["epice"],
      },
    ],
  },
  {
    id: "friands",
    titlePrefix: "Nos",
    titleAccent: "friands",
    unit: "friands",
    visual: "friand",
    orderLabel: "Friand",
    items: [
      {
        id: "f-gros-mornaise",
        name: "La Gros-Mornaise",
        price: 6.5,
        description: "Jambon, merguez, fromage, champignons",
      },
      {
        id: "f-poirier",
        name: "Poirier",
        price: 6.5,
        description: "Poulet, fromage",
      },
      {
        id: "f-sinai",
        name: "Sinaï",
        price: 5,
        description: "Jambon, fromage",
      },
      {
        id: "f-petite-tracee",
        name: "Petite Tracée",
        price: 5,
        description: "Saucisse, fromage",
      },
      {
        id: "f-la-fraicheur",
        name: "La Fraicheur",
        price: 6.5,
        description: "Steack, fromage",
      },
    ],
  },
  {
    id: "crepes-salees",
    titlePrefix: "Crêpes",
    titleAccent: "salées",
    unit: "crêpes",
    visual: "crepe-salee",
    orderLabel: "Crêpe salée",
    items: [
      {
        id: "cs-hibiscus",
        name: "Hibiscus",
        price: 6.5,
        description: "Jambon, fromage, champignons",
      },
      {
        id: "cs-anthurium",
        name: "Anthurium",
        price: 7,
        description: "Jambon, saucisse, fromage, tomate",
      },
      {
        id: "cs-alamanda",
        name: "Alamanda",
        price: 7.5,
        description: "Jambon, merguez, fromage, tomate",
      },
      {
        id: "cs-bougainvillier",
        name: "Bougainvillier",
        price: 7.5,
        description: "Œuf, fromage, champignons, poivrons, tomate",
        tags: ["vegetarien"],
      },
      {
        id: "cs-orchidee",
        name: "Orchidée",
        price: 8,
        description: "Steack haché, sauce BBQ, poivrons, oignons, fromage",
      },
      {
        id: "cs-alpinia",
        name: "Alpinia",
        price: 8,
        description: "Poulet boucané, oignons, fromage, champignons",
      },
      {
        id: "cs-balisier",
        name: "Balisier",
        price: 9.5,
        description: "Crevettes, tomate, fromage",
        tags: ["poisson"],
      },
      {
        id: "cs-flamboyant",
        name: "Flamboyant",
        price: 10.5,
        description: "Crevette, saumon, poivrons, crème, fromage",
        tags: ["poisson"],
      },
      {
        id: "cs-coquelicot",
        name: "Coquelicot",
        price: 14,
        description: "Lambis, crème, tomate, fromage",
        tags: ["poisson"],
      },
      {
        id: "cs-frangipanier",
        name: "Frangipanier",
        price: 7.5,
        description: "4 fromages, poivrons, tomate",
        tags: ["vegetarien"],
      },
    ],
  },
  {
    id: "pizzas-sucrees",
    titlePrefix: "Pizzas",
    titleAccent: "sucrées",
    unit: "pizzas",
    visual: "pizza-sucree",
    orderLabel: "Pizza sucrée",
    items: [
      {
        id: "ps-banane",
        name: "À la banane",
        price: 10,
        description: "Crème liquide, bananes, cassonade, citron",
        tags: ["sucre", "vegetarien"],
      },
      {
        id: "ps-pommes",
        name: "Aux pommes",
        price: 10,
        description:
          "Crème liquide, pomme, caramel au beurre salé, amandes grillées, cannelle",
        tags: ["sucre", "vegetarien"],
      },
      {
        id: "ps-poires",
        name: "Aux poires",
        price: 10,
        description: "Crème liquide, gorgonzola, poires, noix, caramel",
        tags: ["sucre", "vegetarien"],
      },
      {
        id: "ps-nutella-banane",
        name: "Nutella / Banane",
        price: 10,
        description: "Nutella, banane, noix",
        tags: ["sucre", "vegetarien"],
      },
    ],
  },
  {
    id: "crepes-sucrees",
    titlePrefix: "Crêpes",
    titleAccent: "sucrées",
    unit: "crêpes",
    visual: "crepe-sucree",
    orderLabel: "Crêpe sucrée",
    subtitle: "Suppléments crème chocolat, caramel liquide ou sirop d'érable : 0,50 €.",
    items: [
      { id: "cu-nature", name: "Nature", price: 3.5, tags: ["sucre"] },
      { id: "cu-sucre", name: "Sucre", price: 3.9, tags: ["sucre"] },
      { id: "cu-miel", name: "Miel", price: 4, tags: ["sucre"] },
      {
        id: "cu-sucre-beurre-sale",
        name: "Sucre beurre salé",
        price: 4,
        tags: ["sucre"],
      },
      { id: "cu-nutella", name: "Nutella", price: 4, tags: ["sucre"] },
      {
        id: "cu-nutella-amande",
        name: "Nutella, amande",
        price: 4.5,
        tags: ["sucre"],
      },
      {
        id: "cu-nutella-chantilly",
        name: "Nutella, chantilly",
        price: 4.5,
        tags: ["sucre"],
      },
      {
        id: "cu-compote-pomme",
        name: "Compote de pomme",
        price: 4.5,
        note: "Confiture",
        tags: ["sucre"],
      },
      {
        id: "cu-abricot-pays",
        name: "Abricot pays",
        price: 4.5,
        note: "Confiture",
        tags: ["sucre"],
      },
      { id: "cu-banane", name: "Banane", price: 4.5, note: "Confiture", tags: ["sucre"] },
      { id: "cu-goyave", name: "Goyave", price: 4.5, note: "Confiture", tags: ["sucre"] },
      { id: "cu-fraise", name: "Fraise", price: 4.5, note: "Confiture", tags: ["sucre"] },
      { id: "cu-ananas", name: "Ananas", price: 4.5, note: "Confiture", tags: ["sucre"] },
      {
        id: "cu-gingembre",
        name: "Gingembre",
        price: 4.5,
        note: "Confiture",
        tags: ["sucre"],
      },
    ],
  },
  {
    id: "boissons",
    titlePrefix: "Nos",
    titleAccent: "boissons",
    unit: "boissons",
    visual: "boisson",
    items: [
      { id: "b-jus-fruits", name: "Jus de fruits 50 cl", price: 2.5 },
      { id: "b-mont-pele", name: "Mont Pelé 50 cl", price: 2.5 },
      { id: "b-jus-canne", name: "Jus de canne 50 cl", price: 3 },
      { id: "b-jus-local", name: "Jus local", price: 3 },
      { id: "b-chanflor", name: "Chanflor 50 cl", price: 1.5 },
      { id: "b-didier", name: "Didier 50 cl", price: 2 },
      { id: "b-royal-soda", name: "Royal Soda 50 cl", price: 2.5 },
      { id: "b-coca", name: "Coca-Cola 50 cl", price: 2.5 },
      { id: "b-orangina", name: "Orangina 50 cl", price: 2.5 },
      { id: "b-amigo", name: "Amigo 50 cl", price: 2.5 },
      { id: "b-sprite", name: "Sprite 50 cl", price: 2.5 },
      { id: "b-fanta", name: "Fanta 50 cl", price: 2.5 },
      { id: "b-red-bull", name: "Red Bull", price: 2.5 },
      { id: "b-monster", name: "Monster 50 cl", price: 3 },
      { id: "b-vita-malt", name: "Vita Malt 33 cl", price: 2.5 },
      { id: "b-malta-lorraine", name: "Malta Lorraine 50 cl", price: 3 },
    ],
  },
  {
    id: "bieres",
    titlePrefix: "Nos",
    titleAccent: "bières",
    unit: "bières",
    visual: "biere",
    orderLabel: "Bière",
    // Mention obligatoire dès qu'on affiche des boissons alcoolisées.
    subtitle:
      "La vente d'alcool est interdite aux mineurs de moins de 18 ans. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
    items: [
      { id: "bi-porter-39", name: "Porter 39", price: 3, tags: ["alcool"] },
      { id: "bi-lorraine", name: "Bière Lorraine 25 cl", price: 2.5, tags: ["alcool"] },
      { id: "bi-heineken", name: "Bière Heineken 25 cl", price: 2.5, tags: ["alcool"] },
      { id: "bi-desperados", name: "Desperados 33 cl", price: 3.2, tags: ["alcool"] },
    ],
  },
];

/** Index plat id → item, pour reconstruire un panier sans re-parcourir la carte. */
export const menuIndex: Record<string, MenuItem> = Object.fromEntries(
  menu.flatMap((category) => category.items.map((item) => [item.id, item])),
);

/** Index plat id → rubrique, pour retrouver ce qu'est un plat du panier. */
export const categoryOf: Record<string, MenuCategory> = Object.fromEntries(
  menu.flatMap((category) => category.items.map((item) => [item.id, category])),
);

/** Titre court pour les puces de navigation : « Calzones », « Pizzas tomate ». */
export function shortTitle(category: MenuCategory): string {
  const accent = category.titleAccent;
  return category.titlePrefix === "Nos"
    ? accent.charAt(0).toUpperCase() + accent.slice(1)
    : `${category.titlePrefix} ${accent}`;
}

export const tagLabels: Record<NonNullable<MenuItem["tags"]>[number], string> = {
  vegetarien: "Végé",
  poisson: "Mer",
  epice: "Épicé",
  sucre: "Sucré",
  alcool: "Alcool",
};

export function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  });
}
