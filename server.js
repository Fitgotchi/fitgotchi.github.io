const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USER_FILE = path.join(__dirname, 'user.json');

app.use(bodyParser.json());
app.use(express.static('public')); // Asume que tus archivos estáticos están en la carpeta 'public'

// Leer el usuario
app.get('/user', (req, res) => {
    fs.readFile(USER_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error al leer el archivo de usuario' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Crear o actualizar el usuario
app.post('/user', (req, res) => {
    fs.writeFile(USER_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al escribir el archivo de usuario' });
            return;
        }
        res.json({ message: 'Usuario guardado correctamente' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
