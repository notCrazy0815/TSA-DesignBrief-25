import type { IngredientSource } from './menuData';

const ingredientSources: Record<string, IngredientSource> = {
  "Heirloom Tomatoes": {
    name: "Heirloom Tomatoes",
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
  "Fresh Avocado": {
    name: "Fresh Avocado",
    farm: "Green Valley Farms",
    distance: 15,
    farmSince: 2010,
    market: "Nashville Farmers' Market",
    organic: true,
    nonGMO: true,
    season: "März bis Oktober",
    latestHarvest: "2023-10-15",
    farmDescription: "Green Valley Farms ist ein familiengeführter Biobetrieb, der sich auf nachhaltige Anbaumethoden und vielfältige Erntesorten spezialisiert hat. Der Bauernhof arbeitet mit lokalen Restaurants und Cafés zusammen, um die Farm-to-Table-Bewegung zu unterstützen.",
    farmerName: "Marcus Hayes",
    farmerPhoto: "/images/ingredients/marcus-hayes.jpg",
    farmerBio: "Marcus Hayes hat seinen 40-Hektar-Hof 2010 mit dem Ziel gegründet, die lokale Lebensmittelversorgung zu stärken und nachhaltige Landwirtschaft zu praktizieren. Sein Engagement für Biodiversität und ökologische Methoden hat Green Valley Farms zu einem Vorbild für kleine, vielfältige Betriebe gemacht.",
    coordinates: { x: 85, y: 60 },
    description: "Unsere Avocados werden auf nährstoffreichen Böden angebaut und zum optimalen Reifezeitpunkt geerntet. Sie sind reich an gesunden Fettsäuren und bieten einen cremigen, nussigen Geschmack.",
    image: "/images/ingredients/avocados.jpg",
    peakSeason: "Mai bis August",
    harvestMethods: "Handgepflückt bei optimaler Reife. Wir ernten die Avocados, wenn sie reif sind, aber noch fest, damit sie bei unseren Kunden perfekt reifen können.",
    storageInfo: "Bei Raumtemperatur aufbewahren bis zur gewünschten Reife. Angeschnittene Avocados mit Zitronensaft beträufeln und im Kühlschrank aufbewahren.",
    shelfLife: "5-7 Tage bei Raumtemperatur, je nach Reifegrad",
    freshnessTips: "Eine reife Avocado gibt bei leichtem Druck etwas nach. Zu weiche Stellen deuten auf Überreife hin.",
    nutritionDescription: "Avocados sind reich an einfach ungesättigten Fettsäuren, die zur Herzgesundheit beitragen können. Sie enthalten mehr Kalium als Bananen und sind eine gute Quelle für die Vitamine K, E, C und B6 sowie Folat.",
    nutritionComparison: {
      "Kalium": { local: 35, conventional: 25, max: 40 },
      "Vitamin E": { local: 28, conventional: 15, max: 30 },
      "Gesunde Fette": { local: 32, conventional: 30, max: 35 },
      "Ballaststoffe": { local: 25, conventional: 20, max: 25 }
    },
    nutritionBenefits: [
      { name: "Herzgesundheit", description: "Reich an einfach ungesättigten Fettsäuren, die das Risiko von Herzerkrankungen senken können", icon: "H" },
      { name: "Vitamin E", description: "Starkes Antioxidans, das Zellen vor oxidativem Stress schützt", icon: "E" },
      { name: "Ballaststoffe", description: "Enthält sowohl lösliche als auch unlösliche Ballaststoffe für eine gesunde Verdauung", icon: "F" }
    ],
    seasonalData: [
      { month: "Jan", availability: 0 },
      { month: "Feb", availability: 0 },
      { month: "Mär", availability: 30 },
      { month: "Apr", availability: 60 },
      { month: "Mai", availability: 90 },
      { month: "Jun", availability: 100 },
      { month: "Jul", availability: 100 },
      { month: "Aug", availability: 90 },
      { month: "Sep", availability: 60 },
      { month: "Okt", availability: 30 },
      { month: "Nov", availability: 0 },
      { month: "Dez", availability: 0 }
    ],
    environmentalImpact: "Green Valley Farms nutzt wassersparende Anbautechniken und verringert so den Wasserverbrauch im Vergleich zu konventionellen Anbaumethoden um 40%. Alle Abfälle werden kompostiert und wieder in den Boden eingebracht.",
    carbonFootprint: {
      local: "0,8 kg CO₂e pro kg",
      conventional: "2,5 kg CO₂e pro kg",
      savings: 68
    },
    communityImpact: "Green Valley Farms beschäftigt 15 lokale Mitarbeiter und arbeitet mit Schulen zusammen, um Kindern nachhaltigen Anbau beizubringen.",
    jobsSupported: 15,
    farmVisit: "Green Valley Farms bietet von Mai bis September jeden Samstag Farmtouren an. Besucher können die Felder besichtigen und an saisonalen Ernte-Workshops teilnehmen.",
    practices: [
      { name: "Wasserschutz", icon: "W", description: "Präzisionsbewässerung und Mulch reduzieren den Wasserverbrauch um 40%" },
      { name: "Biologische Schädlingsbekämpfung", icon: "B", description: "Einsatz von Nützlingen und begleitenden Pflanzen zur Kontrolle von Schädlingen" },
      { name: "Regenerative Landwirtschaft", icon: "R", description: "Praktiken, die Bodengesundheit und Kohlenstoffbindung verbessern" }
    ]
  },
  "Sweet Potatoes": {
    name: "Sweet Potatoes",
    farm: "Hillside Root Farm",
    distance: 12,
    farmSince: 2009,
    market: "Community Farmers Market",
    organic: true,
    nonGMO: true,
    season: "September bis März",
    latestHarvest: "2023-11-15",
    farmDescription: "Hillside Root Farm spezialisiert sich auf verschiedene Wurzelgemüse und hat perfekte Lagerbedingungen entwickelt, um ganzjährig hochwertige Produkte anbieten zu können. Der Betrieb nutzt traditionelle Anbaumethoden in Kombination mit modernen nachhaltigen Praktiken.",
    farmerName: "Elena Rodriguez",
    farmerPhoto: "/images/ingredients/elena-rodriguez.jpg",
    farmerBio: "Elena Rodriguez hat ihre Liebe zur Landwirtschaft von ihren Großeltern geerbt und Hillside Root Farm gegründet, um traditionelle Wurzelgemüsesorten zu bewahren. Ihr Engagement für Bodenfruchtbarkeit und Sortenvielfalt hat zur Wiederbelebung mehrerer alter Süßkartoffelsorten beigetragen.",
    coordinates: { x: 60, y: 80 },
    description: "Unsere Süßkartoffeln werden in nährstoffreichen Böden angebaut und haben einen intensiven süßen Geschmack. Sie werden nach der Ernte optimal gelagert, um ihre Qualität und Nährwerte zu erhalten.",
    image: "/images/ingredients/sweet-potatoes.jpg",
    peakSeason: "Oktober bis Januar",
    harvestMethods: "Sorgfältig von Hand geerntet, um die Knollen nicht zu beschädigen. Nach der Ernte werden die Süßkartoffeln für 7-10 Tage bei hoher Luftfeuchtigkeit und Wärme gelagert, um die Stärke in Zucker umzuwandeln und den Geschmack zu intensivieren.",
    storageInfo: "An einem kühlen, dunklen, gut belüfteten Ort (nicht im Kühlschrank) für bis zu 6 Wochen lagern.",
    shelfLife: "4-6 Wochen bei optimaler Lagerung",
    freshnessTips: "Feste Süßkartoffeln ohne weiche Stellen oder Sprossen wählen. Kleine bis mittelgroße Knollen haben oft den intensivsten Geschmack.",
    nutritionDescription: "Süßkartoffeln gehören zu den nährstoffreichsten Gemüsesorten überhaupt. Sie sind eine hervorragende Quelle für Betacarotin, das im Körper zu Vitamin A umgewandelt wird, sowie für Vitamin C und Ballaststoffe.",
    nutritionComparison: {
      "Vitamin A": { local: 38, conventional: 20, max: 40 },
      "Vitamin C": { local: 30, conventional: 18, max: 35 },
      "Antioxidantien": { local: 32, conventional: 22, max: 35 },
      "Mineralien": { local: 28, conventional: 18, max: 30 }
    },
    nutritionBenefits: [
      { name: "Augengesundheit", description: "Reich an Betacarotin, das die Sehkraft und Augengesundheit unterstützt", icon: "A" },
      { name: "Immunsystem", description: "Hoher Vitamin-C-Gehalt stärkt die Abwehrkräfte", icon: "I" },
      { name: "Darmgesundheit", description: "Enthält sowohl lösliche als auch unlösliche Ballaststoffe für eine gesunde Verdauung", icon: "D" }
    ],
    seasonalData: [
      { month: "Jan", availability: 80 },
      { month: "Feb", availability: 70 },
      { month: "Mär", availability: 50 },
      { month: "Apr", availability: 20 },
      { month: "Mai", availability: 0 },
      { month: "Jun", availability: 0 },
      { month: "Jul", availability: 0 },
      { month: "Aug", availability: 0 },
      { month: "Sep", availability: 30 },
      { month: "Okt", availability: 70 },
      { month: "Nov", availability: 100 },
      { month: "Dez", availability: 90 }
    ],
    environmentalImpact: "Hillside Root Farm verwendet Fruchtwechsel und Gründüngung, um die Bodengesundheit zu verbessern und den Einsatz von externen Inputs zu minimieren. Der Betrieb verwendet Regenwasser für die Bewässerung und hat ein geschlossenes Kompostsystem implementiert.",
    carbonFootprint: {
      local: "0,3 kg CO₂e pro kg",
      conventional: "2,1 kg CO₂e pro kg",
      savings: 85
    },
    communityImpact: "Hillside Root Farm arbeitet mit lokalen Lebensmittelbanken zusammen und spendet jede Woche frisches Gemüse. Der Betrieb bietet auch Praktika für Agrarwissenschaftsstudenten an.",
    jobsSupported: 8,
    farmVisit: "Hillside Root Farm bietet monatliche Besichtigungen und saisonale Erntefeste an. Im Herbst können Besucher an der Süßkartoffelernte teilnehmen.",
    practices: [
      { name: "Mischkultur", icon: "M", description: "Anbau von komplementären Pflanzen zur Förderung des Bodenlebens" },
      { name: "Sortenvielfalt", icon: "V", description: "Anbau von 6 verschiedenen Süßkartoffelsorten zur Förderung der genetischen Vielfalt" },
      { name: "Kreislaufwirtschaft", icon: "K", description: "Alle Pflanzenreste werden kompostiert und wieder als Dünger eingesetzt" }
    ]
  }
};

export default ingredientSources; 