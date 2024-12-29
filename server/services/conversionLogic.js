import fs from 'fs';
import path from 'path';

export function processFolder(inputFolder, outputFolder, framework) {
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

    //function to transform the file content
    function transformFile(filePath, framework) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let transformedContent = fileContent;

        if (path.extname(filePath) === '.html') {
            transformedContent = fileContent.replace(/class="/g, 'className="'); 
        }

        return transformedContent;
    }

    const files = readFolderRecursively(inputFolder);

    files.forEach((file) => {
        const relativePath = path.relative(inputFolder, file);
        const outputPath = path.join(outputFolder, relativePath.replace(/\.html$/, '.vue'));

        const transformedContent = transformFile(file, framework);

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, transformedContent, 'utf8');
    });

    console.log(`Alle Dateien wurden erfolgreich für ${framework} konvertiert!`);
}
