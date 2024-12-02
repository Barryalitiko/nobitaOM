const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { muteUser } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario por un tiempo determinado (en minutos).",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario [tiempo en minutos]`,
  handle: async ({ args, isReply, remoteJid, replyJid, sendReply, sendSuccessReact }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Usa el comando con @usuario [tiempo en minutos]!"
      );
    }

    // Obtener el JID del usuario a silenciar (si es un mensaje respondido, usar el JID del mensaje)
    const userToMuteJid = isReply ? replyJid : args[0];

    // Obtener el tiempo de duración (en minutos)
    const timeInMinutes = parseInt(args[1]);

    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 El tiempo debe ser un número mayor que 0!");
    }

    if (timeInMinutes > 15) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 El tiempo máximo para silenciar es de 15 minutos.");
    }

    // Llamada a la función para silenciar al usuario
    await muteUser(remoteJid, userToMuteJid, timeInMinutes * 60 * 1000); // Convertir minutos a milisegundos

    await sendSuccessReact();
    await sendReply(`👻 Krampus.bot 👻 El usuario ha sido silenciado por ${timeInMinutes} minutos.`);
  },
};
