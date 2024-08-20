const cors = require('cors')
const app = require('./app.js')
const socket = require('socket.io')


const server = app.listen(8000,()=>{
    console.log("server is running on port 8000")
})


const  io = socket(server,{
    cors: true
})

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
const roomToDetails = []

io.on('connection',(socket)=>{
    console.log('socket connected', socket.id);

    socket.on('room:join',(data)=>{
        const {email,room} = data;
        console.log(email,"-----",room)
        emailToSocketIdMap.set(email,socket.id)
        socketIdToEmailMap.set(socket.id,email)
        
        io.to(room).emit('user:joined',{email,id: socket.id});
        socket.join(room);

        io.to(socket.id).emit('room:join',{email,room})
        
    })

    socket.on("user:call",({to, offer})=>{
        io.to(to).emit('incomming:call',{from: socket.id, offer})
    })

    socket.on('call:accepted', ({to,ans })=>{
        io.to(to).emit('call:accepted',{from: socket.id, ans})
    })

    socket.on('peer:negoNeeded', ({to, offer})=>{
        io.to(to).emit("peer:negoNeeded", {from:socket.id, offer});
    })

    socket.on('peer:negoDone', ({to, ans})=>{
        io.to(to).emit("peer:negoDone", {from: socket.id, ans});
    })

})