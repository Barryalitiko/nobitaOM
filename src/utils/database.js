const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const DELETED_MESSAGES_FILE = "deleted-messages";

function createIfNotExists(fullPath) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([]));
  }
}

function readJSON(jsonFile) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function writeJSON(jsonFile, data) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  fs.writeFileSync(fullPath, JSON.stringify(data));
}

exports.addDeletedMessage = (groupId, userId, messageText) => {
  const deletedMessages = readJSON(DELETED_MESSAGES_FILE);
  deletedMessages.push({ groupId, userId, messageText, timestamp: new Date().toISOString() });

  if (deletedMessages.length > 100) {
    deletedMessages.shift();
  }

  writeJSON(DELETED_MESSAGES_FILE, deletedMessages);
};

exports.getLastDeletedMessages = (groupId) => {
  const deletedMessages = readJSON(DELETED_MESSAGES_FILE);
  return deletedMessages
    .filter((message) => message.groupId === groupId)
    .slice(-6)
    .reverse();
};

exports.activateGroup = (groupId) => {
  const inactiveGroups = readJSON(INACTIVE_GROUPS_FILE);
  const index = inactiveGroups.indexOf(groupId);

  if (index !== -1) {
    inactiveGroups.splice(index, 1);
    writeJSON(INACTIVE_GROUPS_FILE, inactiveGroups);
  }
};

exports.deactivateGroup = (groupId) => {
  const inactiveGroups = readJSON(INACTIVE_GROUPS_FILE);
  if (!inactiveGroups.includes(groupId)) {
    inactiveGroups.push(groupId);
    writeJSON(INACTIVE_GROUPS_FILE, inactiveGroups);
  }
};

exports.isActiveGroup = (groupId) => {
  const inactiveGroups = readJSON(INACTIVE_GROUPS_FILE);
  return !inactiveGroups.includes(groupId);
};

exports.activateWelcomeGroup = (groupId) => {
  const notWelcomeGroups = readJSON(NOT_WELCOME_GROUPS_FILE);
  const index = notWelcomeGroups.indexOf(groupId);

  if (index !== -1) {
    notWelcomeGroups.splice(index, 1);
    writeJSON(NOT_WELCOME_GROUPS_FILE, notWelcomeGroups);
  }
};

exports.deactivateWelcomeGroup = (groupId) => {
  const notWelcomeGroups = readJSON(NOT_WELCOME_GROUPS_FILE);
  if (!notWelcomeGroups.includes(groupId)) {
    notWelcomeGroups.push(groupId);
    writeJSON(NOT_WELCOME_GROUPS_FILE, notWelcomeGroups);
  }
};

exports.isActiveWelcomeGroup = (groupId) => {
  const notWelcomeGroups = readJSON(NOT_WELCOME_GROUPS_FILE);
  return !notWelcomeGroups.includes(groupId);
};

exports.getAutoResponderResponse = (match) => {
  const responses = readJSON("auto-responder");
  const matchUpperCase = match.toLocaleUpperCase();
  const data = responses.find((response) => response.match.toLocaleUpperCase() === matchUpperCase);
  return data ? data.answer : null;
};

exports.activateAutoResponderGroup = (groupId) => {
  const inactiveAutoResponderGroups = readJSON(INACTIVE_AUTO_RESPONDER_GROUPS_FILE);
  const index = inactiveAutoResponderGroups.indexOf(groupId);

  if (index !== -1) {
    inactiveAutoResponderGroups.splice(index, 1);
    writeJSON(INACTIVE_AUTO_RESPONDER_GROUPS_FILE, inactiveAutoResponderGroups);
  }
};

exports.deactivateAutoResponderGroup = (groupId) => {
  const inactiveAutoResponderGroups = readJSON(INACTIVE_AUTO_RESPONDER_GROUPS_FILE);

  if (!inactiveAutoResponderGroups.includes(groupId)) {
    inactiveAutoResponderGroups.push(groupId);
    writeJSON(INACTIVE_AUTO_RESPONDER_GROUPS_FILE, inactiveAutoResponderGroups);
  }
};

exports.isActiveAutoResponderGroup = (groupId) => {
  const inactiveAutoResponderGroups = readJSON(INACTIVE_AUTO_RESPONDER_GROUPS_FILE);
  return !inactiveAutoResponderGroups.includes(groupId);
};

exports.activateAntiLinkGroup = (groupId) => {
  const antiLinkGroups = readJSON(ANTI_LINK_GROUPS_FILE);
  if (!antiLinkGroups.includes(groupId)) {
    antiLinkGroups.push(groupId);
    writeJSON(ANTI_LINK_GROUPS_FILE, antiLinkGroups);
  }
};

exports.deactivateAntiLinkGroup = (groupId) => {
  const antiLinkGroups = readJSON(ANTI_LINK_GROUPS_FILE);
  const index = antiLinkGroups.indexOf(groupId);

  if (index !== -1) {
    antiLinkGroups.splice(index, 1);
    writeJSON(ANTI_LINK_GROUPS_FILE, antiLinkGroups);
  }
};

exports.isActiveAntiLinkGroup = (groupId) => {
  const antiLinkGroups = readJSON(ANTI_LINK_GROUPS_FILE);
  return antiLinkGroups.includes(groupId);
};

module.exports = exports;
exports.activateAntiFloodGroup = (groupId) => {
  const antiFloodGroups = readJSON("anti-flood-groups");
  if (!antiFloodGroups.includes(groupId)) {
    antiFloodGroups.push(groupId);
    writeJSON("anti-flood-groups", antiFloodGroups);
  }
};

exports.deactivateAntiFloodGroup = (groupId) => {
  const antiFloodGroups = readJSON("anti-flood-groups");
  const index = antiFloodGroups.indexOf(groupId);

  if (index !== -1) {
    antiFloodGroups.splice(index, 1);
    writeJSON("anti-flood-groups", antiFloodGroups);
  }
};

exports.isActiveAntiFloodGroup = (groupId) => {
  const antiFloodGroups = readJSON("anti-flood-groups");
  return antiFloodGroups.includes(groupId);
};