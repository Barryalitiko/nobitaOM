const { PREFIX, BOT_NUMBER } = require("../../config");
const { muteUser, unmuteUser } = require("../../utils/database");
const { toUserJid, onlyNumbers } = require("../../utils");

module.exports = {
  name: "mute",
  description: "Silenciar o desmutear a un usuario.",
  commands: ["mute0", "mute1", "mute2", "mute3", "mute4"],
  usage: `${PREFIX}mute0 @usuario ou ${PREFIX}mute1 @usuario`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
  }) => {
    try {
      let memberToMuteJid;

      if (isReply) {
        memberToMuteJid = replyJid;
      } else {
        if (!args.length) {
          throw new InvalidParameterError(
            "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Debes mencionar a la persona que deseas silenciar."
          );
        }

        memberToMuteJid = toUserJid(args[0]);
      }

      const memberToMuteNumber = onlyNumbers(memberToMuteJid);

      if (memberToMuteNumber.length < 7 || memberToMuteNumber.length > 15) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El número de teléfono no es válido."
        );
      }

      if (memberToMuteJid === toUserJid(BOT_NUMBER)) {
        throw new DangerError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No puedes silenciar al bot."
        );
      }

      if (args[0] === "mute0") {
        await unmuteUser(remoteJid, memberToMuteJid);
        await sendSuccessReact();
        await sendReply(
          `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ${memberToMuteJid} ha sido desmutado.`
        );
      } else {
        const durationInMinutes = getDurationInMinutes(args[0]);

        if (durationInMinutes === null) {
          throw new InvalidParameterError(
            "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Debes proporcionar un comando válido (mute0, mute1, mute2, mute3 o mute4)."
          );
        }

        const muteUntil = Date.now() + (durationInMinutes * 60 * 1000);
        await muteUser(remoteJid, memberToMuteJid, muteUntil);

        await sendSuccessReact();
        await sendReply(
          `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ${memberToMuteJid} ha sido silenciado por ${durationInMinutes} minuto(s).`
        );
      }
    } catch (error) {
      console.error(error);
      await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Error: ${error.message}`);
    }
  },
};

function getDurationInMinutes(command) {
  switch (command) {
    case "mute1":
      return 5;
    case "mute2":
      return 10;
    case "mute3":
      return 15;
    case "mute4":
      return 20;
    default:
      return null;
  }
}

