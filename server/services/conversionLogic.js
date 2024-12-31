import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_DIR = path.join(__dirname, '../');
const UPLOADS_DIR = path.join(SERVER_DIR, 'uploads');
const OUTPUT_DIR = path.join(SERVER_DIR, 'output');

export function processFolder(inputFolder, outputFolder, framework) {
  if (framework === 'vue') {
    const htmlFiles = generateVuePages(inputFolder, outputFolder);
    generateVueProjectStructure(outputFolder);
    generateComponentsFolder(outputFolder);
    generateRouterConfig(outputFolder, htmlFiles);
    generateAppVue(outputFolder);
    generateIndexHtml(outputFolder);

    console.log('Installiere npm-Abhängigkeiten...');
    execSync('npm install', { cwd: outputFolder, stdio: 'inherit' });
    console.log('Installation abgeschlossen.');
  }
}

function sanitizeHtmlLinksAndScripts(htmlContent) {
  const sanitized = htmlContent
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '') 
    .replace(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, ''); 

  return transformLinksToRouterLinks(sanitized);
}

function transformLinksToRouterLinks(htmlContent) {
  return htmlContent.replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/gi, (match, href, text) => {
    const vueHref = href === 'index.html' || href === './' ? '/' : href.replace('.html', '');
    return `<router-link to="${vueHref}">${text}</router-link>`;
  });
}

function generateVuePages(inputFolder, outputFolder) {
  const htmlFiles = [];
  const jsFiles = [];

  function readFolderRecursively(folderPath) {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(folderPath, entry.name);
      const ext = path.extname(entry.name);

      if (entry.isDirectory()) {
        readFolderRecursively(fullPath);
      } else if (ext === '.html') {
        htmlFiles.push(fullPath);
      } else if (ext === '.js') {
        jsFiles.push(fullPath);
      }
    });
  }

  readFolderRecursively(inputFolder);

  const pagesDir = path.join(outputFolder, 'src/pages');
  const scriptsDir = path.join(outputFolder, 'src/scripts');

  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  jsFiles.forEach((file) => {
    const fileName = path.basename(file);
    const outputFilePath = path.join(scriptsDir, fileName);
    fs.copyFileSync(file, outputFilePath);
    console.log(`JavaScript-Datei kopiert: ${outputFilePath}`);
  });

  htmlFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const sanitizedHtml = sanitizeHtmlLinksAndScripts(content);

    const vueContent = `
<template>
  ${sanitizedHtml.trim()}
</template>
<script setup>
</script>
<style scoped>
</style>
    `;

    const fileName = path.basename(file, '.html') + '.vue';
    const filePath = path.join(pagesDir, fileName);
    fs.writeFileSync(filePath, vueContent, 'utf8');
    console.log(`Seite erstellt: ${filePath}`);
  });

  return htmlFiles.map((file) => path.basename(file, '.html'));
}

function generateRouterConfig(outputFolder, htmlFiles) {
  const routes = htmlFiles.map((name) => {
    const pathName = name === 'index' ? '/' : `/${name}`;
    return `{
      path: '${pathName}',
      name: '${name.charAt(0).toUpperCase() + name.slice(1)}',
      component: () => import('./pages/${name}.vue')
    }`;
  });

  const routerContent = `
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  ${routes.join(',\n')}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
  `;

  const routerPath = path.join(outputFolder, 'src/router.js');
  fs.writeFileSync(routerPath, routerContent, 'utf8');
  console.log(`Router erstellt: ${routerPath}`);
}

function generateVueProjectStructure(outputFolder) {
  const projectStructure = {
    'package.json': JSON.stringify({
      name: 'mein-vue-projekt',
      version: '0.0.1',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        vue: '^3.5.13',
        'vue-router': '^4.1.6',
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.2.1',
        vite: '^6.0.5',
      },
    }, null, 2),
    'vite.config.js': `
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
    `,
    'src/main.js': `
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
    `,
    '.gitignore': `
node_modules
dist
.env
    `,
    'README.md': `
# Mein Vue Projekt

Dies ist ein automatisch generiertes Vue-Projekt.
    `,
  };

  for (const [filePath, content] of Object.entries(projectStructure)) {
    const fullPath = path.join(outputFolder, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');
  }

  console.log(`Vue-Projektstruktur erfolgreich im Ordner "${outputFolder}" erstellt.`);
}

function generateComponentsFolder(outputFolder) {
  const componentsFolder = path.join(outputFolder, 'src/components');
  if (!fs.existsSync(componentsFolder)) {
    fs.mkdirSync(componentsFolder, { recursive: true });
    console.log(`Leerer Komponentenordner erstellt: ${componentsFolder}`);
  }
}

function generateAppVue(outputFolder) {
  const appVueContent = `
<template>
  <nav>
    <h1>please remove this text</h1>
  </nav>
  <router-view />
</template>

<script setup>
</script>
  `;

  const appVuePath = path.join(outputFolder, 'src/App.vue');
  fs.writeFileSync(appVuePath, appVueContent, 'utf8');
  console.log(`App.vue erstellt: ${appVuePath}`);
}

function generateIndexHtml(outputFolder) {
  const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mein Vue Projekt</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
  `;

  const indexHtmlPath = path.join(outputFolder, 'index.html');

  fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf8');

  console.log(`index.html erfolgreich erstellt: ${indexHtmlPath}`);
}
