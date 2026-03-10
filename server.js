const express = require('express')
const app = express()
const cors = require('cors')
const conectar = require('./index')
const createGroup = require('./validar')
const { validar } = require('./middelware')
app.use(express.json())


app.get('/crearchat',validar , (req, res) => {

    const { nombre = null, descripcion = null, token = null } = req.query
    console.log(nombre, descripcion)
    if (!nombre || !descripcion) {
        return res.status(400).json({ status: false, error: "Falta nombre o descripción" })
    }
    createGroup(token, nombre, descripcion).then(ress => {
        res.status(200).json({ status: true, res: ress })
    }).catch(err => {
        res.status(500).json({ status: false, err: err })
    })

})
app.get('/link/:id', async (req, res) => {
})
app.get('/conectar',validar , (req, res) => {

    conectar().then(ress => {
        res.json({ token: ress })
    }).catch(err => {
        res.json({ error: err })
    })
})
app.listen(3000, () => {
    console.log('corriendo')
})
