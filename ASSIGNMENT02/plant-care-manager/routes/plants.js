const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const ensureAuth = require('../middleware/ensureAuth');

// Public list + search
router.get('/', async (req, res) => {
  const { search = '' } = req.query;
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { species: { $regex: search, $options: 'i' } }] }
    : {};
  try {
    const plants = await Plant.find(filter).sort({ name: 1 }).lean();
    res.render('plants/list', { title: 'Plants', plants, search });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load plants.');
    res.render('plants/list', { title: 'Plants', plants: [], search });
  }
});

// TEMP: debug raw docs (remove when done)
router.get('/debug/json', async (req, res) => {
  try {
    const docs = await Plant.find().lean();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add form
router.get('/add', ensureAuth, (req, res) => {
  res.render('plants/details', { title: 'Add Plant', plant: {}, formMode: true });
});

// Create
router.post('/add', ensureAuth, async (req, res) => {
  try {
    const doc = await Plant.create({ ...req.body, owner: req.user?._id });
    console.log('Created plant:', doc);
    req.flash('success', 'Plant added successfully.');
    res.redirect('/plants');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error adding plant.');
    res.redirect('/plants');
  }
});

// Edit form
router.get('/:id/edit', ensureAuth, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).lean();
    if (!plant) {
      req.flash('error', 'Plant not found.');
      return res.redirect('/plants');
    }
    res.render('plants/details', { title: 'Edit Plant', plant, formMode: true });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading plant.');
    res.redirect('/plants');
  }
});

// Update
router.post('/:id/edit', ensureAuth, async (req, res) => {
  try {
    await Plant.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Plant updated successfully.');
    res.redirect('/plants');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating plant.');
    res.redirect('/plants');
  }
});

// Delete confirm
router.get('/:id/delete', ensureAuth, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).lean();
    if (!plant) {
      req.flash('error', 'Plant not found.');
      return res.redirect('/plants');
    }
    res.render('plants/delete', { title: 'Delete Plant', plant });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading plant.');
    res.redirect('/plants');
  }
});

// Public single view (keep last)
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).lean();
    if (!plant) {
      req.flash('error', 'Plant not found.');
      return res.redirect('/plants');
    }
    res.render('plants/details', { title: plant.name, plant });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading plant.');
    res.redirect('/plants');
  }
});

module.exports = router;
