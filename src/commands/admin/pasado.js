const { PREFIX } = require("../../config");
const { getLastDeletedMessages } = require("../../utils/database");

module.exports = {
  name: "lastdeleted",
  description: "Muestra los últimos 6 mensajes borrados en el grupo.",
  usage: `${PREFIX}lastdeleted`,
  commands: ["lastdeleted"],
  async handle({ remoteJid, sendReply }) {
    try {
      if (!remoteJid) {
        await sendReply("No se pudo identificar el grupo. Intenta nuevamente.");
        return;
      }

      const deletedMessages = getLastDeletedMessages(remoteJid);
      if (!deletedMessages || deletedMessages.length === 0) {
        await sendReply("No se encontraron mensajes borrados recientes.");
        return;
      }

      const escapeMarkdown = (text) => text.replace(/[*_~`]/g, "\\$&");

      const formattedMessages = deletedMessages
        .map((msg, idx) => {
          const userId = msg.userId.split("@")[0];
          return `@${userId}:\n*Mensaje ${idx + 1}:* ${escapeMarkdown(msg.messageText)}`;
        })
        .join("\n\n");

      const mentions = deletedMessages.map((msg) => msg.userId);

      await sendReply(`Estos son los últimos mensajes borrados:\n\n${formattedMessages}`, { mentions });
    } catch (error) {
      console.error("Error al obtener los mensajes borrados:", error);
      await sendReply("Ocurrió un error al intentar recuperar los mensajes borrados.");
    }
  },
};