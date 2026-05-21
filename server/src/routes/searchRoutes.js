const express = require('express');
const router = express.Router();
const { searchContacts, getSuggestions } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/contacts', searchContacts);
router.get('/suggestions', getSuggestions);

module.exports = router;
