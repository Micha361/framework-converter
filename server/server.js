import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFolder } from './services/conversionLogic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware für Datei-Uploads
const upload = multer({ dest: 'uploads/' });

// JSON-Parsing aktivieren
app.use(express.json());

// API-Endpunkt für die Konvertierung
app.post('/api/convert', upload.single('folder'), (req, res) => {
    const inputFolder = path.join(__dirname, 'uploads', req.file.filename);
    const outputFolder = path.join(__dirname, 'output');
    const framework = req.body.framework;

    try {
        processFolder(inputFolder, outputFolder, framework);
        res.json({ message: 'Konvertierung abgeschlossen!', output: '/output' });
    } catch (error) {
        console.error('Fehler bei der Konvertierung:', error);
        res.status(500).json({ error: 'Fehler bei der Konvertierung' });
    }
});

// Statische Dateien aus dem Vue-Build-Ordner bereitstellen
app.use(express.static(path.join(__dirname, '../dist')));

// Alle anderen Routen auf die Vue-Index-Seite umleiten
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
