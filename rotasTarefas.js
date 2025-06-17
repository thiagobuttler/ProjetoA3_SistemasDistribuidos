import { SimpleCrypto } from "simple-crypto-js"
import * as dotenv from 'dotenv'
import auth from "./auth.js";
dotenv.config()

const SECRET = process.env.SECRET;

export default function rotasTarefas(server, db) {

    // Protege as rotas de tarefas
    server.get('/tasks', auth.middlewareAuth, (req, res) => {
        let tasks = db.get("/tasks")
        res.status(200).json(tasks)
    });
    
    server.post('/tasks', auth.middlewareAuth, (req, res) => {
        let id = db.newID("TASK-")
        let data = { id, ...req.body }
        db.set("/tasks/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/tasks/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let task = db.get("/tasks/"+id);
        if(task == null) {
            res.status(400).json({ msg: "Task não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/tasks/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/tasks/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let task = db.get("/tasks/"+id);
        if(task == null) {
            res.status(400).json({ msg: "Task não existe." })
            return
        }
        db.set("/tasks/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    
    // Rota para autenticar e retornar tarefas do usuário
    server.post('/tarefas/login', (req, res) => {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ error: true, msg: "Email e senha obrigatórios." });
            return;
        }
        // Busca usuário pelo email
        const usuarios = db.get("/usuarios");
        const usuario = Object.values(usuarios).find(u => u.email === email);
        if (!usuario) {
            res.status(401).json({ error: true, msg: "Usuário não encontrado." });
            return;
        }
        // Verifica senha
        const simpleCrypto = new SimpleCrypto(SECRET);
        let senhaDescriptografada;
        try {
            senhaDescriptografada = simpleCrypto.decrypt(usuario.senha);
        } catch (e) {
            res.status(401).json({ error: true, msg: "Senha do usuário inválida no banco." });
            return;
        }
        if (senhaDescriptografada !== senha) {
            res.status(401).json({ error: true, msg: "Senha incorreta." });
            return;
        }
        // Busca tarefas do usuário
        const tasks = db.get("/tasks") || {};
        const tarefasUsuario = Object.values(tasks).filter(t => t.usuarioId === usuario.id);
        res.status(200).json({ tarefas: tarefasUsuario });
    });

}