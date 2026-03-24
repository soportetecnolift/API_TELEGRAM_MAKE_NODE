const { Api } = require("telegram");
const conectar = require('./index');
const Chat = require("./chat");

async function enviarCambio(textMessage = "", link = "") {
    try {

        const client = await conectar();

        const data = await Chat.findOne({ link });

        if (!data) {
            throw new Error("Chat no encontrado");
        }

        console.log(data)

        const peer = new Api.InputPeerChannel({
            channelId: BigInt(data.chat.id),
            accessHash: BigInt(data.chat.accessHash)
        });

        const mensaje = await client.sendMessage(peer, {
            message: textMessage
        });
        await client.invoke(
            new Api.messages.UpdatePinnedMessage({
                silent: true,
                peer: peer,
                id: mensaje.id
            })
        )
        return "TRUE"

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = enviarCambio;