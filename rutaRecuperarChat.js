const express = require('express');
const router = express.Router();
const { recuperarYGuardarChat } = require('./recuperarChat');

/**
 * GET /chats/recuperar?link=https://t.me/+xxxxxxxx
 *
 * Reconstruye y guarda en BD un chat de Telegram que existe pero no
 * quedó registrado (o quedó incompleto) en Mongo, usando el link de
 * invitación como única llave (igual que hace enviarCambio.js).
 *
 * El link va como query param porque suele contener "/" y "+",
 * que rompen el parseo si se pasan como param de ruta (:link).
 *
 * Ejemplo: GET /chats/recuperar?link=https://t.me/+AbCdEfGhIjK
 */
router.get('/chats/recuperar', async (req, res) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({ error: "Falta el query param 'link'" });
    }

    try {
        const chatGuardado = await recuperarYGuardarChat(link);
        return res.status(200).json({
            ok: true,
            mensaje: "Chat recuperado y guardado correctamente",
            chat: chatGuardado
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            ok: false,
            error: error.message || "No se pudo recuperar el chat"
        });
    }
});

module.exports = router;
