const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const {
  activateAntiLongTextGroup,
  deactivateAntiLongTextGroup,
} = require("../../utils/database");

module.exports = {
  name: "anti-texto-largo",
  description: "Activa/desactiva el recurso anti-texto-largo en el grupo.",
  commands: ["anti-texto-largo"],
  usage: `${PREFIX}anti-texto-largo (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Activa con 1 o 0 (activar o desactivar)!"
      );
    }

    const antiLongTextOn = args[0] === "1";
    const antiLongTextOff = args[0] === "0";

    if (!antiLongTextOn && !antiLongTextOff) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Activa con 1 o 0 (activar o desactivar)!"
      );
    }

    if (antiLongTextOn) {
      activateAntiLongTextGroup(remoteJid);
    } else {
      deactivateAntiLongTextGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = antiLongTextOn ? "activado" : "desactivado";

    await sendReply(`El anti-texto-largo ha sido ${context}!`);
  },
};
