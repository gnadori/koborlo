import React, { useState } from 'react';
import { Settings, X, KeyRound, Database, Check, Save, ExternalLink } from 'lucide-react';
import { getGoogleMapsApiKey, saveGoogleMapsApiKey } from '../services/streetViewService';
import { getFirebaseConfig, saveFirebaseConfig } from '../services/firebase';

export default function SettingsModal({ onClose }) {
  const [googleKey, setGoogleKey] = useState(getGoogleMapsApiKey());
  const [firebaseJson, setFirebaseJson] = useState(() => {
    const cfg = getFirebaseConfig();
    return cfg ? JSON.stringify(cfg, null, 2) : '';
  });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveGoogleMapsApiKey(googleKey.trim());

    if (firebaseJson.trim()) {
      try {
        const parsed = JSON.parse(firebaseJson.trim());
        saveFirebaseConfig(parsed);
      } catch (err) {
        alert('Érvénytelen JSON formátum a Firebase konfigurációnál!');
        return;
      }
    } else {
      saveFirebaseConfig(null);
    }

    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Fejléc */}
        <div className="p-4 md:p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-700 text-slate-200 border border-white/10">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                Beállítások & API Kulcsok
              </h3>
              <p className="text-[11px] text-slate-400">
                Google Street View és Firebase konfiguráció
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

        {/* Űrlap */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Google Maps API Key */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                Google Maps JavaScript API Kulcs
              </span>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                Kulcs igénylése <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <p className="text-[10px] text-slate-400">
              A Google Maps API-t kizárólag a Street View panoráma betöltésére használja az alkalmazás. A tippelő és eredmény térképek az ingyenes OpenStreetMap-en futnak a kvóták kímélése érdekében.
            </p>
          </div>

          {/* Firebase Konfiguráció */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                Firebase Config JSON (Opcionális)
              </span>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                Firebase Konzol <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <textarea
              rows={5}
              placeholder={'{\n  "apiKey": "...",\n  "projectId": "koborlo",\n  ...\n}'}
              value={firebaseJson}
              onChange={(e) => setFirebaseJson(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-400">
              Ha nincs megadva, a játék automatikusan és zökkenőmentesen a böngésző helyi memóriájába (LocalStorage) menti a ranglistát!
            </p>
          </div>

          {savedMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              Beállítások elmentve! Újratöltés folyamatban...
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Mentés és Alkalmazás</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
