import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_DIR = path.join(__dirname, '../');
const UPLOADS_DIR = path.join(SERVER_DIR, 'uploads');
const OUTPUT_DIR = path.join(SERVER_DIR, 'output');

export function processFolder(inputFolder, outputFolder, framework) {
  if (framework === 'vue') {
    generateVueFromFiles(inputFolder, outputFolder);
    generateVueProjectStructure(outputFolder);
    generateIndexHtml(outputFolder);
  }
}

function sanitizeHtmlLinksAndScripts(htmlContent) {
  return htmlContent
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '') 
    .replace(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, ''); 
}

function extractFunctionsFromJs(jsContent) {
  const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*{([^}]*)}/g;
  const functions = [];
  let match;

  while ((match = functionRegex.exec(jsContent)) !== null) {
    const [_, name, params, body] = match;
    functions.push({ name, params, body });
  }

  return functions;
}

function transformHtmlEventListeners(htmlContent, functions) {
  const eventAttributeRegex = /onclick="([^"]+)"/gi;

  const transformedHtml = htmlContent.replace(eventAttributeRegex, (match, jsFunctionCall) => {
    const functionName = jsFunctionCall.split('(')[0];
    if (functions.some((fn) => fn.name === functionName)) {
      return `@click="${functionName}"`;
    }
    return match;
  });

  return transformedHtml;
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
  const styleCssPath = path.join(outputFolder, 'src/style.css');

  const rawHtmlContent = htmlFiles
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');
  const rawJsContent = jsFiles
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');

  const sanitizedHtml = sanitizeHtmlLinksAndScripts(rawHtmlContent);

  const extractedFunctions = extractFunctionsFromJs(rawJsContent);
  const transformedHtml = transformHtmlEventListeners(sanitizedHtml, extractedFunctions);

  const vueFunctions = extractedFunctions
    .map(({ name, params, body }) => `function ${name}(${params.trim()}) {${body.trim()}}`)
    .join('\n');

  const styleContent = cssFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

  const appVueContent = `
<template>
<div>
  <h1>Your Project</h1>
  ${transformedHtml.trim()}
</div>
</template>

<script setup>
${vueFunctions}
</script>

<style src="./style.css"></style>
`;

  const appVueDir = path.dirname(appVuePath);
  if (!fs.existsSync(appVueDir)) {
    fs.mkdirSync(appVueDir, { recursive: true });
  }

  fs.writeFileSync(appVuePath, appVueContent, 'utf8');
  fs.writeFileSync(styleCssPath, styleContent, 'utf8');

  console.log(`App.vue und style.css erfolgreich erstellt: ${appVuePath}, ${styleCssPath}`);
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
