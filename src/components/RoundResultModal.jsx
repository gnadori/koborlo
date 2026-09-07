import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, ArrowRight, Award, Info } from 'lucide-react';
import L from 'leaflet';
import { formatDistance, formatScore } from '../utils/geo';

export default function RoundResultModal({ 
  roundNumber, 
  totalRounds = 5, 
  location, 
  guess, 
  distanceKm, 
  score, 
  onNextRound 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Eredmény térkép rajzolása: valódi hely, tipp és összekötő vonal
  useEffect(() => {
    if (!mapContainerRef.current || !location || !guess) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Valódi célpont (zöld pin)
    const targetIcon = L.divIcon({
      className: 'target-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; transform: translate(-50%, -100%);">
          <div style="
            width: 34px; height: 34px;
            background: radial-gradient(circle at 30% 30%, #10b981, #047857);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 12px rgba(16, 185, 129, 0.8);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    // Játékos tippje (piros pin)
    const guessIcon = L.divIcon({
      className: 'guess-pin',
      html: `
        <div style="position: relative; width: 30px; height: 30px; transform: translate(-50%, -100%);">
          <div style="
            width: 30px; height: 30px;
            background: radial-gradient(circle at 30% 30%, #ef4444, #b91c1c);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const targetMarker = L.marker([location.lat, location.lng], { icon: targetIcon })
      .addTo(map)
      .bindPopup(`<b>Valódi helyszín:</b><br>${location.title || 'Helyszín'}`)
      .openPopup();

    const guessMarker = L.marker([guess.lat, guess.lng], { icon: guessIcon })
      .addTo(map)
      .bindPopup('<b>A te tipped</b>');

    // Összekötő szaggatott vonal
    const line = L.polyline(
      [
        [location.lat, location.lng],
        [guess.lat, guess.lng],
      ],
      {
        color: '#f59e0b',
        weight: 3,
        dashArray: '6, 10',
        opacity: 0.9,
      }
    ).addTo(map);

    // Nézet igazítása mindkét pontra
    const bounds = L.latLngBounds([
      [location.lat, location.lng],
      [guess.lat, guess.lng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [location, guess]);

  const isLastRound = roundNumber >= totalRounds;

  // Pontszám színének megválasztása
  const getScoreColor = () => {
    if (score >= 4500) return 'from-emerald-400 to-teal-500 text-emerald-300';
    if (score >= 3500) return 'from-teal-400 to-cyan-500 text-teal-300';
    if (score >= 2000) return 'from-amber-400 to-yellow-500 text-amber-300';
    return 'from-rose-400 to-orange-500 text-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Fejléc: pontszám és távolság */}
        <div className="p-4 md:p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 text-center relative">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            {roundNumber}. Kör összefoglalása
          </div>

          <div className="flex items-center justify-center gap-6 my-2">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Távolság</span>
              <span className="text-2xl md:text-3xl font-black text-white">
                {formatDistance(distanceKm)}
              </span>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <span className="text-xs text-slate-400 block font-medium">Szerzett pont</span>
              <span className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                +{formatScore(score)}
              </span>
            </div>
          </div>

          {/* Helyszín adatai (név és leírás) */}
          <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-white/10 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{location.title || 'Kárpát-medencei helyszín'}</span>
              <span className="text-xs font-normal text-slate-400 ml-auto">{location.region}</span>
            </div>
            {location.description && (
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {location.description}
              </p>
            )}
          </div>
        </div>

        {/* Eredmény Térkép konténer */}
        <div className="relative flex-1 min-h-[260px] md:min-h-[320px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Lábléc: Következő kör gomb */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
              <span>Valódi helyszín</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
              <span>A te tipped</span>
            </div>
          </div>

          <button
            onClick={onNextRound}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>{isLastRound ? 'Végső összegzés' : 'Következő kör'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
