# LearnLeague v3 Implementation Plan

**Overview:** Build a React+Vite+TypeScript web app for learning League of Legends champions, featuring a filterable champion grid, detailed champion pages with concise ability descriptions, and a dark information-dense UI.

## Phases

- [ ] **Phase 1:** Initialize Vite+React+TS project, set up routing, create Data Dragon sync script, build-app-data script, and dark theme base styles
- [ ] **Phase 2:** Build ChampionGrid page with FilterBar (search + toggle chips), ChampionCard components, and localStorage for learned state
- [ ] **Phase 3:** Build ChampionDetail page with overview, playstyle, abilities (expandable), strengths/weaknesses, and external links
- [ ] **Phase 4:** Generate content for 10 POC champions (Ahri, Garen, Thresh, Jinx, Lee Sin, Yasuo, Aphelios, Azir, Sylas, Evelynn)
- [ ] **Phase 5:** Mobile responsiveness, accessibility, generate remaining champion descriptions, final testing

---

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Routing:** React Router v6 (SPA with shareable URLs like `/champions/ahri`)
- **Styling:** CSS Modules or vanilla CSS with CSS variables for theming
- **State:** React Context for global state (learned champions), localStorage for persistence
- **Data:** Static JSON files served from `public/`, synced from Data Dragon

---

## Data Model

### Champion Schema (`public/app-data/champions.json`)

```typescript
interface Champion {
  id: string;              // "Ahri"
  name: string;            // "Ahri"
  title: string;           // "the Nine-Tailed Fox"
  
  // Classification (for filtering) - uses modern subclass system
  classes: string[];       // ["Burst", "Assassin"] - can have multiple
  rangeType: "Melee" | "Ranged";
  damageType: "Physical" | "Magic" | "Mixed";
  lanes: string[];         // ["Middle"]
  resource: string;        // "Mana", "Energy", "None", etc.
  
  // Images (local paths, downloaded from Data Dragon)
  images: {
    icon: string;          // Square icon for grid (e.g., "/assets/champion/Ahri.png")
    loading: string;       // Loading screen art for detail (e.g., "/assets/champion/loading/Ahri_0.jpg")
    passive: string;       // Passive ability icon (e.g., "/assets/passive/Ahri_SoulEater.png")
    abilities: string[];   // [Q, W, E, R] ability icons (e.g., "/assets/spell/AhriOrbofDeception.png")
  };
  
  // Content (AI-generated, concise)
  playstyle: {
    identity: string;      // What makes them unique (1-2 sentences)
    howToPlay: string;     // Combo patterns, trading (2-3 sentences)
    powerSpikes: string;   // When they're strong (1-2 sentences)
  };
  strengths: string[];     // 3-4 bullet points
  weaknesses: string[];    // 3-4 bullet points
  
  // Abilities
  passive: Ability;
  abilities: Ability[];    // Q, W, E, R
}

interface Ability {
  slot: "P" | "Q" | "W" | "E" | "R";
  name: string;
  summary: string;         // One-liner (e.g., "Dash forward, charm enemies")
  details: string;         // 2-3 sentences with key mechanics
}
```

### Filter Categories

- **Class (Subclass):** Uses modern LoL classification system. Champions can have multiple classes.
  - Controller: Enchanter, Catcher
  - Fighter: Juggernaut, Diver
  - Mage: Burst, Battlemage, Artillery
  - Marksman (no subclasses)
  - Slayer: Assassin, Skirmisher
  - Tank: Vanguard, Warden
  - Specialist (unique/unclassified)
- **Range Type:** Melee, Ranged
- **Damage Type:** Physical, Magic, Mixed
- **Lane:** Top, Jungle, Middle, Bottom, Support

Reference: https://wiki.leagueoflegends.com/en-us/Champion_classes

---

## Project Structure

```
LearnLeague-v3/
├── public/
│   ├── app-data/
│   │   └── champions.json      # Main champion data
│   └── assets/                 # Downloaded from Data Dragon (served locally)
│       ├── champion/           # Square champion icons (Ahri.png, etc.)
│       │   └── loading/        # Loading screen art (Ahri_0.jpg, etc.)
│       ├── passive/            # Passive ability icons
│       └── spell/              # Q/W/E/R ability icons
├── scripts/
│   ├── sync-ddragon.js         # Download latest DD version
│   └── build-app-data.js       # Generate champions.json from DD + manual data
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── ChampionGrid.tsx    # Grid page with filters
│   │   └── ChampionDetail.tsx  # Detail page
│   ├── components/
│   │   ├── ChampionCard.tsx    # Grid card component
│   │   ├── FilterBar.tsx       # Search + toggle chips
│   │   ├── AbilityCard.tsx     # Ability display with expand
│   │   └── ExternalLinks.tsx   # Wiki, U.GG, etc. links
│   ├── lib/
│   │   ├── champion-data.ts    # Data loading utilities
│   │   ├── filters.ts          # Filter logic
│   │   └── storage.ts          # localStorage for learned state
│   └── styles/
│       ├── base.css            # CSS variables, dark theme
│       ├── grid.css
│       └── detail.css
├── data/
│   ├── ddragon-version.json    # Current DD version
│   └── champion-content/       # Manual ability descriptions
│       ├── ahri.json
│       └── ...
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Phase 1: Project Skeleton + Data Pipeline

**Goal:** Set up the project, Data Dragon sync, and basic data model.

**Tasks:**

1. Initialize Vite + React + TypeScript project with React Router
2. Create `sync-ddragon.js` script to:
   - Fetch latest DD version from `https://ddragon.leagueoflegends.com/api/versions.json`
   - Download champion data JSON from `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json`
   - Download individual champion JSON (for ability details) from `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion/{id}.json`
   - Download all image assets locally to `public/assets/`:
     - Champion icons: `/cdn/{version}/img/champion/{id}.png` → `public/assets/champion/`
     - Loading art: `/cdn/img/champion/loading/{id}_0.jpg` → `public/assets/champion/loading/`
     - Passive icons: `/cdn/{version}/img/passive/{passive.image.full}` → `public/assets/passive/`
     - Spell icons: `/cdn/{version}/img/spell/{spell.image.full}` → `public/assets/spell/`
   - Store version in `data/ddragon-version.json`
3. Create `build-app-data.js` script to:
   - Read DD champion data for base info (id, name, title, tags)
   - Generate local image paths (pointing to downloaded assets)
   - Merge with manual content from `data/champion-content/`
   - Output `public/app-data/champions.json`
4. Set up dark theme CSS variables and base layout
5. Create placeholder routes for grid and detail pages

**Key Files:**

- `package.json` with scripts: `dev`, `build`, `sync:ddragon`, `build:app-data`
- `scripts/sync-ddragon.js`
- `scripts/build-app-data.js`
- `src/styles/base.css`

**Asset Storage Notes:**

- Downloaded assets are stored in `public/assets/` (~50-100MB for all champions)
- Assets are NOT committed to git (add `public/assets/` to `.gitignore`)
- Running `npm run sync:ddragon` downloads/updates all assets
- The `champions.json` data file IS committed (contains local asset paths)

---

## Phase 2: Champion Grid Page

**Goal:** Display all champions in a filterable grid.

**Tasks:**

1. Build `ChampionGrid.tsx` with:
   - Responsive grid layout (CSS Grid)
   - Champion cards showing icon, name, classes, lanes
2. Build `FilterBar.tsx` with:
   - Search input (filters by name)
   - Toggle chips for Class (subclasses like Burst, Juggernaut, Assassin, etc.), Range, Damage Type, Lane
   - AND logic: champion must match ALL active filters
3. Build `ChampionCard.tsx` with:
   - Square icon from Data Dragon
   - Name and class badges
   - "Learned" checkbox (persisted to localStorage)
   - Click navigates to detail page
4. Implement filter state and localStorage persistence

**UI Design Notes:**

- Dark background (#0a0a0f or similar)
- Cards with subtle borders, hover effects
- Chips use color coding by class family (e.g., Mage subclasses = blue tones, Slayer subclasses = purple/red tones, Fighter subclasses = orange tones, Tank subclasses = green tones, Controller subclasses = teal tones, Marksman = yellow, Specialist = gray)
- Dense layout: 6-8 champions per row on desktop

---

## Phase 3: Champion Detail Page

**Goal:** Show detailed champion info with expandable abilities.

**Tasks:**

1. Build `ChampionDetail.tsx` with sections:
   - **Header:** Loading art (background), icon, name, title
   - **Overview:** Classes, range type, damage type, lanes, resource
   - **Playstyle:** Identity, how to play, power spikes
   - **Strengths/Weaknesses:** Bullet point lists
   - **Abilities:** Passive + Q/W/E/R cards
   - **External Links:** Wiki, U.GG, OP.GG, DeepLoL, Mobalytics
2. Build `AbilityCard.tsx` with:
   - Ability icon, slot indicator (P/Q/W/E/R), name
   - One-liner summary always visible
   - "Show details" toggle for expanded view
3. Build `ExternalLinks.tsx` generating links:
   - Wiki: `https://wiki.leagueoflegends.com/en-us/{name}`
   - U.GG: `https://u.gg/lol/champions/{id}/build`
   - OP.GG: `https://op.gg/champions/{id}`
   - DeepLoL: `https://www.deeplol.gg/champions/{id}`
   - Mobalytics: `https://mobalytics.gg/lol/champions/{id}/build`
4. Add back navigation to grid

---

## Phase 4: Proof of Concept Champions

**Goal:** Create content for ~10 diverse champions to validate the data model.

**Selected Champions (covers popular, diverse classes, complex kits):**

1. **Ahri** - Burst, Mid (popular, accessible)
2. **Garen** - Juggernaut, Top (simple baseline)
3. **Thresh** - Catcher, Support (iconic support, hooks)
4. **Jinx** - Marksman, ADC (popular from Arcane)
5. **Lee Sin** - Diver, Jungle (high skill ceiling)
6. **Yasuo** - Skirmisher, Mid/Top (popular, complex)
7. **Aphelios** - Marksman, ADC (very complex, 5 weapons)
8. **Azir** - Specialist, Mid (complex soldier management)
9. **Sylas** - Burst + Skirmisher, Mid/Top (steals ultimates)
10. **Evelynn** - Assassin, Jungle (stealth assassin)

**Content per champion includes:**

- Playstyle (identity, how to play, power spikes)
- 3-4 strengths, 3-4 weaknesses
- All 5 abilities (P, Q, W, E, R) with summary + details

---

## Phase 5: Polish + Remaining Champions

**Goal:** Finalize UI and generate content for all champions.

**Tasks:**

1. Basic mobile responsive adjustments
2. Keyboard navigation and accessibility
3. Generate remaining ~160 champion descriptions in batches
4. Final testing and bug fixes

---

## External Links Format

| Site       | URL Pattern                                              |
| ---------- | -------------------------------------------------------- |
| Wiki       | `https://wiki.leagueoflegends.com/en-us/{ChampionName}`  |
| U.GG       | `https://u.gg/lol/champions/{championId}/build`          |
| OP.GG      | `https://op.gg/champions/{championId}`                   |
| DeepLoL    | `https://www.deeplol.gg/champions/{championId}`          |
| Mobalytics | `https://mobalytics.gg/lol/champions/{championId}/build` |

---

## NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "sync:ddragon": "node scripts/sync-ddragon.js",
    "build:app-data": "node scripts/build-app-data.js"
  }
}
```

**First-time setup:** Run `npm run sync:ddragon` to download all Data Dragon assets locally before starting development.

---

## Sample Ability Description (Ahri Q - Orb of Deception)

**Summary:** "Throw an orb that deals magic damage out and true damage on return."

**Details:** "Ahri throws her orb in a line, dealing magic damage to enemies on the way out. The orb then returns to her, dealing true damage on the way back. This is her primary poke and waveclear tool. The true damage on return makes it effective against tanks."
