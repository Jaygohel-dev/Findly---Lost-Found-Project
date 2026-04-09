const router = require('express').Router();
const { getMessages, sendMessage, getInbox } = require('../controllers/message.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get( '/inbox',      getInbox);
router.get( '/:itemId',    getMessages);
router.post('/',           sendMessage);

module.exports = router;
