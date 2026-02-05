/**
 * Build App Data Script
 * Merges Data Dragon data with manual champion content to produce the final JSON
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT_DIR, 'data')
const DDRAGON_DIR = path.join(DATA_DIR, 'ddragon')
const CONTENT_DIR = path.join(DATA_DIR, 'champion-content')
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'app-data')

// Champion classes from the League of Legends Wiki (source of truth)
// Reference: https://wiki.leagueoflegends.com/en-us/List_of_champions
const WIKI_CHAMPION_CLASSES = {
  'Aatrox': ['Juggernaut'],
  'Ahri': ['Burst'],
  'Akali': ['Assassin'],
  'Akshan': ['Marksman', 'Assassin'],
  'Alistar': ['Vanguard'],
  'Ambessa': ['Diver', 'Skirmisher'],
  'Amumu': ['Vanguard'],
  'Anivia': ['Battlemage'],
  'Annie': ['Burst'],
  'Aphelios': ['Marksman'],
  'Ashe': ['Marksman'],
  'AurelionSol': ['Battlemage'],
  'Aurora': ['Burst', 'Assassin'],
  'Azir': ['Specialist'],
  'Bard': ['Catcher'],
  'Belveth': ['Skirmisher'],
  'Blitzcrank': ['Catcher'],
  'Brand': ['Burst'],
  'Braum': ['Warden'],
  'Briar': ['Diver'],
  'Caitlyn': ['Marksman'],
  'Camille': ['Diver'],
  'Cassiopeia': ['Battlemage'],
  'Chogath': ['Specialist'],
  'Corki': ['Marksman'],
  'Darius': ['Juggernaut'],
  'Diana': ['Assassin', 'Diver'],
  'DrMundo': ['Juggernaut'],
  'Draven': ['Marksman'],
  'Ekko': ['Assassin'],
  'Elise': ['Diver'],
  'Evelynn': ['Assassin'],
  'Ezreal': ['Marksman'],
  'Fiddlesticks': ['Specialist'],
  'Fiora': ['Skirmisher'],
  'Fizz': ['Assassin'],
  'Galio': ['Warden'],
  'Gangplank': ['Specialist'],
  'Garen': ['Juggernaut'],
  'Gnar': ['Specialist'],
  'Gragas': ['Vanguard'],
  'Graves': ['Specialist'],
  'Gwen': ['Skirmisher'],
  'Hecarim': ['Diver'],
  'Heimerdinger': ['Specialist'],
  'Hwei': ['Artillery'],
  'Illaoi': ['Juggernaut'],
  'Irelia': ['Diver'],
  'Ivern': ['Catcher'],
  'Janna': ['Enchanter'],
  'JarvanIV': ['Diver'],
  'Jax': ['Skirmisher'],
  'Jayce': ['Artillery'],
  'Jhin': ['Marksman', 'Catcher'],
  'Jinx': ['Marksman'],
  'KSante': ['Warden', 'Skirmisher'],
  'Kaisa': ['Marksman'],
  'Kalista': ['Marksman'],
  'Karma': ['Burst', 'Enchanter'],
  'Karthus': ['Battlemage'],
  'Kassadin': ['Assassin'],
  'Katarina': ['Assassin'],
  'Kayle': ['Specialist'],
  'Kayn': ['Skirmisher'],
  'Kennen': ['Specialist'],
  'Khazix': ['Assassin'],
  'Kindred': ['Marksman'],
  'Kled': ['Skirmisher'],
  'KogMaw': ['Marksman'],
  'Leblanc': ['Burst', 'Assassin'],
  'LeeSin': ['Diver'],
  'Leona': ['Vanguard'],
  'Lillia': ['Skirmisher'],
  'Lissandra': ['Burst'],
  'Lucian': ['Marksman'],
  'Lulu': ['Enchanter'],
  'Lux': ['Burst', 'Artillery'],
  'Malphite': ['Vanguard'],
  'Malzahar': ['Battlemage'],
  'Maokai': ['Vanguard'],
  'MasterYi': ['Skirmisher'],
  'Mel': ['Artillery'],
  'Milio': ['Enchanter'],
  'MissFortune': ['Marksman'],
  'Mordekaiser': ['Juggernaut'],
  'Morgana': ['Catcher'],
  'Naafiri': ['Assassin'],
  'Nami': ['Enchanter'],
  'Nasus': ['Juggernaut'],
  'Nautilus': ['Vanguard'],
  'Neeko': ['Burst', 'Catcher'],
  'Nidalee': ['Specialist'],
  'Nilah': ['Skirmisher'],
  'Nocturne': ['Assassin'],
  'Nunu': ['Vanguard'],
  'Olaf': ['Diver'],
  'Orianna': ['Burst'],
  'Ornn': ['Vanguard'],
  'Pantheon': ['Diver'],
  'Poppy': ['Warden'],
  'Pyke': ['Assassin', 'Catcher'],
  'Qiyana': ['Assassin'],
  'Quinn': ['Specialist'],
  'Rakan': ['Catcher'],
  'Rammus': ['Vanguard'],
  'RekSai': ['Diver'],
  'Rell': ['Vanguard'],
  'RenataGlasc': ['Enchanter'],
  'Renata': ['Enchanter'],  // Data Dragon uses 'Renata' as ID
  'Renekton': ['Diver'],
  'Rengar': ['Assassin', 'Diver'],
  'Riven': ['Skirmisher'],
  'Rumble': ['Battlemage'],
  'Ryze': ['Battlemage'],
  'Samira': ['Marksman'],
  'Sejuani': ['Vanguard'],
  'Senna': ['Marksman', 'Enchanter'],
  'Seraphine': ['Burst', 'Enchanter'],
  'Sett': ['Juggernaut'],
  'Shaco': ['Assassin'],
  'Shen': ['Warden'],
  'Shyvana': ['Juggernaut'],
  'Singed': ['Specialist'],
  'Sion': ['Vanguard'],
  'Sivir': ['Marksman'],
  'Skarner': ['Vanguard', 'Juggernaut'],
  'Smolder': ['Marksman'],
  'Sona': ['Enchanter'],
  'Soraka': ['Enchanter'],
  'Swain': ['Battlemage'],
  'Sylas': ['Burst', 'Skirmisher'],
  'Syndra': ['Burst'],
  'TahmKench': ['Warden'],
  'Taliyah': ['Battlemage'],
  'Talon': ['Assassin'],
  'Taric': ['Enchanter', 'Warden'],
  'Teemo': ['Specialist'],
  'Thresh': ['Catcher'],
  'Tristana': ['Marksman'],
  'Trundle': ['Juggernaut'],
  'Tryndamere': ['Skirmisher'],
  'TwistedFate': ['Burst'],
  'Twitch': ['Marksman'],
  'Udyr': ['Juggernaut'],
  'Urgot': ['Juggernaut'],
  'Varus': ['Marksman', 'Artillery'],
  'Vayne': ['Marksman'],
  'Veigar': ['Burst'],
  'Velkoz': ['Artillery'],
  'Vex': ['Burst'],
  'Vi': ['Diver'],
  'Viego': ['Skirmisher'],
  'Viktor': ['Battlemage'],
  'Vladimir': ['Battlemage'],
  'Volibear': ['Juggernaut'],
  'Warwick': ['Diver'],
  'Wukong': ['Diver'],
  'MonkeyKing': ['Diver'],  // Data Dragon uses 'MonkeyKing' as ID
  'Xayah': ['Marksman'],
  'Xerath': ['Artillery'],
  'XinZhao': ['Diver'],
  'Yasuo': ['Skirmisher'],
  'Yone': ['Assassin', 'Skirmisher'],
  'Yorick': ['Juggernaut'],
  'Yuumi': ['Enchanter'],
  'Zac': ['Vanguard'],
  'Zed': ['Assassin'],
  'Zeri': ['Marksman'],
  'Ziggs': ['Artillery'],
  'Zilean': ['Specialist'],
  'Zoe': ['Burst'],
  'Zyra': ['Catcher'],
  // Newer champions - add as needed
  'Yunara': ['Marksman'],
  'Zaahen': ['Skirmisher'],
}

// Fallback for any champion not in wiki mapping (shouldn't happen often)
const TAG_TO_CLASS = {
  'Fighter': 'Fighter',
  'Tank': 'Tank',
  'Mage': 'Mage',
  'Assassin': 'Assassin',
  'Marksman': 'Marksman',
  'Support': 'Support',
}

// Champion lanes from the League of Legends Wiki (source of truth)
// Reference: https://wiki.leagueoflegends.com/en-us/List_of_champions_by_draft_position
// Includes any lane with Riot official, 3P, or checkmark designation
const WIKI_CHAMPION_LANES = {
  'Aatrox': ['Top'],
  'Ahri': ['Middle'],
  'Akali': ['Top', 'Middle'],
  'Akshan': ['Middle'],
  'Alistar': ['Support'],
  'Ambessa': ['Top'],
  'Amumu': ['Jungle', 'Support'],
  'Anivia': ['Middle'],
  'Annie': ['Middle'],
  'Aphelios': ['Bottom'],
  'Ashe': ['Bottom', 'Support'],
  'AurelionSol': ['Middle'],
  'Aurora': ['Top', 'Middle'],
  'Azir': ['Middle'],
  'Bard': ['Support'],
  'Belveth': ['Jungle'],
  'Blitzcrank': ['Support'],
  'Brand': ['Jungle', 'Middle', 'Support'],
  'Braum': ['Support'],
  'Briar': ['Jungle'],
  'Caitlyn': ['Bottom'],
  'Camille': ['Top', 'Support'],
  'Cassiopeia': ['Middle'],
  'Chogath': ['Top'],
  'Corki': ['Middle'],
  'Darius': ['Top'],
  'Diana': ['Jungle', 'Middle'],
  'DrMundo': ['Top'],
  'Draven': ['Bottom'],
  'Ekko': ['Jungle', 'Middle'],
  'Elise': ['Jungle'],
  'Evelynn': ['Jungle'],
  'Ezreal': ['Bottom'],
  'Fiddlesticks': ['Jungle'],
  'Fiora': ['Top'],
  'Fizz': ['Middle'],
  'Galio': ['Middle', 'Support'],
  'Gangplank': ['Top'],
  'Garen': ['Top'],
  'Gnar': ['Top'],
  'Gragas': ['Top', 'Jungle', 'Middle'],
  'Graves': ['Jungle'],
  'Gwen': ['Top', 'Jungle'],
  'Hecarim': ['Jungle'],
  'Heimerdinger': ['Top', 'Middle', 'Support'],
  'Hwei': ['Middle', 'Support'],
  'Illaoi': ['Top'],
  'Irelia': ['Top', 'Middle'],
  'Ivern': ['Jungle'],
  'Janna': ['Support'],
  'JarvanIV': ['Jungle'],
  'Jax': ['Top', 'Jungle'],
  'Jayce': ['Top', 'Middle'],
  'Jhin': ['Bottom'],
  'Jinx': ['Bottom'],
  'KSante': ['Top'],
  'Kaisa': ['Bottom'],
  'Kalista': ['Bottom'],
  'Karma': ['Top', 'Middle', 'Support'],
  'Karthus': ['Jungle'],
  'Kassadin': ['Middle'],
  'Katarina': ['Middle'],
  'Kayle': ['Top'],
  'Kayn': ['Jungle'],
  'Kennen': ['Top'],
  'Khazix': ['Jungle'],
  'Kindred': ['Jungle'],
  'Kled': ['Top'],
  'KogMaw': ['Bottom'],
  'Leblanc': ['Middle'],
  'LeeSin': ['Jungle'],
  'Leona': ['Support'],
  'Lillia': ['Jungle'],
  'Lissandra': ['Middle'],
  'Lucian': ['Bottom'],
  'Lulu': ['Support'],
  'Lux': ['Middle', 'Support'],
  'Malphite': ['Top', 'Middle', 'Support'],
  'Malzahar': ['Middle'],
  'Maokai': ['Jungle', 'Support'],
  'MasterYi': ['Jungle'],
  'Mel': ['Middle', 'Support'],
  'Milio': ['Support'],
  'MissFortune': ['Bottom'],
  'Mordekaiser': ['Top'],
  'Morgana': ['Middle', 'Support'],
  'Naafiri': ['Middle'],
  'Nami': ['Support'],
  'Nasus': ['Top'],
  'Nautilus': ['Support'],
  'Neeko': ['Middle', 'Support'],
  'Nidalee': ['Jungle'],
  'Nilah': ['Bottom'],
  'Nocturne': ['Jungle'],
  'Nunu': ['Jungle'],
  'Olaf': ['Top'],
  'Orianna': ['Middle'],
  'Ornn': ['Top'],
  'Pantheon': ['Top', 'Jungle', 'Middle', 'Support'],
  'Poppy': ['Top', 'Jungle'],
  'Pyke': ['Support'],
  'Qiyana': ['Middle'],
  'Quinn': ['Top'],
  'Rakan': ['Support'],
  'Rammus': ['Jungle'],
  'RekSai': ['Jungle'],
  'Rell': ['Support'],
  'RenataGlasc': ['Support'],
  'Renata': ['Support'],  // Data Dragon uses 'Renata' as ID
  'Renekton': ['Top'],
  'Rengar': ['Top', 'Jungle'],
  'Riven': ['Top'],
  'Rumble': ['Top', 'Middle'],
  'Ryze': ['Middle'],
  'Samira': ['Bottom'],
  'Sejuani': ['Jungle'],
  'Senna': ['Bottom', 'Support'],
  'Seraphine': ['Bottom', 'Support'],
  'Sett': ['Top'],
  'Shaco': ['Jungle', 'Support'],
  'Shen': ['Top', 'Support'],
  'Shyvana': ['Jungle'],
  'Singed': ['Top'],
  'Sion': ['Top'],
  'Sivir': ['Bottom'],
  'Skarner': ['Top', 'Jungle'],
  'Smolder': ['Top', 'Middle', 'Bottom'],
  'Sona': ['Support'],
  'Soraka': ['Support'],
  'Swain': ['Middle', 'Bottom', 'Support'],
  'Sylas': ['Top', 'Middle'],
  'Syndra': ['Middle'],
  'TahmKench': ['Top', 'Support'],
  'Taliyah': ['Jungle', 'Middle'],
  'Talon': ['Jungle', 'Middle'],
  'Taric': ['Middle', 'Support'],
  'Teemo': ['Top', 'Jungle', 'Support'],
  'Thresh': ['Support'],
  'Tristana': ['Middle', 'Bottom'],
  'Trundle': ['Top', 'Jungle'],
  'Tryndamere': ['Top'],
  'TwistedFate': ['Top', 'Middle', 'Bottom'],
  'Twitch': ['Bottom', 'Support'],
  'Udyr': ['Top', 'Jungle'],
  'Urgot': ['Top'],
  'Varus': ['Bottom'],
  'Vayne': ['Top', 'Bottom'],
  'Veigar': ['Middle', 'Support'],
  'Velkoz': ['Middle', 'Support'],
  'Vex': ['Middle'],
  'Vi': ['Jungle'],
  'Viego': ['Jungle'],
  'Viktor': ['Middle'],
  'Vladimir': ['Top', 'Middle'],
  'Volibear': ['Top', 'Jungle'],
  'Warwick': ['Top', 'Jungle'],
  'Wukong': ['Top', 'Jungle'],
  'MonkeyKing': ['Top', 'Jungle'],  // Data Dragon uses 'MonkeyKing' as ID
  'Xayah': ['Bottom'],
  'Xerath': ['Middle', 'Support'],
  'XinZhao': ['Jungle'],
  'Yasuo': ['Top', 'Middle', 'Bottom'],
  'Yone': ['Top', 'Middle'],
  'Yorick': ['Top'],
  'Yuumi': ['Support'],
  'Zac': ['Top', 'Jungle', 'Support'],
  'Zed': ['Jungle', 'Middle'],
  'Zeri': ['Bottom'],
  'Ziggs': ['Middle', 'Bottom'],
  'Zilean': ['Support'],
  'Zoe': ['Middle'],
  'Zyra': ['Support'],
  // Newer champions - add as needed
  'Yunara': ['Bottom'],
  'Zaahen': ['Top', 'Jungle'],
}

// Infer damage type from tags
function inferDamageType(tags) {
  const hasPhysical = tags.some(t => ['Fighter', 'Assassin', 'Marksman'].includes(t))
  const hasMagic = tags.some(t => ['Mage', 'Support'].includes(t))
  
  if (hasPhysical && hasMagic) return 'Mixed'
  if (hasMagic) return 'Magic'
  return 'Physical'
}

// Infer range type (very rough - ideally from wiki data)
// For now, assume Marksman/Mage are Ranged, others are Melee
function inferRangeType(tags, stats) {
  // If attack range is provided and > 300, it's ranged
  if (stats?.attackrange > 300) return 'Ranged'
  if (tags.includes('Marksman')) return 'Ranged'
  if (tags.includes('Mage') && !tags.includes('Fighter') && !tags.includes('Assassin')) return 'Ranged'
  return 'Melee'
}

async function loadManualContent(champId) {
  const fileName = `${champId.toLowerCase()}.json`
  const filePath = path.join(CONTENT_DIR, fileName)
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(content)
    console.log(`  [LOADED] ${fileName}`)
    return parsed
  } catch (err) {
    // File doesn't exist or JSON parse error - this is expected for most champions
    return null
  }
}

async function main() {
  console.log('=== Building App Data ===\n')

  // 1. Load champion list
  const championListPath = path.join(DDRAGON_DIR, 'champion.json')
  let championList
  try {
    championList = JSON.parse(await fs.readFile(championListPath, 'utf-8'))
  } catch (err) {
    console.error('Error: Could not read champion.json. Run npm run sync:ddragon first.')
    process.exit(1)
  }

  const championIds = Object.keys(championList.data)
  console.log(`Processing ${championIds.length} champions...`)
  console.log(`Manual content directory: ${CONTENT_DIR}\n`)

  // 2. Process each champion
  const champions = []

  for (const champId of championIds) {
    // Load detailed champion data
    const champDataPath = path.join(DDRAGON_DIR, 'champions', `${champId}.json`)
    const champData = JSON.parse(await fs.readFile(champDataPath, 'utf-8'))
    const champ = champData.data[champId]

    // Load manual content if available
    const manualContent = await loadManualContent(champId)

    // Determine classes: manual content > wiki mapping > Data Dragon tags fallback
    const classes = manualContent?.classes 
      || WIKI_CHAMPION_CLASSES[champId] 
      || champ.tags.map(tag => TAG_TO_CLASS[tag] || tag)

    // Build champion object
    const champion = {
      id: champId,
      name: champ.name,
      title: champ.title,
      
      // Classification
      classes: classes,
      rangeType: manualContent?.rangeType || inferRangeType(champ.tags, champ.stats),
      damageType: manualContent?.damageType || inferDamageType(champ.tags),
      lanes: manualContent?.lanes || WIKI_CHAMPION_LANES[champId] || [],
      resource: champ.partype || 'None',

      // Images (local paths)
      images: {
        icon: `/assets/champion/${champId}.png`,
        loading: `/assets/champion/loading/${champId}_0.jpg`,
        passive: champ.passive?.image?.full 
          ? `/assets/passive/${champ.passive.image.full}` 
          : '',
        abilities: champ.spells?.map(s => `/assets/spell/${s.image.full}`) || [],
      },

      // Content - prefer manual, fallback to empty/placeholder
      playstyle: manualContent?.playstyle || {
        identity: '',
        howToPlay: '',
        powerSpikes: '',
      },
      strengths: manualContent?.strengths || [],
      weaknesses: manualContent?.weaknesses || [],

      // Abilities
      passive: manualContent?.passive || {
        slot: 'P',
        name: champ.passive?.name || 'Passive',
        summary: champ.passive?.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '',
        details: '',
      },
      abilities: manualContent?.abilities || champ.spells?.map((spell, i) => ({
        slot: ['Q', 'W', 'E', 'R'][i],
        name: spell.name,
        summary: spell.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '',
        details: '',
      })) || [],
    }

    champions.push(champion)
    if (!manualContent) {
      process.stdout.write('.')
    }
  }

  console.log(' Done!\n')

  // 3. Sort alphabetically
  champions.sort((a, b) => a.name.localeCompare(b.name))

  // 4. Write output
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const outputPath = path.join(OUTPUT_DIR, 'champions.json')
  await fs.writeFile(
    outputPath,
    JSON.stringify({ champions, version: championList.version }, null, 2)
  )

  console.log('=== Build Complete ===')
  console.log(`Output: ${outputPath}`)
  console.log(`Champions: ${champions.length}`)
  
  // Count champions with manual content
  const withContent = champions.filter(c => c.playstyle.identity !== '').length
  console.log(`With manual content: ${withContent}`)
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
