require("dotenv").config()

const { TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
const readline = require("readline")
const fs = require("fs")

const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH

if (isNaN(apiId)) {
    throw new Error("API_ID debe ser numérico")
}

let session = ""

if (fs.existsSync("session.txt")) {
    session = fs.readFileSync("session.txt", "utf8")
}

const stringSession = new StringSession(session)

let clientGlobal = null

async function conectar() {

    try {

        if (clientGlobal) {
            return clientGlobal
        }

        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5
        })

        if (!session) {

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            await client.start({

                phoneNumber: async () =>
                    new Promise((resolve) =>
                        rl.question("Número: ", resolve)
                    ),

                password: async () =>
                    new Promise((resolve) =>
                        rl.question("Password (si tienes 2FA): ", resolve)
                    ),

                phoneCode: async () =>
                    new Promise((resolve) =>
                        rl.question("Código Telegram: ", resolve)
                    ),

                onError: (err) => console.log(err)

            })

            fs.writeFileSync("session.txt", client.session.save())
            console.log("Sesión creada")
        } 
        else {
            await client.connect()
            console.log("Sesión reutilizada")
        }

        console.log("✅ Telegram conectado")

        clientGlobal = client

        return client

    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = conectar