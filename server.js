const express = require('express')
const app = express()
const cors = require('cors')
const conectar = require('./index')
const createGroup = require('./validar')
const { validar } = require('./middelware')
const conect = require("./conexion")
const enviarCambio = require('./enviarCambio')
const consultarNumero = require('./consultarNumero')
const rutaRecuperarChat = require('./rutaRecuperarChat');

conect()
app.use(express.json())
app.use('/', rutaRecuperarChat);

app.get('/newmessage', async (req, res) => {
    const { text = null, link = null } = req.body
    try {
        enviarCambio(text, link)
            .then(ress => {
                if(ress == "TRUE")return res.status(200).json({ status: true, message: "Mensaje Enviado" })
                return res.status(200).json({ status: true, message: "Chat no Encontrado" })
            })
            .catch(err => {
                return res.status(500).json({ status: true, message: "f-Error Interno: " + err })
            })
    } catch (e) {
        return res.status(500).json({ status: true, message: "Error Interno:  " + e })
    }
})


app.get('/consultarnumero', validar, (req, res) => {
    try {
        consultarNumero()
            .then(ress => {
                return res.status(200).json({ status: true, data: ress })
            })
            .catch(err => {
                return res.status(500).json({ status: false, message: "Error Interno: " + err })
            })
    } catch (e) {
        return res.status(500).json({ status: false, message: "Error Interno: " + e })
    }
})
app.get('/crearchat', validar, (req, res) => {

    const {
        obra = null,
        cliente = null,
        telefono = null,
        dirObra = null,
        equipo = null,
        numSerie = null,
        comercial = null,
        fecha_prevista = null,
        numeroComercial = null
    } = req.body || {}


    const { nombre = null, descripcion = null, token = null } = req.query
    console.log(nombre, descripcion)
    if (!nombre || !descripcion) {
        return res.status(400).json({ status: false, error: "Falta nombre o descripción" })
    }
    createGroup(
        token,
        nombre,
        descripcion,
        DetailsMessage = {
            obra: obra,
            cliente: cliente,
            telefono: telefono,
            dirObra: dirObra,
            equipo: equipo,
            numSerie: numSerie,
            comercial: comercial,
            fecha_prevista: fecha_prevista
        },
        numeroComercial
    ).then(ress => {
        res.status(200).json({ status: true, res: ress })
    }).catch(err => {
        res.status(500).json({ status: false, err: err })
    })

})

app.get('/', async (req, res) => {
    res.status(200).json({ status: true, message: "Sevidor Ejecutandose Correctamente" })
})

app.get('/conectar', validar, (req, res) => {

    conectar().then(ress => {
        res.json({ "status": "Conectado" })
    }).catch(err => {
        console.log(err)
        res.json({ error: err })
    })
})
app.listen(3000, () => {
    console.log('corriendo')
})
