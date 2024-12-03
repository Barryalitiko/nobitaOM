const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { muteUser } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silenciar a un usuario por un tiempo determinado.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario [tiempo en minutos] ou ${PREFIX}mute respondiendo a un mensaje`,
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
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona"
        );
      }

      const memberToMuteJid = isReply ? replyJid : toUserJid(args[0]);
      const memberToMuteNumber = onlyNumbers(memberToMuteJid);

      if (memberToMuteNumber.length < 7 || memberToMuteNumber.length > 15) {
        throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 in𝚟𝚊𝚕𝚒𝚍𝚘");
      }

      if (memberToMuteJid === userJid) {
        throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗");
      }

      const botJid = toUserJid(BOT_NUMBER);
      if (memberToMuteJid === botJid) {
        throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗");
      }

      const durationInMinutes = args[1];
      if (!durationInMinutes) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Debes proporcionar el tiempo de silenciamiento."
        );
      }

      const muteUntil = Date.now() + (durationInMinutes * 60 * 1000);
      await muteUser(remoteJid, memberToMuteJid, muteUntil);

      await sendSuccessReact();
      await sendReply(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ${memberToMuteJid} ha sido silenciado por ${durationInMinutes} minuto(s).`
      );
    } catch (error) {
      console.error(error);
      await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Error: ${error.message}`);
    }
  },
};
