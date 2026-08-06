const { Api } = require("telegram");
const conectar = require('./index');
const Chat = require("./chat");


async function createGroup(stringSessionn = null, nombre = "", descripcion = "", detailsMessage = {}, numeroComercial = "") {
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
            message: "👷‍♂️ Bienvenidos al grupo de la obra" +
                " \n \n** Grupo - " + nombre + "**" +
                "\n \n Este grupo se utilizará para coordinar y compartir información importante sobre el desarrollo de la obra: avances, programación de trabajos, documentación y novedades." +
                "\n \n Por favor mantener la comunicación relacionada únicamente con la obra y compartir información clara para una mejor coordinación." +
                "\n \n **¡Buen trabajo para todos!**" +
                "\n \n 🏗 OBRA " + detailsMessage.obra +
                " \n \n 👤**Cliente:** " + detailsMessage.cliente +
                " \n 📱**Teléfono:** " + detailsMessage.telefono +
                " \n 📌**Dirección obra:** " + detailsMessage.dirObra +
                " \n ⚙**Equipo:** " + detailsMessage.equipo +
                " \n #⃣**Número de serie:** " + detailsMessage.numSerie +
                " \n 👨‍💻**Comercial:** " + detailsMessage.comercial +
                " \n 📅**Fecha prevista instalación:** " + detailsMessage.fecha_prevista +
                " \n \n 🔗**Enlace de Invitación del Grupo:**" + invite.link + " "
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
        console.log("Grupo crado correctamente: " + nombre + " - " + invite.link)
        try {
            const chatLimpio = {
                id: chat.id.value.toString(),
                accessHash: chat.accessHash.value.toString(),
                title: chat.title
            };
            newChat = new Chat({
                link: invite.link,
                chat: chatLimpio
            })
            newChat.save()
            console.log(chat)
        } catch (error) {
            console.log(error)
        }
        //invitar al grupo
        try {
            //juan
            const user = await client.getEntity("+573245751504");

            const adddCLient = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [user]
                })
            );
            //leo
            const user2 = await client.getEntity("+34607330742");

            const adddCLient2 = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [user2]
                })
            );
            console.log(adddCLient2)

            const user3 = await client.getEntity("@TecnoliftoBot");

            const adddCLient3 = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [user3]
                })
            );
            console.log(adddCLient3)

            //paquito
            const user4 = await client.getEntity("+34672686620");

            const adddCLient4 = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [user4]
                })
            );
            console.log(adddCLient4)
            try {
                if (numeroComercial !== "") {
                    const user5 = await client.getEntity(numeroComercial);
                    const adddCLient5 = await client.invoke(
                        new Api.channels.InviteToChannel({
                            channel: chat,
                            users: [user5]
                        })
                    );
                    console.log(adddCLient5)
                }
            } catch (error) {
                console.log(error)
            }


            //sigfrido
            const user6 = await client.getEntity("+34662964240");

            const adddCLient6 = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [user6]
                })
            );
            console.log(adddCLient6)
            //console.log("Usuarios añadidos al grupo");
            
            //Antonio
            const userAdmin = await client.getEntity("+34615231647");

            const addAdmin = await client.invoke(
                new Api.channels.InviteToChannel({
                    channel: chat,
                    users: [userAdmin]
                })
            );
            console.log(addAdmin);

            const setAdmin = await client.invoke(
                new Api.channels.EditAdmin({
                    channel: chat,
                    userId: userAdmin,
                    adminRights: new Api.ChatAdminRights({
                        changeInfo: true,
                        postMessages: true,
                        editMessages: true,
                        deleteMessages: true,
                        banUsers: true,
                        inviteUsers: true,
                        pinMessages: true,
                        addAdmins: true, 
                        anonymous: false,
                        manageCall: true,
                        other: true
                    }),
                    rank: "Admin" 
                })
            );
            console.log(setAdmin);

        } catch (error) {
            console.log(error)
        }
        return { link: invite.link, id: chat.id.value.toString(), accessHash: chat.accessHash.value.toString(), title: chat.title };
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = createGroup;