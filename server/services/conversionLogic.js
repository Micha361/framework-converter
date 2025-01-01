import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_DIR = path.join(__dirname, '../');
const OUTPUT_DIR = path.join(SERVER_DIR, 'output');

export function processFolder(inputFolder, outputFolder, framework) {
  if (framework === 'vue') {
    const htmlFiles = generateVuePages(inputFolder, outputFolder);
    generateVueProjectStructure(outputFolder);
    generateComponentsFolder(outputFolder);
    generateRouterConfig(outputFolder, htmlFiles);
    generateAppVue(outputFolder);
    generateIndexHtml(outputFolder);
    execSync('npm install', { cwd: outputFolder, stdio: 'inherit' });
  }
}

function sanitizeHtmlContent(htmlContent) {
  return htmlContent
    .replace(/<!DOCTYPE html>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>.*?<\/head>/gis, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
    .replace(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, '')
    .replace(/onclick=["']([^"']+)["']/gi, (_, func) => `@click="${func}"`) 
    .replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/gi, (_, href, text) => {
      const vueHref = href === 'index.html' || href === './' ? '/' : href.replace('.html', '');
      return `<router-link to="${vueHref}">${text}</router-link>`;
    })
    .trim();
}


function generateVuePages(inputFolder, outputFolder) {
  const htmlFiles = [];
  const cssFiles = [];
  const jsFiles = [];

  const readFolderRecursively = (folderPath) => {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(folderPath, entry.name);
      const ext = path.extname(entry.name);
      if (entry.isDirectory()) readFolderRecursively(fullPath);
      else if (ext === '.html') htmlFiles.push(fullPath);
      else if (ext === '.css') cssFiles.push(fullPath);
      else if (ext === '.js') jsFiles.push(fullPath);
    });
  };

  readFolderRecursively(inputFolder);

  const pagesDir = path.join(outputFolder, 'src/pages');
  if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

  htmlFiles.forEach((file) => {
    const baseName = path.basename(file, '.html');
    const cssFile = cssFiles.find((css) => path.basename(css, '.css') === baseName);
    const jsFile = jsFiles.find((js) => path.basename(js, '.js') === baseName);

    const sanitizedHtml = sanitizeHtmlContent(fs.readFileSync(file, 'utf8'));
    const cssContent = cssFile ? fs.readFileSync(cssFile, 'utf8').trim() : '';
    const jsContent = jsFile ? fs.readFileSync(jsFile, 'utf8').trim() : '';

    const vueContent = `
<template>
  ${sanitizedHtml}
</template>
${jsContent ? `<script setup>\n${jsContent}\n</script>` : ''}
${cssContent ? `<style scoped>\n${cssContent}\n</style>` : ''}
    `.trim();

    fs.writeFileSync(path.join(pagesDir, `${baseName}.vue`), vueContent, 'utf8');
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
  `.trim();

  fs.writeFileSync(path.join(outputFolder, 'src/router.js'), routerContent, 'utf8');
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
    `.trim(),
    'src/main.js': `
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
    `.trim(),
    '.gitignore': `
node_modules
dist
.env
    `.trim(),
    'README.md': `
# My converted Vue project

Please install the router-vue package in the terminal with the command (npm install vue-router).
    `.trim(),
  };

  Object.entries(projectStructure).forEach(([filePath, content]) => {
    const fullPath = path.join(outputFolder, filePath);
    if (!fs.existsSync(path.dirname(fullPath))) fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
  });
}

function generateComponentsFolder(outputFolder) {
  const componentsFolder = path.join(outputFolder, 'src/components');
  if (!fs.existsSync(componentsFolder)) fs.mkdirSync(componentsFolder, { recursive: true });
}

function generateAppVue(outputFolder) {
  const appVueContent = `
<template>
  <nav>
    <h1>My Vue App</h1>
  </nav>
  <router-view />
</template>

<script setup>
</script>
  `.trim();

  fs.writeFileSync(path.join(outputFolder, 'src/App.vue'), appVueContent, 'utf8');
}

function generateIndexHtml(outputFolder) {
  const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Vue Project</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
  `.trim();

  fs.writeFileSync(path.join(outputFolder, 'index.html'), indexHtmlContent, 'utf8');
}
