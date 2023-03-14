const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

// LAN ANH

app.use(cors())

app.get("/", (req, res) => {
    res.send("Server is running...")
})

server.listen(port, () => {
    console.log("Server started at localhost:" + port)
})