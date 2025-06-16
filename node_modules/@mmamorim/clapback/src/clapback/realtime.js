

const realtime = {
    paths: {},
    cb: null,

    init(cb) {
        realtime.cb = cb
    },

    logPaths() {
        let paths = {}
        for (let key in realtime.paths) {
            let sockets = []
            for (let i in realtime.paths[key]) {
                sockets.push(realtime.paths[key][i].id)
            }
            paths[key] = sockets
        }
        console.log("realtime.paths", paths);
    },

    emits(path) {
        console.log("Emiting changes to ", path);
        let tokens = path.split("/")
        console.log('tokens',tokens);        
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
        console.log('paths',paths);        
        //let paths = realtime.paths[path]
        //for (let i in paths) {
        //    console.log(paths[i].id);            
        //}
    },

    addClient(socket) {
        console.log('addClient', socket.id);
        socket.emit("ack", "ok");

        socket.on('get', (path) => {
            console.log("GET request path ", path);
            let data = realtime.cb.get(path)
            console.log("data", data);
            socket.emit('getData', data)
        })

        socket.on('addlistener', (path) => {
            console.log(`socket ${socket.id} addlistener path `, path);
            if (!realtime.paths[path]) {
                realtime.paths[path] = []
            }
            realtime.paths[path].push(socket)
            realtime.logPaths()
        })

        socket.on("disconnect", (reason) => {
            console.log(`socket ${socket.id} disconnected`, reason);
            for (let key in realtime.paths) {
                for (let i in realtime.paths[key]) {
                    if (realtime.paths[key][i].id == socket.id) {
                        realtime.paths[key].splice(i, 1)
                    }
                }
            }
            realtime.logPaths()
        });
    }
}

export default realtime