const { Api } = require("telegram");
const conectar = require('./index')

async function createGroup(stringSessionn = null , nombre= "", descripcion="", detailsMessage = {}) {
    try {
        const client = await conectar()

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
        message:"👷‍♂️ Bienvenidos al grupo de la obra"+
        " \n \n** Grupo - "+nombre+"**"+
        "\n \n Este grupo se utilizará para coordinar y compartir información importante sobre el desarrollo de la obra: avances, programación de trabajos, documentación y novedades."+
        "\n \n Por favor mantener la comunicación relacionada únicamente con la obra y compartir información clara para una mejor coordinación."+
        "\n \n **¡Buen trabajo para todos!**"+
        "\n \n 🏗 OBRA "+detailsMessage.obra+
        " \n \n 👤**Cliente:** "+detailsMessage.cliente+
        " \n 📱**Teléfono:** "+detailsMessage.telefono+
        " \n 📌**Dirección obra:** "+detailsMessage.dirObra+
        " \n ⚙**Equipo:** "+detailsMessage.equipo+
        " \n #⃣**Número de serie:** "+detailsMessage.numSerie+
        " \n 👨‍💻**Comercial:** "+detailsMessage.comercial+
        " \n 📅**Fecha prevista instalación:** "+detailsMessage.fecha_prevista+
        " \n \n 🔗**Enlace de Invitación del Grupo:**" + invite.link+" "
        })
        await client.invoke(
            new Api.messages.UpdatePinnedMessage({
                silent: true,
                peer: chat,
                id: mensaje.id
            })
        )
        //console.log("mesaje enviado y fijado")
        //console.log("Link de invitación:", invite.link);
        //console.log("Grupo creado:", chat);
        console.log("Grupo crado correctamente: " + nombre + " - " + invite.link )
        
        // invitar al grupo
        /*const user = await client.getEntity("+34607330742");

        const adddCLient = await client.invoke(
        new Api.channels.InviteToChannel({
            channel: chat,
            users: [user]
        })
        );

        console.log(adddCLient)
        
        console.log("Usuario añadido al grupo"); */
        return invite.link 
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = createGroup;