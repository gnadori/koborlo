/**
 * Street View betöltő és Kárpát-medencei helyszínsorsoló szolgáltatás
 */
import { CURATED_LOCATIONS, getRandomCarpathianPoint } from '../data/carpathianBasin';

let googleMapsPromise = null;

// Aktuális API kulcs lekérése (környezeti változóból vagy böngésző tárolóból)
export function getGoogleMapsApiKey() {
  return (
    localStorage.getItem('koborlo_google_maps_key') ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
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
export async function findNearestPanorama(lat, lng, radius = 5000) {
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
          resolve({
            lat: data.location.latLng.lat(),
            lng: data.location.latLng.lng(),
            panoId: data.location.pano,
            description: data.location.description || 'Kárpát-medencei táj'
          });
        } else {
          reject(new Error('Nem található Street View panoráma a megadott körzetben'));
        }
      }
    );
  });
}

/**
 * Véletlenszerű, érvényes Kárpát-medencei panoráma keresése
 * Próbálkozásokkal biztosítja, hogy létező kültéri Street View pontot találjon
 */
export async function findRandomCarpathianPanorama(maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = getRandomCarpathianPoint();
    try {
      // 8-15 km-es körzetben keresünk közutat / panorámát
      const pano = await findNearestPanorama(candidate.lat, candidate.lng, 12000);
      return {
        ...pano,
        isCurated: false,
        title: 'Felfedezetlen Kóborlás',
        region: 'Kárpát-medence'
      };
    } catch (err) {
      // Próbálkozunk következő random ponttal
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
    isCurated: false
  };
}

/**
 * Egy teljes 5 körös játék helyszíneinek előkészítése
 * Felhasználói szabály:
 * 1. és 2. kör: Kurált helyszínek a Kárpát-medencéből
 * 3., 4. és 5. kör: Dinamikusan generált random pontok a Kárpát-medencéből
 */
export async function generateGameRounds() {
  const rounds = [];
  
  // 1. Két véletlenszerű, különböző kurált helyszín kiválasztása
  const shuffledCurated = [...CURATED_LOCATIONS].sort(() => 0.5 - Math.random());
  const selectedCurated = shuffledCurated.slice(0, 2);

  rounds.push({
    roundNumber: 1,
    isCurated: true,
    lat: selectedCurated[0].lat,
    lng: selectedCurated[0].lng,
    heading: selectedCurated[0].heading || 0,
    pitch: selectedCurated[0].pitch || 0,
    title: selectedCurated[0].title,
    region: selectedCurated[0].region,
    description: selectedCurated[0].description
  });

  rounds.push({
    roundNumber: 2,
    isCurated: true,
    lat: selectedCurated[1].lat,
    lng: selectedCurated[1].lng,
    heading: selectedCurated[1].heading || 0,
    pitch: selectedCurated[1].pitch || 0,
    title: selectedCurated[1].title,
    region: selectedCurated[1].region,
    description: selectedCurated[1].description
  });

  // 2. Három dinamikus random helyszín keresése (3., 4., 5. kör)
  // Ha van Google Maps API kulcs, valós Street View pontot keresünk
  const hasApiKey = !!getGoogleMapsApiKey();

  for (let r = 3; r <= 5; r++) {
    if (hasApiKey) {
      try {
        const randomPano = await findRandomCarpathianPanorama(8);
        rounds.push({
          roundNumber: r,
          isCurated: false,
          lat: randomPano.lat,
          lng: randomPano.lng,
          heading: Math.floor(Math.random() * 360),
          pitch: 0,
          title: `Kóborló Helyszín #${r}`,
          region: 'Kárpát-medence',
          description: randomPano.description || 'Véletlenszerű Kárpát-medencei pont.'
        });
        continue;
      } catch (e) {
        console.warn('Nem sikerült random panorámát generálni, tartalék helyszín használata:', e);
      }
    }

    // Tartalék (ha nincs még kulcs vagy offline/sikertelen sorsolás):
    // További kurált helyszínek a listából
    const backupCurated = shuffledCurated[r - 1] || CURATED_LOCATIONS[r % CURATED_LOCATIONS.length];
    rounds.push({
      roundNumber: r,
      isCurated: false,
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
