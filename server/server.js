import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFolder } from './services/conversionLogic.js';
import unzipper from 'unzipper';
import fs from 'fs';
import archiver from 'archiver'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const OUTPUT_DIR = path.join(__dirname, 'output');

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.post('/api/convert', upload.single('folder'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }

    const zipPath = path.join(__dirname, 'uploads', req.file.filename);
    const extractedPath = path.join(__dirname, 'uploads', req.file.filename + '_extracted');
    const framework = req.body.framework;

    try {
        if (!fs.existsSync(extractedPath)) {
            fs.mkdirSync(extractedPath, { recursive: true });
        }

        await new Promise((resolve, reject) => {
            fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: extractedPath }))
                .on('close', resolve)
                .on('error', reject);
        });

        processFolder(extractedPath, OUTPUT_DIR, framework);

        res.json({ message: 'Konvertierung abgeschlossen!', output: '/output' });
    } catch (error) {
        console.error('Fehler bei der Konvertierung:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/download', (req, res) => {
    const zipFilePath = path.join(OUTPUT_DIR, 'converted_project.zip');

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.download(zipFilePath, 'converted_project.zip', (err) => {
            if (err) {
                console.error('Fehler beim Herunterladen:', err);
                res.status(500).send('Fehler beim Herunterladen');
            }
        });
    });

    archive.on('error', (err) => {
        console.error('ZIP-Fehler:', err);
        res.status(500).send('Fehler beim Erstellen der ZIP-Datei');
    });

    archive.pipe(output);
    archive.directory(OUTPUT_DIR, false);
    archive.finalize();
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
