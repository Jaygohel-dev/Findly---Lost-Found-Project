const itemService = require('../services/item.service');
const { sendSuccess } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');
const Item = require('../models/item.model');

const getItems = async (req, res) => {
  const result = await itemService.getAllItems(req.query);
  return sendSuccess(res, 200, 'Items fetched', result);
};

const getStats = async (req, res) => {
  const stats = await itemService.getPlatformStats();
  return sendSuccess(res, 200, 'Stats fetched', stats);
};

const getMyItems = async (req, res) => {
  const items = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Your items fetched', { items });
};

const getItem = async (req, res) => {
  const item = await itemService.getItemById(req.params.id);
  return sendSuccess(res, 200, 'Item fetched', { item });
};

const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 422, 'Validation failed', errors.array());
  const result = await itemService.createItem(req.body, req.files, req.user.id);
  return sendSuccess(res, 201, 'Item reported successfully', result);
};

const updateItem = async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Item updated', { item });
};

const deleteItem = async (req, res) => {
  await itemService.deleteItem(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Item deleted successfully');
};

const markRecovered = async (req, res) => {
  const item = await itemService.markRecovered(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Item marked as recovered', { item });
};

const matchItems = async (req, res) => {
  await itemService.matchItems(req.params.id, req.body.matchedItemId, req.user.id);
  return sendSuccess(res, 200, 'Items matched successfully');
};

module.exports = { getItems, getStats, getMyItems, getItem, createItem, updateItem, deleteItem, markRecovered, matchItems };
