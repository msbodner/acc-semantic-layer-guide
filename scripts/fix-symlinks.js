import { execSync } from 'child_process';
import { existsSync, mkdirSync, symlinkSync, readdirSync } from 'fs';
import { join } from 'path';

// The dev server is stuck looking for modules at this broken path:
const brokenBase = '/vercel/share/v0-next-shadcn/node_modules/.pnpm/next@15.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules';
// The working path that actually exists is:
const workingBase = '/vercel/share/v0-next-shadcn/node_modules/.pnpm/next@15.1.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules';

console.log('Broken path exists:', existsSync(brokenBase));
console.log('Working path exists:', existsSync(workingBase));

// Check what pnpm paths actually exist
const pnpmDir = '/vercel/share/v0-next-shadcn/node_modules/.pnpm';
if (existsSync(pnpmDir)) {
  const entries = readdirSync(pnpmDir).filter(e => e.startsWith('next@'));
  console.log('Available next@ entries:', entries);
} else {
  console.log('pnpm dir does not exist:', pnpmDir);
}

// Check the top-level node_modules
const topModules = '/vercel/share/v0-next-shadcn/node_modules';
if (existsSync(topModules)) {
  const hasNext = existsSync(join(topModules, 'next'));
  const hasReact = existsSync(join(topModules, 'react'));
  const hasSwc = existsSync(join(topModules, '@swc'));
  console.log('Top-level next:', hasNext);
  console.log('Top-level react:', hasReact);
  console.log('Top-level @swc:', hasSwc);
} else {
  console.log('Top-level node_modules does not exist');
}

// Check our project's node_modules
const projectModules = '/vercel/share/v0-project/node_modules';
if (existsSync(projectModules)) {
  const hasNext = existsSync(join(projectModules, 'next'));
  const hasReact = existsSync(join(projectModules, 'react'));
  console.log('Project next:', hasNext);
  console.log('Project react:', hasReact);
} else {
  console.log('Project node_modules does not exist');
}

// If the broken path doesn't exist but working path does, create a symlink
if (!existsSync(brokenBase) && existsSync(workingBase)) {
  const brokenParent = '/vercel/share/v0-next-shadcn/node_modules/.pnpm/next@15.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0';
  try {
    mkdirSync(brokenParent, { recursive: true });
    // Remove the dir we just created and replace with symlink to the working path's parent
    execSync(`rm -rf "${brokenParent}/node_modules"`);
    symlinkSync(workingBase, join(brokenParent, 'node_modules'));
    console.log('SUCCESS: Created symlink from broken path to working path');
    console.log('Broken path now exists:', existsSync(brokenBase));
  } catch (e) {
    console.log('Failed to create symlink:', e.message);
  }
} else if (existsSync(brokenBase)) {
  console.log('Broken path already exists - checking contents...');
  const contents = readdirSync(brokenBase).slice(0, 20);
  console.log('Contents:', contents);
} else {
  console.log('Neither path exists. Trying to find ANY next@ pnpm entry...');
  // List all directories under /vercel/share
  if (existsSync('/vercel/share')) {
    const shares = readdirSync('/vercel/share');
    console.log('/vercel/share contents:', shares);
    for (const s of shares) {
      const nmPath = join('/vercel/share', s, 'node_modules');
      if (existsSync(nmPath)) {
        console.log(`  ${s}/node_modules exists`);
        if (existsSync(join(nmPath, '.pnpm'))) {
          const pnpmEntries = readdirSync(join(nmPath, '.pnpm')).filter(e => e.startsWith('next@')).slice(0, 5);
          console.log(`  ${s}/.pnpm next@ entries:`, pnpmEntries);
        }
      }
    }
  }
}
