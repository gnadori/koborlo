import React, { useEffect, useState } from 'react';
import { Trophy, Medal, X, RefreshCw, Database } from 'lucide-react';
import { fetchLeaderboard } from '../services/firebase';
import { formatScore } from '../utils/geo';

export default function LeaderboardModal({ onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local');

  const loadData = async () => {
    setLoading(true);
    const result = await fetchLeaderboard();
    setEntries(result.data || []);
    setSource(result.source || 'local');
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return <span className="text-xl">🥇</span>;
    if (index === 1) return <span className="text-xl">🥈</span>;
    if (index === 2) return <span className="text-xl">🥉</span>;
    return <span className="text-xs font-bold text-slate-400 w-5 text-center">{index + 1}.</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Fejléc */}
        <div className="p-4 md:p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                Kóborló Ranglista
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Forrás: {source === 'firebase' ? 'Cloud Firestore (Online)' : 'Helyi tároló (Offline)'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={loadData}
              title="Frissítés"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Ranglista betöltése...
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Még nem szerepel eredmény a ranglistán. Játssz le egy menetet, és légy te az első!
            </div>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 flex items-center justify-center">
                    {getRankBadge(idx)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">
                      {entry.playerName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('hu-HU') : 'Ma'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-amber-300">
                    {formatScore(entry.totalScore)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">pont</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lábléc */}
        <div className="p-3 bg-slate-950/80 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            A legjobb 20 Kóborló dicsőségfala
          </p>
        </div>
      </div>
    </div>
  );
}
