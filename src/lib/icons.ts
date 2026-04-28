import fs from 'fs';
import path from 'path';

export interface IconInfo {
  name: string;
  id: string;
  hasDark: boolean;
  hasLight: boolean;
  isCustom: boolean;
}

export function getIcons(): IconInfo[] {
  const iconsDir = path.join(process.cwd(), 'public/icons');
  const files = fs.readdirSync(iconsDir);

  const iconMap: Record<string, Partial<IconInfo>> = {};

  files.forEach((file) => {
    if (!file.endsWith('.svg')) return;

    const baseName = file.replace('.svg', '');
    let id = baseName;
    let theme: 'dark' | 'light' | null = null;

    if (baseName.endsWith('-Dark')) {
      id = baseName.replace('-Dark', '');
      theme = 'dark';
    } else if (baseName.endsWith('-Light')) {
      id = baseName.replace('-Light', '');
      theme = 'light';
    }

    if (!iconMap[id]) {
      iconMap[id] = {
        id,
        name: id, // Can be refined later
        hasDark: false,
        hasLight: false,
        isCustom: false,
      };
    }

    if (theme === 'dark') {
      iconMap[id].hasDark = true;
    } else if (theme === 'light') {
      iconMap[id].hasLight = true;
    } else {
      // If no theme suffix, assume it's a single icon (could be both or just one)
      // For now, let's treat it as neutral
    }
  });

  return Object.values(iconMap) as IconInfo[];
}
