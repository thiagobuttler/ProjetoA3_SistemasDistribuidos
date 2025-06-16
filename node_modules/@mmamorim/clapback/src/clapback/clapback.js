import { JSONFilePreset } from 'lowdb/node'
import { nanoid } from 'nanoid'
import { parserGet, parserSet } from './path-parser.js'
import default_options from './default_options.js'
import serverExpress from "./express-server.js"
import socketServer from './socket-server.js'
import getRouter from "./router.js"

const cb = {
    db: null,
    apidocJSON: null,

    serve(PORT = 3000) {
        let router = getRouter(cb,PORT)
        return router
    },

    async init(_options = default_options) {
        let options = {...default_options, ..._options}
        cb.db = await JSONFilePreset(options.dbFileName, options.defaultData)
        cb.apidocJSON = await JSONFilePreset(options.apidocFile, options.apidocDefaultData)
        if(options.server) {
            options.server.use(options.route, cb.serve(options.port))
        } else {
            serverExpress.init(options.port)
            serverExpress.server.use(options.route, cb.serve(options.port))
        }
        if(options.realtime) {
            socketServer.init(cb, serverExpress.httpServer)
        }
    },

    newID(prefix = "", length = 5) {
        return prefix+nanoid(length)
    },

    get(path) {
        let value = parserGet(cb.db.data,path)
        //console.log('value', value);
        return value
    },

    async set(path, elem) {
        //let elemValue = elem
        //if(elemValue && elemValue.indexOf(".") != -1) {
        //    elemValue = elemValue.replaceAll(".","/")
        //}
        let value = parserSet(cb.db.data,path,elem)
        await cb.db.write()
        socketServer.sendChange(path)
        //console.log('value',value);        
    },

    getApi(path) {
        let value = parserGet(cb.apidocJSON.data,path)
        //console.log('value', value);
        return value
    },

    async setApi(path, elem) {
        //console.log("setApi",{ path, elem }); 
        //let elemValue = elem
        //if(elemValue && elemValue.indexOf(".") != -1) {
        //    elemValue = elemValue.replaceAll(".","/")
        //}
        //console.log("elemValue",elemValue); 
        let value = parserSet(cb.apidocJSON.data,path,elem)
        await cb.apidocJSON.write()
        //console.log('value',value);        
    },

}

export default cb