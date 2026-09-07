import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi, getGoogleMapsApiKey, saveGoogleMapsApiKey } from '../services/streetViewService';
import { Compass, RotateCcw, AlertTriangle, KeyRound, ExternalLink, Sparkles } from 'lucide-react';

export default function StreetViewContainer({ location, onOpenSettings }) {
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasKey, setHasKey] = useState(!!getGoogleMapsApiKey());
  const [inputKey, setInputKey] = useState('');

  // Street View inicializálása vagy frissítése
  useEffect(() => {
    let isMounted = true;

    async function initOrUpdateStreetView() {
      if (!location) return;

      const apiKey = getGoogleMapsApiKey();
      if (!apiKey) {
        setHasKey(false);
        setLoading(false);
        return;
      }
      setHasKey(true);
      setLoading(true);
      setError(null);

      try {
        const maps = await loadGoogleMapsApi();
        if (!isMounted || !containerRef.current) return;

        const targetPos = { lat: location.lat, lng: location.lng };
        const pov = {
          heading: location.heading || 0,
          pitch: location.pitch || 0,
          zoom: 1,
        };

        if (!panoramaRef.current) {
          panoramaRef.current = new maps.StreetViewPanorama(containerRef.current, {
            position: targetPos,
            pov: pov,
            zoomControl: true,
            panControl: true,
            addressControl: false,
            showRoadLabels: false, // Ne árulja el rögtön az utcanevet!
            motionTracking: false,
            motionTrackingControl: false,
            fullscreenControl: false,
            enableCloseButton: false,
          });
        } else {
          panoramaRef.current.setPosition(targetPos);
          panoramaRef.current.setPov(pov);
          panoramaRef.current.setVisible(true);
        }

        setLoading(false);
      } catch (err) {
        console.error('Street View hiba:', err);
        if (isMounted) {
          setError(err.message || 'Hiba történt a panoráma betöltésekor');
          setLoading(false);
        }
      }
    }

    initOrUpdateStreetView();

    return () => {
      isMounted = false;
    };
  }, [location]);

  // Kezdő nézőpont visszaállítása
  const handleResetView = () => {
    if (panoramaRef.current && location) {
      panoramaRef.current.setPosition({ lat: location.lat, lng: location.lng });
      panoramaRef.current.setPov({
        heading: location.heading || 0,
        pitch: location.pitch || 0,
        zoom: 1,
      });
    }
  };

  const handleSaveQuickKey = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      saveGoogleMapsApiKey(inputKey.trim());
      setHasKey(true);
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* Google Street View Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Betöltési animáció */}
      {loading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
            <Compass className="absolute inset-0 m-auto w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <p className="mt-4 font-bold text-lg tracking-wide text-slate-200">
            Kárpát-medencei panoráma betöltése...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Helyszín koordináták és Street View csomópont hangolása
          </p>
        </div>
      )}

      {/* API Kulcs hiánya vagy hiba esetén megjelenő panel */}
      {(!hasKey || error) && !loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 z-10 text-white">
          <div className="max-w-md w-full bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-center text-white mb-2">
              Google Maps API kulcs szükséges
            </h3>
            
            <p className="text-sm text-slate-300 text-center mb-6 leading-relaxed">
              A Kóborló a valódi Kárpát-medencei panorámák megjelenítéséhez a hivatalos Google Street View API-t használja. A tippelés az ingyenes OpenStreetMap-en történik!
            </p>

            <form onSubmit={handleSaveQuickKey} className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Illeszd be a Google Maps API kulcsodat:
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-white/20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Kulcs mentése és játék indítása
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-center">
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-400 hover:underline"
              >
                Ingyenes kulcs igénylése a Google Cloud konzolon <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-slate-400">
                (A Google havonta 200$ ingyenes kreditet ad, ami több ezer játékmenetre elég.)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Panoráma vezérlő gyorsgombok */}
      {hasKey && !loading && !error && (
        <div className="absolute left-4 bottom-6 z-10 flex flex-col gap-2">
          <button
            onClick={handleResetView}
            title="Kezdőpozíció és tájolás visszaállítása"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-white shadow-xl backdrop-blur-md text-xs font-semibold transition-all group cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:-rotate-45 transition-transform" />
            <span>Kezdőpontra</span>
          </button>
        </div>
      )}
    </div>
  );
}
