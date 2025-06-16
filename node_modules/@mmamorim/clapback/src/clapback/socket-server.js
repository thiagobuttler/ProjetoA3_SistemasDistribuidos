import { Server } from "socket.io"
import chalk from 'chalk';

const socketServer = {
    io: null,
    cb: null,

    init(cb,httpServer) {
        socketServer.cb = cb
        //console.log("httpServer",httpServer);
        socketServer.io = new Server(httpServer);
        //console.log("server.io",server.io);
        //realtime.init(cb)

        //socketServer.io.on("connection", (socket) => {
        //    console.log("new connection");
        //});

        console.log(`👏 ${chalk.yellow('Realtime')} events is running`)
        console.log(chalk.blue("-------------------------------------"));
    },

    addClient(socket) {
        console.log('addClient', socket.id);
        socket.emit("ack", "ok");

        socket.on('get', (path) => {
            console.log("GET request path ", path);
            let data = socketServer.cb.get(path)
            console.log("data", data);
            socket.emit('getData', data)
        })

        socket.on("disconnect", (reason) => {
            console.log(`socket ${socket.id} disconnected`, reason);
        });
    },

    getEmitsMsgs(path) {
        //console.log("Emiting changes to ", path);
        let tokens = path.split("/")
        //console.log('tokens',tokens);        
        let paths = []
        let pathfull = ""
        for(let i in tokens) {
            if(i>0) {
                pathfull = pathfull + "/" + tokens[i]
                paths.push(pathfull)
            } else {
                paths.push("/")
            }
        } 
        return paths
    },

    sendChange(path) {
        if (socketServer.io) {
            //socketServer.io.emit(path, "changed")
            //realtime.emits(path)
            let paths = socketServer.getEmitsMsgs(path)
            //console.log('paths',paths);     
            for(let i in paths) {
                socketServer.io.emit(paths[i], "changed")
                //console.log("Changes emited to ", paths[i]);
            }               
        }
    }
}

export default socketServer