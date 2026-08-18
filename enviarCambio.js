const { Api } = require("telegram");
const conectar = require('./index');
const Chat = require("./chat");

function extraerHash(link) {
    const match = link.match(/(?:joinchat\/|\+)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

async function unirseAlChat(client, link) {
    const hash = extraerHash(link);
    if (!hash) {
        throw new Error("No se pudo extraer el hash de invitación del link: " + link);
    }

    const check = await client.invoke(
        new Api.messages.CheckChatInvite({ hash })
    );

    if (check instanceof Api.ChatInviteAlready) {
        return check.chat;
    }

    const result = await client.invoke(
        new Api.messages.ImportChatInvite({ hash })
    );
    return result.chats[0];
}

async function fijarMensaje(client, peer, mensajeId, referencia) {
    try {
        await client.invoke(
            new Api.messages.UpdatePinnedMessage({
                silent: true,
                peer,
                id: mensajeId
            })
        );
    } catch (pinError) {
        if (pinError.errorMessage === "CHAT_ADMIN_REQUIRED") {
            console.log(`Aviso: no se pudo fijar el mensaje en "${referencia}" (la cuenta no es admin). Mensaje enviado igualmente.`);
        } else {
            console.log("Error al intentar fijar el mensaje:", pinError);
        }
    }
}

async function resolverYEnviar(client, link, textMessage) {
    // Re-resuelve por invite link (uniéndose si hace falta) y guarda datos frescos
    const chatEntity = await unirseAlChat(client, link);
    console.log(chatEntity);

    const peer = new Api.InputPeerChannel({
        channelId: BigInt(chatEntity.id.toString()),
        accessHash: BigInt(chatEntity.accessHash.toString())
    });
    const mensaje = await client.sendMessage(peer, { message: textMessage });
    await fijarMensaje(client, peer, mensaje.id, chatEntity.title || link);

    await Chat.updateOne(
        { link },
        {
            $set: {
                "chat.id": chatEntity.id.toString(),
                "chat.accessHash": chatEntity.accessHash.toString(),
                "chat.title": chatEntity.title
            }
        },
        { upsert: true } // por si el documento todavía no existía
    );
}

async function enviarCambio(textMessage = "", link = "") {
    try {
        const client = await conectar();
        const data = await Chat.findOne({ link });
        console.log(data);

        if (data) {
            // Camino rápido: probamos con lo que ya está guardado
            try {
                const peer = new Api.InputPeerChannel({
                    channelId: BigInt(data.chat.id),
                    accessHash: BigInt(data.chat.accessHash)
                });
                const mensaje = await client.sendMessage(peer, { message: textMessage });
                await fijarMensaje(client, peer, mensaje.id, data.chat.title || link);
                return true;
            } catch (err) {
                if (err.errorMessage !== "CHANNEL_INVALID" && err.errorMessage !== "CHANNEL_PRIVATE") {
                    throw err; // otro tipo de error, no lo tapamos con el fallback
                }
                console.log(`accessHash guardado ya no sirve para "${link}" (${err.errorMessage}), re-resolviendo por invite link...`);
            }
        }

        // Sin registro, o el cacheado quedó inválido: resolvemos desde cero
        await resolverYEnviar(client, link, textMessage);
        return "TRUE";

    } catch (error) {
        console.error("enviarCambio falló:", error);
        throw error;
    }
}

module.exports = enviarCambio;