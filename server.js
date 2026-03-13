const express = require('express')
const app = express()
const cors = require('cors')
const conectar = require('./index')
const createGroup = require('./validar')
const { validar } = require('./middelware')
app.use(express.json())


app.get('/crearchat', validar, (req, res) => {

    const {
        obra = null,
        cliente = null,
        telefono = null,
        dirObra = null,
        equipo = null,
        numSerie = null,
        comercial = null,
        fecha_prevista = null
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
            obra : obra,
            cliente : cliente,
            telefono : telefono,
            dirObra : dirObra,
            equipo : equipo,
            numSerie :  numSerie,
            comercial : comercial,
            fecha_prevista : fecha_prevista
        }
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
