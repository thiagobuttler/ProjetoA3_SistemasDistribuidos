//import { io } from "./socket.io.esm.min.js";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
//import default_options from "./default_options.js";

const default_options = {
    ssl: false,
    domain: "localhost",
    port: "3000",
    route: '/clapback',
}

const client = {
    url: "",
    socket: null,
    socketUrl: "",

    init(_options = default_options) {
        let options = { ...default_options, ..._options }
        let url = "http"
        if (options.ssl) { url = url + 's' }
        url = url + "://" + options.domain + ":" + options.port + options.route + "/"
        client.url = url
        let socketUrl = "ws"
        if (options.ssl) { socketUrl = socketUrl + 's' }
        socketUrl = socketUrl + "://" + options.domain + ":" + options.port
        client.socketUrl = socketUrl
    },

    async get(path) {
        try {
            let resp = await fetch(client.url + "getData?path=" + path)
            let data = await resp.json()
            //console.log('data', data);
            return data.data
        } catch (e) {
            this.error = "Error on data initialization...Server probably is down"
            console.log(this.error);
            return {}
        }
    },

    async set(path, data) {
        var elem = { path, data };
        //console.log('model set elem',elem);        
        let resp = await fetch(client.url + "setData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elem)
        })
        let ret = await resp.text()
        //console.log('ret', ret);
    },

    async onValue(path, cbfunc) {
        //console.log("Escutando ", path)
        client.socket = io(client.socketUrl, {
            reconnectionDelayMax: 10000
        });

        client.socket.on("connect", () => {
            //console.log("I'm connect");
        });

        client.socket.on(path, async () => {
            //console.log(`Opa!!! Path ${path} has changed!`);
            let data = await client.get(path)
            cbfunc(data)
        });

        let data = await client.get(path)
        cbfunc(data)
    }

}

export default client