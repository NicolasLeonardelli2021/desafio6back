const express = require("express")
const app = express()
let moment = require("moment")
const fs = require('fs')
let path = require('path')
let {Server: HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');
const PORT = 3000;


app.use(express.json());                    
app.use(express.urlencoded({extended:true}));

app.set("views", path.join(__dirname,"./views/ejs"));
app.set("view engine", "ejs");

let productos = [];
let chat = [];

app.get("/", (req,res,next) =>{
    res.render("index", {productos});   
})

let http = new HttpServer(app);
let io = new SocketIO(http);
 
io.on("connection", socket =>{
    console.log("Nuevo cliente conectado:", socket.id)
    socket.emit("produc",productos);
    socket.emit("chatInit", chat)
    
    socket.on("datos",data =>{
        productos.push({...data})
        io.sockets.emit("tabla",productos)
        console.log(data)
    })
    socket.on("nuevoChat", data =>{
        chat.push({...data, date: moment().format("DD-MM-YYYY HH:mm:ss")})
        io.sockets.emit("mensaje",chat)
        console.log(chat)
    })
})


http.listen(PORT, ()=>{
    console.log(`estamos escuchando en esta url: http://localhost:${PORT}`)
})
