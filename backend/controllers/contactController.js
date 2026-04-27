const pool = require('../config/db');

// POST /api/contact - Public
const submitContact = async (req, res) => {
  try {
    const { full_name, email, message } = req.body;

    const result = await pool.query(
      'INSERT INTO contact_submissions (full_name, email, message) VALUES ($1, $2, $3) RETURNING id, full_name, email, message, created_at',
      [full_name, email, message]
    );

    res.status(201).json({
      message: 'Submission saved successfully',
      submission: result.rows[0],
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: 'Server error saving submission' });
  }
};

// GET /api/contact - Admin only
const getAllContacts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, message, created_at FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
};

// DELETE /api/contact/:id - Admin only
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM contact_submissions WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error deleting submission' });
  }
};

module.exports = { submitContact, getAllContacts, deleteContact };
