const express = require('express');
const router = express.Router();
const { searchAll } = require('../controller/searchController');
const {authUser} = require('../middleware/authUser')

// /api/search
router.get('/', authUser, searchAll);




module.exports = router;