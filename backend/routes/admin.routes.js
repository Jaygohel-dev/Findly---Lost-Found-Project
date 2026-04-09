const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect, restrictTo('admin'));
router.get('/stats',               ctrl.getStats);
router.get('/users',               ctrl.getAllUsers);
router.put('/users/:id/toggle',    ctrl.toggleUser);
router.get('/items',               ctrl.getAllItems);
router.delete('/items/:id',        ctrl.deleteItem);
router.put('/items/:id/moderate',  ctrl.moderateItem);

module.exports = router;
