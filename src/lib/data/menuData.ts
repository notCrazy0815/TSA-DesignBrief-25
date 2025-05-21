// Typdefinitionen für die Menüdaten
export interface Ingredient {
  name: string;
  organic?: boolean;
  local?: boolean;
  seasonal?: boolean;
}

export interface IngredientSource {
  name: string;
  farm: string;
  distance: number; // Entfernung in km
  farmSince: number; // Jahr der Gründung
  market?: string | null;
  organic: boolean;
  nonGMO: boolean;
  season: string;
  latestHarvest?: string;
  farmDescription: string;
  farmerName?: string;
  farmerPhoto?: string;
  farmerBio?: string;
  coordinates?: { x: number; y: number };
  description: string;
  image?: string;
  peakSeason?: string;
  harvestMethods?: string;
  storageInfo?: string;
  shelfLife?: string;
  freshnessTips?: string;
  nutritionDescription?: string;
  nutritionComparison?: {
    [key: string]: { local: number; conventional: number; max: number };
  };
  nutritionBenefits?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  seasonalData: Array<{
    month: string;
    availability: number; // 0-100
  }>;
  environmentalImpact?: string;
  carbonFootprint?: {
    local: string;
    conventional: string;
    savings: number;
  };
  communityImpact?: string;
  jobsSupported?: number;
  farmVisit?: string;
  practices?: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
}

export interface Nutrition {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  sugar?: string;
}

export interface MenuItemDetailed {
  description: string;
  ingredients: Ingredient[] | string[];
  ingredientSources?: IngredientSource[];
  nutrition?: Nutrition;
  allergens?: string[];
  image?: string;
  pairings?: string[];
  recommended?: string;
  origin?: string;
  shortDescription?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  tags: string[];
  isNew?: boolean;
  detailed?: MenuItemDetailed;
  weight?: number;  // für Sortierung
}

export interface MenuSection {
  id: string;
  category: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  description: string;
  image?: string;
  sections: MenuSection[];
}

// Farm-to-Table Partnerschaften
export interface FarmPartner {
  id: string;
  name: string;
  location: string;
  distance: number;
  established: number;
  description: string;
  image?: string;
  products: string[];
  practices: string[];
  certifications: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  visitInfo?: {
    isOpen: boolean;
    hours?: string;
    tours?: string;
  };
}

// Saisonkalender für Zutaten
export interface SeasonalIngredient {
  id: string;
  name: string;
  image?: string;
  category: string;
  availability: {
    [month: string]: number; // Verfügbarkeit pro Monat (0-100%)
  };
  peak: string[]; // Monate mit bester Qualität
  localSource?: string; // Name des lokalen Lieferanten/Bauern
}

// Exportiere die Menüdaten
export const menuCategories: MenuCategory[] = [
  {
    id: "appetizers",
    title: "Appetizers",
    description: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients.",
    sections: [
      {
        id: "cold-starters",
        category: "Cold Starters",
        items: [
          {
            id: "bruschetta",
            name: "Bruschetta with Heirloom Tomatoes",
            price: "7.95",
            tags: ["vegan", "contains-gluten"],
            isNew: false,
            weight: 10,
            detailed: {
              description: "Our signature bruschetta features locally sourced heirloom tomatoes, fresh basil from our greenhouse, and aged balsamic reduction drizzled over artisanal sourdough bread toasted to perfection.",
              ingredients: [
                { name: "Heirloom tomatoes", organic: true, local: true, seasonal: true },
                { name: "Fresh basil", organic: true, local: true },
                { name: "Organic garlic", organic: true, local: true },
                { name: "Extra-virgin olive oil", organic: true },
                { name: "Aged balsamic reduction" },
                { name: "Artisanal sourdough bread", local: true },
                { name: "Sea salt" },
                { name: "Cracked black pepper" }
              ],
              ingredientSources: [
                {
                  name: "Heirloom tomatoes",
                  farm: "Green Door Gourmet",
                  distance: 9,
                  farmSince: 2007,
                  market: "Nashville Farmers' Market",
                  organic: true,
                  nonGMO: true,
                  season: "Juni bis September",
                  latestHarvest: "2023-09-05",
                  farmDescription: "Green Door Gourmet ist ein 350 Hektar großer, USDA-zertifizierter Bio-Bauernhof und Agritourismus-Ziel, nur 12 Minuten von der Innenstadt von Nashville entfernt. Sie konzentrieren sich auf nachhaltige Anbaumethoden und versorgen die Gemeinschaft mit saisonalem Gemüse, Blumen und Kräutern.",
                  farmerName: "Sylvia Ganier",
                  farmerPhoto: "/images/ingredients/sylvia-ganier.jpg",
                  farmerBio: "Sylvia Ganier, Besitzerin von Green Door Gourmet, ist eine zur Landwirtin gewordene Köchin, die sich der nachhaltigen Landwirtschaft und der Verbindung der Gemeinschaft mit lokalen Lebensmittelsystemen widmet. Ihr Hintergrund in der Kochkunst prägt ihren Ansatz für den Anbau außergewöhnlicher Produkte.",
                  coordinates: { x: 70, y: 45 },
                  description: "Diese lebendigen, geschmackvollen Heirloom-Tomaten werden mit traditionellen Methoden angebaut. Jede Sorte wird aufgrund ihres außergewöhnlichen Geschmacks und ihrer Textur ausgewählt, wobei die Samen sorgfältig aus früheren Ernten aufbewahrt werden, um für Tennessee einzigartige Erbsorten zu erhalten.",
                  image: "/images/ingredients/heirloom-tomatoes.jpg",
                  peakSeason: "Mitte Juli bis Ende August",
                  harvestMethods: "Handgepflückt bei optimaler Reife, um maximalen Geschmack und Nährwert zu gewährleisten. Jede Tomate wird am frühen Morgen geerntet, wenn die Temperaturen kühler sind, um die Frische zu bewahren.",
                  storageInfo: "Bei Raumtemperatur und vor direktem Sonnenlicht geschützt aufbewahren. Niemals kühlen, da dies den Geschmack beeinträchtigt und die Textur verändert.",
                  shelfLife: "5-7 Tage nach der Ernte bei sachgemäßer Lagerung",
                  freshnessTips: "Achten Sie auf feste Früchte mit lebendiger Farbe und erdigem Aroma. Der Stiel sollte frisch und grün sein, wenn er noch angebracht ist.",
                  nutritionDescription: "Heirloom-Tomaten enthalten im Vergleich zu herkömmlichen Sorten höhere Mengen an Antioxidantien und Mikronährstoffen. Sie sind reich an den Vitaminen A, C und K und enthalten Lycopin, ein starkes Antioxidans.",
                  nutritionComparison: {
                    "Vitamin C": { local: 38, conventional: 18, max: 40 },
                    "Lycopin": { local: 25, conventional: 12, max: 25 },
                    "Antioxidantien": { local: 32, conventional: 15, max: 35 },
                    "Geschmacksstoffe": { local: 28, conventional: 10, max: 30 }
                  },
                  nutritionBenefits: [
                    { name: "Lycopin-Reich", description: "Enthält bis zu 40% mehr Lycopin als herkömmliche Tomaten, unterstützt die Herz- und Hautgesundheit", icon: "L" },
                    { name: "Vitamin C", description: "Ausgezeichnete Quelle für Vitamin C, stärkt die Immunfunktion und die Kollagenproduktion", icon: "C" },
                    { name: "Kalium", description: "Reich an Kalium, hilft bei der Aufrechterhaltung eines gesunden Blutdrucks", icon: "K" }
                  ],
                  seasonalData: [
                    { month: "Jan", availability: 0 },
                    { month: "Feb", availability: 0 },
                    { month: "Mär", availability: 0 },
                    { month: "Apr", availability: 0 },
                    { month: "Mai", availability: 15 },
                    { month: "Jun", availability: 70 },
                    { month: "Jul", availability: 100 },
                    { month: "Aug", availability: 95 },
                    { month: "Sep", availability: 60 },
                    { month: "Okt", availability: 10 },
                    { month: "Nov", availability: 0 },
                    { month: "Dez", availability: 0 }
                  ],
                  environmentalImpact: "Die biologischen Anbaumethoden bei Green Door Gourmet fördern die Bodengesundheit, die Biodiversität und den Wasserschutz. Der Anbau von Heirloom-Sorten trägt zur Erhaltung der genetischen Vielfalt in unserem Lebensmittelsystem bei.",
                  carbonFootprint: {
                    local: "0,5 kg CO₂e pro Pfund",
                    conventional: "5,3 kg CO₂e pro Pfund",
                    savings: 90
                  },
                  communityImpact: "Green Door Gourmet beschäftigt das ganze Jahr über lokale Arbeiter und bietet Bildungsprogramme für Schulen und Gemeindegruppen an, um nachhaltige Landwirtschaft zu erlernen.",
                  jobsSupported: 32,
                  farmVisit: "Green Door Gourmet empfängt Besucher von Donnerstag bis Sonntag, 9-17 Uhr. Sie können eine selbstgeführte Tour machen, an U-Pick-Veranstaltungen teilnehmen (saisonal) oder in ihrem Hofmarkt einkaufen.",
                  practices: [
                    { name: "Nicht-GVO", icon: "N", description: "Bewahrt Heirloom-Sorten ohne genetische Modifikation" },
                    { name: "Nachhaltige Bewässerung", icon: "W", description: "Tropfbewässerungssysteme reduzieren den Wasserverbrauch um 60%" },
                    { name: "Pestizidfrei", icon: "P", description: "Verwendet natürliche Schädlingsbekämpfungstechniken anstelle synthetischer Chemikalien" },
                    { name: "Bodenpflege", icon: "S", description: "Baut gesunden Boden durch Zwischenfruchtanbau und Kompostierung auf" }
                  ]
                },
                {
                  name: "Artisanal sourdough bread",
                  farm: "Dozen Bakery",
                  distance: 3,
                  farmSince: 2015,
                  market: null,
                  organic: false,
                  nonGMO: true,
                  season: "Ganzjährig",
                  farmDescription: "Dozen Bakery ist eine preisgekrönte Handwerksbäckerei in Nashville, die für ihre traditionellen Brottechniken und den Fokus auf qualitativ hochwertige lokale Zutaten bekannt ist. Die Bäckerei wurde 2015 gegründet und hat sich schnell einen Namen für authentisches Sauerteigbrot gemacht.",
                  description: "Unser Sauerteigbrot wird täglich frisch von Dozen Bakery gebacken, einer lokalen Handwerksbäckerei in Nashville, die für ihre traditionellen Brottechniken und ihr Engagement für Qualitätszutaten bekannt ist.",
                  image: "/images/ingredients/sourdough-bread.jpg",
                  peakSeason: "Ganzjährig verfügbar",
                  harvestMethods: "Täglich frisch gebacken mit traditionellen Fermentationstechniken und einem 15 Jahre alten Sauerteig-Starter.",
                  nutritionDescription: "Traditionelle Sauerteigfermentation erhöht die Bioverfügbarkeit von Nährstoffen und macht Gluten für viele Menschen leichter verdaulich.",
                  environmentalImpact: "Dozen Bakery bezieht wann immer möglich lokales Bio-Mehl und reduziert so den Transportausstoß und unterstützt regionale Getreidebauern.",
                  carbonFootprint: {
                    local: "0,7 kg CO₂e pro Laib",
                    conventional: "2,2 kg CO₂e pro Laib",
                    savings: 68
                  },
                  nutritionBenefits: [
                    { name: "Verdaulichkeit", description: "Traditionelle Fermentation baut Gluten und Phytinsäure für eine leichtere Verdauung ab", icon: "D" },
                    { name: "Probiotisch", description: "Enthält nützliche Bakterien, die die Darmgesundheit unterstützen", icon: "P" }
                  ],
                  seasonalData: [
                    { month: "Jan", availability: 100 },
                    { month: "Feb", availability: 100 },
                    { month: "Mär", availability: 100 },
                    { month: "Apr", availability: 100 },
                    { month: "Mai", availability: 100 },
                    { month: "Jun", availability: 100 },
                    { month: "Jul", availability: 100 },
                    { month: "Aug", availability: 100 },
                    { month: "Sep", availability: 100 },
                    { month: "Okt", availability: 100 },
                    { month: "Nov", availability: 100 },
                    { month: "Dez", availability: 100 }
                  ],
                  practices: [
                    { name: "Traditionelle Methoden", icon: "T", description: "24-stündiger langsamer Fermentationsprozess" },
                    { name: "Lokales Getreide", icon: "L", description: "Verwendet Mehl aus kleinen regionalen Mühlen" },
                    { name: "Zero Waste", icon: "Z", description: "Brot vom Vortag wird wiederverwendet oder kompostiert" }
                  ]
                }
              ],
              nutrition: {
                calories: 215,
                protein: "4g",
                carbs: "28g",
                fat: "10g"
              },
              allergens: ["Gluten"],
              image: "/images/menu/bruschetta.jpg",
              pairings: ["Elderflower Fizz", "Sparkling Botanical Water"]
            }
          },
          // Weitere Elemente würden hier folgen...
        ]
      }
      // Weitere Sektionen würden hier folgen...
    ]
  }
  // Weitere Kategorien würden hier folgen...
];

// Farm-to-Table Partner
export const farmPartners: FarmPartner[] = [
  {
    id: "green-door-gourmet",
    name: "Green Door Gourmet",
    location: "Nashville, TN",
    distance: 9,
    established: 2007,
    description: "Ein 350 Hektar großer USDA-zertifizierter Bio-Bauernhof, der sich auf nachhaltige Anbaumethoden und saisonale Produkte konzentriert.",
    products: ["Heirloom-Tomaten", "Saisonales Gemüse", "Kräuter", "Blumen"],
    practices: ["Bio-Anbau", "Nachhaltige Bewässerung", "Bodenpflege", "Biodiversität"],
    certifications: ["USDA Certified Organic", "Certified Naturally Grown"],
    contactInfo: {
      phone: "(615) 555-1234",
      email: "info@greendoorgourmet.com",
      website: "greendoorgourmet.com"
    },
    visitInfo: {
      isOpen: true,
      hours: "Donnerstag bis Sonntag, 9-17 Uhr",
      tours: "Selbstgeführte Touren und saisonale U-Pick-Veranstaltungen verfügbar"
    }
  },
  // Weitere Partner würden hier folgen...
];

// Saisonkalender
export const seasonalIngredients: SeasonalIngredient[] = [
  {
    id: "heirloom-tomatoes",
    name: "Heirloom-Tomaten",
    category: "Gemüse",
    availability: {
      "Jan": 0, "Feb": 0, "Mär": 0, "Apr": 0,
      "Mai": 15, "Jun": 70, "Jul": 100, "Aug": 95,
      "Sep": 60, "Okt": 10, "Nov": 0, "Dez": 0
    },
    peak: ["Jul", "Aug"],
    localSource: "Green Door Gourmet"
  },
  {
    id: "basil",
    name: "Basilikum",
    category: "Kräuter",
    availability: {
      "Jan": 0, "Feb": 0, "Mär": 10, "Apr": 40,
      "Mai": 80, "Jun": 100, "Jul": 100, "Aug": 100,
      "Sep": 80, "Okt": 40, "Nov": 10, "Dez": 0
    },
    peak: ["Jun", "Jul", "Aug"],
    localSource: "Bloomsbury Farm"
  },
  // Weitere Zutaten würden hier folgen...
]; 