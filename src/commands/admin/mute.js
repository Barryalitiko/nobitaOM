const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { muteUser } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silenciar a un usuario por un tiempo determinado.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario [tiempo en minutos]`,
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
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Usa el comando con @usuario [tiempo en minutos]!"
        );
      }

      const userToMute = args[0];
      let durationInMinutes = args[1];

      if (durationInMinutes === undefined) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Debes proporcionar el tiempo de silenciamiento."
        );
      }

      durationInMinutes = parseInt(durationInMinutes, 10);
      if (isNaN(durationInMinutes) || durationInMinutes < 1 || durationInMinutes > 15) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 El tiempo debe ser un número entre 1 y 15 minutos."
        );
      }

      // Calcular el tiempo de expiración para el mute
      const muteUntil = Date.now() + (durationInMinutes * 60 * 1000);

      // Mudar al usuario
      await muteUser(remoteJid, userToMute, muteUntil);

      await sendSuccessReact();
      await sendReply(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ha sido silenciado por ${durationInMinutes} minuto(s).`
      );
    } catch (error) {
      console.error(error);
      await sendReply(`👻 Krampus.bot 👻 Error: ${error.message}`);
    }
  },
};
