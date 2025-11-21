const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

// Get all search history
router.get('/', async (req, res) => {
  try {
    const history = await SearchHistory.find()
      .sort({ searchDate: -1 })
      .limit(10);
    
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch search history',
      error: error.message 
    });
  }
});

// Delete search history by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SearchHistory.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'History entry deleted' });
  } catch (error) {
    console.error('Error deleting history:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to delete history entry',
      error: error.message 
    });
  }
});

// Clear all search history
router.delete('/', async (req, res) => {
  try {
    await SearchHistory.deleteMany({});
    
    res.json({ success: true, message: 'All history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to clear history',
      error: error.message 
    });
  }
});

module.exports = router;
