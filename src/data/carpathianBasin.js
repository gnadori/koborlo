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
    if (attempts > 500) break; // fallback védelmi korlát
  } while (!isInsideCarpathianBasin(lat, lng));

  return { lat, lng };
}

/**
 * Kurált helyszínek a Kárpát-medence változatos tájairól
 * Gondosan ellenőrzött koordinátákkal és érdekes tájékoztató szöveggel
 */
export const CURATED_LOCATIONS = [
  {
    id: "cur-1",
    title: "Visegrád – Fellegvár panoráma",
    region: "Dunakanyar, Magyarország",
    lat: 47.7937,
    lng: 18.9808,
    heading: 310,
    pitch: -5,
    description: "A Dunakanyar ikonikus látképe a visegrádi várból, ahonnan a folyó U-alakú kanyarulata és a Börzsöny hegyvonulata tárul elénk."
  },
  {
    id: "cur-2",
    title: "Tihanyi Apátság és Balaton",
    region: "Balaton-felvidék, Magyarország",
    lat: 46.9136,
    lng: 17.8893,
    heading: 140,
    pitch: 0,
    description: "Az 1055-ben alapított bencés apátság sétánya, csodálatos kilátással a Balaton keleti medencéjére."
  },
  {
    id: "cur-3",
    title: "Békás-szoros (Cheile Bicazului)",
    region: "Székelyföld / Neamț határ, Erdély",
    lat: 46.8122,
    lng: 25.8276,
    heading: 80,
    pitch: 15,
    description: "A Keleti-Kárpátok egyik leglátványosabb szurdokvölgye, több száz méteres függőleges mészkőfalak között kanyargó hegyi úttal."
  },
  {
    id: "cur-4",
    title: "Magas-Tátra – Csorba-tó (Štrbské Pleso)",
    region: "Szepesség, Felvidék (Szlovákia)",
    lat: 49.1202,
    lng: 20.0631,
    heading: 10,
    pitch: 10,
    description: "A Kárpátok legmagasabb hegyvonulatának lábánál fekvő gleccsertó, 1346 méteres tengerszint feletti magasságban."
  },
  {
    id: "cur-5",
    title: "Torockó és a Székelykő",
    region: "Torockói-hegység, Erdély",
    lat: 46.4528,
    lng: 23.5703,
    heading: 65,
    pitch: 15,
    description: "Europa Nostra-díjas falu a Székelykő lábánál, ahol a hegy alakja miatt 'kétszer kel fel a nap'."
  },
  {
    id: "cur-6",
    title: "Hortobágyi Kilenclyukú híd",
    region: "Hortobágyi Nemzeti Park, Magyarország",
    lat: 47.5818,
    lng: 21.1477,
    heading: 265,
    pitch: 0,
    description: "A puszta jelképe, Magyarország leghosszabb kőhídja a Hortobágy folyó felett."
  },
  {
    id: "cur-7",
    title: "Kassa – Fő utca és a Szent Erzsébet-dóm",
    region: "Abaúj / Kassa, Felvidék (Szlovákia)",
    lat: 48.7208,
    lng: 21.2582,
    heading: 180,
    pitch: 10,
    description: "Európa egyik legkeletibb gótikus katedrálisa és Rákóczi Ferenc nyughelye a pezsgő történelmi belvárosban."
  },
  {
    id: "cur-8",
    title: "Szabadka – Városháza",
    region: "Bácska / Vajdaság (Szerbia)",
    lat: 46.1005,
    lng: 19.6653,
    heading: 320,
    pitch: 5,
    description: "A magyar szecesszió egyik remekműve, Komor Marcell és Jakab Dezső tervei alapján, Zsolnay kerámiákkal díszítve."
  },
  {
    id: "cur-9",
    title: "Munkácsi Vár (Palanok)",
    region: "Kárpátalja (Ukrajna)",
    lat: 48.4317,
    lng: 22.6865,
    heading: 205,
    pitch: 12,
    description: "A Latorca völgye felett magasodó vulkáni hegyen épült történelmi vár, Zrínyi Ilona hősies védelmének színhelye."
  },
  {
    id: "cur-10",
    title: "Segesvár – Óratorony és várnegyed",
    region: "Küküllő mente, Erdély",
    lat: 46.2195,
    lng: 24.7928,
    heading: 210,
    pitch: 8,
    description: "UNESCO Világörökségi középkori erődített város, épségben megmaradt tornyokkal és macskaköves sikátorokkal."
  },
  {
    id: "cur-11",
    title: "Fraknó vára (Burg Forchtenstein)",
    region: "Rozália-hegység, Burgenland (Ausztria)",
    lat: 47.7378,
    lng: 16.3308,
    heading: 240,
    pitch: 10,
    description: "Az Esterházy hercegek legendás fellegvára az egykori magyar-osztrák határon."
  },
  {
    id: "cur-12",
    title: "Lillafüred – Palotaszálló és a Hámori-tó",
    region: "Bükk-vidék, Magyarország",
    lat: 48.1044,
    lng: 20.6225,
    heading: 250,
    pitch: 5,
    description: "A Bükk-hegység mélyén fekvő neoreneszánsz Palotaszálló a Hámori-tó és a Szinva-vízesés szomszédságában."
  },
  {
    id: "cur-13",
    title: "Dévényi vár és a Morva torkolata",
    region: "Kis-Kárpátok / Pozsony pereme, Felvidék",
    lat: 48.1741,
    lng: 16.9785,
    heading: 215,
    pitch: 5,
    description: "A Duna és a Morva összefolyásánál magasodó sziklavár, a történelmi Magyar Királyság nyugati kapuja."
  },
  {
    id: "cur-14",
    title: "Vajdahunyadi vár (Castelul Corvinilor)",
    region: "Hunyad, Erdély",
    lat: 45.7495,
    lng: 22.8883,
    heading: 330,
    pitch: 10,
    description: "A Hunyadiak lenyűgöző gótikus és reneszánsz lovagvára a Zalasd vize felett."
  },
  {
    id: "cur-15",
    title: "Esztergomi Bazilika és Duna-part",
    region: "Pilis / Duna-kanyar, Magyarország",
    lat: 47.7989,
    lng: 18.7358,
    heading: 75,
    pitch: 10,
    description: "Magyarország legnagyobb egyházi épülete a Várhegyen, kilátással a Mária Valéria hídra és Párkányra."
  },
  {
    id: "cur-16",
    title: "Kopácsi-rét Természetvédelmi Park",
    region: "Drávaszög / Baranya (Horvátország)",
    lat: 45.6268,
    lng: 18.7891,
    heading: 105,
    pitch: 0,
    description: "A Duna és a Dráva összefolyásának egyedülálló ártéri vadonja és madárparadicsoma."
  },
  {
    id: "cur-17",
    title: "Pécs – Széchenyi tér és a Gázi Kászim pasa dzsámija",
    region: "Mecsek / Baranya, Magyarország",
    lat: 46.0772,
    lng: 18.2284,
    heading: 20,
    pitch: 8,
    description: "A török kori hódoltság legjelentősebb hazai emléke a mediterrán hangulatú pécsi főtéren."
  },
  {
    id: "cur-18",
    title: "Gyilkos-tó és a Hagymás-hegység",
    region: "Gyergyói-havasok, Erdély",
    lat: 46.7905,
    lng: 25.7925,
    heading: 315,
    pitch: 5,
    description: "1837-ben hegyomlás által keletkezett természetes torlasztó, vízből kiálló megkövesedett fenyőcsonkokkal."
  },
  {
    id: "cur-19",
    title: "Selmecbánya (Banská Štiavnica) – Történelmi óváros",
    region: "Selmeci-hegység, Felvidék (Szlovákia)",
    lat: 48.4589,
    lng: 18.8929,
    heading: 170,
    pitch: 0,
    description: "Az egykori gazdag bányaváros festői, hegyoldalra épült reneszánsz és barokk palotái, UNESCO világörökség."
  },
  {
    id: "cur-20",
    title: "Pannonhalmi Főapátság",
    region: "Sokorói-dombság, Magyarország",
    lat: 47.5524,
    lng: 17.7607,
    heading: 190,
    pitch: 10,
    description: "996-ban alapított ezeréves bencés monostor a Szent Márton-hegy tetején."
  },
  {
    id: "cur-21",
    title: "Péterváradi Vár (Petrovaradin)",
    region: "Újvidék / Szerémség (Szerbia)",
    lat: 45.2530,
    lng: 19.8633,
    heading: 300,
    pitch: 2,
    description: "A 'Duna Gibraltárja' erődítmény a fordított mutatójú óratoronnyal, szemben Újvidék városával."
  },
  {
    id: "cur-22",
    title: "Badacsony és a Szent György-hegy bazaltorgonái",
    region: "Tapolcai-medence, Magyarország",
    lat: 46.8402,
    lng: 17.4478,
    heading: 195,
    pitch: 5,
    description: "Vulkáni tanúhegyek, szőlőültetvények és a Balaton tükröződő víztükre a tanúhegyek tetejéről."
  },
  {
    id: "cur-23",
    title: "Árva vára (Oravský Hrad)",
    region: "Árva vidéke, Észak-Felvidék (Szlovákia)",
    lat: 49.2612,
    lng: 19.3585,
    heading: 75,
    pitch: 20,
    description: "A 112 méter magas mészkősziklára merészen ráépített fellegvár az Árva folyó kanyarulatában."
  },
  {
    id: "cur-24",
    title: "Nagyszebeni Nagypiac (Piața Mare)",
    region: "Szászföld, Erdély",
    lat: 45.7967,
    lng: 24.1518,
    heading: 130,
    pitch: 5,
    description: "Az erdélyi szászok történelmi központja, a házak tetőin jellegzetes 'figyelő szemekkel'."
  },
  {
    id: "cur-25",
    title: "Tokaj – A Tisza és a Bodrog torkolata",
    region: "Zemplén / Hegyalja, Magyarország",
    lat: 48.1187,
    lng: 21.4132,
    heading: 110,
    pitch: 0,
    description: "A világhírű tokaji borvidék szíve, ahol a Bodrog a Tiszába ömlik a Kopasz-hegy lábánál."
  }
];
