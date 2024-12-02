const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { muteUser } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silenciar a un usuario por un tiempo determinado.",
  commands: ["mute"],
  usage: `${PREFIX}mute <@usuario> <tiempo en minutos>`,
  handle: async ({
    args,
    isReply,
    remoteJid,
    replyJid,
    sendReply,
    sendSuccessReact,
    userJid,
  }) => {
    try {
      if (args.length < 2) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Debes proporcionar el nombre del usuario y el tiempo de silenciamiento."
        );
      }

      const userToMute = args[0];
      const durationInMinutes = parseInt(args[1], 10);

      if (isNaN(durationInMinutes) || durationInMinutes < 1 || durationInMinutes > 15) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 El tiempo de silenciamiento debe ser un número entre 1 y 15 minutos."
        );
      }

      // Calcular el tiempo de expiración para el mute
      const muteUntil = Date.now() + (durationInMinutes * 60 * 1000);

      // Mudar al usuario
      await muteUser(remoteJid, userToMute, muteUntil);

      await sendSuccessReact();
      await sendReply(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ${userToMute} ha sido silenciado por ${durationInMinutes} minuto(s).`
      );
    } catch (error) {
      console.error(error);
      await sendReply(`👻 Krampus.bot 👻 Error: ${error.message}`);
    }
  },
};








