const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const {
  muteUser,
  unmuteUser,
  isUserMuted
} = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silencia o desilencia a un usuario en el grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute [@usuario] [tiempo]`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, mentionedJidList }) => {
    if (args.length < 2) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Usa el comando con @usuario [tiempo en minutos]!"
      );
    }

    // Obtener el usuario mencionado y el tiempo (en minutos)
    const mentionedUserJid = mentionedJidList[0];
    const timeInMinutes = parseInt(args[1], 10);

    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 El tiempo debe ser un número mayor que 0."
      );
    }

    // Verificar si el usuario ya está silenciado
    if (await isUserMuted(remoteJid, mentionedUserJid)) {
      await sendReply("👻 Krampus.bot 👻 Este usuario ya está silenciado.");
      return;
    }

    // Silenciar al usuario
    await muteUser(remoteJid, mentionedUserJid, timeInMinutes * 60000); // Convertir minutos a milisegundos

    await sendSuccessReact();
    await sendReply(`👻 Krampus.bot 👻 El usuario ha sido silenciado por ${timeInMinutes} minutos.`);

    // Función para desilenciar al usuario después del tiempo especificado
    setTimeout(async () => {
      await unmuteUser(remoteJid, mentionedUserJid);
      await sendReply(`👻 Krampus.bot 👻 El usuario ha sido desilenciado.`);
    }, timeInMinutes * 60000);
  },
};
