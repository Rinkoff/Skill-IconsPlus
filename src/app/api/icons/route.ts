import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const ICON_SIZE = 48; // We will scale them down from 256
const PADDING = 4;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const iconsParam = searchParams.get('i');
  const themeParam = searchParams.get('theme') || 'dark';
  const perline = Math.max(1, parseInt(searchParams.get('perline') || '15', 10));
  
  if (!iconsParam) {
    return new NextResponse('Missing icons parameter "i"', { status: 400 });
  }

  const iconNames = iconsParam.split(',');
  const svgContents: string[] = [];
  
  // Cache directory listing to speed up lookups
  const availableFiles = fs.readdirSync(ICONS_DIR);

  for (const name of iconNames) {
    // Force light theme for excel as requested
    const currentTheme = name.toLowerCase() === 'excel' ? 'light' : themeParam;
    if (name.startsWith('http')) {
      // Remote image (Cloudinary or other)
      // We wrap it in an <image> tag that fits the 256x256 base size
      const imageTag = `<image href="${name}" width="256" height="256" preserveAspectRatio="xMidYMid slice" />`;
      svgContents.push(imageTag);
      continue;
    }

    const iconFile = findIconFile(name, currentTheme, availableFiles);
    if (iconFile) {
      const filePath = path.join(ICONS_DIR, iconFile);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Robust viewBox extraction
      let viewBox = '0 0 256 256';
      const vbMatch = content.match(/viewBox=["']([^"']+)["']/i);
      if (vbMatch) {
        viewBox = vbMatch[1];
      } else {
        const wMatch = content.match(/width=["']([^"']+)["']/i);
        const hMatch = content.match(/height=["']([^"']+)["']/i);
        if (wMatch && hMatch) {
          viewBox = `0 0 ${parseFloat(wMatch[1])} ${parseFloat(hMatch[1])}`;
        }
      }

      // Robust inner content extraction: remove root <svg> tags
      let innerContent = content
        .replace(/<\?xml[^>]*\?>/gi, '') // Remove XML declaration
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/<svg[^>]*>/i, '')      // Remove opening <svg> tag
        .replace(/<\/svg>\s*$/i, '');    // Remove closing </svg> tag
      
      // Make IDs unique to avoid clashes in combined SVG
      const idPrefix = `icon_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_`;
      
      // Replace id="xxx" with id="prefix_xxx"
      innerContent = innerContent.replace(/\bid=(["'])([^"']+)\1/g, (match, quote, id) => {
        return `id=${quote}${idPrefix}${id}${quote}`;
      });
      
      // Replace url(#xxx) with url(#prefix_xxx)
      innerContent = innerContent.replace(/url\(#([^)]+)\)/g, (match, id) => {
        return `url(#${idPrefix}${id})`;
      });
      
      // Replace xlink:href="#xxx" or href="#xxx"
      innerContent = innerContent.replace(/\b(xlink:)?href=(["'])#([^"']+)\2/g, (match, prefix, quote, id) => {
        return `${prefix || ''}href=${quote}#${idPrefix}${id}${quote}`;
      });

      svgContents.push(`<svg width="256" height="256" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${innerContent}</svg>`);
    } else {
      // Fallback or skip
      console.warn(`Icon not found: ${name}`);
    }
  }

  if (svgContents.length === 0) {
    return new NextResponse('No valid icons found', { status: 404 });
  }

  const rows = Math.ceil(svgContents.length / perline);
  const width = Math.min(svgContents.length, perline) * (ICON_SIZE + PADDING) - PADDING;
  const height = rows * (ICON_SIZE + PADDING) - PADDING;

  let combinedSvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">`;

  svgContents.forEach((content, index) => {
    const x = (index % perline) * (ICON_SIZE + PADDING);
    const y = Math.floor(index / perline) * (ICON_SIZE + PADDING);
    combinedSvg += `<g transform="translate(${x}, ${y}) scale(${ICON_SIZE / 256})">${content}</g>`;
  });

  combinedSvg += '</svg>';

  return new NextResponse(combinedSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function findIconFile(name: string, theme: string, files: string[]): string | null {
  const normalizedName = name.toLowerCase();
  const themeSuffix = theme.toLowerCase() === 'dark' ? '-dark' : '-light';
  
  // Custom aliases map
  const aliases: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'react': 'react',
    'tailwind': 'tailwindcss',
    'next': 'nextjs',
    'nextjs': 'nextjs',
    'node': 'nodejs',
    'nodejs': 'nodejs',
    'aws': 'aws',
    'docker': 'docker',
    'git': 'git',
    'github': 'github',
    'figma': 'figma',
    'mongodb': 'mongodb',
    'postgres': 'postgresql',
    'postgresql': 'postgresql',
    'mysql': 'mysql',
    'redis': 'redis',
    'bash': 'bash',
    'linux': 'linux',
    'windows': 'windows',
    'apple': 'apple',
    'cpp': 'cpp',
    'cs': 'cs',
    'css': 'css',
    'html': 'html',
    'java': 'java',
    'kotlin': 'kotlin',
    'swift': 'swift',
    'go': 'golang',
    'golang': 'golang',
    'rust': 'rust',
    'php': 'php',
    'laravel': 'laravel',
    'vue': 'vuejs',
    'vuejs': 'vuejs',
    'svelte': 'svelte',
    'astro': 'astro',
    'deno': 'deno',
    'bun': 'bun',
  };

  const targetName = aliases[normalizedName] || normalizedName;

  // Try 1: Exact targetName + theme
  let match = files.find(f => f.toLowerCase() === `${targetName}${themeSuffix}.svg`);
  if (match) return match;

  // Try 2: Exact targetName (no theme)
  match = files.find(f => f.toLowerCase() === `${targetName}.svg`);
  if (match) return match;

  // Try 3: Case-insensitive startsWith match for targetName
  match = files.find(f => f.toLowerCase().startsWith(targetName));
  if (match) return match;

  return null;
}
