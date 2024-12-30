import fs from 'fs';
import path from 'path';

export function processFolder(inputFolder, outputFolder, framework) {
  if (framework === 'vue') {
    generateVueFromFiles(inputFolder, outputFolder);
    generateVueProjectStructure(outputFolder);
    generateIndexHtml(outputFolder);
  }
}

function generateVueFromFiles(inputFolder, outputFolder) {
  const htmlFiles = [];
  const cssFiles = [];
  const jsFiles = [];

  function readFolderRecursively(folderPath) {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(folderPath, entry.name);
      const ext = path.extname(entry.name);
      if (entry.isDirectory()) {
        readFolderRecursively(fullPath);
      } else {
        if (ext === '.html') htmlFiles.push(fullPath);
        else if (ext === '.css') cssFiles.push(fullPath);
        else if (ext === '.js') jsFiles.push(fullPath);
      }
    });
  }

  readFolderRecursively(inputFolder);

  const appVuePath = path.join(outputFolder, 'src/App.vue');
  const templateContent = htmlFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const styleContent = cssFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const scriptContent = jsFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

  const appVueContent = `
<template>
<div>
  <h1>Your Project</h1>
  <HelloWorld msg="Welcome to Vue!" />
  ${templateContent.trim()}
</div>
</template>

<style scoped>
${styleContent.trim()}
</style>

<script setup>
import HelloWorld from './components/HelloWorld.vue';
${scriptContent.trim()}
</script>
`;

  const appVueDir = path.dirname(appVuePath);
  if (!fs.existsSync(appVueDir)) {
    fs.mkdirSync(appVueDir, { recursive: true });
  }

  fs.writeFileSync(appVuePath, appVueContent, 'utf8');

  console.log(`App.vue erfolgreich erstellt: ${appVuePath}`);
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

createApp(App).mount('#app');
    `,
    'src/components/HelloWorld.vue': `
<template>
  <div>
    <h2>{{ msg }}</h2>
  </div>
</template>

<script setup>
defineProps({
  msg: String
});
</script>

<style scoped>
h2 {
  color: #42b983;
}
</style>
    `,
    'public/vite.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
  <g fill="#42b983">
    <path d="M421.9 8L123.3 595.3h599.3z" />
    <circle cx="421.9" cy="138.4" r="87.4" fill="#35495e" />
  </g>
</svg>
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
