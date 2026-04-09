const router = require('express').Router();
const { getProfile, updateProfile, changePassword, rateUser } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get( '/profile',         getProfile);
router.put( '/profile',         updateProfile);
router.put( '/change-password', changePassword);
router.post('/rate',            rateUser);

module.exports = router;
