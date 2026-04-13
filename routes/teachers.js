const express = require('express');
const router = express.Router();
const controller = require('../controllers/teachersController');

router.get('/', controller.getAllTeachers);
router.get('/:id', controller.getTeacherById);
router.post('/', controller.createTeacher);
router.delete('/:id', controller.deleteTeacher);

module.exports = router;