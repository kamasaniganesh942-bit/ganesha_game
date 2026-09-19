import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { AnimatedButton } from '../common/AnimatedButton';
import { X, Volume2, VolumeX, Music, Eye, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { state, updateSettings, resetGameProgress } = useGame();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#251342] to-[#120724] border border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
          <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
            <span>⚙️</span> SETTINGS
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4 mb-6">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              {state.settings.sfx ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <span className="font-bold text-sm">Sound Effects (SFX)</span>
            </div>
            <button
              onClick={() => updateSettings({ sfx: !state.settings.sfx })}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${state.settings.sfx ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${state.settings.sfx ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Music */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${state.settings.music ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm">Festival Music</span>
            </div>
            <button
              onClick={() => updateSettings({ music: !state.settings.music })}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${state.settings.music ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${state.settings.music ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Eye className={`w-5 h-5 ${state.settings.reducedMotion ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-sm">Reduced Motion</div>
                <div className="text-[10px] text-slate-400">Accessibility mode</div>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${state.settings.reducedMotion ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${state.settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>

        {/* Reset Progress Confirmation */}
        {showConfirmReset ? (
          <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 mb-4 text-center">
            <p className="text-xs text-red-200 mb-3 font-semibold">
              Are you sure? This will wipe all completed games, stars, and collected items!
            </p>
            <div className="flex gap-2">
              <AnimatedButton
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => {
                  resetGameProgress();
                  setShowConfirmReset(false);
                  onClose();
                }}
              >
                YES, RESET
              </AnimatedButton>
              <AnimatedButton
                variant="glass"
                size="sm"
                className="flex-1"
                onClick={() => setShowConfirmReset(false)}
              >
                CANCEL
              </AnimatedButton>
            </div>
          </div>
        ) : (
          <AnimatedButton
            variant="glass"
            size="sm"
            className="w-full mb-4 text-red-300 hover:text-red-200"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setShowConfirmReset(true)}
          >
            RESET ALL PROGRESS
          </AnimatedButton>
        )}

        <AnimatedButton
          variant="gold"
          size="md"
          className="w-full"
          onClick={onClose}
        >
          CLOSE
        </AnimatedButton>
      </div>
    </div>
  );
};
