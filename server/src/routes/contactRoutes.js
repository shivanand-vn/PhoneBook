const express = require('express');
const router = express.Router();

const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  searchContacts,
  getSuggestions,
  toggleFavorite
} = require('../controllers/contactController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateContact } = require('../validations/contactValidation');

// Protected routes (require user to be logged in)
router.use(protect);

router.get('/', getContacts);
router.post('/', upload.single('profileImage'), validateContact, addContact);
router.get('/search', searchContacts);
router.get('/suggestions', getSuggestions);
router.get('/:id', getContactById);
router.put('/:id', upload.single('profileImage'), validateContact, updateContact);
router.delete('/:id', deleteContact);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
