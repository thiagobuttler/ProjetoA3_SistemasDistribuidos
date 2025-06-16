<img src="./assets/logo600.png" alt="clapback" title="clapback" height="80" />

###
> Simple and fast JSON database


Simple to use type-safe local JSON database 🦉

Inspired by (and largely compatible with) the Firebase realtime database


~~~bash
npm install @mmamorim/clapback
~~~

~~~js
import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
import clapback from "@mmamorim/clapback"

const server = express();
server.use(bodyParser.json());       // suporte para JSON-encoded bodies
server.use(bodyParser.urlencoded({     // suporte para URL-encoded bodies
    extended: true
}));
server.use(cors())

const PORT = 3040

await clapback.init({ dbFileName: 'db.json' })
server.use("/clapback", clapback.serve(PORT))

server.get('/', (req, res) => {
    res.send('🙋‍♂️ Oi gente...você acessou a raiz /');
});

server.listen(PORT, () => {
    console.log('Server escutando na porta '+PORT);
});
~~~