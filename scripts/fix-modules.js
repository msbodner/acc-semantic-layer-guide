import { readdirSync, lstatSync, readlinkSync, unlinkSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const projectRoot = '/vercel/share/v0-project';
const nmPath = join(projectRoot, 'node_modules');

console.log('Checking node_modules at:', nmPath);
console.log('Exists:', existsSync(nmPath));

try {
  const stat = lstatSync(nmPath);
  console.log('Is symlink:', stat.isSymbolicLink());
  console.log('Is directory:', stat.isDirectory());
  
  if (stat.isSymbolicLink()) {
    const target = readlinkSync(nmPath);
    console.log('Symlink target:', target);
    console.log('Removing symlink...');
    unlinkSync(nmPath);
    console.log('Symlink removed. pnpm will recreate it on next install.');
  } else if (stat.isDirectory()) {
    // Check for .pnpm inside
    const pnpmPath = join(nmPath, '.pnpm');
    if (existsSync(pnpmPath)) {
      const pnpmStat = lstatSync(pnpmPath);
      console.log('.pnpm is symlink:', pnpmStat.isSymbolicLink());
      if (pnpmStat.isSymbolicLink()) {
        const pnpmTarget = readlinkSync(pnpmPath);
        console.log('.pnpm symlink target:', pnpmTarget);
      }
    }
    
    // Check next symlink specifically
    const nextPath = join(nmPath, 'next');
    if (existsSync(nextPath)) {
      const nextStat = lstatSync(nextPath);
      console.log('next is symlink:', nextStat.isSymbolicLink());
      if (nextStat.isSymbolicLink()) {
        const nextTarget = readlinkSync(nextPath);
        console.log('next symlink target:', nextTarget);
        if (nextTarget.includes('19.0.0')) {
          console.log('Found broken next symlink pointing to 19.0.0. Removing...');
          unlinkSync(nextPath);
          console.log('Removed broken next symlink.');
        }
      }
    }
    
    // Check react symlink
    const reactPath = join(nmPath, 'react');
    if (existsSync(reactPath)) {
      const reactStat = lstatSync(reactPath);
      if (reactStat.isSymbolicLink()) {
        const reactTarget = readlinkSync(reactPath);
        console.log('react symlink target:', reactTarget);
      }
    }
    
    // Nuclear option: remove entire node_modules to force fresh install
    console.log('Removing entire node_modules to force fresh install...');
    rmSync(nmPath, { recursive: true, force: true });
    console.log('node_modules removed successfully.');
  }
} catch (err) {
  console.log('Error:', err.message);
}

// Also check the shared location
const sharedNm = '/vercel/share/v0-next-shadcn/node_modules';
console.log('\nChecking shared node_modules:', sharedNm);
try {
  const dirs = readdirSync(join(sharedNm, '.pnpm')).filter(d => d.startsWith('next@15.1.0'));
  console.log('Available next versions in pnpm store:', dirs);
} catch (err) {
  console.log('Cannot read shared store:', err.message);
}
