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
    generateRouterConfig(outputFolder, htmlFiles);
    generateAppVue(outputFolder);
    generateIndexHtml(outputFolder);
    generateImgFolder(outputFolder);
    execSync('npm install', { cwd: outputFolder, stdio: 'inherit' });
  }
}

function extractAndRemove(content, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = content.match(regex);
  if (match) {
    content = content.replace(match[0], '');
    const sanitizedContent = match[0]
      .replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/gi, (_, href, text) => {
        const vueHref = href === 'index.html' || href === './' ? '/' : href.replace('.html', '');
        return `<router-link to="${vueHref}">${text}</router-link>`;
      });
    return { content, extracted: sanitizedContent.trim() };
  }
  return { content, extracted: null };
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

function generateComponents(outputFolder, components) {
  const componentsDir = path.join(outputFolder, 'src/components');
  if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

  components.forEach(({ name, content }) => {
    const componentFile = path.join(componentsDir, `${name}.vue`);
    fs.writeFileSync(
      componentFile,
      `<template>${content}</template>\n<style scoped></style>`,
      'utf8'
    );
    console.log(`Komponente erstellt: ${componentFile}`);
  });
}

function generateVuePages(inputFolder, outputFolder) {
  const htmlFiles = [];
  const cssFiles = [];
  const jsFiles = [];
  const components = [];

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

    let htmlContent = fs.readFileSync(file, 'utf8');

    const { content: withoutNavbar, extracted: navbar } = extractAndRemove(htmlContent, 'nav');
    const { content: withoutFooter, extracted: footer } = extractAndRemove(withoutNavbar, 'footer');

    if (navbar && !components.find((c) => c.name === 'Navbar')) {
      components.push({ name: 'Navbar', content: navbar });
    }

    if (footer && !components.find((c) => c.name === 'Footer')) {
      components.push({ name: 'Footer', content: footer });
    }

    htmlContent = withoutFooter;

    const sanitizedHtml = sanitizeHtmlContent(htmlContent);
    const cssContent = cssFile ? fs.readFileSync(cssFile, 'utf8').trim() : '';
    const jsContent = jsFile ? fs.readFileSync(jsFile, 'utf8').trim() : '';

    const vueContent = `
<template>
  ${navbar ? '<Navbar />' : ''}
  <div class="content">
    ${sanitizedHtml}
  </div>
  ${footer ? '<Footer />' : ''}
</template>

<script setup>
${navbar ? "import Navbar from '../components/Navbar.vue';" : ''}
${footer ? "import Footer from '../components/Footer.vue';" : ''}
${jsContent}
</script>

${cssContent ? `<style scoped>\n${cssContent}\n</style>` : ''}
    `.trim();

    const vueFilePath = path.join(pagesDir, `${baseName}.vue`);
    fs.writeFileSync(vueFilePath, vueContent, 'utf8');
    console.log(`Seite erstellt: ${vueFilePath}`);
  });

  generateComponents(outputFolder, components);
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
      name: 'vue-converter-project',
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
  };

  Object.entries(projectStructure).forEach(([filePath, content]) => {
    const fullPath = path.join(outputFolder, filePath);
    if (!fs.existsSync(path.dirname(fullPath))) fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
  });
}

function generateAppVue(outputFolder) {
  const appVueContent = `
<template>
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
    <title>Vue Project</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
  `.trim();

  fs.writeFileSync(path.join(outputFolder, 'index.html'), indexHtmlContent, 'utf8');
}

function generateImgFolder(outputFolder) {
  const imgDir = path.join(outputFolder, 'src/assets/img');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
}