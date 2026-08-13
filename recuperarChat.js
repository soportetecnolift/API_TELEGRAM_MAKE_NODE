const { Api } = require("telegram");
const conectar = require('./index');
const Chat = require("./chat");

function extraerHash(link) {
    const match = link.match(/(?:joinchat\/|\+)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

/**
 * Misma lógica que en enviarCambio.js: comprueba el invite sin unirse
 * todavía, y solo hace ImportChatInvite si el userbot no es miembro aún.
 * Esto evita el error CHANNEL_INVALID por intentar unirse a algo donde
 * ya se es participante, y evita spamear "unirse" innecesariamente.
 */
async function unirseAlChat(client, link) {
    const hash = extraerHash(link);
    if (!hash) {
        throw new Error("No se pudo extraer el hash de invitación del link: " + link);
    }

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

/**
 * Recupera un chat (id + accessHash + title) directamente desde Telegram
 * usando solo el link de invitación, sin depender de que exista un
 * documento previo en Mongo. Pensado para chats que se crearon pero
 * cuyo newChat.save() falló o nunca se ejecutó.
 *
 * @param {string} link - link de invitación completo (t.me/joinchat/xxx o t.me/+xxx)
 * @returns {Promise<{id: string, accessHash: string, title: string}>}
 */
async function recuperarChatPorLink(link) {
    const client = await conectar();
    console.log("Sesión reusada, ya autenticado (recuperación de chat)");

    const chatEntity = await unirseAlChat(client, link);

    const chatLimpio = {
        id: chatEntity.id.toString(),
        accessHash: chatEntity.accessHash.toString(),
        title: chatEntity.title,
    };

    return chatLimpio;
}

/**
 * Recupera el chat por link y lo guarda (o actualiza) en Mongo.
 * Usa upsert sobre el propio link como llave, igual que hace
 * enviarCambio.js con Chat.updateOne({ link }, ...).
 *
 * Si ya existía un documento parcial para ese link (por ejemplo con
 * el chat vacío o con datos viejos), lo completa/corrige en vez de
 * duplicar.
 *
 * @param {string} link
 * @returns {Promise<object>} el documento guardado
 */
async function recuperarYGuardarChat(link) {
    if (!link) {
        throw new Error("Falta el link de invitación");
    }

    const chatLimpio = await recuperarChatPorLink(link);

    const actualizado = await Chat.findOneAndUpdate(
        { link },
        { $set: { link, chat: chatLimpio } },
        { upsert: true, new: true }
    );

    console.log("Chat recuperado y guardado en BD:", actualizado);
    return actualizado;
}

module.exports = {
    recuperarChatPorLink,
    recuperarYGuardarChat,
    unirseAlChat,
    extraerHash,
};
