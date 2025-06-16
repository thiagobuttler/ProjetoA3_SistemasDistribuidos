import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { server, db, PORT } from "./initServer.js"
import auth from "./auth.js"
import rotasUsuarios from "./rotasUsuarios.js";

server.get('/', (req, res) => {
    res.send('🙋‍♂️ Hello...route /');
});

auth.init(server,db)
rotasUsuarios(server,db)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
server.get('/db', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    });
});

server.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
});