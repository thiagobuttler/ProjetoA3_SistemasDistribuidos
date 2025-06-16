import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
import clapback from "./clapback.js"
import { createServer } from "node:http";
import chalk from 'chalk';

const server = {
    server: null,
    httpServer: null,

    async init(PORT) {
        server.server = express();
        server.server.use(bodyParser.json());       // suporte para JSON-encoded bodies
        server.server.use(bodyParser.urlencoded({     // suporte para URL-encoded bodies
            extended: true
        }));
        server.server.use(cors())
                
        server.httpServer = createServer(server.server);

        server.server.get('/', (req, res) => {
            res.send('🙋‍♂️ Hello...nothing here on /');
        });
        
        server.httpServer.listen(PORT, () => {
            console.log(`🔥 Server is running at: `+chalk.blue(`http://localhost:${PORT}`))
            console.log(chalk.blue("-------------------------------------"));
        });    
    }
}

export default server
