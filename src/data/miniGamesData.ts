import { MiniGameMeta } from '../types/game';

export const ALL_MINI_GAMES: MiniGameMeta[] = [
  // DAY 1: FUND THE FESTIVAL (6 Games, Target ₹500)
  {
    id: 'neighborhood-collection',
    gameNumber: 1,
    day: 1,
    title: 'Neighborhood Collection',
    category: 'observation',
    icon: '🏘️',
    shortDesc: 'Move between neighborhood spots and meet friendly neighbors for contributions.',
    instructions: {
      doing: 'Meeting neighbors across the community to fund Bappas celebration.',
      howToPlay: 'Move between House, Shop, Park, and Community Center, then tap to talk.',
      goal: 'Gather contributions from 4 friendly neighbors.',
      reward: 'Festival money (₹20 - ₹50) and community goodwill!'
    }
  },
  {
    id: 'coin-catcher',
    gameNumber: 2,
    day: 1,
    title: 'Coin Catcher',
    category: 'reaction',
    icon: '🪙',
    shortDesc: 'Catch falling festival coins in your donation basket.',
    instructions: {
      doing: 'Catching descending festival contribution coins.',
      howToPlay: 'Drag the basket with touch/mouse, or use A/D and arrow keys.',
      goal: 'Catch falling ₹5, ₹10, and ₹20 coins to build combo streaks.',
      reward: 'Festival funds and multiplier scores!'
    }
  },
  {
    id: 'money-counting-challenge',
    gameNumber: 3,
    day: 1,
    title: 'Money Counting Challenge',
    category: 'counting',
    icon: '🧮',
    shortDesc: 'Drag coins and notes into the counting tray to tally the exact amount.',
    instructions: {
      doing: 'Auditing festival collection trays with mixed currency.',
      howToPlay: 'Drag coins and notes into the counting area and submit the total.',
      goal: 'Count and confirm 3 donation envelopes accurately.',
      reward: 'Counting accuracy bonus and tokens!'
    }
  },
  {
    id: 'festival-budget-puzzle',
    gameNumber: 4,
    day: 1,
    title: 'Festival Budget Puzzle',
    category: 'logic',
    icon: '📋',
    shortDesc: 'Select essential festival supplies without exceeding the budget.',
    instructions: {
      doing: 'Purchasing flowers, diyas, lights, and decor within strict budget limits.',
      howToPlay: 'Select items to add them to your cart while watching remaining funds.',
      goal: 'Pick at least 3 essential supplies within the ₹100 budget.',
      reward: 'Smart budgeting bonus and tokens!'
    }
  },
  {
    id: 'hidden-contribution-hunt',
    gameNumber: 5,
    day: 1,
    title: 'Hidden Contribution Hunt',
    category: 'observation',
    icon: '🔍',
    shortDesc: 'Explore the festival scene and find 3 hidden contribution envelopes.',
    instructions: {
      doing: 'Searching for special donation envelopes left by well-wishers.',
      howToPlay: 'Examine the neighborhood scene carefully and tap sparkling spots.',
      goal: 'Find all 3 hidden contribution envelopes.',
      reward: 'Secret contribution jackpot funds!'
    }
  },
  {
    id: 'lucky-delivery',
    gameNumber: 6,
    day: 1,
    title: 'Lucky Delivery',
    category: 'timing',
    icon: '🏃',
    shortDesc: 'Deliver the collected festival funds to the community organizer.',
    instructions: {
      doing: 'Rushing with the donation treasury box to the community organizer.',
      howToPlay: 'Switch lanes to choose the clearest path and dodge obstacles.',
      goal: 'Safely deliver all collected funds to reach the ₹500 target.',
      reward: 'Day 1 completion and idol fund unlocked!'
    }
  },

  // DAY 2: BUILD THE FESTIVAL (6 Games)
  {
    id: 'tent-construction',
    gameNumber: 7,
    day: 2,
    title: 'Tent Construction',
    category: 'drag-drop',
    icon: '🎪',
    shortDesc: 'Snap pillars, platform, roof, and canopy cloth into the blueprint.',
    instructions: {
      doing: 'Erecting the festive pandal structure for the neighborhood.',
      howToPlay: 'Drag timber pillars, platform, roof, and drapes into matching slots.',
      goal: 'Snap all 4 main structural pieces securely into place.',
      reward: 'Sturdy pandal structure and building stars!'
    }
  },
  {
    id: 'rangoli-creator',
    gameNumber: 8,
    day: 2,
    title: 'Rangoli Creator',
    category: 'drag-drop',
    icon: '🎨',
    shortDesc: 'Connect points on a geometric grid to design an auspicious rangoli.',
    instructions: {
      doing: 'Drawing traditional colored powder rangoli at the pandal entrance.',
      howToPlay: 'Tap grid nodes to fill vibrant festive powder colors.',
      goal: 'Fill symmetrical petals and press [DONE].',
      reward: 'Aesthetic decor bonus and tokens!'
    }
  },
  {
    id: 'garland-maker',
    gameNumber: 9,
    day: 2,
    title: 'Garland Maker',
    category: 'pattern',
    icon: '🌸',
    shortDesc: 'String fresh flowers into a sacred decorative pattern.',
    instructions: {
      doing: 'Weaving festive marigold and rose flower garlands for the mandap.',
      howToPlay: 'Follow the pattern rule (Red → Yellow → Red → Yellow) and tap the next flower.',
      goal: 'Complete 3 sacred flower garlands without mistakes.',
      reward: 'Fragrant floral tokens and score!'
    }
  },
  {
    id: 'decoration-placement',
    gameNumber: 10,
    day: 2,
    title: 'Decoration Placement',
    category: 'drag-drop',
    icon: '🏮',
    shortDesc: 'Place flowers, diyas, lights, banners, and torans in the mandap.',
    instructions: {
      doing: 'Arranging festive decorations across the unfinished altar space.',
      howToPlay: 'Tap an item and place it into its highlighted spot (repositionable).',
      goal: 'Place all 5 festive decorations to complete the mandap interior.',
      reward: 'Grand decor completion score!'
    }
  },
  {
    id: 'electricity-puzzle',
    gameNumber: 11,
    day: 2,
    title: 'Electricity Puzzle',
    category: 'logic',
    icon: '💡',
    shortDesc: 'Rotate circuit wire segments to connect power to all 5 lights.',
    instructions: {
      doing: 'Wiring the fairy lights circuit around the temple arches.',
      howToPlay: 'Tap wire pieces to rotate them until power flows from source to all bulbs.',
      goal: 'Turn on all 5 festive lights simultaneously.',
      reward: 'Full mandap illumination and engineering stars!'
    }
  },
  {
    id: 'temple-design-challenge',
    gameNumber: 12,
    day: 2,
    title: 'Temple Design Challenge',
    category: 'matching',
    icon: '🏛️',
    shortDesc: 'Recreate the target decorative layout with perfect symmetry.',
    instructions: {
      doing: 'Harmonizing sacred symbols in exact decorative order.',
      howToPlay: 'Observe the target layout (Diya, Flower, Banner, Flower, Diya) and arrange.',
      goal: 'Recreate the festive arrangement with high accuracy.',
      reward: 'Day 2 completion and temple ready!'
    }
  },

  // DAY 3: BRING BAPPA (6 Games)
  {
    id: 'choose-the-idol',
    gameNumber: 13,
    day: 3,
    title: 'Choose the Idol',
    category: 'logic',
    icon: '🐘',
    shortDesc: 'Visit the artisan clay sculptor and select your neighborhood Bappa.',
    instructions: {
      doing: 'Selecting an eco-friendly clay Ganesha idol within the collected budget.',
      howToPlay: 'Compare the handcrafted idols and select your favorite.',
      goal: 'Welcome your chosen idol for the rest of the celebration.',
      reward: 'Bappa welcomed with joy and blessings!'
    }
  },
  {
    id: 'market-navigation',
    gameNumber: 14,
    day: 3,
    title: 'Market Navigation',
    category: 'observation',
    icon: '🗺️',
    shortDesc: 'Navigate through the festive market from Idol Shop to Temple.',
    instructions: {
      doing: 'Finding the route through the crowded market using street signs.',
      howToPlay: 'Follow directional signs: Idol Shop → Flower Shop → Temple.',
      goal: 'Reach all 3 market checkpoints in order.',
      reward: 'Market navigator trophy and tokens!'
    }
  },
  {
    id: 'idol-carrying-challenge',
    gameNumber: 15,
    day: 3,
    title: 'Idol Carrying Challenge',
    category: 'reaction',
    icon: '🚶‍♂️',
    shortDesc: 'Carry the sacred idol respectfully, dodging street obstacles.',
    instructions: {
      doing: 'Leading the palkhi carrying Lord Ganesha home.',
      howToPlay: 'Steer left and right to avoid crates and flower pots while gathering petals.',
      goal: 'Safely reach the pandal entrance with Bappa.',
      reward: 'Safe arrival bonus and procession points!'
    }
  },
  {
    id: 'flower-offering',
    gameNumber: 16,
    day: 3,
    title: 'Flower Offering',
    category: 'drag-drop',
    icon: '🌺',
    shortDesc: 'Offer sacred red hibiscus and 21 durva grass blades at Bappas feet.',
    instructions: {
      doing: 'Placing Lord Ganeshas favorite flowers onto the altar thali.',
      howToPlay: 'Drag red hibiscus and durva blades respectfully onto the offering thali.',
      goal: 'Offer 5 sacred items with devotion.',
      reward: 'Auspicious blessings and grace points!'
    }
  },
  {
    id: 'puja-prep-puzzle',
    gameNumber: 17,
    day: 3,
    title: 'Puja Preparation Puzzle',
    category: 'logic',
    icon: '🕯️',
    shortDesc: 'Place diya, flowers, bell, and modak into designated altar spots.',
    instructions: {
      doing: 'Preparing the sacred ritual thali before the evening aarti.',
      howToPlay: 'Match each puja item into its designated outlined slot on the altar.',
      goal: 'Position all 4 sacred items in their proper places.',
      reward: 'Puja readiness bonus and stars!'
    }
  },
  {
    id: 'puja-celebration',
    gameNumber: 18,
    day: 3,
    title: 'Puja Celebration',
    category: 'timing',
    icon: '🙏',
    shortDesc: 'Perform the 4 distinct puja rituals: light diya, offer flowers, ring bell, and offer modak.',
    instructions: {
      doing: 'Conducting the auspicious Ganesh Chaturthi Maha Puja.',
      howToPlay: 'Complete 4 distinct actions: hold to kindle, drag flowers, time bell ring, place modak.',
      goal: 'Execute all 4 sacred steps with high devotion.',
      reward: 'Day 3 completion and sanctum fully blessed!'
    }
  },

  // DAY 4: THE GRAND FINALE (6 Connected Climax Games)
  {
    id: 'procession-preparation',
    gameNumber: 19,
    day: 4,
    title: 'Procession Preparation',
    category: 'drag-drop',
    icon: '🏮',
    shortDesc: 'Stage the procession cart with flowers, diyas, decorations, and silk banner.',
    instructions: {
      doing: 'Preparing the grand chariot before departing for the sacred lake.',
      howToPlay: 'Drag flower garlands, royal diyas, and the Morya banner onto the cart.',
      goal: 'Fully outfit the procession cart for departure.',
      reward: 'Chariot ready for departure and celebration points!'
    }
  },
  {
    id: 'dhol-crowd-rhythm',
    gameNumber: 20,
    day: 4,
    title: 'Dhol & Crowd Rhythm',
    category: 'rhythm',
    icon: '🥁',
    shortDesc: 'Follow dynamic multi-action prompts: Drum, Clap, Light, and Flower.',
    instructions: {
      doing: 'Leading the thunderous neighborhood Dhol Tasha Pathak.',
      howToPlay: 'Tap the matching action (🥁 DRUM, 👏 CLAP, 🪔 LIGHT, 🌸 FLOWER) as called.',
      goal: 'Execute 12 dynamic rhythm beats with the cheering crowd.',
      reward: 'Ecstatic crowd cheer and high combo score!'
    }
  },
  {
    id: 'procession-navigation',
    gameNumber: 21,
    day: 4,
    title: 'Procession Navigation',
    category: 'observation',
    icon: '🧭',
    shortDesc: 'Guide the procession through changing streets: Temple → Market → Park → Lake.',
    instructions: {
      doing: 'Navigating the grand procession through winding neighborhood lanes.',
      howToPlay: 'Select the clearest street path leading toward the water ghat signs.',
      goal: 'Navigate past all 4 environmental stages safely to reach the lake.',
      reward: 'Master procession route guide points!'
    }
  },
  {
    id: 'flower-celebration',
    gameNumber: 22,
    day: 4,
    title: 'Flower Celebration',
    category: 'reaction',
    icon: '💐',
    shortDesc: 'Collect moving flower trails and golden star blooms in the crowd.',
    instructions: {
      doing: 'Catching showers of gulal and marigold blooms thrown from balconies.',
      howToPlay: 'Switch procession lanes to collect floating flowers and special star blooms.',
      goal: 'Collect 15 flowers and at least 2 golden star blooms.',
      reward: 'Celebration trail jackpot score and tokens!'
    }
  },
  {
    id: 'memory-journey',
    gameNumber: 23,
    day: 4,
    title: 'Memory Journey',
    category: 'memory',
    icon: '📜',
    shortDesc: 'Reconstruct the route connecting landmark memories from all 4 days.',
    instructions: {
      doing: 'Remembering the community story: House → Shop → Temple → Flower Area → Lake.',
      howToPlay: 'Observe the landmark sequence, then tap the locations in historical order.',
      goal: 'Connect all 5 landmark memories without mistakes.',
      reward: 'Four-day journey remembrance trophy and stars!'
    }
  },
  {
    id: 'grand-visarjan-ceremony',
    gameNumber: 24,
    day: 4,
    title: 'Grand Visarjan Ceremony',
    category: 'timing',
    icon: '🌅',
    shortDesc: 'A multi-stage cinematic interactive finale at the sunset lake.',
    instructions: {
      doing: 'Conducting the sacred lake immersion ceremony with prayers and gratitude.',
      howToPlay: 'Complete final offerings, confirm immersion, and experience the gentle farewell.',
      goal: 'Perform the respectful Visarjan and complete the festival journey.',
      reward: 'Grand festival completion & Ganpati Bappa Morya!'
    }
  }
];

export const INITIAL_OFFERS = [
  {
    id: 'offer-flowers',
    title: '🌸 Flower Bonus',
    desc: 'Collect 5 special flowers across games',
    icon: '🌸',
    rewardScore: 30,
    rewardTokens: 15,
    progress: 0,
    target: 5,
    claimed: false
  },
  {
    id: 'offer-diyas',
    title: '🪔 Diya Bonus',
    desc: 'Complete a diya activity with high accuracy',
    icon: '🪔',
    rewardScore: 40,
    rewardTokens: 20,
    progress: 0,
    target: 3,
    claimed: false
  },
  {
    id: 'offer-decor',
    title: '🏮 Decoration Bonus',
    desc: 'Complete festival building and arrangement activities',
    icon: '🏮',
    rewardScore: 50,
    rewardTokens: 25,
    progress: 0,
    target: 4,
    claimed: false
  },
  {
    id: 'offer-rhythm',
    title: '🥁 Celebration Bonus',
    desc: 'Achieve perfect rhythm hits in the Dhol Tasha games',
    icon: '🥁',
    rewardScore: 50,
    rewardTokens: 25,
    progress: 0,
    target: 3,
    claimed: false
  }
];

export const SHOP_ITEMS = [
  {
    id: 'decor-flower-toran',
    name: 'Marigold Toran',
    category: 'Flowers',
    cost: 30,
    icon: '🌸',
    desc: 'Festive marigold flower garland hanging above the pandal door.'
  },
  {
    id: 'decor-brass-diya',
    name: 'Royal Brass Diya',
    category: 'Diyas',
    cost: 45,
    icon: '🪔',
    desc: 'Exquisite multi-tier brass oil lamp that radiates golden light.'
  },
  {
    id: 'decor-fairy-lights',
    name: 'Golden Fairy Lights',
    category: 'Lights',
    cost: 50,
    icon: '💡',
    desc: 'Warm cascading LED light drapes illuminating the mandap.'
  },
  {
    id: 'decor-peacock-rangoli',
    name: 'Peacock Rangoli',
    category: 'Art',
    cost: 60,
    icon: '🎨',
    desc: 'Intricate peacock design in vibrant saffron, gold, and teal.'
  },
  {
    id: 'decor-festival-banner',
    name: 'Morya Silk Banner',
    category: 'Banner',
    cost: 75,
    icon: '🏮',
    desc: 'Crimson and gold embroidered banner with "Ganpati Bappa Morya".'
  }
];
