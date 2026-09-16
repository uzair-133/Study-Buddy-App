const express = require('express');
const router = express.Router();
const { searchAll } = require('../controller/searchController');
const { authStudent } = require('../middleware/authMiddleware')

router.get('/', authStudent, searchAll)




module.exports = router;