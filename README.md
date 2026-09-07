# Kóborló 🧭 – Kárpát-medencei GeoGuessr Játék

A **Kóborló** egy modern, böngészőben játszható földrajzi kvízjáték a népszerű GeoGuessr mintájára, amely kifejezetten a **Kárpát-medence** történelmi és földrajzi tájaira fókuszál (Magyarország, Erdély, Felvidék, Kárpátalja, Vajdaság, Burgenland, Drávaszög).

🔗 **GitHub tároló:** [https://github.com/gnadori/koborlo](https://github.com/gnadori/koborlo)

---

## 🎮 Játékmenet és Szabályok

Egy meccs **5 körből** áll:
1. **1. és 2. kör:** Kézzel válogatott, ikonikus **kurált helyszínek** (híres várak, természeti csodák, folyópartok és történelmi városok a Kárpát-medence minden szegletéből, érdekes háttér-információkkal).
2. **3., 4. és 5. kör:** Dinamikusan, véletlenszerűen generált valódi pontok a Kárpát-medence poligonján belül, amelyeket a játék a legközelebbi kültéri Street View panorámára illeszt.

### 🎯 Pontszámítás
- Minden körben legfeljebb **5000 pont** szerezhető (összesen maximum **25 000 pont**).
- A pontozás a légvonalban mért távolság alapján exponenciálisan csökken, a Kárpát-medence méreteihez kalibrálva:
  - 🎯 **0 – 25 m:** 5000 pont
  - 📍 **5 km:** ~4850 pont
  - 🧭 **25 km:** ~4200 pont
  - 🗺️ **100 km:** ~2450 pont
  - 🌲 **300+ km:** minimális pontszám

---

## 💡 Költségtakarékos Térkép-architektúra

A játék úgy lett megtervezve, hogy a lehető legkevesebb fizetős API hívást indítsa:
- **Google Maps API:** Kizárólag a 360°-os panoráma megjelenítésére (`StreetViewPanorama`) és a random panorámák felkutatására (`StreetViewService`) használjuk.
- **OpenStreetMap + Leaflet.js:** A jobb alsó sarokban lévő interaktív tipp-térkép és a kör végi eredménytérképek (valódi hely, tipp és összekötő vonal) **100%-ban ingyenes, nyílt forráskódú OpenStreetMap** csempéket használnak. Így a Google Maps havi 200$-os ingyenes kreditkerete több ezer játékmenetre elegendő!

---

## 🛠️ Technológiai Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas-Confetti
- **Panoráma:** Google Maps JavaScript API (Street View)
- **Tipp-térkép:** Leaflet.js, OpenStreetMap (CartoDB Positron réteg)
- **Adatbázis / Ranglista:** Firebase Cloud Firestore (automatikus LocalStorage tartalékkal)

---

## 🚀 Telepítés és Helyi Futtatás

### 1. Függőségek telepítése:
```bash
npm install
```

### 2. Fejlesztői szerver indítása:
```bash
npm run dev
```
Nyisd meg a böngészőben a kapott címet (általában: `http://localhost:5173`).

---

## 🔑 API Kulcsok Beállítása

Az API kulcsokat kétféleképpen is megadhatod:

### 1. Opció: Közvetlenül a webes felületen
Indítsd el a játékot, kattints a fejlécben a fogaskerék (⚙️ **Beállítások**) ikonra vagy a kezdőképernyőn megjelenő mezőre, és illeszd be a Google Maps kulcsodat! A böngésző azonnal megjegyzi.

### 2. Opció: `.env` fájl létrehozásával
Másold le a `.env.example` fájlt `.env` néven:
```bash
cp .env.example .env
```
Majd töltsd ki az értékeket:
```env
# Google Maps JavaScript API (Street View-hoz)
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

# Firebase (Opcionális - ha üres, helyi tárolót használ)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

---

## 📦 Verziókezelés és Publikálás

A kód felküldése a GitHub tárolóba:
```bash
git add .
git commit -m "feat: Kóborló Kárpát-medencei GeoGuessr játék első kiadás"
git branch -M main
git push -u origin main
```
