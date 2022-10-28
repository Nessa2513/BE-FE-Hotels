const fs = require('fs')
const express = require('express')
const res = require('express/lib/response')
const { application } = require('express')
const app = express()
const bodyParser = require('body-parser')
const puerto = 3000
const mongoose = require('mongoose')
const config = require('./config')
const { callbackify } = require('util')
const bcrypt = require("bcrypt")
// db.roles.createIndex({rolID:1},{unique:true}) - PARA LLAVE PRIMARIA en STUDIO 3T
const connectionString = "mongodb+srv://nessacardenasm:yolo2504@prueba1.txegamx.mongodb.net/?retryWrites=true&w=majority/be-fe"

app.use(express.json())
app.set('llave', config.llave)

const rutasProtegidas = express.Router() //Metodo Router y se agrega a esta constante

rutasProtegidas.use((req, res, next)=>{
    // Permiso que le doy a la gente para que consuma estos servicios = Token
    const token = req.headers['access-token']
    if(token == undefined){
        var payload = {
            msg : "Error al autenticar"
        }
        res.send(payload)
        return
    }
    console.log("token: ", token)
    next() // Pasar al siguiente servicio
}) //Callback

// EJEMPLO GET
app.get('/', (req, res)=>{
    res.send("Datos recibidos")
})

//app.post('/registro', rutasProtegidas, async (req,res)=>{ // Al agregar rutas protegidas entra directamente a ese en lugar de registro. No entra a registro a menos que rutasProtegidas ponga next
app.post('/roles', async (req,res)=>{
    var datos = req.body
    if(datos){
        datos.datetime =  new Date("2022-10-27")
        datos.clave = await bcrypt.hash(datos.clave, 10) 
        console.log(datos)
    }
    var registro = new RolesModel(datos)
    var payload = {
        registro : registro,
        msg : ""
    }
    registro.save().then(item =>{
        console.log("Registro fue guardado")
        payload.msg = "Guardado en base de datos"
        res.send(payload)
    }).catch(err =>{
        console.log("Error al guardar: "+ err.toString())
        payload.msg = "Error de guardado"
        res.send(payload)
    })
})

app.listen(puerto, ()=>{
    console.log("Escuchando por el puerto: " + puerto)
})

fs.readFile("Package.json", function(err,data){
    if(err){
        console.log("error")
        console.log(err)
        return
    }
    console.log(data.toString())
})


mongoose.connect(connectionString, {useNewURLParser: true}, (err, res)=>{
    if(err){
        console.log("Error conectando a mongo: " + err)
    } else {
        console.log("Conectado a Mongo correctamente")
    }
})

var tabla_roles = new mongoose.Schema({ 
    rolID : Number,
    nombre : String,
    codigo : Number,
    createDate : Date
})
var RolesModel = mongoose.model("Roles", tabla_roles)