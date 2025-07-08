import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sharedDir = resolve(__dirname, '../../shared');
const frontendSrcDir = resolve(__dirname, '../src');
const targetSharedDir = resolve(frontendSrcDir, 'shared');

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main(): Promise<void> {
  try {
    // Clean up previous copy if it exists
    await fs.rm(targetSharedDir, { recursive: true, force: true });

    await copyDir(sharedDir, targetSharedDir);
    console.log('Shared directory copied successfully!');
  } catch (err) {
    console.error('Error copying shared directory:', err);
    process.exit(1); // Exit with an error code
  }
}

main();