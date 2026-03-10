require('dotenv').config()
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require('readline')
const fs = require('fs');
const { ClientRequest } = require("http");
const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(""); // guardar sesión luego

console.log(stringSession)

async function conectar() {

    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        })

        await client.start({
            phoneNumber: async () =>
                new Promise((resolve) =>
                    rl.question("Por favor, introduzca su número: ", resolve)
                ),
            password: async () =>
                new Promise((resolve) =>
                    rl.question("Por favor, introduzca su contraseña: ", resolve)
                ),
            phoneCode: async () =>
                new Promise((resolve) =>
                    rl.question("Por favor, introduzca el código que ha recibido: ", resolve)
                ),
            onError: (err) => console.log(err),
        })
        fs.writeFileSync('session.txt', stringSession.save())
        await client.start()
        console.log("Conectado perfectamente ")
        return stringSession
    } catch (error) {
        console.log(error)
        return error
    }
    
}

module.exports = conectar