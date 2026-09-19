import React from 'react';
import { AnimatedButton } from '../common/AnimatedButton';
import { Play, RotateCcw, Map, Settings as SettingsIcon } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMap: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMap,
  onOpenSettings
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xs bg-gradient-to-b from-[#251342] to-[#120724] border border-amber-500/40 rounded-3xl p-6 text-center text-white shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl">
          ⏸
        </div>
        <h3 className="text-xl font-black text-amber-300 mb-5">GAME PAUSED</h3>

        <div className="space-y-3">
          <AnimatedButton
            variant="gold"
            size="md"
            className="w-full"
            icon={<Play className="w-4 h-4 fill-current" />}
            onClick={onResume}
          >
            RESUME
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            size="md"
            className="w-full"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRestart}
          >
            RESTART
          </AnimatedButton>

          <AnimatedButton
            variant="glass"
            size="md"
            className="w-full"
            icon={<SettingsIcon className="w-4 h-4" />}
            onClick={onOpenSettings}
          >
            SETTINGS
          </AnimatedButton>

          <AnimatedButton
            variant="danger"
            size="md"
            className="w-full"
            icon={<Map className="w-4 h-4" />}
            onClick={onMap}
          >
            QUIT TO MAP
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
