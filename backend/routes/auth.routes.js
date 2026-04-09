const router = require('express').Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate    = require('../middlewares/validate.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

router.post('/register', registerValidation, validate, register);
router.post('/login',    loginValidation,    validate, login);
router.get( '/me',       protect, getMe);
router.post('/logout',   protect, logout);

module.exports = router;
