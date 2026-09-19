import React from 'react';
import { soundManager } from '../../audio/SoundManager';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'gold' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  soundType?: 'click' | 'dhol' | 'coin' | 'bell';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  soundType = 'click',
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundType === 'click') soundManager.playClick();
    else if (soundType === 'dhol') soundManager.playDhol(true);
    else if (soundType === 'coin') soundManager.playCoin();
    else if (soundType === 'bell') soundManager.playBell();

    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/40 border-t border-amber-300',
    secondary: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-600/30 border-t border-teal-300',
    accent: 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-lg shadow-rose-600/40 border-t border-pink-300',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30',
    gold: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 font-extrabold shadow-lg shadow-yellow-500/40 border-t border-yellow-100',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[40px] rounded-xl',
    md: 'px-5 py-3 text-base min-h-[48px] rounded-2xl',
    lg: 'px-6 py-4 text-lg min-h-[56px] rounded-2xl tracking-wide',
    xl: 'px-8 py-5 text-xl min-h-[64px] rounded-3xl font-bold tracking-wider'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center font-bold select-none cursor-pointer
        transform active:scale-95 transition-all duration-150 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-2.5 inline-flex items-center text-xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
