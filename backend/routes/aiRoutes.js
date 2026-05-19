const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

router.post('/analyze', auth, aiController.analyzeComplaint);

module.exports = router;
