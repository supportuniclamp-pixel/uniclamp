import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const rootDir = __dirname;
  const srcDir = path.join(rootDir, 'src');
  const appDir = path.join(rootDir, 'src', 'app');
  const routesDir = path.join(srcDir, 'routes');

  // 1. Create app directory
  await fs.mkdir(appDir, { recursive: true });
  await fs.mkdir(path.join(appDir, 'about'), { recursive: true });
  await fs.mkdir(path.join(appDir, 'certifications'), { recursive: true });
  await fs.mkdir(path.join(appDir, 'contact'), { recursive: true });
  await fs.mkdir(path.join(appDir, 'projects', '[slug]'), { recursive: true });
  await fs.mkdir(path.join(appDir, 'products', '[slug]'), { recursive: true });

  // Helper to read and replace Link imports
  async function copyAndReplace(srcFile, destFile) {
    try {
      let content = await fs.readFile(srcFile, 'utf-8');
      
      // Replace @tanstack/react-router imports with Next.js equivalents where possible
      content = content.replace(/import\s+\{.*Link.*\}\s+from\s+['"]@tanstack\/react-router['"];?/g, "import Link from 'next/link';");
      
      // Replace createRoute, Route.useParams, Route.useSearch, etc.
      content = content.replace(/import\s+\{.*createFileRoute.*\}\s+from\s+['"]@tanstack\/react-router['"];?/g, "");
      content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\(['"].*['"]\)\(\{[\s\S]*?component:\s*([A-Za-z0-9_]+),?[\s\S]*?\}\);?/g, "export default $1;");

      await fs.writeFile(destFile, content);
      console.log(`Migrated ${srcFile} to ${destFile}`);
    } catch (e) {
      console.error(`Failed to migrate ${srcFile}: ${e.message}`);
    }
  }

  // 2. Move routes
  await copyAndReplace(path.join(routesDir, 'index.tsx'), path.join(appDir, 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'about.tsx'), path.join(appDir, 'about', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'certifications.tsx'), path.join(appDir, 'certifications', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'contact.tsx'), path.join(appDir, 'contact', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'projects.tsx'), path.join(appDir, 'projects', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'projects.$slug.tsx'), path.join(appDir, 'projects', '[slug]', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'products.tsx'), path.join(appDir, 'products', 'page.tsx'));
  await copyAndReplace(path.join(routesDir, 'products.$slug.tsx'), path.join(appDir, 'products', '[slug]', 'page.tsx'));

  // 3. Create basic layout.tsx
  const layoutContent = `import '../styles.css';

export const metadata = {
  title: 'UNIclamp — Pipe Supports & Fixing Systems',
  description: 'Precision-engineered pipe supports, modular systems and industrial fixing solutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
`;
  await fs.writeFile(path.join(appDir, 'layout.tsx'), layoutContent);

  // 4. Update package.json
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
  
  delete pkg.dependencies['@tanstack/react-router'];
  delete pkg.dependencies['@tanstack/react-start'];
  delete pkg.dependencies['@tanstack/router-plugin'];
  
  pkg.dependencies['next'] = 'latest';
  
  pkg.scripts.dev = 'next dev';
  pkg.scripts.build = 'next build';
  pkg.scripts.start = 'next start';
  pkg.scripts.lint = 'next lint';
  delete pkg.scripts['build:dev'];
  delete pkg.scripts.preview;

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  console.log("Migration script complete. Now run 'bun install' and then cleanup leftover Tanstack files.");
}

migrate();
