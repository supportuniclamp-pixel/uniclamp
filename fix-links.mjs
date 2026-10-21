import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixLinks(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await fixLinks(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      let content = await fs.readFile(fullPath, 'utf-8');
      
      // Fix Link to -> href
      content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');
      
      await fs.writeFile(fullPath, content);
    }
  }
}

async function run() {
  await fixLinks(path.join(__dirname, 'src', 'app'));
  await fixLinks(path.join(__dirname, 'src', 'components'));
  console.log('Fixed Link components');
}

run();
