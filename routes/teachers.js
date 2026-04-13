// routes/teachers.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teachersController');

router.route('/')
  .get(ctrl.getAll)
  .post(ctrl.create);

router.route('/:id')
  .get(ctrl.getById)
  .delete(ctrl.delete);

module.exports = router;