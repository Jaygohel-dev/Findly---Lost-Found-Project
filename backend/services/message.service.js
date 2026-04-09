const Message = require('../models/message.model');
const Item    = require('../models/item.model');
const AppError = require('../utils/AppError');

const getMessagesForItem = async (itemId, userId) => {
  const item = await Item.findById(itemId);
  if (!item) throw new AppError('Item not found.', 404);
  return Message.find({ item: itemId })
    .populate('sender',   'name avatarUrl')
    .populate('receiver', 'name')
    .sort({ createdAt: 1 });
};

const sendMessage = async ({ itemId, receiverId, content }, senderId) => {
  if (senderId.toString() === receiverId.toString())
    throw new AppError('Cannot send a message to yourself.', 400);
  const msg = await Message.create({ item: itemId, sender: senderId, receiver: receiverId, content });
  return msg.populate(['sender', 'receiver']);
};

const getInbox = async (userId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate('sender',   'name avatarUrl')
    .populate('receiver', 'name avatarUrl')
    .populate('item',     'title type status')
    .sort({ createdAt: -1 });

  // Group by item
  const convMap = {};
  messages.forEach((m) => {
    const key = m.item?._id?.toString();
    if (!key) return;
    if (!convMap[key]) convMap[key] = { item: m.item, messages: [], unread: 0 };
    convMap[key].messages.push(m);
    if (!m.read && m.receiver._id.toString() === userId.toString()) {
      convMap[key].unread++;
    }
  });
  return Object.values(convMap);
};

const markRead = async (itemId, userId) => {
  await Message.updateMany({ item: itemId, receiver: userId, read: false }, { read: true });
};

module.exports = { getMessagesForItem, sendMessage, getInbox, markRead };
