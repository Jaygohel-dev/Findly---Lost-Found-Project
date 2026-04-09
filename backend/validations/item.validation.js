const { body } = require('express-validator');

const CATEGORIES = ['electronics', 'wallet', 'keys', 'bag', 'documents', 'jewelry', 'clothing', 'pet', 'other'];

const itemValidation = [
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('address').trim().notEmpty().withMessage('Location/address is required'),
  body('date').isISO8601().withMessage('Valid date required'),
];

module.exports = { itemValidation };
