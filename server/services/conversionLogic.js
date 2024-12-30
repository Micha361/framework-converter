import fs from 'fs';
import path from 'path';

export function processFolder(inputFolder, outputFolder, framework) {
  if (framework === 'vue') {
      generateVueFromFiles(inputFolder, outputFolder);
      generateVueEnvironment(outputFolder);
  }
}

function copyFilesToOutput(inputFolder, outputFolder) {
    function readFolderRecursively(folderPath) {
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });
        entries.forEach((entry) => {
            const fullPath = path.join(folderPath, entry.name);
            const outputPath = path.join(outputFolder, path.relative(inputFolder, fullPath));

            if (entry.isDirectory()) {
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath, { recursive: true });
                }
                readFolderRecursively(fullPath);
            } else {
                fs.copyFileSync(fullPath, outputPath);
            }
        });
    }

    readFolderRecursively(inputFolder);
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
${templateContent.trim()}
</template>

<style scoped>
${styleContent.trim()}
</style>

<script setup>
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

function generateVueEnvironment(outputFolder) {
    const vueStructure = {
        'package.json': JSON.stringify({
            name: 'generated-vue-project',
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
    };

    for (const [filePath, content] of Object.entries(vueStructure)) {
        const fullPath = path.join(outputFolder, filePath);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, content, 'utf8');
    }

    console.log(`Vue 3 Umgebung erfolgreich im Ordner "${outputFolder}" erstellt.`);
}
