const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { muteUser } = require("../../utils/database"); // Asegúrate de que muteUser esté importado

module.exports = {
  name: "mute",
  description: "Silenciar a un usuario por un tiempo determinado.",
  commands: ["mute"],
  usage: `${PREFIX}mute @marcar_miembro [tiempo en minutos]`,
  handle: async ({
    args,
    isReply,
    remoteJid,
    replyJid,
    sendReply,
    sendSuccessReact,
    userJid,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Usa el comando con @usuario [tiempo en minutos]!"
      );
    }

    const userToMuteJid = isReply ? replyJid : args[0];
    const durationInMinutes = parseInt(args[1], 10); // Convierte el segundo argumento a un número entero

    if (isNaN(durationInMinutes) || durationInMinutes <= 0 || durationInMinutes > 15) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 El tiempo debe ser un número entre 1 y 15 minutos."
      );
    }

    // Calcular el tiempo de expiración para el mute
    const muteUntil = Date.now() + (durationInMinutes * 60 * 1000); // Expiración en minutos

    // Mudar al usuario
    muteUser(remoteJid, userToMuteJid, muteUntil); // Guarda el mute con el tiempo de expiración

    await sendSuccessReact();
    await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ha sido silenciado por ${durationInMinutes} minuto(s).`);
  },
};
