import React from 'react';
import { HelpCircle, X, MapPin, Compass, Award, Sparkles } from 'lucide-react';

export default function RulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Fejléc */}
        <div className="p-4 md:p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                Hogyan működik a Kóborló?
              </h3>
              <p className="text-[11px] text-slate-400">
                Szabályok és a Kárpát-medencei kaland
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Szabályok leírása */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>A játék célja</span>
            </div>
            <p>
              A játékos 5 körön keresztül vándorol a Kárpát-medence legszebb és legizgalmasabb vidékein. Minden körben egy 360°-os Street View panorámakép jelenik meg. A feladatod: a tájékozódási pontok, tájjelek, növényzet és építészet alapján megtippelni a pontos helyet a jobb alsó térképen!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>A körök felépítése</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">1. és 2. kör:</strong> Kézzel válogatott, ikonikus <em>kurált helyszínek</em> (hegyvidékek, természeti csodák, történelmi várak, folyópartok).
              </li>
              <li>
                <strong className="text-white">3. kör:</strong> Kárpát-medencei <em>nagyváros</em> (pl. Budapest, Kolozsvár, Pozsony, Kassa, Temesvár, Szeged, Pécs, Brassó, Nagyvárad stb.).
              </li>
              <li>
                <strong className="text-white">4. és 5. kör:</strong> Teljesen <em>véletlenszerűen generált kültéri utak</em> a Kárpát-medence határain belül.
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>Pontszámítás (max. 25 000 pont)</span>
            </div>
            <p>
              Minden körben legfeljebb <strong className="text-white">5000 pont</strong> szerezhető:
            </p>
            <ul className="space-y-1 pl-1">
              <li>🎯 <strong>25 méteren belül:</strong> 5000 pont (Tökéletes találat!)</li>
              <li>📍 <strong>5 km-en belül:</strong> ~4800+ pont</li>
              <li>🧭 <strong>25 km-en belül:</strong> ~4200 pont</li>
              <li>🗺️ <strong>150 km távolságban:</strong> ~1700 pont</li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Költségtakarékos OpenStreetMap</span>
            </div>
            <p>
              A tippeléshez és az eredmények visszanézéséhez a nyílt forráskódú OpenStreetMap-et és a Leaflet-et használjuk, így a játék minimális Google Maps API kvótát fogyaszt!
            </p>
          </div>
        </div>

        {/* Bezárás gomb */}
        <div className="p-3 bg-slate-950/80 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Értem, vágjunk bele!
          </button>
        </div>
      </div>
    </div>
  );
}
