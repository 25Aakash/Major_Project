const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @route   GET /api/content
// @desc    Get all content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, difficulty, contentType, limit = 20 } = req.query;
    
    const query = { isActive: true };
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    if (contentType) query.contentType = contentType;

    const content = await Content.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: content.length,
      content
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('prerequisites', 'title difficulty')
      .populate('createdBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error('Fetch content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/content
// @desc    Create new content
// @access  Public (should be teacher/admin only)
router.post('/', async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/content/subjects/list
// @desc    Get all subjects
// @access  Public
router.get('/subjects/list', async (req, res) => {
  try {
    const subjects = await Content.distinct('subject');
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content
// @access  Public (should be admin/teacher only)
router.put('/:id', async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({
      success: true,
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Public (should be admin only)
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
