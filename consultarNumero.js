const conectar = require('./index');

async function consultarNumero() {
    try {
        const client = await conectar();

        const autorizado = await client.isUserAuthorized();
        if (!autorizado) {
            throw new Error("Sesión no autorizada o expirada");
        }

        const me = await client.getMe();

        return {
            id: me.id.toString(),
            phone: me.phone || null,
            username: me.username || null,
            firstName: me.firstName || null,
            lastName: me.lastName || null
        };

    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = consultarNumero;