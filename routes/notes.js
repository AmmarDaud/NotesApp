import express from "express";
import  Note  from "../models/Notes.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/notes 
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id});
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
        user: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT /api/notes/:id - Update a note
router.put("/:id", async (req, res) => {
  try {
    //Authorization check
       const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ownership check
    if (note.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to update this note.' });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    //Authorization check
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    // Ownership check
    if (note.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to delete this note.' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;