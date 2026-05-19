const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, complaintController.addComplaint);
router.get('/', auth, complaintController.getComplaints);
router.put('/:id', auth, complaintController.updateComplaintStatus);
router.get('/search', auth, complaintController.searchComplaints);

module.exports = router;
