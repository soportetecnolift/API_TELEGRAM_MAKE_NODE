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

    // Primero comprobamos el estado del invite sin unirnos todavía
    const check = await client.invoke(
        new Api.messages.CheckChatInvite({ hash })
    );

    if (check instanceof Api.ChatInviteAlready) {
        // Ya somos participantes: el chat viene incluido directamente
        return check.chat;
    }

    // No somos miembros aún: nos unimos
    const result = await client.invoke(
        new Api.messages.ImportChatInvite({ hash })
    );
    return result.chats[0];
}

async function enviarCambio(textMessage = "", link = "") {
    try {
        const client = await conectar();

        const data = await Chat.findOne({ link });

        if (!data) {
            throw new Error("Chat no encontrado");
        }

        console.log(data);

        const chatEntity = await unirseAlChat(client, link);

        const peer = new Api.InputPeerChannel({
            channelId: BigInt(chatEntity.id.toString()),
            accessHash: BigInt(chatEntity.accessHash.toString())
        });

        const mensaje = await client.sendMessage(peer, {
            message: textMessage
        });

        try {
            await client.invoke(
                new Api.messages.UpdatePinnedMessage({
                    silent: true,
                    peer: peer,
                    id: mensaje.id
                })
            );
        } catch (pinError) {
            if (pinError.errorMessage === "CHAT_ADMIN_REQUIRED") {
                console.log(`Aviso: no se pudo fijar el mensaje en "${chatEntity.title || link}" (la cuenta no es admin). Mensaje enviado igualmente.`);
            } else {
                console.log("Error al intentar fijar el mensaje:", pinError);
            }
        }

        await Chat.updateOne(
            { link },
            {
                $set: {
                    "chat.id": chatEntity.id.toString(),
                    "chat.accessHash": chatEntity.accessHash.toString()
                }
            }
        );

        return "TRUE";

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = enviarCambio;