import React, { useRef } from 'react';
import { soundManager } from '../../audio/SoundManager';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'gold' | 'glass' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  soundType?: 'click' | 'dhol' | 'coin' | 'bell' | 'fanfare';
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
  const isLockedRef = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLockedRef.current) return;

    // Rapid-click lock for 180ms to prevent duplicate actions
    isLockedRef.current = true;
    setTimeout(() => {
      isLockedRef.current = false;
    }, 180);

    if (soundType === 'click') soundManager.playClick();
    else if (soundType === 'dhol') soundManager.playDhol(true);
    else if (soundType === 'coin') soundManager.playCoin();
    else if (soundType === 'bell') soundManager.playBell();
    else if (soundType === 'fanfare') soundManager.playFanfare();

    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/35 border-t border-amber-300 hover:brightness-105',
    secondary: 'bg-[#1C0D36] border-2 border-amber-400/40 text-amber-200 hover:bg-[#28144B] hover:border-amber-300 shadow-md',
    success: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/30 border-t border-teal-300 hover:brightness-105',
    accent: 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-lg shadow-rose-600/35 border-t border-pink-300 hover:brightness-105',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30',
    gold: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 font-black shadow-lg shadow-yellow-500/35 border-t border-yellow-100 hover:brightness-105',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm min-h-[38px] rounded-xl',
    md: 'px-4 py-2.5 text-sm sm:text-base min-h-[46px] rounded-2xl',
    lg: 'px-6 py-3.5 text-base sm:text-lg min-h-[52px] rounded-2xl tracking-wide',
    xl: 'px-8 py-4 text-lg sm:text-xl min-h-[60px] rounded-3xl font-black tracking-wider'
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
      {icon && <span className="mr-2 inline-flex items-center text-lg">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
