/**
 * Kárpát-medence földrajzi határai, kurált helyszínei és véletlenszerű pontgenerátora
 */

// A Kárpát-medence körvonalát közelítő sokszög (szélesség, hosszúság párok)
// Lefedi: Magyarország, Erdély, Felvidék, Kárpátalja, Vajdaság, Drávaszög, Burgenland, Muravidék
export const CARPATHIAN_POLYGON = [
  [48.1, 16.2], // Bécsi-medence / Pozsony környéke
  [49.0, 18.0], // Fehér-Kárpátok / Zsolna
  [49.4, 19.5], // Magas-Tátra
  [49.4, 21.0], // Alacsony-Beszkidek / Bártfa
  [49.0, 22.6], // Keleti-Kárpátok / Ungvári hegyek
  [48.4, 24.2], // Kárpátalja / Hoverla térsége
  [47.8, 25.0], // Máramaros / Radnai-havasok
  [47.2, 25.8], // Kelemen-havasok
  [46.6, 25.9], // Gyergyói-havasok / Gyilkos-tó
  [45.8, 26.2], // Háromszéki-havasok / Bodok
  [45.4, 25.5], // Brassó / Bucegi pereme
  [45.3, 24.6], // Fogarasi-havasok
  [45.3, 23.5], // Retyezát / Hunyad
  [44.8, 22.3], // Vaskapu / Kazán-szoros
  [44.7, 20.8], // Delibláti-homokpuszta / Duna menti síkság
  [44.8, 19.8], // Szávaszög / Fruška Gora
  [45.2, 18.7], // Slavónia / Vukovár
  [45.6, 17.5], // Dráva mente / Baranya
  [46.0, 16.3], // Muraköz / Varasd felé
  [46.8, 16.1], // Muravidék / Őrség
  [47.5, 16.4], // Kőszegi-hegység / Burgenland
  [48.0, 16.5], // Fertő-tó / Leitha-hegység
];

// Bounding box a gyors előszűréshez
export const CARPATHIAN_BBOX = {
  minLat: 44.7,
  maxLat: 49.5,
  minLng: 16.0,
  maxLng: 26.3,
};

/**
 * Sugármetszés (ray-casting) algoritmus: eldönti, hogy egy koordináta a Kárpát-medencében van-e
 */
export function isInsideCarpathianBasin(lat, lng) {
  let inside = false;
  const vs = CARPATHIAN_POLYGON;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    
    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Véletlenszerű koordináta generálása a Kárpát-medence poligonján belül
 */
export function getRandomCarpathianPoint() {
  const { minLat, maxLat, minLng, maxLng } = CARPATHIAN_BBOX;
  let lat, lng;
  let attempts = 0;
  
  do {
    lat = minLat + Math.random() * (maxLat - minLat);
    lng = minLng + Math.random() * (maxLng - minLng);
    attempts++;
    if (attempts > 500) break;
  } while (!isInsideCarpathianBasin(lat, lng));

  return { lat, lng };
}

/**
 * Kurált kültéri helyszínek a Kárpát-medence ikonikus tájairól
 * Kizárólag KÜLTÉRI KÖZUTAK és KILÁTÓK, garantált Street View bejárhatósággal (nem szállodák/épületbelsők!)
 */
export const CURATED_LOCATIONS = [
  {
    id: "cur-1",
    title: "Visegrád – Panoráma út a Dunakanyar felett",
    region: "Dunakanyar, Magyarország",
    lat: 47.7946,
    lng: 18.9804,
    heading: 315,
    pitch: 0,
    description: "A Dunakanyar lélegzetelállító panorámája a visegrádi fellegvár alatti szerpentinről, a Börzsöny hegyeivel szemben."
  },
  {
    id: "cur-2",
    title: "Tihanyi Pisky sétány a Balaton felett",
    region: "Balaton-felvidék, Magyarország",
    lat: 46.9142,
    lng: 17.8899,
    heading: 140,
    pitch: 0,
    description: "A tihanyi Bencés Apátság melletti panorámasétány, ahonnan belátni a Balaton keleti medencéjét és a füredi öblöt."
  },
  {
    id: "cur-3",
    title: "Békás-szoros (Cheile Bicazului)",
    region: "Gyergyói-havasok / Neamț, Erdély",
    lat: 46.8122,
    lng: 25.8276,
    heading: 85,
    pitch: 15,
    description: "Kanyargós hegyi közút a Keleti-Kárpátok legszűkebb, több száz méteres függőleges mészkősziklái között."
  },
  {
    id: "cur-4",
    title: "Magas-Tátra – Csorba-tó (Štrbské Pleso)",
    region: "Szepesség, Felvidék (Szlovákia)",
    lat: 49.1195,
    lng: 20.0620,
    heading: 15,
    pitch: 8,
    description: "A gleccsertó partján húzódó sétaút, háttérben a Magas-Tátra hófödte csúcsaival."
  },
  {
    id: "cur-5",
    title: "Torockó és a Székelykő",
    region: "Torockói-hegység, Erdély",
    lat: 46.4518,
    lng: 23.5708,
    heading: 70,
    pitch: 12,
    description: "A híres erdélyi falu főutcája a monumentális Székelykő sziklafalának árnyékában."
  },
  {
    id: "cur-6",
    title: "Hortobágyi Kilenclyukú híd (33-as főút)",
    region: "Hortobágyi Nemzeti Park, Magyarország",
    lat: 47.5818,
    lng: 21.1477,
    heading: 265,
    pitch: 0,
    description: "A végtelen puszta és a klasszicista kőhíd látképe a Hortobágy folyó partján."
  },
  {
    id: "cur-7",
    title: "Kassa – Fő utca és a Szent Erzsébet-dóm",
    region: "Abaúj / Kassa, Felvidék (Szlovákia)",
    lat: 48.7205,
    lng: 21.2575,
    heading: 175,
    pitch: 10,
    description: "Európa egyik legkeletibb gótikus székesegyháza Kassa tágas, történelmi sétálóutcáján."
  },
  {
    id: "cur-8",
    title: "Szabadka – Városháza előtti tér",
    region: "Bácska / Vajdaság (Szerbia)",
    lat: 46.1002,
    lng: 19.6650,
    heading: 325,
    pitch: 5,
    description: "A magyar szecesszió csodája, Komor és Jakab által tervezett Zsolnay-kerámiás műremek a főtéren."
  },
  {
    id: "cur-9",
    title: "Dévényi vár és a Duna–Morva összefolyás",
    region: "Pozsony vidéke, Felvidék (Szlovákia)",
    lat: 48.1738,
    lng: 16.9790,
    heading: 215,
    pitch: 5,
    description: "A Duna és a Morva folyó találkozásánál meredeken kiemelkedő sziklavár közútja."
  },
  {
    id: "cur-10",
    title: "Vajdahunyad vára előtti tér",
    region: "Hunyad, Erdély",
    lat: 45.7490,
    lng: 22.8885,
    heading: 335,
    pitch: 10,
    description: "A Hunyadiak lenyűgöző gótikus lovagvára a Zalasd patak hídja előtt állva."
  },
  {
    id: "cur-11",
    title: "Badacsony – Római út a bazalthegy lábánál",
    region: "Tapolcai-medence, Magyarország",
    lat: 46.7905,
    lng: 17.4985,
    heading: 210,
    pitch: 3,
    description: "Híres panorámaút a Balaton partján, a vulkáni bazalthegy szőlőültetvényei között."
  },
  {
    id: "cur-12",
    title: "Esztergomi Víziváros és a Duna-part",
    region: "Pilis / Esztergom, Magyarország",
    lat: 47.7975,
    lng: 18.7360,
    heading: 80,
    pitch: 12,
    description: "A Várhegy tetején magasodó Bazilika a Duna-parti sétányról és a Mária Valéria híd környékéről."
  },
  {
    id: "cur-13",
    title: "Gyilkos-tó hegyi útja",
    region: "Gyergyói-havasok, Erdély",
    lat: 46.7905,
    lng: 25.7925,
    heading: 310,
    pitch: 5,
    description: "A természetes gáttó partján kanyargó hegyi út, a vízből kiálló fatörzsek csonkjaival."
  },
  {
    id: "cur-14",
    title: "Pécs – Széchenyi tér",
    region: "Mecsekalja / Pécs, Magyarország",
    lat: 46.0772,
    lng: 18.2284,
    heading: 25,
    pitch: 8,
    description: "A mediterrán hangulatú pécsi főtér a Gázi Kászim pasa dzsámijával a Mecsek lankáin."
  },
  {
    id: "cur-15",
    title: "Segesvári vár alatti középkori utca",
    region: "Küküllő mente, Erdély",
    lat: 46.2195,
    lng: 24.7928,
    heading: 205,
    pitch: 8,
    description: "Épségben fennmaradt középkori utcácska az erődített városfalak és bástyák tövében."
  },
  {
    id: "cur-16",
    title: "Árva vára alatti közút (Oravský Podzámok)",
    region: "Árva vidéke, Felvidék (Szlovákia)",
    lat: 49.2612,
    lng: 19.3585,
    heading: 75,
    pitch: 20,
    description: "A 112 méter magas sziklaszirten álló 'sasfészek' fellegvár a folyóparti útról nézve."
  },
  {
    id: "cur-17",
    title: "Kopácsi-rét nemzeti parki út",
    region: "Drávaszög / Baranya (Horvátország)",
    lat: 45.6268,
    lng: 18.7891,
    heading: 110,
    pitch: 0,
    description: "A Duna és a Dráva árterének háborítatlan zöldje a Kárpát-medence déli kapujában."
  },
  {
    id: "cur-18",
    title: "Nagyszeben – Nagypiac (Piața Mare)",
    region: "Szászföld, Erdély",
    lat: 45.7967,
    lng: 24.1518,
    heading: 135,
    pitch: 5,
    description: "Az erdélyi szászok történelmi főtere, a jellegzetes szem alakú tetőablakokkal díszített házakkal."
  },
  {
    id: "cur-19",
    title: "Dobogókő – Eötvös Loránd menedékház előtti kilátó",
    region: "Visegrádi-hegység, Magyarország",
    lat: 47.7195,
    lng: 18.8995,
    heading: 350,
    pitch: 0,
    description: "A magyar természetjárás bölcsője, kilátással a Prédikálószékre és a Dunakanyarra."
  },
  {
    id: "cur-20",
    title: "Tokaj – Bodrog-híd és a Kopasz-hegy lába",
    region: "Tokaj-Hegyalja, Magyarország",
    lat: 48.1215,
    lng: 21.4110,
    heading: 115,
    pitch: 0,
    description: "A világhírű borvidék központja a Bodrog folyó partján, a Kopasz-hegy tövében."
  }
];
