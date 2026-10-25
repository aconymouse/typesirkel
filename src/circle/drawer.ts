import type { Drawer, Leaf } from '../drawer/types'
import type { Circle } from './circle'

// Someone who joins through a link has no folder of their own. The circle is
// their drawer: one document, kept by everyone in the room instead of a disk.
export const circleDrawer = (circle: Circle): Drawer => {
  const leaf: Leaf = { path: 'shared.md', name: 'shared.md', dir: '' }
  return {
    kind: 'circle',
    label: 'Shared draft',
    list: async () => [leaf],
    read: async () => circle.text.toString(),
    write: async () => {},
    create: async () => leaf,
  }
}
