// src/routes/stories.js
const express = require('express');
const router = express.Router();

// In-memory storage for stories
// TODO: Replace with database in production
let userStories = [];

/**
 * GET /api/stories
 * Retrieve all user stories
 */
router.get('/', (req, res) => {
    try {
        // Return stories sorted by date (newest first)
        const sortedStories = [...userStories].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
        res.json({ stories: sortedStories });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

/**
 * POST /api/stories
 * Create a new user story
 */
router.post('/', (req, res) => {
    try {
        const { name, result, story } = req.body;

        // Validation
        if (!name || !result || !story) {
            return res.status(400).json({
                error: 'Name, result, and story are required'
            });
        }

        if (typeof name !== 'string' || typeof result !== 'string' || typeof story !== 'string') {
            return res.status(400).json({
                error: 'Invalid data types'
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                error: 'Name is too long (max 100 characters)'
            });
        }

        if (story.length > 1000) {
            return res.status(400).json({
                error: 'Story is too long (max 1000 characters)'
            });
        }

        // Create new story
        const newStory = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            result: result.trim(),
            story: story.trim(),
            date: new Date().toISOString()
        };

        userStories.unshift(newStory);

        // Optional: limit total stories in memory (keep last 100)
        if (userStories.length > 100) {
            userStories = userStories.slice(0, 100);
        }

        res.status(201).json({
            message: 'Story saved successfully',
            story: newStory
        });
    } catch (error) {
        console.error('Error saving story:', error);
        res.status(500).json({ error: 'Failed to save story' });
    }
});

module.exports = router;