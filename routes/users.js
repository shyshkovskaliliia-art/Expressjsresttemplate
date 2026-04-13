const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/teachersController');

router.route('/')
  .get(ctrl.getAllTeachers)
  .post(ctrl.createTeacher);

router.route('/:id')
  .get(ctrl.getTeacherById)
  .delete(ctrl.deleteTeacher);

module.exports = router;