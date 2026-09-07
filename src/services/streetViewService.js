/**
 * Street View betöltő és Kárpát-medencei helyszínsorsoló szolgáltatás
 */
import { CURATED_LOCATIONS, getRandomCarpathianPoint, getRandomCityCandidate } from '../data/carpathianBasin';

let googleMapsPromise = null;

const DEFAULT_GOOGLE_MAPS_KEY = 'AIzaSyBf738xF8Jhqgn-UsbWEiSTQQBQMR56n0o';

// Aktuális API kulcs lekérése (környezeti változóból, böngésző tárolóból vagy alapértelmezettből)
export function getGoogleMapsApiKey() {
  return (
    localStorage.getItem('koborlo_google_maps_key') ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    DEFAULT_GOOGLE_MAPS_KEY
  );
}

// API kulcs mentése a böngészőben
export function saveGoogleMapsApiKey(key) {
  if (key) {
    localStorage.setItem('koborlo_google_maps_key', key.trim());
  } else {
    localStorage.removeItem('koborlo_google_maps_key');
  }
}

/**
 * Google Maps JavaScript API dinamikus betöltése
 */
export function loadGoogleMapsApi() {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('Nincs megadva Google Maps API kulcs'));
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Ha már van script tag
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.onload = () => resolve(window.google.maps);
      existingScript.onerror = (e) => reject(e);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps nem inicializálódott'));
      }
    };
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error('Nem sikerült betölteni a Google Maps API-t. Ellenőrizd a kulcsot és a hálózati kapcsolatot!'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Street View lefedettség keresése egy koordináta körül
 */
export async function findNearestPanorama(lat, lng, radius = 5000, requireLinks = true) {
  await loadGoogleMapsApi();
  const svService = new window.google.maps.StreetViewService();

  return new Promise((resolve, reject) => {
    svService.getPanorama(
      {
        location: { lat, lng },
        radius: radius,
        source: window.google.maps.StreetViewSource.OUTDOOR,
        preference: window.google.maps.StreetViewPreference.NEAREST
      },
      (data, status) => {
        if (status === window.google.maps.StreetViewStatus.OK && data && data.location) {
          // Ha bejárhatóság szükséges (3-5. random körök), megköveteljük az útkapcsolatokat
          if (requireLinks && (!data.links || data.links.length === 0)) {
            reject(new Error('Nem bejárható közút (nincsenek útvonal-kapcsolatok)'));
            return;
          }

          resolve({
            lat: data.location.latLng.lat(),
            lng: data.location.latLng.lng(),
            panoId: data.location.pano,
            description: data.location.description || 'Kárpát-medencei táj'
          });
        } else {
          reject(new Error('Nem található kültéri Street View panoráma a megadott körzetben'));
        }
      }
    );
  });
}

/**
 * Véletlenszerű, érvényes és BEJÁRHATÓ (mozgatható) Kárpát-medencei panoráma keresése
 */
export async function findRandomCarpathianPanorama(maxAttempts = 16) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = getRandomCarpathianPoint();
    try {
      // Csak olyan kültéri közutat fogadunk el, ahol a Street View autó járt és vannak útkapcsolatok (links)
      const pano = await findNearestPanorama(candidate.lat, candidate.lng, 15000, true);
      return {
        ...pano,
        isCurated: false,
        roundType: 'random',
        title: 'Felfedezetlen Kóborlás',
        region: 'Kárpát-medence'
      };
    } catch (err) {
      // Következő próbálkozás újabb random koordinátával
    }
  }

  // Végső tartalék: egy random kurált pont
  const fallback = CURATED_LOCATIONS[Math.floor(Math.random() * CURATED_LOCATIONS.length)];
  return {
    lat: fallback.lat,
    lng: fallback.lng,
    title: fallback.title,
    region: fallback.region,
    description: fallback.description,
    isCurated: false,
    roundType: 'random'
  };
}

/**
 * Véletlenszerű Kárpát-medencei nagyváros bejárható pontjának keresése (3. kör)
 */
export async function findRandomCityPanorama(maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = getRandomCityCandidate();
    try {
      // A nagyváros központja körül 1.5 km-en belül bejárható utcát keresünk
      const pano = await findNearestPanorama(candidate.lat, candidate.lng, 1500, true);
      return {
        ...pano,
        isCurated: false,
        roundType: 'city',
        title: `Nagyváros: ${candidate.city.name}`,
        region: candidate.city.region,
        description: `Kárpát-medencei nagyváros: ${candidate.city.name} (${candidate.city.region})`
      };
    } catch (err) {
      // Következő várospróbálkozás
    }
  }

  // Tartalék nagyváros (Budapest Lánchíd környéke)
  return {
    lat: 47.4985,
    lng: 19.0435,
    isCurated: false,
    roundType: 'city',
    title: 'Nagyváros: Budapest',
    region: 'Közép-Magyarország',
    description: 'Kárpát-medencei nagyváros: Budapest'
  };
}

/**
 * Egy teljes 5 körös játék helyszíneinek előkészítése
 * 1. és 2. kör: Kurált, kültéri nevezetes helyszínek (természeti és történelmi tájak)
 * 3. kör: Kárpát-medencei NAGYVÁROS (Budapest, Kolozsvár, Pozsony, Kassa, Szeged, Temesvár stb.)
 * 4. és 5. kör: Teljesen random, mozgatható/bejárható Kárpát-medencei közutak
 */
export async function generateGameRounds() {
  const rounds = [];
  const hasApiKey = !!getGoogleMapsApiKey();
  
  // 1. Két véletlenszerű kurált helyszín (1. és 2. kör)
  const shuffledCurated = [...CURATED_LOCATIONS].sort(() => 0.5 - Math.random());
  const selectedCurated = shuffledCurated.slice(0, 2);

  for (let i = 0; i < selectedCurated.length; i++) {
    const cur = selectedCurated[i];
    let panoInfo = null;

    if (hasApiKey) {
      try {
        panoInfo = await findNearestPanorama(cur.lat, cur.lng, 400, false);
      } catch (e) {
        console.warn('Nem sikerült kültéri panorámát illeszteni:', cur.title);
      }
    }

    rounds.push({
      roundNumber: i + 1,
      isCurated: true,
      roundType: 'curated',
      lat: panoInfo ? panoInfo.lat : cur.lat,
      lng: panoInfo ? panoInfo.lng : cur.lng,
      panoId: panoInfo ? panoInfo.panoId : undefined,
      heading: cur.heading || 0,
      pitch: cur.pitch || 0,
      title: cur.title,
      region: cur.region,
      description: cur.description
    });
  }

  // 2. Harmadik kör: Kárpát-medencei Nagyváros (3. kör)
  let cityRound = null;
  if (hasApiKey) {
    try {
      cityRound = await findRandomCityPanorama(12);
    } catch (e) {
      console.warn('Nem sikerült nagyvárosi panorámát találni:', e);
    }
  }

  if (!cityRound) {
    // Tartalék kurált nagyváros (Szabadka vagy Kassa)
    const backupCity = CURATED_LOCATIONS.find(l => l.title.includes('Kassa') || l.title.includes('Szabadka')) || CURATED_LOCATIONS[2];
    cityRound = {
      lat: backupCity.lat,
      lng: backupCity.lng,
      title: backupCity.title,
      region: backupCity.region,
      description: backupCity.description,
      isCurated: false,
      roundType: 'city'
    };
  }

  rounds.push({
    roundNumber: 3,
    isCurated: false,
    roundType: 'city',
    lat: cityRound.lat,
    lng: cityRound.lng,
    panoId: cityRound.panoId,
    heading: Math.floor(Math.random() * 360),
    pitch: 0,
    title: cityRound.title,
    region: cityRound.region,
    description: cityRound.description
  });

  // 3. Negyedik és ötödik kör: Teljesen véletlenszerű Kárpát-medencei pontok (4. és 5. kör)
  for (let r = 4; r <= 5; r++) {
    if (hasApiKey) {
      try {
        const randomPano = await findRandomCarpathianPanorama(16);
        rounds.push({
          roundNumber: r,
          isCurated: false,
          roundType: 'random',
          lat: randomPano.lat,
          lng: randomPano.lng,
          panoId: randomPano.panoId,
          heading: Math.floor(Math.random() * 360),
          pitch: 0,
          title: `Kóborló Helyszín #${r}`,
          region: 'Kárpát-medence',
          description: randomPano.description || 'Véletlenszerű Kárpát-medencei táj.'
        });
        continue;
      } catch (e) {
        console.warn('Nem sikerült random bejárható panorámát generálni:', e);
      }
    }

    // Tartalék
    const backupCurated = shuffledCurated[r] || CURATED_LOCATIONS[r % CURATED_LOCATIONS.length];
    rounds.push({
      roundNumber: r,
      isCurated: false,
      roundType: 'random',
      lat: backupCurated.lat,
      lng: backupCurated.lng,
      heading: backupCurated.heading || Math.floor(Math.random() * 360),
      pitch: backupCurated.pitch || 0,
      title: backupCurated.title,
      region: backupCurated.region,
      description: backupCurated.description
    });
  }

  return rounds;
}
