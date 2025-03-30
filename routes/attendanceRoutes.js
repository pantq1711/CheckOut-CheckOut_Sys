const express = require('express');
const { cardScan, faceAuth } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/card-scan', cardScan);
router.post('/face-auth', faceAuth);

module.exports = router;
