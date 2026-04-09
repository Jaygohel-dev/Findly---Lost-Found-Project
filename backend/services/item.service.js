const Item = require('../models/item.model');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const buildFilter = (query) => {
  const filter = {};
  const { type, category, status, search } = query;
  if (type)     filter.type     = type;
  if (category) filter.category = category;
  filter.status = status || 'active';
  if (search)   filter.$text    = { $search: search };
  return filter;
};

const getAllItems = async (query) => {
  const { page = 1, limit = 12 } = query;
  const filter = buildFilter(query);
  const skip   = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate('owner', 'name city rating avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Item.countDocuments(filter),
  ]);

  return { items, total, pages: Math.ceil(total / Number(limit)), page: Number(page) };
};

const getItemById = async (id) => {
  const item = await Item.findById(id).populate('owner', 'name email phone city rating totalRatings itemsRecovered');
  if (!item) throw new AppError('Item not found.', 404);
  item.views += 1;
  await item.save({ validateBeforeSave: false });
  return item;
};

const createItem = async (data, files, userId) => {
  const { type, title, description, category, address, lat, lng, date, color, brand, reward } = data;
  const images = files ? files.map((f) => `/uploads/${f.filename}`) : [];

  const item = await Item.create({
    type, title, description, category,
    location: { address, lat: lat ? Number(lat) : null, lng: lng ? Number(lng) : null },
    date, images, color, brand, reward,
    owner: userId,
  });

  await User.findByIdAndUpdate(userId, { $inc: { itemsReported: 1 } });

  // Suggest potential matches (opposite type, same category)
  const matches = await Item.find({
    type: type === 'lost' ? 'found' : 'lost',
    category,
    status: 'active',
  }).limit(4).populate('owner', 'name');

  return { item, potentialMatches: matches };
};

const updateItem = async (id, updates, userId, role) => {
  const item = await Item.findById(id);
  if (!item) throw new AppError('Item not found.', 404);
  if (item.owner.toString() !== userId.toString() && role !== 'admin')
    throw new AppError('Not authorised to update this item.', 403);

  if (updates.address) {
    updates.location = { address: updates.address, lat: updates.lat || null, lng: updates.lng || null };
  }
  return Item.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

const deleteItem = async (id, userId, role) => {
  const item = await Item.findById(id);
  if (!item) throw new AppError('Item not found.', 404);
  if (item.owner.toString() !== userId.toString() && role !== 'admin')
    throw new AppError('Not authorised to delete this item.', 403);
  await Item.findByIdAndDelete(id);
};

const markRecovered = async (id, userId) => {
  const item = await Item.findById(id);
  if (!item) throw new AppError('Item not found.', 404);
  if (item.owner.toString() !== userId.toString())
    throw new AppError('Only the owner can mark this item as recovered.', 403);
  item.status = 'recovered';
  await item.save();
  await User.findByIdAndUpdate(userId, { $inc: { itemsRecovered: 1 } });
  return item;
};

const matchItems = async (itemId, matchedItemId, userId) => {
  const item = await Item.findById(itemId);
  if (!item) throw new AppError('Item not found.', 404);
  if (item.owner.toString() !== userId.toString())
    throw new AppError('Only the owner can confirm a match.', 403);
  await Item.findByIdAndUpdate(itemId,      { status: 'matched', matchedWith: matchedItemId });
  await Item.findByIdAndUpdate(matchedItemId, { status: 'matched', matchedWith: itemId });
};

const getPlatformStats = async () => {
  const [total, lost, found, recovered, matched, users] = await Promise.all([
    Item.countDocuments(),
    Item.countDocuments({ type: 'lost',  status: 'active' }),
    Item.countDocuments({ type: 'found', status: 'active' }),
    Item.countDocuments({ status: 'recovered' }),
    Item.countDocuments({ status: 'matched' }),
    User.countDocuments({ role: 'user' }),
  ]);
  return { total, lost, found, recovered, matched, users };
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem, markRecovered, matchItems, getPlatformStats };
