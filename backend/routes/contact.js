const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts, deleteContact } = require('../controllers/contactController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { contactValidation } = require('../middleware/validation');

router.post('/contact', contactValidation, submitContact);
router.get('/contact', authenticate, isAdmin, getAllContacts);
router.delete('/contact/:id', authenticate, isAdmin, deleteContact);

module.exports = router;
