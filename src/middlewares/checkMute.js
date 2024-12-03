const { isUserMuted } = require("../utils/database");

exports.checkMute = async ({ socket, userJid, remoteJid }) => {
  try {
    const { participants } = await socket.groupMetadata(remoteJid);
    const participant = participants.find((participant) => (link unavailable) === userJid);
    if (!participant) {
      return false;
    }
    return isUserMuted(remoteJid, userJid);
  } catch (error) {
    throw error;
  }
};
