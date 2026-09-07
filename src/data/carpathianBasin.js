/**
 * Kárpát-medence földrajzi határai, 50 kurált nevezetessége és 50 nagyvárosa
 */

// A Kárpát-medence körvonalát közelítő sokszög
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

export const CARPATHIAN_BBOX = {
  minLat: 44.7,
  maxLat: 49.5,
  minLng: 16.0,
  maxLng: 26.3,
};

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
 * 50 Kárpát-medencei nagyváros és jelentős történelmi központ (3. körhöz)
 */
export const CARPATHIAN_MAJOR_CITIES = [
  // Magyarország (20 város)
  { name: "Budapest", region: "Közép-Magyarország", lat: 47.4979, lng: 19.0402, radiusKm: 6.0 },
  { name: "Debrecen", region: "Észak-Alföld", lat: 47.5316, lng: 21.6273, radiusKm: 4.5 },
  { name: "Szeged", region: "Dél-Alföld", lat: 46.2530, lng: 20.1414, radiusKm: 4.0 },
  { name: "Miskolc", region: "Észak-Magyarország", lat: 48.1035, lng: 20.7784, radiusKm: 4.5 },
  { name: "Pécs", region: "Dél-Dunántúl", lat: 46.0727, lng: 18.2323, radiusKm: 4.0 },
  { name: "Győr", region: "Nyugat-Dunántúl", lat: 47.6875, lng: 17.6504, radiusKm: 4.0 },
  { name: "Nyíregyháza", region: "Észak-Alföld", lat: 47.9554, lng: 21.7167, radiusKm: 4.0 },
  { name: "Kecskemét", region: "Dél-Alföld", lat: 46.9075, lng: 19.6918, radiusKm: 3.5 },
  { name: "Székesfehérvár", region: "Közép-Dunántúl", lat: 47.1860, lng: 18.4221, radiusKm: 3.5 },
  { name: "Szombathely", region: "Nyugat-Dunántúl", lat: 47.2307, lng: 16.6218, radiusKm: 3.5 },
  { name: "Szolnok", region: "Észak-Alföld", lat: 47.1751, lng: 20.1837, radiusKm: 3.5 },
  { name: "Tatabánya", region: "Közép-Dunántúl", lat: 47.5692, lng: 18.3943, radiusKm: 3.0 },
  { name: "Kaposvár", region: "Dél-Dunántúl", lat: 46.3593, lng: 17.7967, radiusKm: 3.0 },
  { name: "Békéscsaba", region: "Dél-Alföld", lat: 46.6806, lng: 21.0967, radiusKm: 3.5 },
  { name: "Veszprém", region: "Közép-Dunántúl", lat: 47.0933, lng: 17.9115, radiusKm: 3.5 },
  { name: "Zalaegerszeg", region: "Nyugat-Dunántúl", lat: 46.8417, lng: 16.8416, radiusKm: 3.0 },
  { name: "Eger", region: "Észak-Magyarország", lat: 47.9025, lng: 20.3772, radiusKm: 3.0 },
  { name: "Nagykanizsa", region: "Nyugat-Dunántúl", lat: 46.4535, lng: 16.9910, radiusKm: 3.0 },
  { name: "Sopron", region: "Nyugat-Dunántúl", lat: 47.6817, lng: 16.5845, radiusKm: 3.0 },
  { name: "Baja", region: "Dél-Alföld", lat: 46.1812, lng: 18.9553, radiusKm: 3.0 },

  // Erdély, Partium, Bánság (13 város)
  { name: "Kolozsvár (Cluj-Napoca)", region: "Erdély", lat: 46.7712, lng: 23.6236, radiusKm: 4.5 },
  { name: "Temesvár (Timișoara)", region: "Bánság", lat: 45.7537, lng: 21.2257, radiusKm: 4.5 },
  { name: "Brassó (Brașov)", region: "Erdély", lat: 45.6579, lng: 25.6012, radiusKm: 4.0 },
  { name: "Nagyvárad (Oradea)", region: "Partium", lat: 47.0465, lng: 21.9189, radiusKm: 4.0 },
  { name: "Arad", region: "Partium / Bánság", lat: 46.1866, lng: 21.3123, radiusKm: 3.5 },
  { name: "Nagyszeben (Sibiu)", region: "Erdély", lat: 45.7983, lng: 24.1256, radiusKm: 3.5 },
  { name: "Marosvásárhely (Târgu Mureș)", region: "Székelyföld / Erdély", lat: 46.5456, lng: 24.5625, radiusKm: 3.5 },
  { name: "Szatmárnémeti (Satu Mare)", region: "Partium", lat: 47.7900, lng: 22.8900, radiusKm: 3.5 },
  { name: "Nagybánya (Baia Mare)", region: "Máramaros / Partium", lat: 47.6567, lng: 23.5850, radiusKm: 3.5 },
  { name: "Csíkszereda (Miercurea Ciuc)", region: "Székelyföld", lat: 46.3606, lng: 25.8014, radiusKm: 2.5 },
  { name: "Sepsiszentgyörgy (Sfântu Gheorghe)", region: "Székelyföld", lat: 45.8636, lng: 25.7875, radiusKm: 2.5 },
  { name: "Gyulafehérvár (Alba Iulia)", region: "Erdély", lat: 46.0697, lng: 23.5714, radiusKm: 3.0 },
  { name: "Déva (Deva)", region: "Hunyad / Erdély", lat: 45.8772, lng: 22.9108, radiusKm: 3.0 },

  // Felvidék (11 város)
  { name: "Pozsony (Bratislava)", region: "Felvidék (Szlovákia)", lat: 48.1486, lng: 17.1077, radiusKm: 5.0 },
  { name: "Kassa (Košice)", region: "Felvidék (Szlovákia)", lat: 48.7164, lng: 21.2611, radiusKm: 4.5 },
  { name: "Eperjes (Prešov)", region: "Felvidék (Szlovákia)", lat: 48.9984, lng: 21.2393, radiusKm: 3.5 },
  { name: "Zsolna (Žilina)", region: "Felvidék (Szlovákia)", lat: 49.2231, lng: 18.7394, radiusKm: 3.5 },
  { name: "Nyitra (Nitra)", region: "Felvidék (Szlovákia)", lat: 48.3061, lng: 18.0764, radiusKm: 3.5 },
  { name: "Besztercebánya (Banská Bystrica)", region: "Felvidék (Szlovákia)", lat: 48.7363, lng: 19.1462, radiusKm: 3.5 },
  { name: "Nagyszombat (Trnava)", region: "Felvidék (Szlovákia)", lat: 48.3774, lng: 17.5883, radiusKm: 3.0 },
  { name: "Trencsén (Trenčín)", region: "Felvidék (Szlovákia)", lat: 48.8945, lng: 18.0444, radiusKm: 3.0 },
  { name: "Poprád (Poprad)", region: "Szepesség / Felvidék", lat: 49.0560, lng: 20.2970, radiusKm: 3.0 },
  { name: "Komárom (Komárno)", region: "Csallóköz / Felvidék", lat: 47.7636, lng: 18.1264, radiusKm: 3.0 },
  { name: "Érsekújvár (Nové Zámky)", region: "Felvidék (Szlovákia)", lat: 47.9856, lng: 18.1611, radiusKm: 3.0 },

  // Vajdaság (3 város)
  { name: "Újvidék (Novi Sad)", region: "Vajdaság (Szerbia)", lat: 45.2671, lng: 19.8335, radiusKm: 4.0 },
  { name: "Szabadka (Subotica)", region: "Vajdaság (Szerbia)", lat: 46.1005, lng: 19.6653, radiusKm: 3.5 },
  { name: "Zombor (Sombor)", region: "Vajdaság (Szerbia)", lat: 45.7742, lng: 19.1122, radiusKm: 3.0 },

  // Kárpátalja (2 város)
  { name: "Ungvár (Uzhhorod)", region: "Kárpátalja (Ukrajna)", lat: 48.6208, lng: 22.2879, radiusKm: 3.0 },
  { name: "Munkács (Mukachevo)", region: "Kárpátalja (Ukrajna)", lat: 48.4419, lng: 22.7178, radiusKm: 3.0 },

  // Burgenland, Drávaszög (1-1 város)
  { name: "Kismarton (Eisenstadt)", region: "Burgenland (Ausztria)", lat: 47.8457, lng: 16.5253, radiusKm: 2.5 },
  { name: "Eszék (Osijek)", region: "Drávaszög / Szlavónia", lat: 45.5550, lng: 18.6955, radiusKm: 3.5 },
];

export function getRandomCityCandidate() {
  const city = CARPATHIAN_MAJOR_CITIES[Math.floor(Math.random() * CARPATHIAN_MAJOR_CITIES.length)];
  const angle = Math.random() * Math.PI * 2;
  const distKm = Math.random() * city.radiusKm;
  const latOffset = (Math.cos(angle) * distKm) / 111;
  const lngOffset = (Math.sin(angle) * distKm) / 75;

  return {
    city,
    lat: city.lat + latOffset,
    lng: city.lng + lngOffset,
  };
}

/**
 * 50 gondosan kiválasztott, KÜLTÉRI, BEJÁRHATÓ Kárpát-medencei nevezetesség (1-2. körhöz)
 */
export const CURATED_LOCATIONS = [
  // 1-10: Dunakanyar, Balaton, Alföld, Északi-Középhegység
  {
    id: "cur-1",
    title: "Visegrád – Panoráma szerpentin a Dunakanyar felett",
    region: "Dunakanyar, Magyarország",
    lat: 47.7946,
    lng: 18.9804,
    heading: 315,
    pitch: 0,
    description: "Látványos kilátás a Duna U-alakú kanyarulatára és a Börzsöny hegyvonulatára."
  },
  {
    id: "cur-2",
    title: "Tihanyi Pisky sétány a Balaton felett",
    region: "Balaton-felvidék, Magyarország",
    lat: 46.9142,
    lng: 17.8899,
    heading: 140,
    pitch: 0,
    description: "Az 1055-ben alapított bencés apátság sétánya a Balaton keleti medencéjére nézve."
  },
  {
    id: "cur-3",
    title: "Hortobágyi Kilenclyukú híd (33-as út)",
    region: "Hortobágy, Magyarország",
    lat: 47.5818,
    lng: 21.1477,
    heading: 265,
    pitch: 0,
    description: "A puszta ikonikus jelképe, Magyarország leghosszabb közúti kőhídja."
  },
  {
    id: "cur-4",
    title: "Badacsony – Római út a tanúhegy szőlői alatt",
    region: "Tapolcai-medence, Magyarország",
    lat: 46.7905,
    lng: 17.4985,
    heading: 210,
    pitch: 3,
    description: "Vulkáni bazalthegy, lankás szőlőültetvények és a Balaton panorámája."
  },
  {
    id: "cur-5",
    title: "Esztergom – Duna-part és a Várhegy",
    region: "Duna-kanyar, Magyarország",
    lat: 47.7975,
    lng: 18.7360,
    heading: 80,
    pitch: 12,
    description: "Magyarország legnagyobb temploma, a Bazilika a Duna vízparti sétányáról nézve."
  },
  {
    id: "cur-6",
    title: "Dobogókő – Kilátó a Dunakanyarra és a Börzsönyre",
    region: "Visegrádi-hegység, Magyarország",
    lat: 47.7195,
    lng: 18.8995,
    heading: 350,
    pitch: 0,
    description: "A magyar természetjárás szülőhelye, a Prédikálószék és a Dunakanyar hegyei."
  },
  {
    id: "cur-7",
    title: "Tokaj – Bodrog-híd és a Kopasz-hegy töve",
    region: "Tokaj-Hegyalja, Magyarország",
    lat: 48.1215,
    lng: 21.4110,
    heading: 115,
    pitch: 0,
    description: "A Bodrog és a Tisza torkolata a világörökségi borvidék szívében."
  },
  {
    id: "cur-8",
    title: "Pécs – Széchenyi tér a Dzsámival",
    region: "Mecsekalja, Magyarország",
    lat: 46.0772,
    lng: 18.2284,
    heading: 25,
    pitch: 8,
    description: "Mediterrán hangulatú történelmi főtér a török hódoltság legfontosabb hazai emlékével."
  },
  {
    id: "cur-9",
    title: "Lillafüred – Szinva-völgyi szerpentin és a Hámori-tó",
    region: "Bükk-vidék, Magyarország",
    lat: 48.1065,
    lng: 20.6200,
    heading: 240,
    pitch: 5,
    description: "A Bükk mélyén fekvő hegyvidéki üdülőhely kanyargós erdei közútja."
  },
  {
    id: "cur-10",
    title: "Kékestető – Magyarország legmagasabb pontja",
    region: "Mátra, Magyarország",
    lat: 47.8725,
    lng: 20.0075,
    heading: 180,
    pitch: 0,
    description: "1014 méteres magasságban futó hegyi út az ország csúcsánál."
  },

  // 11-20: Nyugat-Magyarország, Őrség, Fertő-tó, Bakony
  {
    id: "cur-11",
    title: "Pannonhalmi Főapátság alatti panorámaút",
    region: "Sokorói-dombság, Magyarország",
    lat: 47.5505,
    lng: 17.7580,
    heading: 30,
    pitch: 10,
    description: "Az ezeréves bencés monostor a Szent Márton-hegy tetején."
  },
  {
    id: "cur-12",
    title: "Fertőrákos – Fertő-parti út és a nádas",
    region: "Fertő-táj, Magyarország",
    lat: 47.7215,
    lng: 16.6545,
    heading: 60,
    pitch: 0,
    description: "A sztyepptó védett nádasa és a világörökségi táj a határvidéken."
  },
  {
    id: "cur-13",
    title: "Szalafő Pityerszer – Őrségi népi műemlékegyüttes",
    region: "Őrség, Magyarország",
    lat: 46.8655,
    lng: 16.3385,
    heading: 220,
    pitch: 0,
    description: "Tipikus őrségi szeres település zsuppfedeles boronaházakkal és fenyvesekkel."
  },
  {
    id: "cur-14",
    title: "Sümegi vár alatti közút",
    region: "Bakonyalja, Magyarország",
    lat: 46.9785,
    lng: 17.2820,
    heading: 340,
    pitch: 15,
    description: "A magányos mészkőszirten magasodó épségben megmaradt középkori végvár."
  },
  {
    id: "cur-15",
    title: "Cseszneki vár sziklái a 82-es főút felett",
    region: "Bakony, Magyarország",
    lat: 47.3520,
    lng: 17.8825,
    heading: 10,
    pitch: 12,
    description: "A Bakony sziklaszorosában emelkedő gótikus várrom."
  },
  {
    id: "cur-16",
    title: "Villányi pincesor és a Szársomlyó",
    region: "Villányi-hegység, Magyarország",
    lat: 45.8695,
    lng: 18.4555,
    heading: 90,
    pitch: 5,
    description: "A híres vörösborvidék dűlői és a mediterrán klímájú Szársomlyó mészkőbérce."
  },
  {
    id: "cur-17",
    title: "Hollókő – Ófalu védett macskaköves utcája",
    region: "Cserhát, Magyarország",
    lat: 47.9975,
    lng: 19.5820,
    heading: 195,
    pitch: 5,
    description: "UNESCO Világörökségi palóc falu, hagyományos kontyolt parasztházakkal."
  },
  {
    id: "cur-18",
    title: "Aggtelek – Baradla-barlang bejárati sziklafalai",
    region: "Gömör–Tornai-karszt, Magyarország",
    lat: 48.4710,
    lng: 20.4950,
    heading: 310,
    pitch: 10,
    description: "A monumentális fehér mészkőfalak a cseppkőbarlang kapujánál."
  },
  {
    id: "cur-19",
    title: "Füzéri vár alatti szerpentin",
    region: "Zempléni-hegység, Magyarország",
    lat: 48.5410,
    lng: 21.4580,
    heading: 45,
    pitch: 20,
    description: "Meredek vulkáni sziklakúpon újjáépített középkori vár a Zemplén erdeiben."
  },
  {
    id: "cur-20",
    title: "Tata – Öreg-tó partja és a Vár",
    region: "Vértes / Tatai-medence, Magyarország",
    lat: 47.6450,
    lng: 18.3185,
    heading: 300,
    pitch: 5,
    description: "Zsigmond és Mátyás király kedvenc vizes vára az Öreg-tó sétányán."
  },

  // 21-33: Erdély, Partium, Bánság, Székelyföld
  {
    id: "cur-21",
    title: "Békás-szoros (Cheile Bicazului)",
    region: "Gyergyói-havasok, Erdély",
    lat: 46.8122,
    lng: 25.8276,
    heading: 85,
    pitch: 15,
    description: "Kanyargós hegyi közút a Keleti-Kárpátok több száz méteres mészkőfalai között."
  },
  {
    id: "cur-22",
    title: "Torockó és a Székelykő",
    region: "Torockói-hegység, Erdély",
    lat: 46.4518,
    lng: 23.5708,
    heading: 70,
    pitch: 12,
    description: "Europa Nostra-díjas falu a monumentális Székelykő lábánál."
  },
  {
    id: "cur-23",
    title: "Gyilkos-tó hegyi útja",
    region: "Gyergyói-havasok, Erdély",
    lat: 46.7905,
    lng: 25.7925,
    heading: 310,
    pitch: 5,
    description: "Természetes torlasztó a fenyvesek mélyén, vízből kiálló fatörzsekkel."
  },
  {
    id: "cur-24",
    title: "Vajdahunyad vára előtti tér",
    region: "Hunyad, Erdély",
    lat: 45.7490,
    lng: 22.8885,
    heading: 335,
    pitch: 10,
    description: "A Hunyadiak lenyűgöző gótikus lovagvára a folyóparti híddal."
  },
  {
    id: "cur-25",
    title: "Segesvári vár alatti középkori utca",
    region: "Küküllő mente, Erdély",
    lat: 46.2195,
    lng: 24.7928,
    heading: 205,
    pitch: 8,
    description: "Épségben fennmaradt középkori várváros macskaköves sikátorokkal."
  },
  {
    id: "cur-26",
    title: "Nagyszeben – Nagypiac (Piața Mare)",
    region: "Szászföld, Erdély",
    lat: 45.7967,
    lng: 24.1518,
    heading: 135,
    pitch: 5,
    description: "Az erdélyi szászok történelmi központja a híres 'szemes' tetőkkel."
  },
  {
    id: "cur-27",
    title: "Törcsvári kastély (Bran) alatti közút",
    region: "Bucsecs-hegység pereme, Erdély",
    lat: 45.5145,
    lng: 25.3670,
    heading: 100,
    pitch: 15,
    description: "A Brassó melletti szorosban magasodó híres középkori határvár."
  },
  {
    id: "cur-28",
    title: "Transzfogarasi út (DN7C) és a Bâlea-vízesés",
    region: "Fogarasi-havasok, Erdély",
    lat: 45.6320,
    lng: 24.6180,
    heading: 190,
    pitch: 15,
    description: "A Déli-Kárpátok legmagasabb hegyláncán átívelő ikonikus szerpentin."
  },
  {
    id: "cur-29",
    title: "Tordai-hasadék bejárati közútja",
    region: "Erdélyi-érchegység, Erdély",
    lat: 46.5645,
    lng: 23.6930,
    heading: 275,
    pitch: 10,
    description: "Szent László legendás hasadéka, több kilométeres mészkőszurdok."
  },
  {
    id: "cur-30",
    title: "Csíksomlyói kegytemplom előtti út",
    region: "Csíki-medence, Székelyföld",
    lat: 46.3795,
    lng: 25.8260,
    heading: 75,
    pitch: 8,
    description: "A székelyek ősi zarándokhelye a Kis-Somlyó lábánál."
  },
  {
    id: "cur-31",
    title: "Szent Anna-tó hegyi útja a Csomád-kráterben",
    region: "Hargita / Csomád-hegység, Erdély",
    lat: 46.1285,
    lng: 25.8850,
    heading: 150,
    pitch: 0,
    description: "Közép-Európa egyetlen épségben megmaradt vulkáni krátertava."
  },
  {
    id: "cur-32",
    title: "Kazán-szoros és a Duna áttörése (Vaskapu)",
    region: "Bánsági-hegyvidék / Kazán-szoros",
    lat: 44.6050,
    lng: 22.2560,
    heading: 120,
    pitch: 5,
    description: "Ahol a Duna a Kárpátok déli ívén tör át hatalmas sziklák között."
  },
  {
    id: "cur-33",
    title: "Déva vára alatti felvonóút",
    region: "Hunyad, Erdély",
    lat: 45.8885,
    lng: 22.8980,
    heading: 200,
    pitch: 18,
    description: "A magányos vulkáni kúpon magasodó 'magos Déva vára' a Maros völgyében."
  },

  // 34-43: Felvidék (Szlovákia)
  {
    id: "cur-34",
    title: "Magas-Tátra – Csorba-tó (Štrbské Pleso)",
    region: "Szepesség, Felvidék (Szlovákia)",
    lat: 49.1195,
    lng: 20.0620,
    heading: 15,
    pitch: 8,
    description: "A gleccsertó partján húzódó sétaút a tátrai csúcsok árnyékában."
  },
  {
    id: "cur-35",
    title: "Kassa – Fő utca és a Szent Erzsébet-dóm",
    region: "Abaúj / Kassa, Felvidék (Szlovákia)",
    lat: 48.7205,
    lng: 21.2575,
    heading: 175,
    pitch: 10,
    description: "A történelmi Magyarország egyik legszebb gótikus katedrálisa a tágas sétálóutcán."
  },
  {
    id: "cur-36",
    title: "Árva vára alatti közút (Oravský Podzámok)",
    region: "Árva vidéke, Felvidék (Szlovákia)",
    lat: 49.2612,
    lng: 19.3585,
    heading: 75,
    pitch: 20,
    description: "Meredek sziklabércre épült fellegvár az Árva folyó partján."
  },
  {
    id: "cur-37",
    title: "Dévényi vár és a Duna–Morva összefolyás",
    region: "Pozsony vidéke, Felvidék (Szlovákia)",
    lat: 48.1738,
    lng: 16.9790,
    heading: 215,
    pitch: 5,
    description: "A Duna és a Morva folyó találkozásánál emelkedő történelmi kapuvár."
  },
  {
    id: "cur-38",
    title: "Szepesi vár (Spišský Hrad) alatti hegyi út",
    region: "Szepesség, Felvidék (Szlovákia)",
    lat: 48.9995,
    lng: 20.7680,
    heading: 130,
    pitch: 12,
    description: "Közép-Európa egyik legnagyobb kiterjedésű vára a mészkődomb tetején."
  },
  {
    id: "cur-39",
    title: "Selmecbánya (Banská Štiavnica) – Történelmi óváros",
    region: "Selmeci-hegység, Felvidék (Szlovákia)",
    lat: 48.4590,
    lng: 18.8930,
    heading: 165,
    pitch: 0,
    description: "A hegyoldalba épült reneszánsz bányaváros festői utcái, UNESCO világörökség."
  },
  {
    id: "cur-40",
    title: "Bártfa (Bardejov) – Gótikus városháza tér",
    region: "Sáros, Felvidék (Szlovákia)",
    lat: 49.2920,
    lng: 21.2760,
    heading: 10,
    pitch: 5,
    description: "Tökéletesen megőrzött gótikus és reneszánsz polgárházak négyszögletes főtere."
  },
  {
    id: "cur-41",
    title: "Krasznahorka vára alatti panorámaút",
    region: "Gömör, Felvidék (Szlovákia)",
    lat: 48.6550,
    lng: 20.6010,
    heading: 350,
    pitch: 12,
    description: "Az Andrássyak büszke vára a Rozsnyói-medence felett."
  },
  {
    id: "cur-42",
    title: "Donovaly hágó a Nagy-Fátra és Alacsony-Tátra határán",
    region: "Alacsony-Tátra, Felvidék (Szlovákia)",
    lat: 48.8780,
    lng: 19.2240,
    heading: 45,
    pitch: 5,
    description: "960 méteres hegyi hágó fenyvesekkel és tágas havasi legelőkkel."
  },
  {
    id: "cur-43",
    title: "Trencsén vára (Trenčiansky Hrad) a Vág völgyében",
    region: "Vág mente, Felvidék (Szlovákia)",
    lat: 48.8950,
    lng: 18.0440,
    heading: 85,
    pitch: 15,
    description: "Csák Máté hatalmas sziklavára a római kori felirattal."
  },

  // 44-46: Kárpátalja (Ukrajna)
  {
    id: "cur-44",
    title: "Munkácsi Vár (Palanok) alatti közút",
    region: "Kárpátalja (Ukrajna)",
    lat: 48.4317,
    lng: 22.6865,
    heading: 205,
    pitch: 12,
    description: "Vulkáni hegy tetején emelkedő vár, Zrínyi Ilona és Rákóczi szabadságharcának jelképe."
  },
  {
    id: "cur-45",
    title: "Vereckei-hágó hegyi útja az emlékművel",
    region: "Északkeleti-Kárpátok / Kárpátalja",
    lat: 48.7750,
    lng: 23.1750,
    heading: 110,
    pitch: 5,
    description: "A 841 méter magas történelmi hágó, a honfoglaló magyarok ősi útvonala."
  },
  {
    id: "cur-46",
    title: "Ungvári vár és skanzen előtti utca",
    region: "Ung völgye, Kárpátalja (Ukrajna)",
    lat: 48.6215,
    lng: 22.3050,
    heading: 280,
    pitch: 5,
    description: "A Drugethek ezeréves vára az Ung folyó feletti dombon."
  },

  // 47-48: Vajdaság (Szerbia)
  {
    id: "cur-47",
    title: "Szabadka – Városháza előtti tér",
    region: "Bácska / Vajdaság (Szerbia)",
    lat: 46.1002,
    lng: 19.6650,
    heading: 325,
    pitch: 5,
    description: "A magyar szecesszió remekműve Zsolnay-kerámiákkal díszítve a Korzón."
  },
  {
    id: "cur-48",
    title: "Péterváradi vár a Duna felett (Újvidék)",
    region: "Szerémség / Duna mente (Szerbia)",
    lat: 45.2530,
    lng: 19.8633,
    heading: 300,
    pitch: 2,
    description: "A 'Duna Gibraltárja' erőd a fordított mutatós óratoronnyal."
  },

  // 49: Burgenland (Ausztria)
  {
    id: "cur-49",
    title: "Fraknó vára (Burg Forchtenstein) szerpentinje",
    region: "Rozália-hegység, Burgenland (Ausztria)",
    lat: 47.7378,
    lng: 16.3308,
    heading: 240,
    pitch: 10,
    description: "Az Esterházy hercegek monumentális sziklavára a határvidéken."
  },

  // 50: Drávaszög / Szlavónia
  {
    id: "cur-50",
    title: "Kopácsi-rét Nemzeti Parki útja",
    region: "Drávaszög, Horvátország",
    lat: 45.6268,
    lng: 18.7891,
    heading: 110,
    pitch: 0,
    description: "A Duna és a Dráva árterének háborítatlan madár- és vadonparadicsoma."
  }
];
