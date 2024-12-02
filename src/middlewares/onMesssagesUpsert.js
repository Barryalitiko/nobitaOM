const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { handleAntiLongText } = require("../middlewares/antiLongText");
const { addDeletedMessage } = require("../utils/database");
const checkMute = require("../middlewares/checkMute"); // Importar el middleware de mute

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    if (!commonFunctions) {
      continue;
    }

    // Middleware para manejar usuarios silenciados
    const isMuted = await new Promise((resolve) => {
      checkMute(socket, webMessage, () => resolve(false));
    });

    if (isMuted) {
      console.log("Mensaje bloqueado por mute.");
      continue; // Bloquear mensajes de usuarios silenciados
    }

    // Manejar mensajes eliminados
    if (webMessage.message && webMessage.message.delete) {
      const groupId = webMessage.key.remoteJid;
      const userId = webMessage.key.participant || webMessage.key.remoteJid;
      const messageText = webMessage.message?.conversation || webMessage.message?.extendedTextMessage?.text;

      if (messageText) {
        addDeletedMessage(groupId, userId, messageText);
      }
    }

    // Procesar comandos dinámicos
    await dynamicCommand(commonFunctions);
  }
};
