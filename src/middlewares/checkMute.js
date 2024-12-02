const { isUserMuted } = require("../utils/database");

module.exports = async (socket, webMessage, next) => {
  try {
    const groupId = webMessage.key.remoteJid; // ID del grupo
    const userJid = webMessage.key.participant || webMessage.key.remoteJid; // JID del usuario que envió el mensaje

    // Verificar si es un grupo
    if (!groupId.endsWith("@g.us")) {
      return next(); // Si no es un grupo, continuar con el flujo normal
    }

    // Verificar si el usuario está silenciado
    if (isUserMuted(groupId, userJid)) {
      console.log(`Usuario silenciado detectado: ${userJid} en el grupo ${groupId}. Bloqueando mensaje.`);
      return; // Bloquear mensaje (no pasar al siguiente middleware)
    }

    next(); // Continuar con el flujo normal si no está silenciado
  } catch (error) {
    console.error("Error en el middleware de mute:", error);
    next(); // Asegurarse de no detener el flujo en caso de error
  }
};
