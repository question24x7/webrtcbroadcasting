const express = require('express')
const socketio = require('socket.io')
const app = express()
const port = process.env.PORT || 4444
app.use(express.static(__dirname+"/public"))
const server = app.listen(port, function(){
    console.log("server started at port : "+port)
})

const sio = socketio(server)

sio.on("connection", function(socket){
    socket.on("message", function(data){
        socket.broadcast.emit("message", data)
    })
    console.log(socket.id);
})