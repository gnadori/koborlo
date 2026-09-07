/**
 * Földrajzi számítások és pontozási algoritmus a Kóborló játékhoz
 */

// Két koordináta közötti távolság számítása Haversine-képlettel (km-ben)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Föld sugara km-ben
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Pontszám számítása a távolság alapján (0 - 5000 pont)
 * A Kárpát-medence átmérőjéhez (~700-800 km) kalibrált exponenciális lecsengés:
 * - 0-25 méteren belül: 5000 pont
 * - 5 km: ~4850 pont
 * - 25 km: ~4200 pont
 * - 75 km: ~3000 pont
 * - 200 km: ~1300 pont
 * - 500+ km: minimális pont
 */
export function calculateScore(distanceKm) {
  if (distanceKm <= 0.025) return 5000;
  
  // Exponenciális pontozási görbe Kárpát-medencei léptékre optimalizálva (skálafaktor: 140 km)
  const score = Math.round(5000 * Math.exp(-distanceKm / 140));
  return Math.max(0, Math.min(5000, score));
}

// Távolság formázása (pl. "350 m" vagy "42.8 km")
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Pontszám formázása ezres elválasztóval
export function formatScore(score) {
  return new Intl.NumberFormat('hu-HU').format(score);
}
