const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 8080
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

app.use(cors())

app.get("/", (req, res) => {
    res.send("Server is running...")
})

io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callstop')
    })

    socket.on('calluser', ({ userToCall, sigalDatam, from, name} ) => {
        io.to(userToCall).emit("calluser", { signal: sigalDatam, from, name})
    })

    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal)
    })
})

server.listen(port, () => {
    console.log("Server started at localhost:" + port)
})