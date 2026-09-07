import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StreetViewContainer from './components/StreetViewContainer';
import GuessMap from './components/GuessMap';
import RoundResultModal from './components/RoundResultModal';
import GameSummaryModal from './components/GameSummaryModal';
import LeaderboardModal from './components/LeaderboardModal';
import SettingsModal from './components/SettingsModal';
import RulesModal from './components/RulesModal';
import { generateGameRounds } from './services/streetViewService';
import { calculateDistance, calculateScore } from './utils/geo';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [gameStatus, setGameStatus] = useState('loading'); // 'loading' | 'playing' | 'round_result' | 'game_over'
  const [rounds, setRounds] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [currentRoundResult, setCurrentRoundResult] = useState(null);

  // Modális ablakok állapota
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Új játék indítása és 5 kör generálása (1-2 kurált, 3-5 random)
  const startNewGame = useCallback(async () => {
    setGameStatus('loading');
    setCurrentRoundIndex(0);
    setRoundsHistory([]);
    setCurrentGuess(null);
    setCurrentRoundResult(null);

    try {
      const generatedRounds = await generateGameRounds();
      setRounds(generatedRounds);
      setGameStatus('playing');
    } catch (err) {
      console.error('Hiba a játék indításakor:', err);
      setGameStatus('playing');
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const currentRound = rounds[currentRoundIndex] || null;
  const totalScore = roundsHistory.reduce((acc, curr) => acc + curr.score, 0);

  // Tipp leadása a játékos által
  const handleMakeGuess = (guessedCoords) => {
    if (!currentRound || gameStatus !== 'playing') return;

    const distance = calculateDistance(
      currentRound.lat,
      currentRound.lng,
      guessedCoords.lat,
      guessedCoords.lng
    );
    const score = calculateScore(distance);

    const roundData = {
      roundNumber: currentRoundIndex + 1,
      location: currentRound,
      guess: guessedCoords,
      distanceKm: distance,
      score: score,
    };

    setCurrentRoundResult(roundData);
    setRoundsHistory((prev) => [...prev, roundData]);
    setGameStatus('round_result');
  };

  // Következő körre ugrás vagy játék vége
  const handleNextRound = () => {
    if (currentRoundIndex + 1 < rounds.length) {
      setCurrentRoundIndex((prev) => prev + 1);
      setCurrentRoundResult(null);
      setGameStatus('playing');
    } else {
      setGameStatus('game_over');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* Fejléc és állapotjelző */}
      <Navbar
        currentRound={currentRoundIndex + 1}
        totalRounds={rounds.length || 5}
        totalScore={totalScore}
        isCurated={currentRound?.isCurated}
        onRestartGame={startNewGame}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenRules={() => setShowRules(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Fő tartalom: Panoráma és Térkép */}
      {gameStatus === 'loading' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
            <Compass className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              KÓBORLÓ
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kárpát-medencei helyszínek előkészítése (2 kurált + 3 random pont)...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Street View panoráma konténer */}
          <StreetViewContainer
            location={currentRound}
            onOpenSettings={() => setShowSettings(true)}
          />

          {/* Jobb alsó tipp-térkép (OpenStreetMap) */}
          {gameStatus === 'playing' && (
            <GuessMap onMakeGuess={handleMakeGuess} disabled={false} />
          )}

          {/* Kör végi eredmény ablak */}
          {gameStatus === 'round_result' && currentRoundResult && (
            <RoundResultModal
              roundNumber={currentRoundResult.roundNumber}
              totalRounds={rounds.length}
              location={currentRoundResult.location}
              guess={currentRoundResult.guess}
              distanceKm={currentRoundResult.distanceKm}
              score={currentRoundResult.score}
              onNextRound={handleNextRound}
            />
          )}

          {/* 5 kör utáni végső összegző és ranglista mentés */}
          {gameStatus === 'game_over' && (
            <GameSummaryModal
              roundsHistory={roundsHistory}
              totalScore={totalScore}
              onRestartGame={startNewGame}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
            />
          )}
        </>
      )}

      {/* Modális ablakok */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
