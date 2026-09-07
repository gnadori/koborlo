import React from 'react';
import { Compass, Trophy, HelpCircle, Settings, RotateCcw, MapPin } from 'lucide-react';
import { formatScore } from '../utils/geo';

export default function Navbar({ 
  currentRound, 
  totalRounds = 5, 
  totalScore, 
  roundType = 'curated', 
  onRestartGame, 
  onOpenLeaderboard, 
  onOpenRules, 
  onOpenSettings 
}) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 md:px-6 py-2.5 bg-slate-900/85 backdrop-blur-md border-b border-white/10 text-white shadow-lg select-none">
      {/* Bal oldal: Logó és cím */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-white/20">
          <Compass className="w-6 h-6 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="font-black tracking-wide text-lg md:text-xl bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
            Kóborlás a Kárpát-medencében
          </h1>
          <p className="text-xs font-semibold text-emerald-400 tracking-wide">
            AKG - Kutatók Éjszakája
          </p>
        </div>
      </div>

      {/* Középső panel: Aktuális kör és típus */}
      <div className="flex items-center gap-2 md:gap-4 bg-slate-800/80 px-3 md:px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase font-bold text-slate-400">Kör:</span>
          <span className="font-extrabold text-sm md:text-base text-emerald-400">
            {currentRound} <span className="text-xs text-slate-400 font-normal">/ {totalRounds}</span>
          </span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Kör típus jelző: 1-2 kurált, 3 nagyváros, 4-5 random */}
        <div className="flex items-center gap-1 text-[11px] font-medium">
          {roundType === 'curated' ? (
            <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Kurált helyszín
            </span>
          ) : roundType === 'city' ? (
            <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Nagyváros
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Random kóborlás
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase font-bold text-slate-400">Pont:</span>
          <span className="font-extrabold text-sm md:text-base text-amber-300">
            {formatScore(totalScore)}
          </span>
        </div>
      </div>

      {/* Jobb oldal: Akciógombok */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={onOpenLeaderboard}
          title="Ranglista"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <Trophy className="w-4 h-4" />
          <span className="hidden lg:inline">Ranglista</span>
        </button>

        <button
          onClick={onOpenRules}
          title="Használat leírása és segítség"
          className="px-3 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 transition-all flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Súgó / Útmutató</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="Beállítások (API kulcsok)"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onRestartGame}
          title="Új játék indítása"
          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
