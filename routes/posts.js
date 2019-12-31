const express = require('express');
const { check } = require('express-validator');

const router = express.Router({mergeParams: true});

router.get('/', () => {});

module.exports = router;
