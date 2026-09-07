/**
 * Firebase szolgáltatás toplistához és statisztikákhoz
 * Ha nincs megadva Firebase config, automatikusan a böngésző LocalStorage-ét használja!
 */
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

// Alapértelmezett Firebase konfiguráció olvasása környezeti változókból vagy localStorage-ból
export function getFirebaseConfig() {
  const saved = localStorage.getItem('koborlo_firebase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Hibás mentett Firebase config', e);
    }
  }

  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  return null;
}

export function saveFirebaseConfig(configObj) {
  if (configObj && Object.keys(configObj).length > 0) {
    localStorage.setItem('koborlo_firebase_config', JSON.stringify(configObj));
  } else {
    localStorage.removeItem('koborlo_firebase_config');
  }
}

let db = null;

function initFirestore() {
  if (db) return db;
  const config = getFirebaseConfig();
  if (config && config.apiKey && config.projectId) {
    try {
      const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.warn('Nem sikerült inicializálni a Firebase-t, helyi tároló lesz használva:', err);
    }
  }
  return null;
}

const LOCAL_STORAGE_KEY = 'koborlo_leaderboard';

// Eredmény mentése (Firestore vagy LocalStorage)
export async function saveGameResult(playerName, totalScore, rounds) {
  const name = (playerName || 'Névtelen Kóborló').trim();
  const firestoreDb = initFirestore();

  const entry = {
    playerName: name,
    totalScore,
    roundsCount: rounds.length,
    timestamp: new Date().toISOString(),
  };

  if (firestoreDb) {
    try {
      await addDoc(collection(firestoreDb, 'leaderboard'), {
        ...entry,
        createdAt: serverTimestamp(),
      });
      return { success: true, source: 'firebase' };
    } catch (e) {
      console.warn('Hiba a Firestore-ba mentéskor, mentés helyi tárolóba:', e);
    }
  }

  // Helyi mentés fallback
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    local.push(entry);
    local.sort((a, b) => b.totalScore - a.totalScore);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local.slice(0, 50)));
    return { success: true, source: 'local' };
  } catch (e) {
    console.error('Hiba a helyi tároláskor:', e);
    return { success: false, error: e };
  }
}

// Ranglista lekérdezése
export async function fetchLeaderboard() {
  const firestoreDb = initFirestore();

  if (firestoreDb) {
    try {
      const q = query(
        collection(firestoreDb, 'leaderboard'),
        orderBy('totalScore', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      if (results.length > 0) {
        return { data: results, source: 'firebase' };
      }
    } catch (e) {
      console.warn('Firestore ranglista olvasási hiba, helyi tároló használata:', e);
    }
  }

  // Fallback helyi tároló
  const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  return { data: local.slice(0, 20), source: 'local' };
}
