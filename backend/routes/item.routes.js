const router   = require('express').Router();
const ctrl     = require('../controllers/item.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { itemValidation } = require('../validations/item.validation');
const upload   = require('../config/multer');

router.get('/',        ctrl.getItems);
router.get('/stats',   ctrl.getStats);
router.get('/my',      protect, ctrl.getMyItems);
router.get('/:id',     ctrl.getItem);

router.post('/',       protect, upload.array('images', 5), itemValidation, validate, ctrl.createItem);
router.put('/:id',     protect, upload.array('images', 5), ctrl.updateItem);
router.delete('/:id',  protect, ctrl.deleteItem);
router.post('/:id/recover', protect, ctrl.markRecovered);
router.post('/:id/match',   protect, ctrl.matchItems);

module.exports = router;
