/**
 * Data Dragon Sync Script
 * Downloads champion data and images from Riot's Data Dragon CDN
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT_DIR, 'data')
const ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets')

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com'

async function fetchJson(url) {
  console.log(`Fetching: ${url}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.json()
}

async function downloadFile(url, destPath) {
  // Check if file already exists
  try {
    await fs.access(destPath)
    return // File exists, skip download
  } catch {
    // File doesn't exist, continue with download
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`)
  }
  
  const buffer = await response.arrayBuffer()
  await fs.mkdir(path.dirname(destPath), { recursive: true })
  await fs.writeFile(destPath, Buffer.from(buffer))
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function main() {
  console.log('=== Data Dragon Sync ===\n')

  // 1. Get latest version
  console.log('Step 1: Fetching latest version...')
  const versions = await fetchJson(`${DDRAGON_BASE}/api/versions.json`)
  const version = versions[0]
  console.log(`Latest version: ${version}\n`)

  // 2. Ensure directories exist
  await ensureDir(DATA_DIR)
  await ensureDir(path.join(DATA_DIR, 'ddragon'))
  await ensureDir(path.join(ASSETS_DIR, 'champion', 'loading'))
  await ensureDir(path.join(ASSETS_DIR, 'passive'))
  await ensureDir(path.join(ASSETS_DIR, 'spell'))

  // 3. Download champion list
  console.log('Step 2: Downloading champion data...')
  const championListUrl = `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`
  const championList = await fetchJson(championListUrl)
  
  // Save champion list
  await fs.writeFile(
    path.join(DATA_DIR, 'ddragon', 'champion.json'),
    JSON.stringify(championList, null, 2)
  )

  const championIds = Object.keys(championList.data)
  console.log(`Found ${championIds.length} champions\n`)

  // 4. Download individual champion data
  console.log('Step 3: Downloading individual champion data...')
  const championsDir = path.join(DATA_DIR, 'ddragon', 'champions')
  await ensureDir(championsDir)

  for (const champId of championIds) {
    const champUrl = `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion/${champId}.json`
    const champData = await fetchJson(champUrl)
    await fs.writeFile(
      path.join(championsDir, `${champId}.json`),
      JSON.stringify(champData, null, 2)
    )
    process.stdout.write('.')
  }
  console.log(' Done!\n')

  // 5. Download images
  console.log('Step 4: Downloading champion images...')
  let downloadCount = 0
  
  for (const champId of championIds) {
    // Read champion data for spell/passive info
    const champDataPath = path.join(championsDir, `${champId}.json`)
    const champData = JSON.parse(await fs.readFile(champDataPath, 'utf-8'))
    const champ = champData.data[champId]

    // Champion icon
    const iconUrl = `${DDRAGON_BASE}/cdn/${version}/img/champion/${champId}.png`
    const iconPath = path.join(ASSETS_DIR, 'champion', `${champId}.png`)
    await downloadFile(iconUrl, iconPath)

    // Loading art (note: doesn't include version in path)
    const loadingUrl = `${DDRAGON_BASE}/cdn/img/champion/loading/${champId}_0.jpg`
    const loadingPath = path.join(ASSETS_DIR, 'champion', 'loading', `${champId}_0.jpg`)
    await downloadFile(loadingUrl, loadingPath)

    // Passive icon
    if (champ.passive?.image?.full) {
      const passiveUrl = `${DDRAGON_BASE}/cdn/${version}/img/passive/${champ.passive.image.full}`
      const passivePath = path.join(ASSETS_DIR, 'passive', champ.passive.image.full)
      await downloadFile(passiveUrl, passivePath)
    }

    // Spell icons
    if (champ.spells) {
      for (const spell of champ.spells) {
        if (spell.image?.full) {
          const spellUrl = `${DDRAGON_BASE}/cdn/${version}/img/spell/${spell.image.full}`
          const spellPath = path.join(ASSETS_DIR, 'spell', spell.image.full)
          await downloadFile(spellUrl, spellPath)
        }
      }
    }

    downloadCount++
    if (downloadCount % 20 === 0) {
      console.log(`  Downloaded ${downloadCount}/${championIds.length} champions...`)
    }
  }
  console.log(`  Downloaded ${downloadCount}/${championIds.length} champions. Done!\n`)

  // 6. Save version info
  console.log('Step 5: Saving version info...')
  await fs.writeFile(
    path.join(DATA_DIR, 'ddragon-version.json'),
    JSON.stringify({ version, syncedAt: new Date().toISOString() }, null, 2)
  )

  console.log('\n=== Sync Complete ===')
  console.log(`Version: ${version}`)
  console.log(`Champions: ${championIds.length}`)
  console.log(`Data saved to: ${DATA_DIR}`)
  console.log(`Assets saved to: ${ASSETS_DIR}`)
}

main().catch((err) => {
  console.error('Sync failed:', err)
  process.exit(1)
})
