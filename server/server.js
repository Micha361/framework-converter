const express = require('express');
const multer = require('multer');
const path = require('path');
const { processFolder } = require('./services/conversionLogic');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
