export type System = 'mac' | 'windows' | 'linux'

declare const __DOWNLOADS__: Record<System, string>

// Filled in at build time from the latest published release, so each button
// hands over the installer itself rather than a page of files to choose from.
export const downloads = __DOWNLOADS__

export const systems: System[] = ['mac', 'windows', 'linux']
