import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFolder } from './services/conversionLogic.js';
import unzipper from 'unzipper';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

app.post('/api/convert', upload.single('folder'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }

    const zipPath = path.join(__dirname, 'uploads', req.file.filename);
    const extractedPath = path.join(__dirname, 'uploads', req.file.filename + '_extracted');
    const outputFolder = path.join(__dirname, 'output');
    const framework = req.body.framework;

    try {
        if (!fs.existsSync(extractedPath)) {
            fs.mkdirSync(extractedPath, { recursive: true });
        }

        const directory = await fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractedPath }))
            .promise();

        processFolder(extractedPath, outputFolder, framework);

        res.json({ message: 'Konvertierung abgeschlossen!', output: '/output' });
    } catch (error) {
        console.error('Fehler bei der Konvertierung:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
