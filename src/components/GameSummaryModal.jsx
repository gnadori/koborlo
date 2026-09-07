import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Award, MapPin, RotateCcw, Share2, Check, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import L from 'leaflet';
import { formatDistance, formatScore } from '../utils/geo';
import { saveGameResult } from '../services/firebase';

export default function GameSummaryModal({ roundsHistory, totalScore, onRestartGame, onOpenLeaderboard }) {
  const mapContainerRef = useRef(null);
  const [playerName, setPlayerName] = useState(localStorage.getItem('koborlo_player_name') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Konfetti durrantás a jó eredményért
  useEffect(() => {
    if (totalScore >= 12000) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    }
  }, [totalScore]);

  // Összesítő térkép felrajzolása az 5 kör minden pontjával
  useEffect(() => {
    if (!mapContainerRef.current || !roundsHistory || roundsHistory.length === 0) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const allCoords = [];
    const colors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4'];

    roundsHistory.forEach((r, idx) => {
      const col = colors[idx % colors.length];

      // Célpont
      const targetIcon = L.divIcon({
        className: `t-pin-${idx}`,
        html: `
          <div style="
            width: 26px; height: 26px;
            background: ${col};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            color: white; font-size: 11px; font-weight: bold;
            display: flex; align-items: center; justify-content: center;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      // Játékos tipp
      const guessIcon = L.divIcon({
        className: `g-pin-${idx}`,
        html: `
          <div style="
            width: 18px; height: 18px;
            background: #ffffff;
            border: 3px solid ${col};
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([r.location.lat, r.location.lng], { icon: targetIcon })
        .addTo(map)
        .bindPopup(`<b>${idx + 1}. Kör célpont:</b><br>${r.location.title || 'Helyszín'}`);

      L.marker([r.guess.lat, r.guess.lng], { icon: guessIcon })
        .addTo(map)
        .bindPopup(`<b>${idx + 1}. Kör tipp</b> (${formatDistance(r.distanceKm)})`);

      L.polyline(
        [
          [r.location.lat, r.location.lng],
          [r.guess.lat, r.guess.lng],
        ],
        {
          color: col,
          weight: 3,
          dashArray: '4, 6',
          opacity: 0.8,
        }
      ).addTo(map);

      allCoords.push([r.location.lat, r.location.lng]);
      allCoords.push([r.guess.lat, r.guess.lng]);
    });

    if (allCoords.length > 0) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    }

    return () => {
      map.remove();
    };
  }, [roundsHistory]);

  // Eredmény mentése
  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || isSaved) return;

    setSaving(true);
    localStorage.setItem('koborlo_player_name', playerName.trim());
    await saveGameResult(playerName.trim(), totalScore, roundsHistory);
    setSaving(false);
    setIsSaved(true);
  };

  // Rang / Minősítés kiszámítása
  const getRank = (score) => {
    if (score >= 23500) return { title: 'Kárpátok Nagymestere 👑', desc: 'Tökéletesen ismered a Kárpát-medence minden zugát!' };
    if (score >= 19000) return { title: 'Tapasztalt Kóborló 🧭', desc: 'Bámulatos tájékozódási érzék, büszke lehetsz a tudásodra!' };
    if (score >= 14000) return { title: 'Jártas Vándor 🎒', desc: 'Szép teljesítmény, sok tájat és vidéket felismertél.' };
    if (score >= 8000) return { title: 'Kezdő Felfedező 🗺️', desc: 'Jó kezdet, néhány körben nagyon közel jártál!' };
    return { title: 'Eltévedt Zarándok 🌲', desc: 'Ne csüggedj, a Kárpát-medence hegyei és völgyei kifürkészhetetlenek!' };
  };

  const rank = getRank(totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Fejléc */}
        <div className="p-5 md:p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Játék Befejezve</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            {formatScore(totalScore)} / 25 000 pont
          </h2>

          <div className="mt-2">
            <h3 className="text-lg font-extrabold text-white">{rank.title}</h3>
            <p className="text-xs text-slate-300">{rank.desc}</p>
          </div>
        </div>

        {/* Középső tartalom: Térkép + Körök bontása */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Térkép összefoglaló */}
          <div className="h-[220px] md:h-auto md:w-1/2 bg-slate-950 relative min-h-[220px]">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          {/* Körök listája */}
          <div className="p-4 md:w-1/2 flex flex-col gap-2.5 overflow-y-auto max-h-[260px] md:max-h-[360px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Körönkénti eredmények:
            </span>
            {roundsHistory.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-white/5 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-white block truncate">
                      {r.location.title || `Helyszín #${i + 1}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDistance(r.distanceKm)} távolság
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="font-bold text-amber-300">
                    +{formatScore(r.score)} pont
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eredmény mentése űrlap */}
        <div className="p-4 bg-slate-800/80 border-t border-white/10">
          {!isSaved ? (
            <form onSubmit={handleSaveResult} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Add meg a neved a ranglistához..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={25}
                className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={!playerName.trim() || saving}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'Mentés...' : 'Mentés a Ranglistára'}</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Eredményed sikeresen rögzítve lett!
              </span>
              <button
                onClick={onOpenLeaderboard}
                className="underline hover:text-white cursor-pointer"
              >
                Ranglista megtekintése
              </button>
            </div>
          )}
        </div>

        {/* Alsó gombsor */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onOpenLeaderboard}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Ranglista</span>
          </button>

          <button
            onClick={onRestartGame}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Új Kóborlás indítása</span>
          </button>
        </div>
      </div>
    </div>
  );
}
