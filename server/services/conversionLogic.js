import fs from 'fs';
import path from 'path';

export function processFolder(inputFolder, outputFolder, framework) {
    copyFilesToOutput(inputFolder, outputFolder);

    if (framework === 'vue') {
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

//function to generate the vue environment
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
        'src/App.vue': `
<template>
  <div id="app">
    <h1>Welcome to Your Vue 3 App</h1>
    <HelloWorld msg="Hello Vue 3!"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  }
};
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
        `,
        'src/components/HelloWorld.vue': `
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
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
