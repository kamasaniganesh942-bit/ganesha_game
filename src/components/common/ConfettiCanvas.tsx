import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCanvasProps {
  trigger?: boolean;
  intensity?: 'medium' | 'high';
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ trigger = true, intensity = 'medium' }) => {
  useEffect(() => {
    if (!trigger) return;

    const count = intensity === 'high' ? 120 : 60;
    const colors = ['#FF6F00', '#FFD700', '#FFB300', '#D81B60', '#00897B', '#FFFFFF'];

    confetti({
      particleCount: count,
      spread: 80,
      origin: { y: 0.6 },
      colors
    });

    if (intensity === 'high') {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
      }, 300);
    }
  }, [trigger, intensity]);

  return null;
};
