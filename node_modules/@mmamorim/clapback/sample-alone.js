import clapback from "./index.js"

const port = process.env.PORT || 3000;

await clapback.init({ port, dbFileName: 'db.json' })
//server.use("/clapback", clapback.serve(PORT))