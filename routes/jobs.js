const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Create job
router.post('/', async (req, res) => {
  try {
    const { category, pay, workArrangement } = req.body;
    const MINIMUM_WAGE_FULL_TIME = 5067.04;
    const MINIMUM_WAGE_PART_TIME_HOURLY = 28.79;

    if (category === 'Maid' || category === 'Landscaper') {
      if (workArrangement === 'full-time' && pay < MINIMUM_WAGE_FULL_TIME) {
        return res.status(400).json({ error: `The pay for a full-time ${category} category job must be at least R${MINIMUM_WAGE_FULL_TIME} per month.` });
      }
      if (workArrangement === 'part-time' && pay < MINIMUM_WAGE_PART_TIME_HOURLY) {
        return res.status(400).json({ error: `The pay for a part-time ${category} category job must be at least R${MINIMUM_WAGE_PART_TIME_HOURLY} per hour.` });
      }
    }

    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all jobs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { title, location, type, category, workArrangement, description, page = 1, limit = 10 } = req.query;
    const filter = {};

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // Case-insensitive regex search
    }
    if (type) {
      filter.type = { $regex: type, $options: 'i' }; // Case-insensitive regex search
    }
    if (category) {
      filter.category = category; // Exact match
    }
    if (workArrangement) {
      filter.workArrangement = workArrangement; // Exact match
    }
    if (description) {
      filter.description = { $regex: description, $options: 'i' }; // Case-insensitive regex search
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalJobs = await Job.countDocuments(filter);

    res.json({
      jobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      totalJobs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    // Handle potential CastError if ID format is invalid
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Update an existing job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;