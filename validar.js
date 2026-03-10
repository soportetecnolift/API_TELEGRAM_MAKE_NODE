const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("readline");
const fs = require("fs");

const apiId = 37315121;
const apiHash = "e919c06befd94931fffaa3df25c275db";

const stringSession = new StringSession(fs.readFileSync("session.txt", "utf8"));
let client
async function createGroup(stringSessionn = null , nombre= "", descripcion="") {
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

        console.log("Link de invitación:", invite.link);
        console.log("Grupo creado:", chat);
        return invite.link
        /*const chat = result.chats[0];
        
        // obtener usuario
        const user = await client.getEntity("username_del_amigo");
        
        // invitar al grupo
        const user = await client.getEntity("+573001234567");

        await client.invoke(
        new Api.channels.InviteToChannel({
            channel: chat,
            users: [user]
        })
        );
        
        console.log("Usuario añadido al grupo"); */

    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = createGroup;