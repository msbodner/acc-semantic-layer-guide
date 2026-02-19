import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Read all source files and create a single JSON manifest
const projectRoot = '/vercel/share/v0-project';

const files = [
  'app/page.tsx',
  'app/layout.tsx', 
  'app/globals.css',
  'components/file-upload.tsx',
  'components/conversion-preview.tsx',
  'components/semantic-processor.tsx',
  'components/user-guide.tsx',
  'components/reference-page.tsx',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'next.config.mjs',
  'tsconfig.json',
  'lib/utils.ts',
];

const manifest = {};

for (const file of files) {
  try {
    const content = readFileSync(join(projectRoot, file), 'utf8');
    manifest[file] = content;
    console.log(`Read: ${file} (${content.length} chars)`);
  } catch (e) {
    console.error(`Failed to read ${file}: ${e.message}`);
  }
}

// Write the manifest as JSON
const outputPath = join(projectRoot, 'public', 'source-manifest.json');
writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`\nManifest written to: ${outputPath}`);
console.log(`Total files: ${Object.keys(manifest).length}`);
