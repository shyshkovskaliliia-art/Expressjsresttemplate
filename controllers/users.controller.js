// controllers/teachersController.js
const db = require('../config/database');

exports.getAllTeachers = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};

exports.getTeacherById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE teacher_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const { full_name, phone, address, birth_date, start_date } = req.body;
    if (!full_name || !start_date) {
      return res.status(400).json({ success: false, message: 'full_name and start_date are required' });
    }
    const [result] = await db.query(
      'INSERT INTO teachers (full_name, phone, address, birth_date, start_date) VALUES (?, ?, ?, ?, ?)',
      [full_name, phone, address, birth_date, start_date]
    );
    res.status(201).json({ success: true, data: { teacher_id: result.insertId, ...req.body } });
  } catch (err) { next(err); }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM teachers WHERE teacher_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (err) { next(err); }
};