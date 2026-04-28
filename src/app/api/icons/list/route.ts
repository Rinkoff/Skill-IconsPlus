import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');

export async function GET() {
  try {
    const files = fs.readdirSync(ICONS_DIR);
    // Extract unique base names (e.g. "React-Dark.svg" -> "React")
    const iconIds = Array.from(new Set(files.map(f => {
      let name = f.replace('.svg', '');
      name = name.replace('-Dark', '').replace('-Light', '');
      return name.toLowerCase();
    }))).sort();

    return NextResponse.json({ icons: iconIds });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list icons' }, { status: 500 });
  }
}
