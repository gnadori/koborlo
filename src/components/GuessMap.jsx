import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Maximize2, Minimize2, Check, X, Compass } from 'lucide-react';
import L from 'leaflet';
import { CARPATHIAN_POLYGON } from '../data/carpathianBasin';

// Egyedi gombostű (Pin) ikon a Leaflet-hez SVG-vel
const createGuessIcon = () => {
  return L.divIcon({
    className: 'custom-guess-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; transform: translate(-50%, -100%);">
        <div style="
          width: 32px;
          height: 32px;
          background: radial-gradient(circle at 30% 30%, #ef4444, #991b1b);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 10px rgba(239, 68, 68, 0.6);
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export default function GuessMap({ onMakeGuess, disabled }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [guessedPos, setGuessedPos] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Térkép inicializálása Leaflet-tel
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Kárpát-medence középpontja (cca. Kecskemét/Szeged környéke)
      const map = L.map(mapContainerRef.current, {
        center: [47.1, 20.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Hivatalos OpenStreetMap csemperéteg (100% ingyenes, nincs API kulcs hiba)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Kárpát-medence határvonalának berajzolása (lágy szaggatott zöld vonallal)
      L.polygon(CARPATHIAN_POLYGON, {
        color: '#10b981',
        weight: 2,
        dashArray: '5, 8',
        fillColor: '#10b981',
        fillOpacity: 0.05,
      }).addTo(map);

      // Kattintás a térképen = tipp elhelyezése
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setGuessedPos({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], {
            icon: createGuessIcon(),
            draggable: true,
          }).addTo(map);

          markerRef.current.on('dragend', (ev) => {
            const pos = ev.target.getLatLng();
            setGuessedPos({ lat: pos.lat, lng: pos.lng });
          });
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Tisztítás
    };
  }, []);

  // Térkép méretének újraszámítása kinyitás/összecsukás esetén
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpanded, isHovered]);

  const handleGuessSubmit = () => {
    if (guessedPos && onMakeGuess && !disabled) {
      onMakeGuess(guessedPos);
    }
  };

  const handleClearGuess = (e) => {
    e.stopPropagation();
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    setGuessedPos(null);
  };

  const activeExpanded = isExpanded || isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute right-4 bottom-4 z-20 transition-all duration-300 ease-out flex flex-col items-end ${
        activeExpanded
          ? 'w-[90vw] sm:w-[480px] md:w-[580px] h-[360px] md:h-[440px]'
          : 'w-[240px] sm:w-[280px] h-[170px]'
      }`}
    >
      {/* Térkép Kártya */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex flex-col group">
        
        {/* Térkép fejléc / gombok */}
        <div className="absolute top-2 left-2 right-2 z-[400] flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tipp-térkép (Kárpát-medence)</span>
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            {guessedPos && (
              <button
                onClick={handleClearGuess}
                title="Tipp törlése"
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-white/10 shadow backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Összecsukás' : 'Teljes méret'}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shadow backdrop-blur-md transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Leaflet konténer */}
        <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

        {/* Instrukció, ha még nincs tipp */}
        {!guessedPos && activeExpanded && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[400] pointer-events-none bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-medium text-amber-300 shadow-lg animate-pulse whitespace-nowrap">
            Kattints a térképre a tipped elhelyezéséhez!
          </div>
        )}

        {/* Tippelés megerősítő gomb */}
        <div className="absolute bottom-3 left-3 right-3 z-[400]">
          <button
            onClick={handleGuessSubmit}
            disabled={!guessedPos || disabled}
            className={`w-full py-2.5 px-4 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
              guessedPos && !disabled
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white ring-2 ring-emerald-400/50 shadow-emerald-900/50 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800/80 text-slate-500 border border-white/10 cursor-not-allowed'
            }`}
          >
            <MapPin className={`w-4 h-4 ${guessedPos ? 'text-white animate-bounce' : 'text-slate-500'}`} />
            <span>{guessedPos ? 'Tippelek!' : 'Válassz egy pontot!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
