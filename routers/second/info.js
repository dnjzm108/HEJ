const express = require('express');
const router = express.Router();
const controller = require('./info_controller');

router.get('/info',controller.info);

module.exports = router;