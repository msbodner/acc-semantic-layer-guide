import { execSync } from 'child_process';
import { rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const projectDir = '/vercel/share/v0-project';
const sharedDir = '/vercel/share/v0-next-shadcn';

// 1. Check what's in the shared pnpm store
console.log('=== Checking shared pnpm store ===');
const pnpmDir = join(sharedDir, 'node_modules', '.pnpm');
if (existsSync(pnpmDir)) {
  const entries = readdirSync(pnpmDir).filter(e => e.startsWith('next@'));
  console.log('Next.js entries in pnpm store:', entries);
  
  const reactEntries = readdirSync(pnpmDir).filter(e => e.startsWith('react@'));
  console.log('React entries in pnpm store:', reactEntries);
} else {
  console.log('No .pnpm dir found at', pnpmDir);
}

// 2. Check if project has node_modules and what it links to
const projectNM = join(projectDir, 'node_modules');
console.log('\n=== Project node_modules ===');
console.log('Exists:', existsSync(projectNM));
if (existsSync(projectNM)) {
  try {
    const nextPath = join(projectNM, 'next');
    const realPath = execSync(`readlink -f ${nextPath} 2>/dev/null || echo "not a link"`).toString().trim();
    console.log('next resolves to:', realPath);
  } catch(e) {
    console.log('Could not resolve next path');
  }
}

// 3. Delete project node_modules completely
console.log('\n=== Removing project node_modules ===');
try {
  rmSync(projectNM, { recursive: true, force: true });
  console.log('Removed project node_modules');
} catch(e) {
  console.log('Error removing:', e.message);
}

// 4. Also remove .next cache
const nextCache = join(projectDir, '.next');
try {
  rmSync(nextCache, { recursive: true, force: true });
  console.log('Removed .next cache');
} catch(e) {
  console.log('No .next to remove');
}

// 5. Run pnpm install fresh
console.log('\n=== Running pnpm install ===');
try {
  const result = execSync('cd /vercel/share/v0-project && pnpm install --no-frozen-lockfile 2>&1', {
    timeout: 60000,
    encoding: 'utf-8'
  });
  console.log(result);
} catch(e) {
  console.log('pnpm install output:', e.stdout || '');
  console.log('pnpm install error:', e.stderr || e.message);
}

// 6. Verify what we got
console.log('\n=== Verifying installation ===');
if (existsSync(projectNM)) {
  try {
    const nextPkg = join(projectNM, 'next', 'package.json');
    if (existsSync(nextPkg)) {
      const pkg = JSON.parse(execSync(`cat ${nextPkg}`).toString());
      console.log('Installed next version:', pkg.version);
    }
    const reactPkg = join(projectNM, 'react', 'package.json');
    if (existsSync(reactPkg)) {
      const pkg = JSON.parse(execSync(`cat ${reactPkg}`).toString());
      console.log('Installed react version:', pkg.version);
    }
  } catch(e) {
    console.log('Verification error:', e.message);
  }
} else {
  console.log('node_modules still does not exist after install');
}
