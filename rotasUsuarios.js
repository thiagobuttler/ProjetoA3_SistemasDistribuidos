import { SimpleCrypto } from "simple-crypto-js"
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.SECRET

export default function rotasUsuarios(server, db) {

    server.get('/usuarios', (req, res) => {
        let lista = db.get("/usuarios")
        res.status(200).json(lista)
    });
    
    server.post('/usuarios', (req, res) => {
        let lista = db.get("/usuarios") || {};
        // Verifica se já existe usuário com o mesmo email
        const emailExiste = Object.values(lista).some(u => u.email === req.body.email);
        if (emailExiste) {
            res.status(400).json({ msg: "Já existe um usuário com este email." });
            return;
        }
        let id = db.newID("USER-")
        let data = { id, ...req.body }
        const simpleCrypto = new SimpleCrypto(SECRET)
        data.senha = simpleCrypto.encrypt(data.senha)
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/usuarios/:id', (req, res) => {
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuário não existe." })
            return
        }
        let data = { id, ...req.body }
        const simpleCrypto = new SimpleCrypto(SECRET)
        data.senha = simpleCrypto.encrypt(data.senha)
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/usuarios/:id', (req, res) => {
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuario não existe." })
            return
        }
        db.set("/usuarios/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}