const { isActiveAntiLongTextGroup } = require("../utils/database");

exports.handleAntiLongText = async ({ client, webMessage, sendReact, sendReply }) => {
  const remoteJid = webMessage.key.remoteJid;


  if (!isActiveAntiLongTextGroup(remoteJid)) {
    return;
  }


  const text = webMessage.message?.conversation || webMessage.message?.extendedTextMessage?.text;

  if (text && text.length > 1000) {
    const senderId = webMessage.key.participant || webMessage.key.remoteJid;

    try {

      await client.groupParticipantsUpdate(remoteJid, [senderId], "remove");

      await client.sendMessage(remoteJid, {
        text: `👻 *Krampus.bot* 👻\n\nEl usuario @${senderId.split("@")[0]} fue eliminado por enviar mensajes demasiado largos.`,
        mentions: [senderId],
      });

      await sendReact("❌");
    } catch (error) {
      console.error("Error eliminando al usuario:", error);
      await sendReply("Hubo un error al intentar eliminar al usuario.");
    }
  }
};