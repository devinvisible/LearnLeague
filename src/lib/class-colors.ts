/** Returns the CSS class name for a champion class (used for badges and filter chips). */
export function getClassColor(className: string): string {
  if (['Burst', 'Battlemage', 'Artillery'].includes(className)) return 'class-mage'
  if (['Assassin', 'Skirmisher'].includes(className)) return 'class-slayer'
  if (['Juggernaut', 'Diver'].includes(className)) return 'class-fighter'
  if (['Vanguard', 'Warden'].includes(className)) return 'class-tank'
  if (['Enchanter', 'Catcher'].includes(className)) return 'class-controller'
  if (className === 'Marksman') return 'class-marksman'
  if (className === 'Specialist') return 'class-specialist'
  return ''
}
