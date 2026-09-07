import React from 'react';
import { HelpCircle, X, MapPin, Compass, Award, Sparkles, Navigation, MousePointer, Eye, CheckCircle2 } from 'lucide-react';

export default function RulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Fejléc */}
        <div className="p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg md:text-xl text-white">
                Kóborlás a Kárpát-medencében – Útmutató & Súgó
              </h3>
              <p className="text-xs font-semibold text-emerald-400">
                AKG - Kutatók Éjszakája
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Részletes használati útmutató */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed flex-1">
          
          {/* 1. Vezérlés és navigáció */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              <span>1. Vezérlés és tájékozódás a panorámaképen</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-base">🖱️</span>
                <div>
                  <strong className="text-white block">Körbenézés:</strong>
                  Tartsd lenyomva az egér bal gombját, és mozgasd az egeret 360°-ban bármelyik irányba!
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-base">🔍</span>
                <div>
                  <strong className="text-white block">Nagyítás (Zoom):</strong>
                  Az egérgörgővel ráközelíthetsz a távoli hegycsúcsokra, táblákra és épületrészletekre.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-base">🚶‍♂️</span>
                <div>
                  <strong className="text-white block">Haladás az utakon:</strong>
                  Kattints az úton megjelenő fehér navigációs nyilakra, hogy előre-hátra mozoghass az úton!
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-base">🔄</span>
                <div>
                  <strong className="text-white block">Kezdőpont visszaállítása:</strong>
                  A bal alsó „Kezdőpontra” gombbal bármikor visszaugorhatsz a kiindulási helyre.
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tippelés menete */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>2. Hogyan tippelj a térképen?</span>
            </div>
            <p>
              A képernyő jobb alsó sarkában látható az interaktív <strong>OpenStreetMap Kárpát-medence térkép</strong> (a határait zöld szaggatott vonal jelöli).
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-300">
              <li>Vidd rá az egeret a kis térképre: ekkor <strong>automatikusan kinyílik</strong> nagy méretben.</li>
              <li>Kattints a térképen arra a pontra, ahol szerinted a kép készült! A piros gombostűt tetszőlegesen áthelyezheted újabb kattintással.</li>
              <li>Ha biztos vagy a tippedben, nyomd meg a zöld <strong>„Tippelek!”</strong> gombot!</li>
            </ul>
          </div>

          {/* 3. Körök felépítése */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>3. A játék menete (5 kör)</span>
            </div>
            <ul className="space-y-2">
              <li className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase shrink-0 mt-0.5">1-2. Kör</span>
                <div>
                  <strong className="text-white">Ikonikus nevezetességek:</strong> 50 válogatott természeti csoda, hegyvonulat, vár és történelmi látványosság a Kárpát-medencéből.
                </div>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 font-bold text-[10px] uppercase shrink-0 mt-0.5">3. Kör</span>
                <div>
                  <strong className="text-white">Kárpát-medencei Nagyváros:</strong> 50 nagyváros (Budapest, Kolozsvár, Pozsony, Kassa, Szeged, Temesvár, Brassó stb.) utcáin kell felismerned a helyet.
                </div>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px] uppercase shrink-0 mt-0.5">4-5. Kör</span>
                <div>
                  <strong className="text-white">Teljesen véletlenszerű kóborlás:</strong> A Kárpát-medence bármely kültéri közútja (falvak, szerpentinek, erdőségek, síkságok).
                </div>
              </li>
            </ul>
          </div>

          {/* 4. Pontozás */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>4. Pontszámítás és Ranglista (max. 25 000 pont)</span>
            </div>
            <p>
              Minden körben legfeljebb <strong className="text-white">5000 pont</strong> szerezhető a légvonalban mért távolság alapján:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
                <span className="block font-bold text-sm">5000 pont</span>
                <span className="text-[10px] text-slate-400">25 méteren belül</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-teal-300">
                <span className="block font-bold text-sm">~4850 pont</span>
                <span className="text-[10px] text-slate-400">5 km-en belül</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300">
                <span className="block font-bold text-sm">~4200 pont</span>
                <span className="text-[10px] text-slate-400">25 km-en belül</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-rose-500/30 text-rose-300">
                <span className="block font-bold text-sm">~2450 pont</span>
                <span className="text-[10px] text-slate-400">100 km-re</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Az 5. kör után beírhatod a neved a ranglistára, és megtekintheted a Kutatók Éjszakája összesített dicsőségfalát!
            </p>
          </div>
        </div>

        {/* Bezárás gomb */}
        <div className="p-4 bg-slate-900 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mindent értek, induljon a játék!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
