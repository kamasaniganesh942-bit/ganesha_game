import React from 'react';

export interface GaneshaIdolProps {
  type?: 'simple' | 'festival' | 'grand';
  silkColor?: 'saffron' | 'rose' | 'gold';
  size?: number | string; // width in px or css string
  className?: string;
  showHalo?: boolean;
  showThrone?: boolean;
  showMouse?: boolean;
  animated?: boolean;
  immersionDepth?: number; // 0 to 100
}

export const GaneshaIdol: React.FC<GaneshaIdolProps> = ({
  type = 'festival',
  silkColor = 'saffron',
  size = 200,
  className = '',
  showHalo = true,
  showThrone = true,
  showMouse = true,
  animated = true,
  immersionDepth = 0
}) => {
  // Color tokens based on type
  const isEco = type === 'simple';
  const isGrand = type === 'grand';

  // Body skin tones:
  // Eco: Terracotta natural river clay
  // Festival: Warm radiant golden sandalwood
  // Grand: Luminous sacred ivory/gold with jewel highlights
  const skinColor = isEco ? '#C87D55' : isGrand ? '#FFBE76' : '#F5A623';
  const skinShadow = isEco ? '#A0522D' : isGrand ? '#E08B38' : '#D48806';
  const skinHighlight = isEco ? '#DDA17E' : isGrand ? '#FFE8C5' : '#FFD57E';

  // Dhoti and Stole (Angavastra) colors
  const silkFill =
    silkColor === 'rose'
      ? 'url(#roseSilkGrad)'
      : silkColor === 'gold'
      ? 'url(#goldSilkGrad)'
      : 'url(#saffronSilkGrad)';

  const mukutColor = isEco ? '#8D4F25' : '#FFD700';
  const mukutShadow = isEco ? '#5C3317' : '#B8860B';

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: showHalo ? 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.45))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
      }}
    >
      <svg
        viewBox="0 0 400 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'animate-breathe' : ''}`}
        style={{
          transform: immersionDepth > 0 ? `translateY(${immersionDepth * 0.8}%)` : 'none',
          opacity: immersionDepth > 85 ? 0.35 : 1,
          transition: 'transform 0.2s ease-out, opacity 0.3s ease-out'
        }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9D2" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#D48806" />
          </linearGradient>

          <linearGradient id="saffronSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8F00" />
            <stop offset="60%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          <linearGradient id="roseSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="70%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          <linearGradient id="goldSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>

          <linearGradient id="dhotiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="divineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Divine Aura / Prabhavali Halo */}
        {showHalo && (
          <g className="halo-layer">
            <circle cx="200" cy="180" r="140" fill="url(#haloGrad)" />
            {/* Intricate Sunburst rays */}
            <circle
              cx="200"
              cy="180"
              r="115"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.6"
              className={animated ? 'animate-spin-slow origin-[200px_180px]' : ''}
            />
            <circle
              cx="200"
              cy="180"
              r="125"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 12"
              opacity="0.4"
            />
          </g>
        )}

        {/* 2. Throne / Asan Platform */}
        {showThrone && (
          <g className="throne-layer">
            {/* Throne Back Arch for Grand style */}
            {isGrand && (
              <path
                d="M 100 240 C 100 130, 300 130, 300 240 L 320 380 L 80 380 Z"
                fill="#78350F"
                stroke="#F59E0B"
                strokeWidth="4"
                opacity="0.7"
              />
            )}

            {/* Lotus Petal Base */}
            <g transform="translate(0, 360)">
              {/* Lower base plinth */}
              <rect x="70" y="55" width="260" height="24" rx="10" fill="#92400E" stroke="#F59E0B" strokeWidth="2" />
              <rect x="85" y="60" width="230" height="12" rx="4" fill="#B45309" />

              {/* Lotus Petals */}
              <path d="M 90 55 C 105 35, 120 35, 135 55 Z" fill="url(#lotusGrad)" stroke="#FDA4AF" strokeWidth="1" />
              <path d="M 125 55 C 145 25, 165 25, 185 55 Z" fill="url(#lotusGrad)" stroke="#FDA4AF" strokeWidth="1" />
              <path d="M 175 55 C 200 18, 225 18, 250 55 Z" fill="url(#lotusGrad)" stroke="#FDA4AF" strokeWidth="1.5" />
              <path d="M 240 55 C 260 25, 280 25, 300 55 Z" fill="url(#lotusGrad)" stroke="#FDA4AF" strokeWidth="1" />
              <path d="M 290 55 C 305 35, 320 35, 335 55 Z" fill="url(#lotusGrad)" stroke="#FDA4AF" strokeWidth="1" />
            </g>
          </g>
        )}

        {/* 3. Seated Legs & Yellow Pitambar Dhoti */}
        <g className="legs-and-dhoti">
          {/* Crossed Folded Legs (Padmasana) */}
          <ellipse cx="200" cy="365" rx="125" ry="32" fill={skinShadow} />
          {/* Left leg folded */}
          <path
            d="M 90 365 C 90 330, 150 330, 180 355 C 200 375, 130 385, 90 365 Z"
            fill="url(#dhotiGrad)"
            stroke="#D97706"
            strokeWidth="2"
          />
          {/* Right leg folded */}
          <path
            d="M 310 365 C 310 330, 250 330, 220 355 C 200 375, 270 385, 310 365 Z"
            fill="url(#dhotiGrad)"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Golden Dhoti Zari border & pleats */}
          <path d="M 170 345 C 190 385, 210 385, 230 345" stroke="#B45309" strokeWidth="3" fill="none" />
          <path d="M 180 350 L 190 385 L 200 350 L 210 385 L 220 350" stroke="#FFE066" strokeWidth="2.5" fill="none" />

          {/* Sacred Feet with Alta/Henna */}
          <ellipse cx="140" cy="368" rx="14" ry="8" fill={skinColor} />
          <ellipse cx="260" cy="368" rx="14" ry="8" fill={skinColor} />
          {/* Red Alta line on soles */}
          <circle cx="140" cy="368" r="4" fill="#EF4444" />
          <circle cx="260" cy="368" r="4" fill="#EF4444" />
        </g>

        {/* 4. Plump Divine Torso & Belly (Lambodara) */}
        <g className="belly-and-chest">
          {/* Round loving belly */}
          <ellipse cx="200" cy="295" rx="68" ry="62" fill={skinColor} />
          {/* Gentle shadow under belly */}
          <path d="M 145 315 C 170 350, 230 350, 255 315 C 240 345, 160 345, 145 315 Z" fill={skinShadow} />

          {/* Navel (Nabhi) */}
          <circle cx="200" cy="310" r="4" fill={skinShadow} />

          {/* Chest & Torso */}
          <ellipse cx="200" cy="245" rx="55" ry="42" fill={skinColor} />

          {/* Sacred Snake Belt (Naga Kamarbandh) */}
          <path
            d="M 145 318 C 175 332, 225 332, 255 318"
            stroke="#10B981"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 145 318 C 175 332, 225 332, 255 318"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Golden belt gem clasp */}
          <circle cx="200" cy="325" r="7" fill="url(#goldGrad)" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="200" cy="325" r="3" fill="#EF4444" />

          {/* Sacred Thread (Yajnopavita / Janeu) */}
          <path
            d="M 160 215 C 175 250, 205 285, 235 320"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="4 2"
            fill="none"
          />
          <path
            d="M 162 215 C 177 250, 207 285, 237 320"
            stroke="#FFE066"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Royal Angavastra Silk Shawl draped on shoulders */}
          <path
            d="M 135 220 C 130 260, 125 310, 132 355 C 145 350, 150 310, 148 245 Z"
            fill={silkFill}
            stroke="#991B1B"
            strokeWidth="1"
          />
          <path
            d="M 265 220 C 270 260, 275 310, 268 355 C 255 350, 250 310, 252 245 Z"
            fill={silkFill}
            stroke="#991B1B"
            strokeWidth="1"
          />
        </g>

        {/* 5. Four Divine Arms (Chaturbhuja) */}
        <g className="four-arms">
          {/* Upper Right Hand: Ankush (Axe) */}
          <g>
            {/* Upper Right Arm */}
            <path d="M 155 225 C 115 210, 95 180, 100 150" stroke={skinColor} strokeWidth="18" strokeLinecap="round" fill="none" />
            {/* Palm */}
            <ellipse cx="102" cy="146" rx="10" ry="10" fill={skinColor} />
            {/* Golden Parashu / Ankush */}
            <path d="M 102 165 L 102 120" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <path d="M 102 135 C 118 128, 122 110, 102 115 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
          </g>

          {/* Upper Left Hand: Pasha (Sacred Noose / Lotus) */}
          <g>
            {/* Upper Left Arm */}
            <path d="M 245 225 C 285 210, 305 180, 300 150" stroke={skinColor} strokeWidth="18" strokeLinecap="round" fill="none" />
            {/* Palm */}
            <ellipse cx="298" cy="146" rx="10" ry="10" fill={skinColor} />
            {/* Lotus bloom in hand */}
            <g transform="translate(296, 130) scale(0.6)">
              <path d="M 0 0 C -15 -25, 0 -35, 0 -10 C 0 -35, 15 -25, 0 0" fill="url(#lotusGrad)" />
            </g>
          </g>

          {/* Lower Right Hand: Abhaya Blessing Mudra with ॐ */}
          <g>
            {/* Forearm */}
            <path d="M 150 255 C 115 265, 110 290, 118 310" stroke={skinColor} strokeWidth="17" strokeLinecap="round" fill="none" />
            {/* Blessing Palm */}
            <path d="M 110 305 C 110 295, 128 295, 130 305 C 130 318, 115 322, 110 305 Z" fill={skinHighlight} stroke={skinColor} strokeWidth="2" />
            {/* Fingers pointing upward */}
            <rect x="114" y="290" width="4" height="15" rx="2" fill={skinColor} />
            <rect x="119" y="287" width="4" height="17" rx="2" fill={skinColor} />
            <rect x="124" y="291" width="4" height="14" rx="2" fill={skinColor} />
            {/* Auspicious Red Om on palm */}
            <text x="118" y="312" fontSize="9" fontWeight="bold" fill="#DC2626" textAnchor="middle">ॐ</text>
          </g>

          {/* Lower Left Hand: Bowl of Golden Modaks */}
          <g>
            {/* Forearm */}
            <path d="M 250 255 C 280 265, 285 290, 275 310" stroke={skinColor} strokeWidth="17" strokeLinecap="round" fill="none" />
            {/* Palm holding bowl */}
            <ellipse cx="270" cy="312" rx="12" ry="7" fill={skinColor} />
            {/* Golden Prasad Bowl (Patra) */}
            <path d="M 252 308 C 252 322, 288 322, 288 308 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
            {/* Steamed Modaks in Bowl */}
            <circle cx="262" cy="305" r="5" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="272" cy="303" r="6" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="278" cy="306" r="4.5" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="268" cy="298" r="5" fill="#FEF08A" stroke="#D97706" strokeWidth="1" />
          </g>
        </g>

        {/* 6. Grand Majestic Head, Large Ears & Mukut */}
        <g className="head-and-ears">
          {/* Wide Auspicious Elephant Ears */}
          {/* Left Ear (Viewer's left) */}
          <g>
            <path
              d="M 155 170 C 90 140, 60 190, 85 235 C 105 265, 140 245, 155 220 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="3"
            />
            {/* Inner ear delicate pink fold */}
            <path
              d="M 145 180 C 100 160, 85 195, 102 225 C 115 242, 135 230, 145 210 Z"
              fill="#FDA4AF"
              opacity="0.6"
            />
            {/* Gold Kundal Earring */}
            <circle cx="85" cy="235" r="8" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="85" cy="235" r="3" fill="#DC2626" />
          </g>

          {/* Right Ear (Viewer's right) */}
          <g>
            <path
              d="M 245 170 C 310 140, 340 190, 315 235 C 295 265, 260 245, 245 220 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="3"
            />
            {/* Inner ear delicate pink fold */}
            <path
              d="M 255 180 C 300 160, 315 195, 298 225 C 285 242, 265 230, 255 210 Z"
              fill="#FDA4AF"
              opacity="0.6"
            />
            {/* Gold Kundal Earring */}
            <circle cx="315" cy="235" r="8" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="315" cy="235" r="3" fill="#DC2626" />
          </g>

          {/* Broad Divine Head Contour */}
          <ellipse cx="200" cy="185" rx="52" ry="46" fill={skinColor} />
          {/* Head dome highlights */}
          <ellipse cx="200" cy="170" rx="36" ry="24" fill={skinHighlight} opacity="0.6" />

          {/* Tusks */}
          {/* Right Whole Tusk (Ekadanta - viewer's left) */}
          <path d="M 166 226 C 158 238, 142 248, 136 244 C 138 236, 158 225, 168 222 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          {/* Left Broken Tusk (Sacred broken tusk - viewer's right) */}
          <path d="M 234 226 L 246 235 L 243 238 L 232 228 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

          {/* Sacred Curved Trunk (Sond) turning towards left to taste modak */}
          <path
            d="M 190 205
               C 190 240, 185 265, 192 285
               C 200 310, 230 325, 250 318
               C 265 312, 268 296, 256 295
               C 246 295, 240 306, 230 306
               C 215 306, 206 290, 204 265
               C 202 240, 208 225, 210 205 Z"
            fill={skinColor}
            stroke={skinShadow}
            strokeWidth="2.5"
          />

          {/* Golden ornaments on trunk */}
          <path d="M 191 245 C 198 250, 203 250, 208 245" stroke="#F59E0B" strokeWidth="3" fill="none" />
          <path d="M 192 260 C 198 265, 203 265, 208 260" stroke="#F59E0B" strokeWidth="3" fill="none" />
          {/* Modak on tip of trunk */}
          <circle cx="260" cy="296" r="6" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.2" />

          {/* Gentle Loving Eyes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="178" cy="182" rx="7" ry="4" fill="#FFFFFF" />
            <circle cx="179" cy="182" r="3.5" fill="#451A03" />
            <circle cx="180" cy="181" r="1" fill="#FFFFFF" />
            <path d="M 170 178 Q 178 174 186 178" stroke="#78350F" strokeWidth="1.8" fill="none" />
          </g>
          {/* Right Eye */}
          <g>
            <ellipse cx="222" cy="182" rx="7" ry="4" fill="#FFFFFF" />
            <circle cx="221" cy="182" r="3.5" fill="#451A03" />
            <circle cx="222" cy="181" r="1" fill="#FFFFFF" />
            <path d="M 214 178 Q 222 174 230 178" stroke="#78350F" strokeWidth="1.8" fill="none" />
          </g>

          {/* Sacred Chandan & Kumkum Tilak on Forehead */}
          <g className="tilak">
            {/* White/Yellow Chandan Tripundra arcs */}
            <path d="M 186 155 Q 200 162 214 155" stroke="#FFFBEB" strokeWidth="3.5" fill="none" />
            <path d="M 188 160 Q 200 167 212 160" stroke="#FFFBEB" strokeWidth="2.5" fill="none" />
            {/* Vermillion Kumkum U-shape / Trishul */}
            <path d="M 194 148 Q 200 170 206 148" stroke="#DC2626" strokeWidth="2.5" fill="none" />
            {/* Red Kumkum Bindi / Sun */}
            <circle cx="200" cy="154" r="3.5" fill="#EF4444" />
          </g>

          {/* Ornate Gilded Royal Crown (Mukut) */}
          <g className="royal-mukut">
            {/* Crown Base Band */}
            <path
              d="M 160 148 C 175 142, 225 142, 240 148 L 244 135 C 225 130, 175 130, 156 135 Z"
              fill={mukutColor}
              stroke={mukutShadow}
              strokeWidth="2"
            />
            {/* Crown Gems on band */}
            <circle cx="175" cy="140" r="3" fill="#DC2626" />
            <circle cx="200" cy="138" r="4.5" fill="#10B981" />
            <circle cx="225" cy="140" r="3" fill="#DC2626" />

            {/* Main Crown Tier */}
            <path
              d="M 162 135
                 L 172 90
                 L 200 60
                 L 228 90
                 L 238 135
                 Z"
              fill={mukutColor}
              stroke={mukutShadow}
              strokeWidth="2.5"
            />

            {/* Inner Crown Intricate Engravings */}
            <path d="M 176 115 C 190 100, 210 100, 224 115" stroke={mukutShadow} strokeWidth="2" fill="none" />
            <path d="M 184 95 C 192 85, 208 85, 216 95" stroke={mukutShadow} strokeWidth="1.8" fill="none" />

            {/* Royal Ruby Gemstone Crest in Center of Crown */}
            <polygon points="200,82 208,94 200,106 192,94" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="200" cy="94" r="2.5" fill="#FCA5A5" />

            {/* Golden Kalash Pinnacle Jewel atop Mukut */}
            <circle cx="200" cy="55" r="7" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="200" cy="45" r="3.5" fill="#DC2626" />
          </g>

          {/* Fragrant Marigold & Jasmine Mala around Neck */}
          <g className="flower-mala">
            <path
              d="M 148 215 C 160 270, 240 270, 252 215"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="10 4"
              fill="none"
            />
            <path
              d="M 148 215 C 160 270, 240 270, 252 215"
              stroke="#EF4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 10"
              fill="none"
            />
            {/* Center Rose Pendant */}
            <circle cx="200" cy="265" r="8" fill="#F43F5E" stroke="#FFE4E6" strokeWidth="1.5" />
          </g>
        </g>

        {/* 7. Mooshak (Devoted Mouse Companion) at Bappa's Feet */}
        {showMouse && (
          <g transform="translate(300, 360) scale(0.95)" className="mooshak-raj">
            {/* Body */}
            <ellipse cx="20" cy="20" rx="14" ry="10" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
            {/* Head */}
            <ellipse cx="9" cy="16" rx="9" ry="7" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
            {/* Cute Ear */}
            <circle cx="11" cy="9" r="5" fill="#FDA4AF" stroke="#64748B" strokeWidth="1.2" />
            {/* Eye */}
            <circle cx="6" cy="15" r="1.5" fill="#0F172A" />
            {/* Long Tail curled happily */}
            <path d="M 33 22 Q 45 15 42 6" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Front paws holding tiny modak */}
            <ellipse cx="2" cy="19" rx="3" ry="2" fill="#E2E8F0" />
            <circle cx="0" cy="18" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
};
