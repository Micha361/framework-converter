export function processFolder(inputFolder, outputFolder, framework) {
    const fs = require('fs');
    const path = require('path');

    function readFolderRecursively(folderPath) {
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });
        const files = [];

        entries.forEach((entry) => {
            const fullPath = path.join(folderPath, entry.name);
            if (entry.isDirectory()) {
                files.push(...readFolderRecursively(fullPath));
            } else {
                files.push(fullPath);
            }
        });

        return files;
    }

    function transformFile(content, framework) {
        if (framework === 'vue') {
            return content.replace(/<a href="(.*?)">/g, '<router-link to="$1">')
                          .replace(/<\/a>/g, '</router-link>');
        } else if (framework === 'react') {
            return content.replace(/class="/g, 'className="');
        }
        return content;
    }

    const files = readFolderRecursively(inputFolder);

    files.forEach((file) => {
        const relativePath = path.relative(inputFolder, file);
        const outputPath = path.join(outputFolder, relativePath);

        const content = fs.readFileSync(file, 'utf8');
        const transformedContent = transformFile(content, framework);

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, transformedContent, 'utf8');
    });

    console.log(`Alle Dateien wurden erfolgreich für ${framework} konvertiert!`);
}
