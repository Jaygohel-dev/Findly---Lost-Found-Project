const messageService = require('../services/message.service');
const { sendSuccess } = require('../utils/apiResponse');

const getMessages = async (req, res) => {
  const messages = await messageService.getMessagesForItem(req.params.itemId, req.user.id);
  await messageService.markRead(req.params.itemId, req.user.id);
  return sendSuccess(res, 200, 'Messages fetched', { messages });
};

const sendMessage = async (req, res) => {
  const { itemId, receiverId, content } = req.body;
  const message = await messageService.sendMessage({ itemId, receiverId, content }, req.user.id);
  return sendSuccess(res, 201, 'Message sent', { message });
};

const getInbox = async (req, res) => {
  const conversations = await messageService.getInbox(req.user.id);
  return sendSuccess(res, 200, 'Inbox fetched', { conversations });
};

module.exports = { getMessages, sendMessage, getInbox };
