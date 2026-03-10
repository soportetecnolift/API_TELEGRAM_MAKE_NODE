const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("readline");
const fs = require("fs");

const apiId = 37315121;
const apiHash = "e919c06befd94931fffaa3df25c275db";

const stringSession = new StringSession(fs.readFileSync("session.txt", "utf8"));
let client
async function createGroup(stringSessionn = null , nombre= "", descripcion="", detailsMessage = {}) {
    try {
        if(stringSessionn){
            client = new TelegramClient(stringSessionn, apiId, apiHash, {
            connectionRetries: 5,
            })
        
        }else{
            client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
            })
        }
        
        

        await client.start();

        console.log("Sesión reusada, ya autenticado");

        const result = await client.invoke(
            new Api.channels.CreateChannel({
                title: nombre,
                about: descripcion,
                megagroup: true,
            })
        );

        const chat = result.chats[0];

        const invite = await client.invoke(
            new Api.messages.ExportChatInvite({
                peer: chat
            })
        );

        const mensaje = await client.sendMessage(chat, {
        message:"🏗 OBRA "+detailsMessage.obra+
        " \n \n 👤Cliente: "+detailsMessage.cliente+
        " \n 📱Teléfono: "+detailsMessage.telefono+
        " \n 📌Dirección obra: "+detailsMessage.dirObra+
        " \n 🎽Equipo: "+detailsMessage.equipo+
        " \n #⃣Número de serie: "+detailsMessage.numSerie+
        " \n 👨‍💻Comercial: "+detailsMessage.comercial+
        " \n 📅Fecha prevista instalación: "+detailsMessage.fecha_prevista+
        " \n \n 🔗Enlace de Invitación del Grupo:" + invite.link
        })
        await client.invoke(
            new Api.messages.UpdatePinnedMessage({
                silent: true,
                peer: chat,
                id: mensaje.id
            })
        )
        console.log("mesaje enviado y fijado")
        console.log("Link de invitación:", invite.link);
        console.log("Grupo creado:", chat);
        
        
        // invitar al grupo
        const user = await client.getEntity("+34607330742");

        const adddCLient = await client.invoke(
        new Api.channels.InviteToChannel({
            channel: chat,
            users: [user]
        })
        );

        console.log(adddCLient)
        
        console.log("Usuario añadido al grupo"); 
        return invite.link 
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = createGroup;