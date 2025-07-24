import express from "express";
import Note from "../models/Notes.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();


router.use(authMiddleware);

router.get("/", async (req, res) => {

  try {
    const notes = await Note.find({ user: req.user._id });
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

router.put("/:id", async (req, res) => {
  try {
    const noteToUpdate = await Note.findById(req.params.id);

    if (!noteToUpdate) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    if (noteToUpdate.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this note." });
    }

    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const noteToDelete = await Note.findById(req.params.id);

    if (!noteToDelete) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    if (noteToDelete.user.toString() !== req.user._id.toString) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this note." });
    }
    const note = await Note.findByIdAndDelete(req.params.id);

    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;